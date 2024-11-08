import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    categoryId: {type: String, required: true},
    filename: {type: String, required: true},
    imgUrl: { type: String, required: true }
  },
  { timestamps: true }
);

const CategoryImage = mongoose.model("categoryImage", imageSchema);

export default CategoryImage