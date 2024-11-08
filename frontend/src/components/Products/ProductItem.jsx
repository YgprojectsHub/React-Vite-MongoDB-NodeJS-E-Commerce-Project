import propTypes from "prop-types";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../helper/formatCurrency";

import { isAdmin } from "../../helper/auth";
import "./ProductItem.css";

const ProductItem = ({ productItem }) => {
  
  const reviewItems = productItem.reviews

  const totalRating = reviewItems && reviewItems.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviewItems.length == 0 ? 0 : totalRating / reviewItems.length;

  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  return (
    <div className="product-item glide__slide glide__slide--active">
      <div className="product-image">
        <Link to={`/product/${productItem.seoLink}`}>
          <img src={productItem.imgs[0]} alt="" className="img1" />
          <img src={productItem.imgs[1]} alt="" className="img2" />
        </Link>
      </div>
      <div className="product-info">
        <Link to={`/product/${productItem.seoLink}`} className="product-title">
          {productItem.name}
        </Link>
        {productItem.reviews && <ul className="product-star">
          {[...Array(fullStars)].map((_, index) => (
            <li key={index}>
              <i className="bi bi-star-fill"></i>
            </li>
          ))}

          {hasHalfStar && (
            <li>
              <i className="bi bi-star-half"></i>
            </li>
          )}

          {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
            <li key={index}>
              <i className="bi bi-star"></i>
            </li>
          ))}
        </ul>}
        <div className="product-prices">
          <strong className="new-price">
            {formatCurrency(
              productItem.price.newPrice,
              productItem.price.currency
            )}
          </strong>
          {productItem.price.discount != 0 && (
            <span className="old-price">
              {formatCurrency(
                productItem.price.current,
                productItem.price.currency
              )}
            </span>
          )}
        </div>
        {productItem.price.discount != 0 && (
          <span className="product-discount">
            -%{productItem.price.discount}
          </span>
        )}
        <div className="product-links">
          {!isAdmin() && <button>
            <i className="bi bi-heart-fill"></i>
          </button>}
          <Link to={`/product/${productItem.seoLink}`} className="product-link">
            <i className="bi bi-eye-fill"></i>
          </Link>
          <a href="#">
            <i className="bi bi-share-fill"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

ProductItem.propTypes = {
  productItem: propTypes.object,
};
