import express from "express";
import Product from "../database/models/Product.js";
import { sendResponse } from "../helper/sendResponse.js";
import mongoose from "mongoose";
import { verifyToken } from "../middlewares/JWT.js";
import OrderedProduct from "../database/models/OrderedProduct.js";

const router = express.Router();

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, rating, user } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return sendResponse(res, 404);
    }

    const objId = new mongoose.Types.ObjectId(user)

    const newReview = {
      text,
      rating,
      user: objId,
    };

    product.reviews.push(newReview);

    const response = await product.save();

    (response && sendResponse(res, 201)) || sendResponse(res, 404)
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/controlCanComment/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    
    const findedOP = await OrderedProduct.findOne({ userId });
    
    if (!findedOP) {
      return sendResponse(res, 404);
    }

    const isHas = findedOP.orderedProducts.some(
      (product) => product.productId.toString() === productId
    );

    sendResponse(res, 201, isHas);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});


export default router;
