import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptData = (data, itemName) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();
  localStorage.setItem(itemName, encryptedData);
};

export const decryptData = (itemName) => {
  const encryptedData = localStorage.getItem(itemName);
  if (!encryptedData) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Şifre çözme hatası:", error);
    return null;
  }
};

export const isLogined = () => {
  return !!localStorage.getItem("user");
};

export const isAdmin = () => {
  const user = isLogined() ? decryptData("user") : null;
  return user && user.role === "admin";
};

export const userData = () => {
  return isLogined() ? decryptData("user") : null;
};

export const deleteDataAndRedirect = (delayCount = 0) => {
  setTimeout(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("token");
    localStorage.removeItem("appliedCoupon");
    window.location.href = "/auth";
  }, delayCount * 1000);
};

export const logout = () => {
  const isConfirm = window.confirm("Çıkış yapmak istediğine emin misin?");
  if (isConfirm) {
    deleteDataAndRedirect();
  }
};

export const setUser = async (userData) => {
  const { password, ...user } = userData;
  encryptData(user, "user");

  return { role: user.role };
};
