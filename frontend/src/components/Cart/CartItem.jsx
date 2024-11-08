import PropTypes from "prop-types";
import { CartContext } from "../../context/CartProvider";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../helper/formatCurrency";

const CartItem = ({ cartItem }) => {
  const {removeFromCart} = useContext(CartContext);

  const totalPrice = (cartItem.price.newPrice * cartItem.quantity);

  return (
    <tr className="cart-item">
      <td></td>
      <td className="cart-image">
        <img src={cartItem.imgs[0]} alt=""/>
        <i className="bi bi-x delete-cart" onClick={() => removeFromCart(cartItem.index)}/>
      </td>
      <td>
        <div className="cart-item-info">
          {cartItem.awardCoupon && <div className="discount-badge"> %{cartItem.awardCoupon.discountPercent} indirim kuponu hediye! </div>}
          <Link to={"/product/"+cartItem.seoLink}>{cartItem.name}</Link>
        </div>
      </td>
      <td>{formatCurrency(cartItem.price.newPrice, cartItem.price.currency)}</td>
      <td className="product-quantity">{cartItem.quantity}</td>
      <td className="product-subtotal">{formatCurrency(totalPrice, cartItem.price.currency)}</td>
    </tr>
  );
};

export default CartItem;

CartItem.propTypes = {
  cartItem: PropTypes.object
}
