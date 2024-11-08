import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";
import { categories } from "../../http-requests/requests";
import { Spin } from "antd";
import NotFoundThing from "../../helper/NotFoundThing";
import "./Categories.css";

const Categories = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      const data = await categories();
      setCategoriesData(data.response);
      setLoading(false);
    };
    getCategories();
  }, []);

  return (
    <section className="categories">
      <div className="container">
        <div className="section-title">
          <h2>All Categories</h2>
          <p>Summer Collection New Morden Design</p>
        </div>
        <Spin spinning={isLoading}>
          <ul className="category-list">
            {categoriesData && categoriesData.length > 0 &&
              categoriesData.map((category, id) => (
                <CategoryItem key={id} category={category} />
              ))
            }
            {categoriesData.length == 0 && 
              <NotFoundThing content={"Herhangi bir kategori bulunamadı."}></NotFoundThing>
            }
          </ul>
        </Spin>
      </div>
    </section>
  );
};

export default Categories;
