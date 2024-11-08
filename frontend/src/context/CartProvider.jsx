import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { decryptData, encryptData } from "../helper/auth";
import { couponById } from "../http-requests/requests";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const firstCart = decryptData("cartItems") || []
  const firstCoupon = decryptData("appliedCoupon") || []

  const [cartItems, setCartItems] = useState(firstCart);
  const [appliedCoupon, setAppliedCoupon] = useState(firstCoupon);

  useEffect(() => {
    encryptData(cartItems, "cartItems");
    encryptData(appliedCoupon, "appliedCoupon");
  }, [cartItems, appliedCoupon]);
  
  const addToCart = async(cartItem) => {
    const {response} = await couponById(cartItem.awardCoupon._id)

    setCartItems((prevCart) => [
      ...prevCart,
      {
        _id: cartItem._id,
        imgs: [cartItem.imgs[0]],
        name: cartItem.name,
        productCode: cartItem.productCode,
        price: cartItem.price,
        size: cartItem.size,
        color: cartItem.color,
        seoLink: cartItem.seoLink,
        awardCoupon: response,
        quantity: cartItem.quantity || 1,
        index: cartItems.length != 0 ? cartItems.length + 1 : 0
      }
    ]);
  };

  const removeFromCart = (index) => {
    const filteredCartItems = cartItems.filter((cartItem) => {
      return cartItem.index !== index;
    });

    setCartItems(filteredCartItems);
    filteredCartItems.length == 0 && setAppliedCoupon([]);
  };

  const removeCartItems = () => {
    setCartItems([])
    setAppliedCoupon([])
  }

  const filteredCart = (id) => {
    return cartItems.find((cartItem) => cartItem._id === id);
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        filteredCart,
        setAppliedCoupon,
        appliedCoupon,
        removeCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

CartProvider.propTypes = {
  children: PropTypes.node,
};
