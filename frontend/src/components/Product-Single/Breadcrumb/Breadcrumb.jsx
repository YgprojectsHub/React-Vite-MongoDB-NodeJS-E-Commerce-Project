import { useEffect, useState } from "react";
import "./Breadcrumb.css";

const findBreadcrumbs = (data, selectedKey) => {
  let breadcrumbs = [];

  function traverse(children, path = []) {
    for (const child of children) {
      const newPath = [...path, child.title];

      if (child.key === selectedKey) {
        breadcrumbs = newPath;
        return true;
      }

      if (child.children && child.children.length > 0) {
        if (traverse(child.children, newPath)) {
          return true;
        }
      }
    }
    return false;
  }

  traverse(data.children);
  return breadcrumbs;
};

const Breadcrumb = ({ category }) => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    setCategoryData(findBreadcrumbs(category, category.selectedKey));
  }, [category]);

  return (
    <div className="single-topbar">
      <nav className="breadcrumb">
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          {categoryData.map((breadcrumb, index) => (
            <li key={index}><a href="#">{breadcrumb}</a></li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Breadcrumb;
