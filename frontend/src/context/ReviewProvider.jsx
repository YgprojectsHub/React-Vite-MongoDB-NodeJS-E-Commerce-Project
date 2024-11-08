import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { userData } from "../helper/auth";
import { getFormattedCurrentTime } from "../helper/formatLocalDate";

export const ReviewContext = createContext();

const ReviewProvider = ({ children }) => {
  const [productItem, setProductItem] = useState();
  const [reviewItems, setReviewItem] = useState(undefined);
  const [pseudoItem, setPseudoItem] = useState(null);
  const [canComment, setCanComment] = useState([true, true]);

  useEffect(() => {
    setReviewItem(productItem && productItem.reviews ? productItem.reviews : [])
  }, [productItem])

  const addReview = (values) => {
    const user = userData()
    const newData = {
      avatar: user.avatar,
      rating: values.rating,
      username: user.username,
      email: user.email,
      text: values.text,
      createdAt: getFormattedCurrentTime()
    }
    setPseudoItem(newData)
  }

  return (
    <ReviewContext.Provider
      value={{
        productItem,
        setProductItem,
        reviewItems,
        addReview,
        pseudoItem,
        setCanComment,
        canComment
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewProvider;

ReviewProvider.propTypes = {
  children: PropTypes.node,
};
