import {useContext} from "react";
import CartItem from "./CartItem";
import { CartContext } from "../../context/CartProvider"

const CartTable = () => {
  const { cartItems } = useContext(CartContext)

  if(cartItems.length == 0){
    return (
      <h3 style={{width: "100%", textAlign: "center", margin: "10px 0px"}}>Görünüşe göre sepette ürün yok.</h3>
    )
  }

  return (
    <table className="shop-table">
      <thead>
        <tr>
          <th className="product-thumbnail">&nbsp;</th>
          <th className="product-thumbnail">&nbsp;</th>
          <th className="product-name">Product</th>
          <th className="product-price">Price</th>
          <th className="product-quantity">Quantity</th>
          <th className="product-subtotal">Subtotal</th>
        </tr>
      </thead>
      <tbody className="cart-wrapper">
        {cartItems.map((cart,id) => (
          <CartItem cartItem={cart} key={id}/>
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
