dotenv.config();
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import { sendResponse } from "../helper/sendResponse.js";

const SECRET_KEY = process.env.SECRET_KEY

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return sendResponse(res, 401)
  }

  jwt.verify(token, SECRET_KEY, (err, data) => {
    if (err) return sendResponse(res, 401)
    next();
  });
}