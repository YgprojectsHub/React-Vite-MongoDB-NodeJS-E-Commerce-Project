import { encryptData, setUser, userData } from "../helper/auth";
import { sendReq } from "./http-config";
import { resByStatus } from "./res-interface";

export const register = async (data, action) => {
  try {
    const res = await sendReq("register", data);

    if (res.status == 200) {
      const { response } = await res.json();
      setUser(response[0]);

      encryptData(response[1], "token");
      resByStatus("register", 200, action);
    }
  } catch (err) {
    console.log(err);
  }
};

export const login = async (data, action) => {
  try {
    const res = await sendReq("login", data);

    if (res.status == 200) {
      const { response } = await res.json();
      const { role } = setUser(response[0]);

      encryptData(response[1], "token");
      resByStatus("login", 200, action, role);
    } else {
      resByStatus("login", 400, undefined, false);
    }
  } catch (err) {
    console.log(err);
  }
};

export const users = async () => {
  try {
    const data = await sendReq("users");
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const user = async (id) => {
  try {
    const data = await sendReq("user", id, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const userDelete = async (email) => {
  try {
    const { status } = await sendReq("user-delete", email, true, true);

    resByStatus("user-delete", status);
    return status == 201 ? true : false;
  } catch (err) {
    console.log(err);
  }
};

export const passwordUpdate = async (passwords) => {
  try{
    const {_id} = userData()
    const { status } = await sendReq("passwordUpdate", {...passwords, id: _id}, true);
    resByStatus("password-update", status);
  }catch (err){
    console.log(err);
  }
}

export const categories = async () => {
  try {
    const data = await sendReq("categories");
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const category = async (seoLink) => {
  try {
    const data = await sendReq("category", seoLink, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const categoryCreate = async (Imgdata, formData) => {
  try {
    const newData = { name: "category-create", Imgdata };
    const data = await sendReq("create-img", newData);

    const res = await data.json();
    const link = res.response;

    if (data.status == 200) {
      const newFormData = { ...formData, imgUrl: link };
      const { status } = await sendReq("category-create", newFormData);
      resByStatus("category-create", status);
    }
  } catch (err) {
    console.log(err);
  }
};

export const categoryDelete = async (id) => {
  try {
    const { status } = await sendReq("category-delete", id, true, true);

    resByStatus("category-delete", status);
    return status == 201 ? true : false;
  } catch (err) {
    console.log(err);
  }
};

export const categoryUpdate = async (seoLink, Imgdata, formData) => {
  try {
    let data = []
    let res = []

    if(Imgdata){
      const newData = { seoLink, name: "category-update", Imgdata };
      data = await sendReq("update-img", newData);
      res = await data.json();
    }

    if (!Imgdata || data.status == 200) {
      const newFormData = { ...formData, imgUrl: res.response ? res.response : null, seoLink };
      const { status } = await sendReq("category-update", newFormData, true);
      resByStatus("category-update", status);
    }
  } catch (err) {
    console.log(err);
  }
};

export const products = async () => {
  try {
    const data = await sendReq("products");
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const productCreate = async (Imgdata, formData) => {
  try {
    const newData = { name: "product-create", Imgdata };
    const data = await sendReq("create-img", newData);

    const res = await data.json();
    const links = res.response;

    if (data.status == 200) {
      const newFormData = { ...formData, imgs: links };
      const { status } = await sendReq("product-create", newFormData);
      resByStatus("product-create", status);
    }
  } catch (err) {
    console.log(err);
  }
};

export const productDelete = async (id) => {
  try {
    const { status } = await sendReq("product-delete", id, true, true);

    resByStatus("product-delete", status);
    return status == 201 ? true : false;
  } catch (err) {
    console.log(err);
  }
};

export const product = async (seoLinkOrId) => {
  try {
    const data = await sendReq("product", seoLinkOrId, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const productUpdate = async (seoLink, Imgdata, formData) => {
  try {
    let data = []
    let res = []

    if(Imgdata.length > 0){
      const newData = { seoLink, name: "product-update", Imgdata };
      data = await sendReq("update-img", newData);
      const { response } = await data?.json();
      res = response
    }

    if (Imgdata.length == 0 || data?.status == 200) {
      const newFormData = { ...formData, imgs: res ? res : null, seoLink };
      const { status } = await sendReq("product-update", newFormData, true);
      resByStatus("product-update", status);
    }
  } catch (err) {
    console.log(err);
  }
};

export const couponCreate = async (formData) => {
  try {
    const data = await sendReq("coupon-create", formData);
    resByStatus("coupon-create", data.status);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const coupons = async () => {
  try {
    const data = await sendReq("coupons");
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const couponDelete = async (id) => {
  try {
    const { status } = await sendReq("coupon-delete", id, true, true);
    resByStatus("coupon-delete", status);
    return status == 201 ? true : false;
  } catch {
    console.log(err);
  }
};

export const couponUpdate = async (seoLink, formData) => {
  try {
    const data = await sendReq("coupon-update", { seoLink, ...formData }, true);
    resByStatus("coupon-update", data.status);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const coupon = async (seoLink) => {
  try {
    const data = await sendReq("coupon", seoLink, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const couponById = async (id) => {
  try {
    const data = await sendReq("couponById", id, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const couponsByUserId = async () => {
  try {
    const id = userData()._id
    const data = await sendReq("couponsByUserId", id, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const couponDiscount = async (code) => {
  try {
    const id = userData()._id
    const data = await sendReq("coupon-discount", {id: code, userId: id}, true);
    resByStatus("coupon-discount", data.status);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const reviewCreate = async (id, formData) => {
  try {
    const { status } = await sendReq("review-create", { id, ...formData }, true);
    resByStatus("review-create", status);
    return status == 201 ? true : false;
  } catch (err) {
    console.log(err);
  }
};

export const reviewCanStateControl = async (productId) => {
  try {
    const userId = userData()._id
    const response = await sendReq("review-can-state-control", { userId, id: productId }, true);
    return await response.json()
  } catch (err) {
    console.log(err);
  }
};

export const searchProducts = async (name = undefined, selectedCategories=undefined, selectedTags=undefined, price=undefined) => {
  try {
    const data = await sendReq("products-search", {name: name ? name.search : undefined, selectedCategories, selectedTags, price});
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const payment = async (paymentData) => {
  try {
    const data = await sendReq("payment", paymentData);

    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const orderCreate = async (orderData) => {
  try {
    return await sendReq("order-create", orderData);
  } catch (err) {
    console.log(err);
  }
};

export const orders = async () => {
  try {
    const data = await sendReq("orders");
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const order = async (seoLİnk) => {
  try {
    const data = await sendReq("order", seoLİnk, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const ordersByUser = async (userId) => {
  try {
    const data = await sendReq("orders-byUser", userId, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const orderUpdate = async (seoLink, statusCode) => {
  try {
    const {email, username} = userData()
    const data = await sendReq("order-update", { seoLink, statusCode, email, username }, true);

    if (statusCode == 102) {
      resByStatus("order-completed", data.status);
    } 
    else if (statusCode == 200) {
      resByStatus("order-canceled", data.status);
    }
    else if (statusCode == 201) {
      resByStatus("order-retrive-demand", data.status);
    }
    else{
      resByStatus("order-update", data.status);
    }

    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const statistics = async () => {
  try {
    const mc = await sendReq("monthly-customers");
    const ms = await sendReq("monthly-sales");

    return [await mc.json(), await ms.json()];
  } catch (err) {
    console.log(err);
  }
};

export const userUpdate = async (Imgdata, formData, ppChanged) => {
  try {
    const { _id, avatar } = userData();

    const id = _id;

    const user = userData()

    if (ppChanged) {
      let data;

      if (avatar.startsWith("https://i.pravatar.cc/")) {
        const newData = { id, name: "avatar-create", Imgdata };
        data = await sendReq("create-img", newData);
      } else {
        const newData = { id, name: "avatar-update", Imgdata };
        data = await sendReq("update-img", newData);
      }

      const imgData = await data.json();
      const { response } = imgData;

      if (data.status == 200 || data.status == 201) {

        const newUserData = {
          ...user,
          ...formData,
          isEmailVerification: formData.email != user.email ? false : true,
          id,
          avatar: response,
        };

        const { status } = await sendReq("user-update", newUserData, true);

        resByStatus("user-update", status);

        return status == 201 ? [true, response] : [false];
      } else {
        resByStatus("user-update", 100);
      }
    } else {
      const newUserData = {
        ...user,
        ...formData,
        isEmailVerification: formData.email != user.email ? false : true,
        id 
      };

      const { status } = await sendReq("user-update", newUserData, true);
      resByStatus("user-update", status);
      return status == 201 ? [true] : [false];
    }
  } catch (err) {
    console.log(err);
  }
};

export const sendEmail = async (verificationCode, isEmailVer = false) => {
  try{
    const { email, username } = userData();

    const {status} = await sendReq("verification", {email, username, isEmailVer, verificationCode});

    return status == 200 ? true : false
  } catch (err) {
    console.log(err);
  }
}

export const tagCreate = async (formData) => {
  try {
    const data = await sendReq("tag-create", formData);
    resByStatus("tag-create", data.status);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const tags = async () => {
  try {
    const data = await sendReq("tags");
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const tagDelete = async (id) => {
  try {
    const { status } = await sendReq("tag-delete", id, true, true);
    resByStatus("tag-delete", status);
    return status == 201 ? true : false;
  } catch {
    console.log(err);
  }
};

export const tagUpdate = async (seoLink, formData) => {
  try {
    const data = await sendReq("tag-update", { seoLink, ...formData }, true);
    resByStatus("tag-update", data.status);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};

export const tag = async (seoLink) => {
  try {
    const data = await sendReq("tag", seoLink, true, true);
    return await data.json();
  } catch (err) {
    console.log(err);
  }
};