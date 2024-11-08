import express from "express"; 
import Product from "../database/models/Product.js";
import { sendResponse } from "../helper/sendResponse.js";

const router = express.Router();

router.post("/product", async (req, res) => {
  try {
    const { name, selectedCategories, selectedTags, price } = req.body;

    const filter = {};
    
    if (name) {
      filter.name = { $regex: new RegExp(name, "i") };
    }

    if (selectedTags && selectedTags.length > 0) {
      filter.tags = { $in: selectedTags };
    }

    if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
      filter.$or = selectedCategories.map((category) => {
        const condition = { "category.rootCategoryId": category.categoryId };
        
        if (category.selectedKeys && category.selectedKeys.length > 0) {
          condition["category.key"] = { $in: category.selectedKeys };
        }
    
        return condition;
      });
    }
    

    if (price && (price.minPrice || price.maxPrice)) {
      filter["price.newPrice"] = {};
      if (price.minPrice) filter["price.newPrice"].$gte = price.minPrice;
      if (price.maxPrice) filter["price.newPrice"].$lte = price.maxPrice;
    }

    console.log(filter)

    const products = await Product.find(filter).lean();

    if (products.length > 0) {
      sendResponse(res, 200, products);
    } else {
      sendResponse(res, 404);
    }
  } catch (err) {
    console.error(err);
    sendResponse(res, 500);
  }
});

export default router;
