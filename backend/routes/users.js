import express from "express";
import User from "../database/models/User.js";
import UserImage from "../database/models/image/User.js";
import { sendResponse } from "../helper/sendResponse.js";
import { deleteImage } from "../helper/imageUplodaer.js";
import { verifyToken } from "../middlewares/JWT.js";
import { CODES } from "../interface/errorCodes.js";
import NodeCache from "node-cache";

const router = express.Router();
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

router.get("/", verifyToken, async (req, res) => {
  try {
    const cacheKey = "users";

    const cachedUsers = cache.get(cacheKey);
    if (cachedUsers) {
      return sendResponse(res, 200, cachedUsers);
    }

    const users = await User.find({ role: { $ne: 'admin' } }).lean();

    if (users) {
      cache.set(cacheKey, users);
      sendResponse(res, 200, users);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user_${id}`;

    const cachedUser = cache.get(cacheKey);
    if (cachedUser) {
      return sendResponse(res, 200, cachedUser);
    }

    const user = await User.findById(id).lean();

    if (user) {
      cache.set(cacheKey, user);
      sendResponse(res, 200, user);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.put("/:uid", verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;

    const { id, ...body } = req.body;

    const response = await User.findByIdAndUpdate(uid, body);

    if (response) {
      cache.del(`user_${uid}`);
      cache.del("users");
      sendResponse(res, 201);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    err.code === 11000
      ? sendResponse(res, 400, CODES.SAME_EMAIL)
      : sendResponse(res, 500, err, req);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const response = await User.findByIdAndDelete(id);

    if (response) {
      if (!response.avatar.startsWith("https://i.pravatar.cc")) {
        const deletedFile = await deleteImage(response.avatar);
        if (deletedFile) {
          await UserImage.findOneAndDelete({ imgUrl: response.avatar });
        }
      }
      
      cache.del(`user_${id}`);
      cache.del("users");
      sendResponse(res, 201);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
