/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Gallery from "./Gallery/Gallery";
import Info from "./Info/Info";
import Tabs from "./Tabs/Tabs";
import { product } from "../../http-requests/requests";
import "./ProductSingle.css";
import { Spin } from "antd";
import { ReviewContext } from "../../context/ReviewProvider";

const ProductSingle = () => {
  const { seoLink } = useParams();
  const [productData, setProductData] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const { setProductItem } = useContext(ReviewContext);

  useEffect(() => {
    const getProduct = async () => {
      const {response} = await product(seoLink);
      setProductData(response);
      setProductItem(response);
      setLoading(false);
    };

    getProduct();
  }, [seoLink]);

  return (
    <Spin spinning={loading}>
      <section className="single-product">
        <div className="container">
          {productData && (
            <div className="single-product-wrapper">
              <Breadcrumb category={productData.category} />

              <div className="single-content">
                <main className="site-main">
                  <Gallery imgs={productData.imgs} />
                  <Info product={productData} />
                </main>
              </div>

              <Tabs />
            </div>
          )}
          {!productData && (
            <h3
              style={{
                width: "500px",
                margin: "0 auto",
                textAlign: "center",
                color: "#ccc",
              }}
            >
              Herhangi bir ürün bulunamadı.
            </h3>
          )}
        </div>
      </section>
    </Spin>
  );
};

export default ProductSingle;
