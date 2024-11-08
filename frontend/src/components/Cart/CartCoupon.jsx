import { useContext, useState } from "react";
import { couponDiscount } from "../../http-requests/requests";
import { CartContext } from "../../context/CartProvider";
import { decryptData } from "../../helper/auth";

const CartCoupon = () => {
  const [couponCode, setCouponCode] = useState("")
  const {cartItems, setAppliedCoupon} = useContext(CartContext)
  const [isCanUse, setIsCanUse] = useState(decryptData("appliedCoupon").length == 0 ? false : true)

  const applyCoupon = async() => {
    const {response} = await couponDiscount(couponCode)
    if(response){
      setIsCanUse(true)
      console.log(response)
      setAppliedCoupon({discount: response.coupon.discountPercent, coupon: response.coupon})
    }
  };
  
  if(cartItems.length == 0){
    return 
  }

  return (
    <div className="actions-wrapper">
      <div className="coupon">
        <input
          type="text"
          name="code"
          className="input-text"
          placeholder="Coupon code"
          onChange={(e) => setCouponCode(e.target.value)}
          value={couponCode}
        />
        <button className="btn" type="button" disabled={isCanUse || couponCode.length < 6 || couponCode.length > 12} onClick={applyCoupon}>
          Apply Coupon
        </button>
      </div>
    </div>
  );
};

export default CartCoupon;
