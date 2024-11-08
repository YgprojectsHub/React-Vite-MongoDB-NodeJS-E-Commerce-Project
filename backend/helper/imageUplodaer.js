dotenv.config();
import dotenv from "dotenv"
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { serverBaseLink } from "../helper/mixLinkAndPort.js"
import fs from "fs"

const reqsByLink = [
  {name: "createCategoryImg", urlName: "categories"},
  {name: "updateCategoryImg", urlName: "categories"},
  {name: "createProductImg", urlName: "products"},
  {name: "updateProductImg", urlName: "products"},
  {name: "createAvatarImg", urlName: "avatars"},
  {name: "updateAvatarImg", urlName: "avatars"},
]

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/${setLastURL(req)}/`);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = uniqueId + extension;
    cb(null, filename);
  }
});

const setLastURL = (reqtype) => {
  const refs = reqtype.url.split("/")
  const ref = refs[1]
  const req = reqsByLink.find(i => i.name==ref)

  return req.urlName
}

const getRelativePath = (baseUrl, fullUrl) => {
  return fullUrl.substring(baseUrl.length)
}

export const deleteImage = (filePath) => {

  const path = getRelativePath(serverBaseLink(), filePath)

  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const upload = multer({ storage });

export const generateImageMetadata = (file, reqtype) => {
  const id = uuidv4();
  const req = reqsByLink.find(i => i.name==reqtype)

  const link = `${serverBaseLink()}uploads/${req.urlName}/${file.filename}`;

  return {
    id,
    filename: file.filename,
    link,
  };
};
