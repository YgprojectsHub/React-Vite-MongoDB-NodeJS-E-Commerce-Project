import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
      code: { type: String, required: true, unique: true },
      discountPercent: { type: Number, required: true }
    },
    { timestamps: true }
);

const GainedCouponSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gainedCoupons: [CouponSchema]
  },
  { timestamps: true }
);

const GainedCoupon = mongoose.model("GainedCoupons", GainedCouponSchema)

export default GainedCoupon