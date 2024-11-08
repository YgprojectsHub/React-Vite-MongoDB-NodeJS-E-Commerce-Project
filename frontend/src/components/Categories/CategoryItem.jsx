import './CategoryItem.css'
import { Link } from "react-router-dom"

const CategoryItem = ({ category }) => {

  return (
    <li className="category-item">
        <Link to={"/category/"+category.seoLink}>
          <img style={{height: 170}} src={category.imgUrl} alt="" className="category-image"/>
          <span className="category-title">{category.name}</span>
        </Link>
    </li>
  )
}

export default CategoryItem