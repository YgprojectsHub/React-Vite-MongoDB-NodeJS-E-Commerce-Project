import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    productId: {type: String, required: true},
    filename: {type: String, required: true},
    imgUrl: { type: String, required: true }
  },
  { timestamps: true }
);

const ProductImage = mongoose.model("productImage", imageSchema);

export default ProductImage