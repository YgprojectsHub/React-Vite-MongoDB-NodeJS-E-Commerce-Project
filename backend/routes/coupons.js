import express from "express";
import Coupon from "../database/models/Coupon.js";
import { sendResponse } from "../helper/sendResponse.js";
import { CODES } from "../interface/errorCodes.js";
import { verifyToken } from "../middlewares/JWT.js";
import { generateSeoLink } from "../helper/genSeoLink.js";
import NodeCache from "node-cache";
import GainedCoupon from "../database/models/GainedCoupon.js";

const cache = new NodeCache();
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    let coupons = cache.get("coupons");
    if (!coupons) {
      coupons = await Coupon.find();
      cache.set("coupons", coupons);
    }
    coupons ? sendResponse(res, 200, coupons) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { seoLink } = req.params;
    let coupon = cache.get(`coupon_${seoLink}`);
    if (!coupon) {
      coupon = await Coupon.findOne({ seoLink });
      cache.set(`coupon_${seoLink}`, coupon);
    }
    coupon ? sendResponse(res, 200, coupon) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/id/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let coupon = cache.get(`coupon_${id}`);
    if (!coupon) {
      coupon = await Coupon.findById(id);
      cache.set(`coupon_${id}`, coupon);
    }
    coupon ? sendResponse(res, 200, coupon) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let gCoupon = cache.get(`couponsOfUser_${id}`);
    if (!gCoupon) {
      gCoupon = await GainedCoupon.findOne({userId: id});
      cache.set(`couponsOfUser_${id}`, gCoupon);
    }
    
    gCoupon ? sendResponse(res, 200, gCoupon) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/code/:code", verifyToken, async (req, res) => {
  try {
    const { code } = req.params;
    const { userId } = req.body;

    const gCoupon = await GainedCoupon.findOne({ userId });

    if (!gCoupon) {
      return sendResponse(res, 404);
    }

    const couponIndex = gCoupon.gainedCoupons.findIndex((gC) => gC.code === code);
    const coupon = gCoupon.gainedCoupons.find((gC) => gC.code === code);

    if (couponIndex !== -1) {
      gCoupon.gainedCoupons.splice(couponIndex, 1);

      await GainedCoupon.updateOne({ userId }, { gainedCoupons: gCoupon.gainedCoupons });

      sendResponse(res, 200, {coupon: coupon});
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});


router.post("/", verifyToken, async (req, res) => {
  try {
    const { code, discountPercent } = req.body;
    const newCoupon = new Coupon({
      code,
      discountPercent,
      seoLink: generateSeoLink(req.body.code, false),
    });

    await newCoupon.save();

    cache.del("coupons");
    sendResponse(res, 201);
  } catch (err) {
    err.code === 11000
      ? sendResponse(res, 400, CODES.SAME_CODE)
      : sendResponse(res, 500, err, req);
  }
});

router.put("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { seoLink } = req.params;
    const { id, ...body } = req.body;
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { seoLink },
      { ...body, seoLink: generateSeoLink(req.body.code, false) }
    );

    if (updatedCoupon) {
      cache.del("coupons");
      cache.del(`coupon_${seoLink}`);
      cache.del(`coupon_code_${updatedCoupon.code}`);
    }
    updatedCoupon ? sendResponse(res, 201) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (deletedCoupon) {
      cache.del("coupons");
      cache.del(`coupon_${deletedCoupon.seoLink}`);
      cache.del(`coupon_code_${deletedCoupon.code}`);
    }

    deletedCoupon ? sendResponse(res, 201) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
