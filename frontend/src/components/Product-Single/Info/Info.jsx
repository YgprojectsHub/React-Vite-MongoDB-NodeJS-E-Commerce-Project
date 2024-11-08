import { useRef, useState } from "react";
import { formatCurrency } from "../../../helper/formatCurrency";
import { useContext } from "react";
import { CartContext } from "../../../context/CartProvider";
import { ReviewContext } from "../../../context/ReviewProvider";
import { Select } from "antd"; // Ant Design Select component
import "./Info.css";
import { isAdmin, isLogined } from "../../../helper/auth";
import { Link } from "react-router-dom";
import { findTitleByKey } from "../../../helper/findTitleByKey";

const Info = ({ product }) => {
  const quantityRef = useRef();

  const sizesData = product.additionalDetails.filter((detail) => detail.key == "sizes")[0].value.split(",");
  const [selectedSize, setSize] = useState(sizesData && sizesData[0]);

  const [selectedColor, setColor] = useState(product.colors[0]);
  const { addToCart } = useContext(CartContext);
  const { reviewItems, pseudoItem } = useContext(ReviewContext);

  let userReview = 0
  reviewItems.map(review => !review.isAdmin && userReview++)
  const reviewCount = reviewItems && userReview + (pseudoItem ? 1 : 0);

  const totalRating = reviewItems && reviewItems.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = reviewItems.length == 0 ? 0 : totalRating / reviewCount;
  
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;


  const selectedCategory = findTitleByKey(product.category.children[0], product.category.selectedKey);

  const shortDescription = product.description.length > 60 ? product.description.substring(0, 60) + "..." : product.description;

  return (
    <div className="product-info">
      <h1 className="product-title">{product.name}</h1>
      {product.reviews && (
        <div className="product-review">
          <ul className="product-star">
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

            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map(
              (_, index) => (
                <li key={index}>
                  <i className="bi bi-star"></i>
                </li>
              )
            )}
          </ul>
          <span>{reviewCount} reviews</span>
        </div>
      )}
      <div className="product-price">
        <s className="old-price">
          <h5>
            {formatCurrency(product.price.current, product.price.currency)}
          </h5>
        </s>
        <strong className="new-price">
          {formatCurrency(product.price.newPrice, product.price.currency)}
        </strong>
      </div>
      <div
        className="product-description"
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: shortDescription }}
      />
      <form className="variations-form">
        <div className="variations">
          <div className="colors">
            <div className="colors-label">
              <span>Color</span>
            </div>
            <div className="colors-wrapper">
              {product.colors.map((color, id) => (
                <div
                  className={`color-wrapper ${
                    selectedColor == color ? "active" : ""
                  }`}
                  key={id}
                >
                  <label style={{ background: color }}>
                    <input
                      type="radio"
                      name="product-color"
                      onClick={() => setColor(color)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
          {sizesData.length > 0 && (
            <div className="values">
              <div className="about-label">
                <span>Sizes</span>
              </div>
              <Select
                value={selectedSize}
                onChange={(value) => setSize(value)}
                style={{ width: 200 }}
                placeholder="Select a size"
              >
                {sizesData.map((sizeData, id) => (
                  <Select.Option key={id} value={sizeData}>
                    {sizeData}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
          
          <div className="cart-button">
            <div className="about-label">
              <span>Add To Cart</span>
            </div>
            <input
              type="number"
              defaultValue="1"
              ref={quantityRef}
              min="1"
              max={product.stockCount}
              id="quantity"
            />
            <button
              className="btn btn-lg btn-primary"
              id="add-to-cart"
              type="button"
              disabled={!isLogined() || isAdmin()}
              onClick={() =>
                addToCart({
                  ...product,
                  color: selectedColor,
                  size: selectedSize,
                  quantity: parseInt(quantityRef.current.value),
                })
              }
            >
              Add to cart
            </button>
          </div>
          
          <div className="product-extra-buttons">
            <a href="#">
              <i className="bi bi-share"></i>
              <span> Share this Product</span>
            </a>
          </div>
        </div>
      </form>
      <div className="divider"></div>
      <div className="product-meta">
        <div>
          <span>Stock Count:</span>
          <strong style={{ color: "#e61a0b" }}> {product.stockCount}</strong>
        </div>
        <div>
          <span>Product Code:</span>
          <strong> {product.productCode}</strong>
        </div>
        <div>
          <span>Category:</span>
          <strong> {selectedCategory}</strong>
        </div>
        <div>
          <span>Tags:</span>
          {product.tags.map((tag, index) => (
            <Link to={"/tag/" + tag.seoLink} key={index}>
              {index == 0 ? "" : ","} <strong>{tag.name}</strong>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Info;
