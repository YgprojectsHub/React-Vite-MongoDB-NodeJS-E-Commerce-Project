import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  text: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  isAdmin: { type: Boolean, required: true, default: false }
}, {timestamps: true});

const additionalDetailSchema = new mongoose.Schema({
  key: { type: String, required: true },
  valueType: { type: String, required: true },
  value: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imgs: [{ type: String, required: true }],
    reviews: [ReviewSchema],
    description: { type: String, required: true },
    colors: [{ type: String, required: true }],
    price: {
      current: { type: Number, required: true },
      newPrice: { type: Number, required: true },
      discount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    category: {
      rootCategoryId: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
      key: {type: String, required: true},
    },
    additionalDetails: [additionalDetailSchema],
    stockCount: { type: Number, required: true, default: 0 },
    awardCoupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true},
    seoKeys: { type: String, required: true },
    seoLink: { type: String, required: true, unique: true },
    recommendedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }],
    sku: { type: String, required: true },
    productCode: { type: String, required: true },
    sellCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
