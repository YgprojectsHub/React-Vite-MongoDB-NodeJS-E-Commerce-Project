import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orders: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        awardCoupon: [{ type: String }],
        img: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
        size: { type: String },
      },
    ],
    totalPrice: { type: Number, required: true },
    isFastCargo: { type: Boolean, default: false, required: true },
    paymentSessionId: { type: String, required: true },
    usedCoupon: { type: mongoose.Schema.Types.Mixed },
    
    orderCode: { type: String, required: true },
    status: {
      type: Number,
      enum: [100, 101, 102, 200, 201, 202],
      default: 100,
      required: true,
    },
    seoLink: { type: String, required: true },
  },
  { timestamps: true }
);

//status: Beklemede, Kargoya Verildi, Teslim Edildi, İptal Edildi, İade Talep Edildi, İade Edildi,

const Order = mongoose.model("Order", OrderSchema);

export default Order;
