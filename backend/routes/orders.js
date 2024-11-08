dotenv.config();
import dotenv from "dotenv";
import express from "express";
import Order from "../database/models/Order.js";
import { verifyToken } from "../middlewares/JWT.js";
import crypto from "crypto";
import { sendResponse } from "../helper/sendResponse.js";
import { generateSeoLink } from "../helper/genSeoLink.js";
import NodeCache from "node-cache";
import Product from "../database/models/Product.js";
import GainedCoupon from "../database/models/GainedCoupon.js";
import Stripe from "stripe";
import axios from "axios";
import { serverBaseLink } from "../helper/mixLinkAndPort.js";
import { sendEmail } from "../helper/sendEmail.js";
import User from "../database/models/User.js";
import OrderedProduct from "../database/models/OrderedProduct.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const cache = new NodeCache();
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    let orders = cache.get("orders");
    if (!orders) {
      orders = await Order.find();
      cache.set("orders", orders, 30);
    }
    orders ? sendResponse(res, 200, orders) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { seoLink } = req.params;
    let order = cache.get(`order_${seoLink}`);
    if (!order) {
      order = await Order.findOne({ seoLink });
      if (order) cache.set(`order_${seoLink}`, order, 30);
    }

    order ? sendResponse(res, 200, order) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/ordersByUser/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    let orders = cache.get(`ordersByUser_${userId}`);
    if (!orders) {
      orders = await Order.find({ userId });
      if (orders) cache.set(`ordersByUser_${userId}`, orders, 30);
    }
    orders ? sendResponse(res, 200, orders) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const orderCode = crypto.randomUUID().split("-")[0];
    const { usedCoupon, orders, userId } = req.body;
    const seoLink = generateSeoLink(orderCode, false);

    const orderData = {
      ...req.body,
      orderCode,
      seoLink,
    };

    let gainedCouponData = {
      userId,
      gainedCoupons: [],
    };

    let orderedProductData = {
      userId,
      orderedProducts: [],
    };

    const existingGainedCoupon = await GainedCoupon.findOne({ userId });

    if (existingGainedCoupon && usedCoupon && usedCoupon.length > 0) {
      existingGainedCoupon.gainedCoupons =
        existingGainedCoupon.gainedCoupons.filter(
          (coupon) => !usedCoupon.some((used) => used.code === coupon.code)
        );
    }

    for (const order of orders) {
      const product = await Product.findById(order.productId);
      if (order.awardCoupon) {
        gainedCouponData.gainedCoupons.push({
          code: order.awardCoupon.code,
          discountPercent: order.awardCoupon.discountPercent,
        });
      }

      if (product && product.stockCount > 0) {
        await Product.findByIdAndUpdate(order.productId, {
          stockCount: product.stockCount - order.quantity,
        });
      }

      // Sadece sipariş edilen ürünleri kaydetmek için orderedProducts dizisine productId ekleyin
      if (product) {
        orderedProductData.orderedProducts.push(product._id);
      }
    }

    if (existingGainedCoupon) {
      await GainedCoupon.updateOne(
        { userId },
        {
          $set: {
            gainedCoupons: [
              ...existingGainedCoupon.gainedCoupons,
              ...gainedCouponData.gainedCoupons,
            ],
          },
        }
      );
    } else if (gainedCouponData.gainedCoupons.length > 0) {
      const newGainedCoupon = new GainedCoupon(gainedCouponData);
      await newGainedCoupon.save();
    }

    const newOrder = new Order(orderData);
    const response = await newOrder.save();

    if (orderedProductData.orderedProducts.length > 0) {
      const existingOrderedProduct = await OrderedProduct.findOne({ userId });
      if (existingOrderedProduct) {
        existingOrderedProduct.orderedProducts.push(...orderedProductData.orderedProducts);
        await existingOrderedProduct.save();
      } else {
        const newOrderedProduct = new OrderedProduct(orderedProductData);
        await newOrderedProduct.save();
      }
    }

    if (response) {
      const { email, username } = await User.findById(userId);

      const templateData = {
        seoLink,
        email,
        statusCode: 100,
        orderCode,
        username,
      };

      sendEmail(email, "EmailOrderNotify", templateData);

      cache.del("orders");
      sendResponse(res, 201);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.put("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { statusCode, email, username, seoLink } = req.body;

    const order = await Order.findOne({ seoLink });

    const updatedOrder = await Order.findOneAndUpdate(
      { seoLink },
      { status: statusCode }
    );

    if (updatedOrder) {
      cache.del("orders");
      cache.del(`order_${seoLink}`);
      cache.del(`ordersByUser_${updatedOrder.userId}`);

      const templateData = {
        seoLink,
        email,
        statusCode,
        orderCode: updatedOrder.orderCode,
        username,
      };

      sendEmail(email, "EmailOrderNotify", templateData);
    }

    if (updatedOrder && (statusCode === 200 || statusCode === 202)) {
      const { payment_intent } = await stripe.checkout.sessions.retrieve(order.paymentSessionId);
      const totalPriceInCents = Math.round(order.totalPrice * 100);

      await stripe.refunds.create({
        payment_intent,
        amount: totalPriceInCents,
      });

      const orderedProduct = await OrderedProduct.findOne({ userId: updatedOrder.userId });

      if (orderedProduct) {
        orderedProduct.orderedProducts = orderedProduct.orderedProducts.filter(
          (productId) => !order.orders.some((orderItem) => orderItem.productId.equals(productId))
        );

        await orderedProduct.save();
      }
    }

    updatedOrder ? sendResponse(res, 201) : sendResponse(res, 400);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});


export default router;
