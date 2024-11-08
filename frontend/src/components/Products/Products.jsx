import { useEffect, useState } from "react"; 
import PropTypes from "prop-types";
import Slider from "react-slick";
import { Spin } from "antd";
import ProductItem from "./ProductItem";
import { products } from "../../http-requests/requests";
import NotFoundThing from "../../helper/NotFoundThing";
import "./Products.css";

function NextBtn({ onClick }) {
  return (
    <button className="glide__arrow glide__arrow--right" onClick={onClick}>
      <i className="bi bi-chevron-right"></i>
    </button>
  );
}

NextBtn.propTypes = {
  onClick: PropTypes.func,
};

function PrevBtn({ onClick }) {
  return (
    <button className="glide__arrow glide__arrow--left" onClick={onClick}>
      <i className="bi bi-chevron-left"></i>
    </button>
  );
}

PrevBtn.propTypes = {
  onClick: PropTypes.func,
};

const Products = ({ pData }) => {
  const [productsData, setProductsData] = useState(pData || []);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const data = await products();
      setProductsData(data.response);
      setLoading(false);
    };

    if (!pData || !Array.isArray(pData)) {
      getProducts();
    } else {
      setProductsData(pData);
      setLoading(false);
    }
  }, [pData]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
    autoplaySpeed: 3000,
    autoplay: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="products">
      <div className="container">
        <div className="section-title" style={{ marginTop: "10px" }}>
          {!Array.isArray(pData) && (
            <>
              <h2>Featured Products</h2>
              <p>Summer Collection New Modern Design</p>
            </>
          )}

          {Array.isArray(pData) && (
            <>
              <p>Found Products ({pData.length})</p>
            </>
          )}
        </div>
        <Spin spinning={isLoading}>
          <div className="product-wrapper product-carousel">
            {Array.isArray(pData) ? (
              <div className="product-list">
                {productsData.length > 0 ? (
                  productsData.map((product) => (
                    <ProductItem productItem={product} key={product._id} />
                  ))
                ) : (
                  <NotFoundThing content={"Herhangi bir ürün bulunamadı."} />
                )}
              </div>
            ) : (
              <Slider {...sliderSettings}>
                {productsData.length > 0 ? (
                  productsData.map((product) => (
                    <ProductItem productItem={product} key={product._id} />
                  ))
                ) : (
                  <NotFoundThing content={"Herhangi bir ürün bulunamadı."} />
                )}
              </Slider>
            )}
          </div>
        </Spin>
      </div>
    </section>
  );
};

export default Products;
