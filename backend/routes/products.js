import express from "express";
import Product from "../database/models/Product.js";
import Category from "../database/models/Category.js";
import Coupon from "../database/models/Coupon.js";
import Tag from "../database/models/Tag.js";
import { sendResponse } from "../helper/sendResponse.js";
import ProductImage from "../database/models/image/Product.js";
import { deleteImage } from "../helper/imageUplodaer.js";
import { verifyToken } from "../middlewares/JWT.js";
import { generateSeoLink } from "../helper/genSeoLink.js";
import { generateProductCode } from "../helper/genPorductCode.js";
import NodeCache from "node-cache";

const cache = new NodeCache();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let products = cache.get("products");
    if (!products) {
      products = await Product.find().lean();
      cache.set("products", products, 30);
    }

    products ? sendResponse(res, 200, products) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.get("/:seoLinkOrId", async (req, res) => {
  try {
    const { seoLinkOrId } = req.params;
    let product = "";

    const isSeoLink = seoLinkOrId.includes("-");
    isSeoLink && (product = await Product.findOne({ seoLink: seoLinkOrId }).lean());
    !isSeoLink && (product = await Product.findById(seoLinkOrId).lean());
    
    if (!product) {
      return sendResponse(res, 404);
    }

    if(!isSeoLink){
      return sendResponse(res, 200, product.seoLink);
    }

    const selectedCategory = await Category.findById(product.category.rootCategoryId).lean();
    const awardCoupon = await Coupon.findById(product.awardCoupon).lean();
    const recommendedProducts = await Promise.all(
      product.recommendedProducts.map(async (rp) => {
        return await Product.findById(rp).lean();
      })
    );
    const tags = await Promise.all(
      product.tags.map(async (tag) => {
        return await Tag.findById(tag).lean();
      })
    );

    const lastRes = {
      ...product,
      category: {
        ...selectedCategory,
        selectedKey: product.category.key,
      },
      awardCoupon: awardCoupon || null,
      recommendedProducts,
      tags,
    };

    sendResponse(res, 200, lastRes);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { price, discount, ...other } = req.body;

    const priceF = parseInt(price);
    const discountF = parseInt(discount);

    const newPrice = priceF - (priceF * discountF) / 100;

    const seoLink = generateSeoLink(other.name);
    const productCode = generateProductCode(other.name);

    const productData = {
      ...other,
      seoLink,
      productCode,
      price: {
        current: price,
        newPrice,
        discount,
        currency: "TRY",
      },
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    cache.del("products");
    sendResponse(res, 201);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.put("/:seoLink", verifyToken, async (req, res) => {
  try {
    const { seoLink } = req.params;
    const { price, discount, imgs, ...other } = req.body;

    const existingProduct = await Product.findOne({ seoLink });

    if (!existingProduct) {
      return sendResponse(res, 404);
    }

    const priceF = parseInt(price);
    const discountF = parseInt(discount);

    const newPrice = priceF - (priceF * discountF) / 100;

    const newSeoLink = other.name == existingProduct.name ? existingProduct.seoLink : generateSeoLink(other.name);
    const productCode = generateProductCode(other.name);

    const productData = {
      ...other,
      seoLink: newSeoLink,
      productCode,
      price: {
        current: price,
        newPrice,
        discount,
        currency: "TRY",
      },
      imgs: imgs ? imgs : existingProduct.imgs,
    };

    const response = await Product.findOneAndUpdate({ seoLink }, productData, { new: true });

    if (response) {
      cache.del("products"); 
      cache.del(`product_${seoLink}`);
    }
    
    response ? sendResponse(res, 201, response) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Product.findByIdAndDelete(id);

    if (response) {
      const imgs = response.imgs;

      const promise = imgs.map(async (img) => {
        const deletedFile = await deleteImage(img);
        deletedFile ? await ProductImage.findOneAndDelete({ imgUrl: img }) : null;
      });

      await Promise.all(promise);
    }

    cache.del("products");
    response ? sendResponse(res, 201) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
