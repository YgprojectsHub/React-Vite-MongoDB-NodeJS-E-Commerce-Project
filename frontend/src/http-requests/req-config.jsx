const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

export const requestConfig = [
  //auth

  {
    name: "register",
    url: baseUrl + "auth/register",
    method: "POST",
    configType: "raw",
  },
  {
    name: "login",
    url: baseUrl + "auth/login",
    method: "POST",
    configType: "raw",
  },
  {
    name: "passwordUpdate",
    url: baseUrl + "auth/passwordUpdate/",
    method: "PUT",
    configType: "raw",
  },

  //user

  {
    name: "users",
    url: baseUrl + "users/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "user",
    url: baseUrl + "users/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "user-delete",
    url: baseUrl + "users/",
    method: "DELETE",
    configType: "raw",
  },

  {
    name: "user-update",
    url: baseUrl + "users/",
    method: "PUT",
    configType: "raw",
  },

  //category

  {
    name: "categories",
    url: baseUrl + "categories/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "category-delete",
    url: baseUrl + "categories/",
    method: "DELETE",
    configType: "raw",
  },
  {
    name: "category-update",
    url: baseUrl + "categories/",
    method: "PUT",
    configType: "raw",
  },
  {
    name: "category",
    url: baseUrl + "categories/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "category-create",
    url: baseUrl + "categories/",
    method: "POST",
    configType: "raw",
  },

  //product

  {
    name: "products",
    url: baseUrl + "products/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "product-delete",
    url: baseUrl + "products/",
    method: "DELETE",
    configType: "raw",
  },
  {
    name: "product-update",
    url: baseUrl + "products/",
    method: "PUT",
    configType: "raw",
  },
  {
    name: "product",
    url: baseUrl + "products/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "product-create",
    url: baseUrl + "products/",
    method: "POST",
    configType: "raw",
  },

  //coupon

  {
    name: "coupons",
    url: baseUrl + "coupons/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "coupon-delete",
    url: baseUrl + "coupons/",
    method: "DELETE",
    configType: "raw",
  },
  {
    name: "coupon-create",
    url: baseUrl + "coupons/",
    method: "POST",
    configType: "raw",
  },
  {
    name: "coupon",
    url: baseUrl + "coupons/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "couponById",
    url: baseUrl + "coupons/id/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "couponsByUserId",
    url: baseUrl + "coupons/user/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "coupon-discount",
    url: baseUrl + "coupons/code/",
    method: "POST",
    configType: "raw",
  },
  {
    name: "coupon-update",
    url: baseUrl + "coupons/",
    method: "PUT",
    configType: "raw",
  },

  //review

  {
    name: "review-create",
    url: baseUrl + "reviews/",
    method: "POST",
    configType: "raw",
  },

  {
    name: "review-can-state-control",
    url: baseUrl + "reviews/controlCanComment/",
    method: "POST",
    configType: "raw",
  },

  //products

  {
    name: "products-search",
    url: baseUrl + "search/product",
    method: "POST",
    configType: "raw",
  },

  //payment

  {
    name: "payment",
    url: baseUrl + "payment/",
    method: "POST",
    configType: "raw",
  },

  //orders

  {
    name: "orders",
    url: baseUrl + "orders/",
    method: "GET",
    configType: "raw",
  },

  {
    name: "order",
    url: baseUrl + "orders/",
    method: "GET",
    configType: "raw",
  },

  {
    name: "order-create",
    url: baseUrl + "orders/",
    method: "POST",
    configType: "raw",
  },

  {
    name: "order-update",
    url: baseUrl + "orders/",
    method: "PUT",
    configType: "raw",
  },

  {
    name: "orders-byUser",
    url: baseUrl + "orders/ordersByUser/",
    method: "GET",
    configType: "raw",
  },

  //statics

  {
    name: "monthly-customers",
    url: baseUrl + "statistic/monthly-customers",
    method: "GET",
    configType: "raw",
  },

  {
    name: "monthly-sales",
    url: baseUrl + "statistic/monthly-sales",
    method: "GET",
    configType: "raw",
  },

  //email

  {
    name: "verification",
    url: baseUrl + "mailActions/EmailVerification",
    method: "POST",
    configType: "raw",
  },

  //tag

  {
    name: "tags",
    url: baseUrl + "tags/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "tag-delete",
    url: baseUrl + "tags/",
    method: "DELETE",
    configType: "raw",
  },
  {
    name: "tag-create",
    url: baseUrl + "tags/",
    method: "POST",
    configType: "raw",
  },
  {
    name: "tag",
    url: baseUrl + "tags/",
    method: "GET",
    configType: "raw",
  },
  {
    name: "tag-update",
    url: baseUrl + "tags/",
    method: "PUT",
    configType: "raw",
  },

  //update-create img(s)

  {
    name: "update-img",
    url: baseUrl + "uploads/",
    method: "POST",
    configType: "form-data",
  },
  {
    name: "create-img",
    url: baseUrl + "uploads/",
    method: "POST",
    configType: "form-data",
  },
];

export const imgReqConfig = [
  //category

  {
    name: "category-create",
    extUrl: "createCategoryImg",
    multiple: false,
  },
  {
    name: "category-update",
    extUrl: "updateCategoryImg/",
    multiple: false,
  },

  //product

  {
    name: "product-create",
    extUrl: "createProductImg",
    multiple: true,
  },
  {
    name: "product-update",
    extUrl: "updateProductImg/",
    multiple: true,
  },

  //avatar

  {
    name: "avatar-create",
    extUrl: "createAvatarImg",
    multiple: false,
  },
  {
    name: "avatar-update",
    extUrl: "updateAvatarImg/",
    multiple: false,
  },
];

export const reqs = [
  {
    name: "register",
    isRedirect: true,
    status: {
      success: "Kayıt işlemi başarılı!, yönlendiriliyorsunuz..",
      bad_request: "Email başka bir hesaba kayıtlı.",
    },
  },
  {
    name: "login",
    isRedirect: true,
    status: {
      success: "Giriş işlemi başarılı!, yönlendiriliyorsunuz..",
      bad_request: "Email ya da şifre yanlış.",
    },
  },

  {
    name: "user-delete",
    isRedirect: false,
    status: {
      success: "Kullanıcı silindi.",
      bad_request: "Kullanıcı bulunamadı.",
    },
  },

  {
    name: "category-delete",
    isRedirect: false,
    status: {
      success: "Kategori silindi.",
      bad_request: "Kategori bulunamadı.",
    },
  },
  {
    name: "category-update",
    isRedirect: false,
    status: {
      success: "Kategori güncellendi.",
      bad_request: "Kategori bulunamadı.",
    },
  },
  {
    name: "category-create",
    isRedirect: false,
    status: {
      success: "Kategori oluşturuldu.",
      bad_request: "Aynı isime sahip iki kategori olamaz..",
    },
  },

  {
    name: "product-delete",
    isRedirect: false,
    status: {
      success: "Ürün silindi.",
      bad_request: "Ürün bulunamadı.",
    },
  },
  {
    name: "product-update",
    isRedirect: false,
    status: {
      success: "Ürün güncellendi.",
      bad_request: "Ürün bulunamadı.",
    },
  },
  {
    name: "product-create",
    isRedirect: false,
    status: {
      success: "Ürün oluşturuldu.",
      bad_request: "Resimler yüklenemedi. Lütfen daha sonra tekrar deneyiniz.",
    },
  },

  {
    name: "coupon-delete",
    isRedirect: false,
    status: {
      success: "Kupon silindi.",
      bad_request: "Kupon bulunamadı.",
    },
  },
  {
    name: "coupon-update",
    isRedirect: false,
    status: {
      success: "Kupon güncellendi.",
      bad_request: "Kupon bulunamadı.",
    },
  },
  {
    name: "coupon-create",
    isRedirect: false,
    status: {
      success: "Kupon oluşturuldu.",
      bad_request: "Aynı koda sahip iki kupon olamaz.",
    },
  },
  {
    name: "coupon-discount",
    isRedirect: false,
    status: {
      success: "Kupon uygulandı.",
      bad_request: "Bu indirim kodu bulunamadı.",
    },
  },

  {
    name: "review-create",
    isRedirect: false,
    status: {
      success: "Yorum oluşturuldu.",
      bad_request: "Ürün bulunamadı.",
    },
  },

  {
    name: "order-update",
    isRedirect: false,
    status: {
      success: "Sipariş durumu güncellendi.",
      bad_request: "Sipariş bulunamadı.",
    },
  },

  {
    name: "order-completed",
    isRedirect: false,
    status: {
      success: "Sipariş tamamlandı olarak işaretlendi.",
      bad_request: "Sipariş bulunamadı.",
    },
  },

  {
    name: "order-canceled",
    isRedirect: false,
    status: {
      success: "Sipariş iptal edildi, En kısa sürede ücret iadesi yapılacaktır.",
      bad_request: "Sipariş bulunamadı.",
    },
  },

  {
    name: "order-retrive-demand",
    isRedirect: false,
    status: {
      success: "Sipariş iade talebi gönderildi.",
      bad_request: "Sipariş bulunamadı.",
    },
  },

  {
    name: "user-update",
    isRedirect: false,
    status: {
      success: "Kullanıcı güncellendi.",
      bad_request: "Kullanıcı bulunamadı.",
    },
  },

  {
    name: "password-update",
    isRedirect: false,
    status: {
      success: "Şifre güncellendi.",
      bad_request: "Eski şifre yanlış.",
    },
  },

  {
    name: "tag-delete",
    isRedirect: false,
    status: {
      success: "Etiket silindi.",
      bad_request: "Etiket bulunamadı.",
    },
  },
  {
    name: "tag-update",
    isRedirect: false,
    status: {
      success: "Etiket güncellendi.",
      bad_request: "Etiket bulunamadı.",
    },
  },
  {
    name: "tag-create",
    isRedirect: false,
    status: {
      success: "Etiket oluşturuldu.",
      bad_request: "Aynı isme sahip iki etiket olamaz.",
    },
  },
];
