/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { Select, TreeSelect, InputNumber } from "antd";
import { searchFormSchemas } from "../../../yupSchemas/SearchForm";
import { categories, searchProducts, tags } from "../../../http-requests/requests";
import { formatCurrency } from "../../../helper/formatCurrency";
import { useNavigate } from "react-router-dom";
import { transformCategories } from "../../../helper/transformCategories";
import { findRootCategoryId } from "../../../helper/findRootCategoryId";
import "./Search.css";

const { Option } = Select;

const Search = ({ isSearchShow, setSearchShow }) => {
  const [isShowResult, setShowResult] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoriesData, setCategories] = useState([]);
  const [tagsData, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({ categoryId: null, selectedKeys: [] });
  const [selectedTags, setSelectedTags] = useState([]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { response } = await categories();
      const editedDatas = response.flatMap((category) => { return transformCategories(category.children)})
      setCategories([editedDatas, response]);
    };

    const fetchTags = async () => {
      const { response } = await tags();
      setTags(response);
    };

    fetchCategories();
    fetchTags();
  }, []);

  const getProducts = async (search) => {
    const { response } = await searchProducts(search, selectedCategories, selectedTags, {minPrice, maxPrice});
    setProducts(response);
    setShowResult(true);
  };

  const handleCategoryChange = (values) => {
    const categoryMap = {};
  
    values.forEach((key) => {
      const rootCategoryId = findRootCategoryId(categoriesData[1], key);
      
      if (rootCategoryId) {
        if (categoryMap[rootCategoryId]) {
          categoryMap[rootCategoryId].push(key);
        } else {
          categoryMap[rootCategoryId] = [key];
        }
      }
    });
  
    const selectedCategoriesData = Object.keys(categoryMap).map((categoryId) => ({
      categoryId,
      selectedKeys: categoryMap[categoryId],
    }));
  
    setSelectedCategories(selectedCategoriesData);
  };
  

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { search: "" },
    validationSchema: searchFormSchemas,
    onSubmit: getProducts,
    validateOnMount: true,
  });

  useEffect(() => {
    const clearAllData = () => {
      setShowResult(false);
      setProducts([]);
      setSearchShow(false);
      setCategories([])
      setTags([])
      setSelectedCategories({ categoryId: null, selectedKeys: [] })
      setShowResult(false);
      setMinPrice(null)
      setMaxPrice(null)
    }

    if (!isSearchShow) {
      clearAllData()
    }
  }, [isSearchShow]);
  
  const navigateProduct = (link) => {
    navigate(link)
  };

  return (
    <div className={`modal-search ${isSearchShow ? "show" : ""}`}>
      <div className="modal-wrapper">
        <h3 className="modal-title">Search for Products</h3>
        <p className="modal-text">Start typing to see products you are looking for.</p>
        <form className="search-form" onSubmit={handleSubmit}>
          <TreeSelect
            treeData={categoriesData[0]}
            value={selectedCategories.selectedKeys}
            onChange={handleCategoryChange}
            treeCheckable={true}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            placeholder="Select Categories"
            style={{ width: "100%" }}
          />
          <Select
            placeholder="Etiketleri seçiniz"
            mode="multiple"
            onChange={setSelectedTags}
            style={{ width: "100%"}}
          >
            {tagsData && tagsData.map((tag) => (
              <Option key={tag._id} value={tag._id}>
                {tag.name}
              </Option>
            ))}
          </Select>
          <div className="price-range">
            <InputNumber
              placeholder="Min Price"
              value={minPrice}
              onChange={setMinPrice}
              style={{ width: "46.5%", marginRight: "3px" }}
              min={0}
            />
            <InputNumber
              placeholder="Max Price"
              value={maxPrice}
              onChange={setMaxPrice}
              style={{ width: "46.5%" }}
              min={0}
            />
          </div>
          <input
            type="text"
            name="search"
            placeholder="Search a product"
            value={values.search}
            onChange={handleChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="bi bi-search"></i>
          </button>
        </form>

        {isShowResult && (
          <div className="search-results">
            <div className="search-heading">
              <h3>RESULTS FROM PRODUCT</h3>
            </div>
            <div className="results">
              {products.length > 0 ? (
                products.map((product) => (
                  <a
                    onClick={() => navigateProduct("/product/" + product.seoLink)}
                    className="result-item"
                    key={product._id}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={product.imgs[0]} className="search-thumb" alt={product.name} />
                    <div className="search-info">
                      <h4>{product.name}</h4>
                      <span className="search-sku">Product Code: {product.productCode}</span>
                      <span className="search-price">
                        {formatCurrency(product.price.newPrice, product.price.currency)}
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <h4 style={{ width: "100%", textAlign: "center", margin: "10px 0" }}>
                  Ürünler bulunamadı
                </h4>
              )}
            </div>
          </div>
        )}
        <i
          onClick={() => setSearchShow(false)}
          className="bi bi-x-circle"
          id="close-search"
        ></i>
      </div>

      <div className="modal-overlay" onClick={() => setSearchShow(false)}></div>
    </div>
  );
};

Search.propTypes = {
  isSearchShow: PropTypes.bool.isRequired,
  setSearchShow: PropTypes.func.isRequired,
};

export default Search;
