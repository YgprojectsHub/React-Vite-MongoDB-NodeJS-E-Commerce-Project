import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { category, searchProducts } from "../http-requests/requests";
import Products from "../components/Products/Products";

const ProductsByCategoryPage = () => {
  const [productsData, setProductsData] = useState();
  const { seoLink } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const { response } = await category(seoLink);
      const products = await searchProducts(undefined, [{categoryId: response._id}])
      setProductsData(products.response);
    };

    fetchProducts();
  }, [seoLink]);

  return <>
      <Products pData={productsData}></Products>
  </>;
};

export default ProductsByCategoryPage;
