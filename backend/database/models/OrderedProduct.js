import mongoose from "mongoose";

const OrderedProductSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }]
  },
  { timestamps: true }
);

const OrderedProduct = mongoose.model("OrderedProducts", OrderedProductSchema)

export default OrderedProduct