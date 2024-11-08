/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartProvider";
import { formatCurrency } from "../../helper/formatCurrency";
import { payment } from "../../http-requests/requests";
import { userData } from "../../helper/auth";
import stripePromise from "../../helper/stripePromise";

const CartTotals = () => {
  const { cartItems, appliedCoupon, setCartItems, setAppliedCoupon } = useContext(CartContext);

  const [fastCargoChecked, setFastCargoChecked] = useState(false);
  const [totals, setTotals] = useState(0);
  const [subTotals, setSubTotals] = useState(0);
  const [cargoFee, setCargoFee] = useState(15);
  
  const paymentCart = async () => {
    const stripe = await stripePromise;
  
    const body = {
      products: cartItems,
      user: userData(),
      cargoFee: fastCargoChecked ? cargoFee : 0,
    };
  
    const { response } = await payment(body);
  
    if (response) {
      localStorage.setItem(
        "paymentDatas",
        JSON.stringify([response.id, totals, fastCargoChecked])
      );
      await stripe.redirectToCheckout({ sessionId: response.id });
    }
  };
  
  // Toplam hesaplamaları için useEffect
  useEffect(() => {
    const calculateTotals = () => {
      const cartItemTotals = cartItems.length > 0 
        ? cartItems.map((item) => parseFloat(item.price.newPrice) * item.quantity) 
        : [];
        
      const calculatedSubTotals = cartItemTotals.reduce((preVal, curVal) => preVal + curVal, 0);
      setSubTotals(calculatedSubTotals);
  
      let totalWithCargo = fastCargoChecked ? cargoFee + calculatedSubTotals : calculatedSubTotals;
  
      if (appliedCoupon && appliedCoupon.length !== 0) {
        totalWithCargo -= (totalWithCargo * appliedCoupon.discount) / 100;
      }
  
      setTotals(totalWithCargo);
    };
  
    calculateTotals();
  }, [appliedCoupon, cartItems, fastCargoChecked, cargoFee]);
  
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.length !== 0) {
      const updateCartItems = cartItems.map((cart) => {
        const price = cart.price;
        const updatedPrice =
          price.newPrice - (price.newPrice * appliedCoupon.discount) / 100;
        return { ...cart, price: { ...price, newPrice: updatedPrice } };
      });
  
      setAppliedCoupon([])
      setCartItems(updateCartItems);
    }
  }, [appliedCoupon]);
  

  return (
    <div className="cart-totals">
      <h2>Cart totals</h2>
      <table>
        <tbody>
          <tr className="cart-subtotal">
            <th>Subtotal</th>
            <td>
              <span id="subtotal">
                {(cartItems.length != 0 &&
                  formatCurrency(subTotals, cartItems[0].price.currency)) ||
                  "₺0,00"}
              </span>
            </td>
          </tr>
          <tr>
            <th>Shipping</th>
            <td>
              <ul>
                <li>
                  <label>
                    Fast Cargo: {formatCurrency(cargoFee, "TRY")}
                    <input
                      type="checkbox"
                      id="fast-cargo"
                      disabled={cartItems.length == 0}
                      checked={fastCargoChecked}
                      onChange={() => setFastCargoChecked(!fastCargoChecked)}
                    />
                  </label>
                </li>
                <li>
                  <a href="#">Change Address</a>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Total</th>
            <td>
              <strong id="cart-total">
                {(cartItems.length != 0 &&
                  formatCurrency(totals, cartItems[0].price.currency)) ||
                  "₺0,00"}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="checkout">
        <button
          className="btn btn-lg"
          disabled={cartItems.length == 0}
          onClick={paymentCart}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
};

export default CartTotals;
