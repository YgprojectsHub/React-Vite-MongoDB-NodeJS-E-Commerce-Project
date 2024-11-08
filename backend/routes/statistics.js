import dotenv from "dotenv";
dotenv.config();
import express from "express";
import User from "../database/models/User.js";
import { sendResponse } from "../helper/sendResponse.js";
import Stripe from "stripe";
import { verifyToken } from "../middlewares/JWT.js";
import NodeCache from 'node-cache';

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const cache = new NodeCache({ stdTTL: 60 * 5 });

router.get('/monthly-sales', verifyToken, async (req, res) => {
  try {
    const cacheKey = 'monthly_sales';
    let cachedSales = cache.get(cacheKey);

    if (cachedSales) {
      return sendResponse(res, 200, cachedSales);
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: {
        gte: Math.floor(new Date(year, 0, 1).getTime() / 1000),
        lt: Math.floor(new Date(year + 1, 0, 1).getTime() / 1000)
      }
    });

    const lineItems = await Promise.all(sessions.data.map(async (session) => {
      const items = await stripe.checkout.sessions.listLineItems(session.id);
      return items.data.map(item => ({ ...item, sessionCreated: session.created }));
    }));

    const products = lineItems.flat().map(item => ({
      month: new Date(item.sessionCreated * 1000).getMonth() + 1,
      quantity: item.quantity,
      amount: item.amount_total
    }));

    const monthlySales = products.reduce((acc, product) => {
      if (!acc[product.month]) {
        acc[product.month] = { month: product.month, totalSales: 0 };
      }
      acc[product.month].totalSales += product.quantity;
      return acc;
    }, {});

    for (let i = 1; i <= 12; i++) {
      if (!monthlySales[i]) {
        monthlySales[i] = { month: i, totalSales: 0 };
      }
    }

    const sortedMonths = Object.values(monthlySales).sort((a, b) => a.month - b.month);

    const result = sortedMonths.map((item) => {
      const monthName = new Date(year, item.month - 1).toLocaleString('tr-TR', { month: 'long' });

      return {
        name: monthName,
        totalSales: item.totalSales
      };
    });

    const totalRevenue = products.reduce((sum, product) => sum + product.amount, 0);
    const totalProductSales = products.reduce((sum, product) => sum + product.quantity, 0);

    const additionalData = {
      totalRevenue: totalRevenue / 100,
      totalProductSales: totalProductSales
    };

    const responseData = { result, additionalData };

    cache.set(cacheKey, responseData);

    sendResponse(res, 200, responseData);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/monthly-customers", verifyToken, async (req, res) => {
  try {
    const cacheKey = 'monthly_customers';
    let cachedCustomers = cache.get(cacheKey);

    if (cachedCustomers) {
      return sendResponse(res, 200, cachedCustomers);
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const result = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    const fullYearData = [];
    for (let i = 1; i <= 12; i++) {
      const foundMonth = result.find(item => item._id.month === i);
      const monthData = foundMonth ? foundMonth.count : 0;
      fullYearData.push({ month: i, count: monthData });
    }

    const customerDataWithGrowth = fullYearData.map((item) => {
      const monthName = new Date(year, item.month - 1, 1).toLocaleString('tr-TR', { month: 'long' });

      return {
        name: monthName,
        count: item.count
      };
    });

    cache.set(cacheKey, customerDataWithGrowth);
    
    sendResponse(res, 200, customerDataWithGrowth);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
