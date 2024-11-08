import * as yup from "yup"

export const loginFormSchemas = yup.object().shape({
    email : yup.string().email("Geçerli email adresi giriniz.").required("Email adresi giriniz."),
    password : yup.string().min(6,"Karakter sayısı 6-16 arasında olmalıdır.").max(16,"Karakter sayısı 6-16 arasında olmalıdır.").required("Şifre giriniz."),
})