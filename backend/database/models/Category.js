import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    key: { type: String, required: true },
    children: [],
  },
  { _id: false }
);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    imgUrl: { type: String, required: true },
    children: [SubCategorySchema],
    seoLink: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

export default Category;
