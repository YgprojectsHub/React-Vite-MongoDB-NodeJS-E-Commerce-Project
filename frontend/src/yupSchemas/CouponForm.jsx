import * as yup from "yup";

export const couponSchema = yup.object().shape({
  text: yup.string().min(6, "Yorum en az 6 karakterden oluşamlıdır.").max(12, "Yorum en az 12 karakterden oluşamlıdır.")
});
