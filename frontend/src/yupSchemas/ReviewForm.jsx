import * as yup from "yup";

export const reviewSchema = yup.object().shape({
  text: yup.string().required("Yorum yazınız.").min(10, "Yorum en az 10 karakterden oluşamlıdır."),
  rating: yup.number().required("Oylama zorunludur")
});
