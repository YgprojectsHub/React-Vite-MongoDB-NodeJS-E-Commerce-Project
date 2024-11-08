import crypto from "crypto";
import moment from "moment";

const generateToken = () => {
  return crypto.randomBytes(16).toString("hex")
};

export const token = () => {
  const token = generateToken();
  const expiration = moment().add(3, "minutes").toISOString()

  const link = `${token}/${encodeURIComponent(expiration)}`;
  return link;
};
