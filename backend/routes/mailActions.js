import express from "express";
import { verifyToken } from "../middlewares/JWT.js";
import { sendEmail } from "../helper/sendEmail.js";
import { sendResponse } from "../helper/sendResponse.js";

const router = express.Router();

router.post("/EmailVerification", verifyToken, async (req, res) => {
  try {
    const {email, username, verificationCode} = req.body

    const templateData = {
      name: username,
      verificationCode
    }

    const info = sendEmail(email, "EmailVerification", templateData)

    info ? sendResponse(res, 200) : sendResponse(res, 1)
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

export default router;
