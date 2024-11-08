import { message } from "antd";
import { reqs } from "./req-config";

export const resByStatus = (req, status, action = undefined, isAdmin = false) => {
  const codeType = reqs.find((obj) => obj.name === req);

  if (status == 200 || status == 201) {
    action ? action.resetForm() : null;

    message.success(codeType.status.success, 2);

    codeType.isRedirect ? redirect(req, isAdmin) : null;

  } else if (status == 500) {
    message.error("Oops.. Bir sorun çıktı, lütfen daha sonra tekrar deneyiniz.");
  } else {
    message.warning(codeType.status.bad_request, 3);
  }
};

const redirect = (req, isAdmin) => {
  if (req == "login" && isAdmin) delay("/p/admin");
  else if (req == "login" && !isAdmin) delay("/p/account");
  else if (req == "register") delay("/p/account");
};

const delay = (url) =>
  setTimeout(() => {
    window.location.href = url;
  }, 1000);
