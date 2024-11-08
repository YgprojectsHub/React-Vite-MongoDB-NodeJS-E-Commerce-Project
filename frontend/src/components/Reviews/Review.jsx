import { useContext } from "react"
import ReviewItem from "./ReviewItem"
import ReviewForm from "./ReviewForm"
import { ReviewContext } from "../../context/ReviewProvider"
import "./Review.css"

const Review = () => {
  const {reviewItems, productItem, pseudoItem} = useContext(ReviewContext)

  const reviewCount = reviewItems && (reviewItems.length + (pseudoItem ? 1 : 0))

  return (
    <div className="tab-panel-reviews">
    <h3><span>{reviewCount}</span> reviews for {productItem.name}</h3>
    <div className="comments">
      <ol className="comment-list">
        {reviewItems.map((review, index) => (
          <ReviewItem review={review} key={index} />
        ))}
        { pseudoItem != null && <ReviewItem review={pseudoItem} isPseudo={true} />}
      </ol>
    </div>

    <ReviewForm productId={productItem._id}/>
  </div>
  )
}

export default Review