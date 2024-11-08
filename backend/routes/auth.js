import dotenv from "dotenv";
import express from "express";
import User from "../database/models/User.js";
import { sendResponse } from "../helper/sendResponse.js";
import { compareValue, hashValue } from "../helper/crypto.js";
import { genRandomAvatar } from "../helper/randomAvatar.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { verifyToken } from "../middlewares/JWT.js";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { browser, version, os, platform, source, isMobile, isTablet, isDesktop } = req.useragent;
    const ipAddress = req.ip;

    const { username, email, password, role } = req.body;

    let deviceType = "Unknown";
    if (isMobile) deviceType = "Mobile";
    else if (isTablet) deviceType = "Tablet";
    else if (isDesktop) deviceType = "Desktop";

    let location = await getUserLocation(ipAddress)

    if(!location) return sendResponse(res, 500);

    const psw = await hashValue(password);

    const userData = {
      username,
      email,
      password: psw,
      role: role ? "admin" : "user",
      avatar: genRandomAvatar(),
      lastLogin: Date.now(),
      loginedDevices: [
        {
          ipAddress,
          operatingSystem: os,
          browserInfo: browser,
          version,
          platform,
          deviceType,
          source,
          loginDate: Date.now(),
          location
        }
      ],
    };

    const newUser = new User(userData);
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email, password: newUser.password }, SECRET_KEY, { expiresIn: "3 days" });

    sendResponse(res, 200, [newUser, token]);
  } catch (err) {
    err.code === 11000 ? sendResponse(res, 400) : sendResponse(res, 500, err, req);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { browser, version, os, platform, isMobile, isTablet, isDesktop, source } = req.useragent;
    const ipAddress = req.ip;

    let deviceType = "Unknown";
    if (isMobile) deviceType = "Mobile";
    else if (isTablet) deviceType = "Tablet";
    else if (isDesktop) deviceType = "Desktop";

    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 404);
    } 
    else {
      const isPasswordMatch = await compareValue(password, user.password);

      if (isPasswordMatch) {
        const deviceExists = user.loginedDevices.some(device =>
          device.ipAddress === ipAddress &&
          device.operatingSystem === os &&
          device.browserInfo === browser &&
          device.version === version &&
          device.platform === platform &&
          device.deviceType === deviceType
        );

        if (!deviceExists) {
          let location = await getUserLocation(ipAddress)

          if(!location) return sendResponse(res, 500);

          user.loginedDevices.push({
            ipAddress,
            operatingSystem: os,
            browserInfo: browser,
            version,
            platform,
            deviceType,
            source,
            loginDate: Date.now(),
            location
          });
        }

        user.lastLogin = Date.now()

        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "3 days" });

        sendResponse(res, 200, [user, token]);
      } else {
        sendResponse(res, 404);
      }
    }
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});


router.put("/passwordUpdate/:uid", verifyToken, async (req, res) => {
  try {
    const { uid } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(uid);
    
    if(!user){
      return sendResponse(res, 404);
    }

    const isPasswordMatch = await compareValue(oldPassword, user.password);

    if(!isPasswordMatch){
      return sendResponse(res, 400);
    }

    const psw = await hashValue(newPassword);
    const response = await User.findByIdAndUpdate(uid, {password: psw});

    response ? sendResponse(res, 201) : sendResponse(res, 404);
  } catch (err) {
    sendResponse(res, 500, err, req);
  }
});

const getUserLocation = async(ipAddress) => {
  try {
    const ip = ipAddress == "::1" ? "" : ipAddress
    const response = await axios.get(`http://ip-api.com/json/${ip}`);

    const { regionName, city, lat, lon, timezone, isp, org, as } = response.data;
    
    return { regionName, city, lat, lon, timezone, isp, org, as }
  } catch (error) {
    console.log("Konum bilgisi alınamadı:", error);
    return sendResponse(res, 500, error, req);
  }
}

export default router;
