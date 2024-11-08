import { message } from "antd";
import { decryptData, deleteDataAndRedirect } from "../helper/auth";
import { imgReqConfig, requestConfig } from "./req-config";

const headerConfig = (reqType, data = undefined, imgReq = undefined) => {
  let config = {};
  const token = decryptData("token");

  if (reqType.configType === "raw") {
    config = {
      method: reqType.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (reqType.method !== "GET" && reqType.method !== "DELETE") {
      config.body = JSON.stringify(data);
    }
  } else {
    const isMulti = imgReq?.multiple;

    const formData = new FormData();

    if (isMulti) {
      data.forEach(file => {
        formData.append("images", file);
      });
    } else {
      formData.append("image", data);
    }

    config = {
      method: reqType.method,
      body: formData,
    };
  }

  if (token) {
    config.headers = {
      ...config.headers,
      "Authorization": `Bearer ${token}`
    };
  }
  
  return config;
};


export const sendReq = async (type, data = undefined, haveParam = false, isGet=false) => {
  try {
    const reqType = requestConfig.find((req) => req.name == type);

    if (reqType.configType == "form-data") {
      const imgReq = imgReqConfig.find((req) => req.name == data.name)

      const splitData = data ? data.name.split("-") : undefined
      const isCreate = splitData && splitData[1] == "create" ? true : false

      if(isCreate){
        const res = await fetch(reqType.url + imgReq.extUrl, headerConfig(reqType, data.Imgdata, imgReq))
        return isUnauthorized(res)
      }else{
        const res = await fetch(reqType.url + imgReq.extUrl + (data.id ? data.id : data.seoLink), headerConfig(reqType, data.Imgdata, imgReq))
        return isUnauthorized(res)
      }
    } else {
      if(haveParam){
        if(isGet){
          const res = await fetch(reqType.url + data, headerConfig(reqType))
          return isUnauthorized(res)
        }else{
          const res = await fetch(reqType.url + (data.id ? data.id : data.seoLink), headerConfig(reqType, data))
          return isUnauthorized(res)
        }
      }else{
        const res = await fetch(reqType.url, headerConfig(reqType, data ? data : undefined))
        return isUnauthorized(res)
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const isUnauthorized = (res) => {
  const isToken = localStorage.getItem("token")
  if(res.status == 401 && isToken){
    message.warning("Oturum süreniz dolmuştur. Yönlendiriliyorsunuz...", 3);
    deleteDataAndRedirect(3)
    return []
  }
  if(res.status == 401 && !isToken){
    return []
  }else{
    return res
  }
}