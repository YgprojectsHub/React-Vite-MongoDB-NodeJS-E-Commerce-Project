import express from "express";
import NodeCache from "node-cache";
import Category from "../database/models/Category.js";
import { sendResponse } from "../helper/sendResponse.js";
import { CODES } from "../interface/errorCodes.js";
import { deleteImage } from "../helper/imageUplodaer.js";
import CategoryImage from "../database/models/image/Category.js";
import { verifyToken } from "../middlewares/JWT.js";
import { generateSeoLink } from "../helper/genSeoLink.js";

const router = express.Router();
const cache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

router.get("/", async (req, res) => {
  try {
    const cachedCategories = cache.get("categories");

    if (cachedCategories) {
      return sendResponse(res, 200, cachedCategories);
    }

    const categories = await Category.find();
    if (categories) {
      cache.set("categories", categories);
      return sendResponse(res, 200, categories);
    } else {
      return sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/:seoLink", async (req, res) => {
  try {
    const { seoLink } = req.params;
    const cacheKey = `category_${seoLink}`;
    const cachedCategory = cache.get(cacheKey);

    if (cachedCategory) {
      return sendResponse(res, 200, cachedCategory);
    }

    const category = await Category.findOne({ seoLink });
    if (category) {
      cache.set(cacheKey, category);
      return sendResponse(res, 200, category);
    } else {
      return sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const newCategory = new Category({ ...req.body, seoLink: generateSeoLink(req.body.name, false) });
    const isOk = await newCategory.save();

    if (isOk) {
      cache.del("categories");
      sendResponse(res, 200);
    }
  } catch (err) {
    err.code === 11000 ? sendResponse(res, 400, CODES.SAME_CATEGORY) : sendResponse(res, 500, err, req);
  }
});

router.put("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { seoLink } = req.params;
    const { name, imgUrl } = req.body;

    const existingProduct = await Category.findOne({ seoLink });

    const newSeoLink = name === existingProduct.name ? existingProduct.seoLink : generateSeoLink(name, false);

    const response = await Category.findOneAndUpdate(
      { seoLink },
      { ...req.body, seoLink: newSeoLink, imgUrl: imgUrl ? imgUrl : existingProduct.imgUrl }
    );

    if (response) {
      cache.del("categories"); 
      cache.del(`category_${seoLink}`);
      sendResponse(res, 201);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Category.findByIdAndDelete(id);

    if (response) {
      const deletedFile = await deleteImage(response.imgUrl);
      if (deletedFile) {
        await CategoryImage.findOneAndDelete({ imgUrl: response.imgUrl });
      }

      cache.del("categories"); 
      cache.del(`category_${response.seoLink}`);

      sendResponse(res, 201);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
