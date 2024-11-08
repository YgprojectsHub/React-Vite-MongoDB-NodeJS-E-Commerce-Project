import express from "express";
import {
  upload,
  generateImageMetadata,
  deleteImage,
} from "../helper/imageUplodaer.js";
import { sendResponse } from "../helper/sendResponse.js";

import CategoryImage from "../database/models/image/Category.js";
import Category from "../database/models/Category.js";

import Product from "../database/models/Product.js";
import ProductImage from "../database/models/image/Product.js";
import { verifyToken } from "../middlewares/JWT.js";
import UserImage from "../database/models/image/User.js";
import User from "../database/models/User.js";

const router = express.Router();

router.post("/createCategoryImg", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    console.log(file)

    if (file) {
      const { id, filename, link } = generateImageMetadata(
        file,
        "createCategoryImg"
      );

      const newImage = new CategoryImage({
        categoryId: id,
        filename,
        imgUrl: link,
      });

      await newImage.save();

      sendResponse(res, 200, link);
    } else {
      sendResponse(res, 400, "Resim gönderilmedi.");
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/updateCategoryImg/:seoLink", verifyToken, upload.single("image"),async (req, res) => {
  try {
    const file = req.file;
    const { seoLink } = req.params;

    const { imgUrl } = await Category.findOne({ seoLink });

    if (imgUrl) {
      const deletedFile = await deleteImage(imgUrl);
      deletedFile && await CategoryImage.findOneAndDelete({ imgUrl })
    }

    if (file) {
      const { id, filename, link } = generateImageMetadata(
        file,
        "updateCategoryImg"
      );

      const newImage = new CategoryImage({
        categoryId: id,
        filename,
        imgUrl: link,
      });

      await newImage.save();

      sendResponse(res, 200, link);
    } else {
      sendResponse(res, 400, "Resim gönderilmedi.");
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
  }
);

router.post("/createProductImg", verifyToken, upload.array("images"), async (req, res) => {
  try {
    const files = req.files;

    if (files && files.length > 0) {
      const imagePromises = files.map((file) => {
        const { id, filename, link } = generateImageMetadata(file,"createProductImg");

        const newImage = new ProductImage({
          productId: id,
          filename,
          imgUrl: link,
        });

        return newImage.save();
      });

      await Promise.all(imagePromises);

      const links = files.map(
        (file) => generateImageMetadata(file, "createProductImg").link
      );

      sendResponse(res, 200, links);
    } else {
      sendResponse(res, 400, "Resim gönderilmedi.");
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/updateProductImg/:seoLink", verifyToken, upload.array("images"), async (req, res) => {
    try {
      const files = req.files;
      const { seoLink } = req.params;

      const product = await Product.findOne({seoLink});
      
      if (!product) {
        return sendResponse(res, 404, "Ürün bulunamadı.");
      }

      const { imgs } = product;

      if (imgs && imgs.length > 0) {
        const imagePromises = imgs.map(async (imgUrl) => {
          const deletedFiles = await deleteImage(imgUrl);
          deletedFiles && await ProductImage.findOneAndDelete({ imgUrl });
        });

        await Promise.all(imagePromises);
      }

      if (files) {
        const imagePromises = files.map(async (file) => {
          const { id, filename, link } = generateImageMetadata(
            file,
            "updateProductImg"
          );

          const newImage = new ProductImage({
            productId: id,
            filename,
            imgUrl: link,
          });

          await newImage.save();
          return link;
        });

        const links = await Promise.all(imagePromises)

        sendResponse(res, 200, links);
      } else {
        sendResponse(res, 400, "Resim gönderilmedi.");
      }
    } catch (err) {
      sendResponse(res, 500, err.message)
    }
  }
);



router.post("/createAvatarImg", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (file) {
      const { id, filename, link } = generateImageMetadata(
        file,
        "createAvatarImg"
      );

      const newImage = new UserImage({
        avatarId: id,
        filename,
        imgUrl: link,
      });

      await newImage.save();

      sendResponse(res, 200, link);
    } else {
      sendResponse(res, 400, "Resim gönderilmedi.");
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

router.post("/updateAvatarImg/:userId", verifyToken, upload.single("image"),async (req, res) => {
  try {
    const file = req.file;
    const { userId } = req.params;

    const { avatar } = await User.findById(userId);

    if (avatar) {
      const deletedFile = await deleteImage(avatar);
      deletedFile && await UserImage.findOneAndDelete({ imgUrl: avatar })
    }

    if (file) {
      const { id, filename, link } = generateImageMetadata(
        file,
        "updateAvatarImg"
      );

      const newImage = new UserImage({
        avatarId: id,
        filename,
        imgUrl: link,
      });

      await newImage.save();

      sendResponse(res, 200, link);
    } else {
      sendResponse(res, 400, "Resim gönderilmedi.");
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
  }
);

export default router;
