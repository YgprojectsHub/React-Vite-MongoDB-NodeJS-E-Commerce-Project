dotenv.config();
import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";
import { sendResponse } from "../helper/sendResponse.js";
import { hashValue } from "../helper/crypto.js";
import { token } from "../helper/token.js";
import { verifyToken } from "../middlewares/JWT.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { products, user, cargoFee } = req.body;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "try",
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(product.price.newPrice * 100),
      },
      quantity: product.quantity,
    }));

    if (cargoFee !== 0) {
      lineItems.push({
        price_data: {
          currency: "try",
          product_data: {
            name: "Hızlı Kargo",
          },
          unit_amount: cargoFee * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.SUCCESS_URL}/${await hashValue(
        user._id, true
      )}/${token()}`,
      cancel_url: `${process.env.CANCEL_URL}/${await hashValue(
        user._id, true
      )}/${token()}`,
    });

    sendResponse(res, 200, {
      id: session.id,
    });

  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
