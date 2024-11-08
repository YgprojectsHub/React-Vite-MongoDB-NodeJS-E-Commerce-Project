import express from "express";
import Tag from "../database/models/Tag.js";
import { sendResponse } from "../helper/sendResponse.js";
import { verifyToken } from "../middlewares/JWT.js";
import { generateSeoLink } from "../helper/genSeoLink.js";
import NodeCache from "node-cache";

const router = express.Router();
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

router.get("/", verifyToken, async (req, res) => {
  try {
    const cacheKey = "tags";

    const cachedTags = cache.get(cacheKey);
    if (cachedTags) {
      return sendResponse(res, 200, cachedTags);
    }

    const tags = await Tag.find();
    
    if (tags) {
      cache.set(cacheKey, tags);
      sendResponse(res, 200, tags);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { seoLink } = req.params;
    const cacheKey = `tag_${seoLink}`;

    const cachedTag = cache.get(cacheKey);
    if (cachedTag) {
      return sendResponse(res, 200, cachedTag);
    }

    const tag = await Tag.findOne({ seoLink });

    if (tag) {
      cache.set(cacheKey, tag);
      sendResponse(res, 200, tag);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = new Tag({ name, seoLink: generateSeoLink(name, false) });

    await newTag.save();

    cache.del("tags");

    sendResponse(res, 201);
  } catch (err) {
    err.code === 11000
      ? sendResponse(res, 400)
      : sendResponse(res, 500, err, req);
  }
});

router.put("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { seoLink } = req.params;
    const { name } = req.body;

    const response = await Tag.findOneAndUpdate({ seoLink }, { name, seoLink: generateSeoLink(name, false) });

    if (response) {
      cache.del(`tag_${seoLink}`);
      cache.del("tags");
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

    const response = await Tag.findByIdAndDelete(id);

    if (response) {
      cache.del(`tag_${response.seoLink}`);
      cache.del("tags");
      sendResponse(res, 201);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
