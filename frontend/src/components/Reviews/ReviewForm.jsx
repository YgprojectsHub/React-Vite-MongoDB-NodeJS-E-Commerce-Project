/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { reviewSchema } from "../../yupSchemas/ReviewForm";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { reviewCanStateControl, reviewCreate } from "../../http-requests/requests";
import { userData, isLogined, isAdmin } from "../../helper/auth";
import { useNavigate } from "react-router-dom";
import { ReviewContext } from "../../context/ReviewProvider";

const ReviewForm = ({productId}) => {
  const [starCount, setStarCount] = useState(0)
  const {reviewItems, addReview, setCanComment, canComment, pseudoItem} = useContext(ReviewContext)

  const navigate = useNavigate();

  useEffect(() => {
    const initilazeFunc = async() => {
      const user = userData()
      const admin = isAdmin()
      const res = user && reviewItems.find((item) => item.user == user._id)
  
      const {response} = await reviewCanStateControl(productId)
  
      if(res || pseudoItem != null){
        setCanComment([false, canComment[1]])
      }

      if(response.code == 404){
        setCanComment([canComment[0], false])
      }
      
      admin && setCanComment([true, true])
    }

    initilazeFunc()
  }, [reviewItems, setCanComment, pseudoItem])

  const onSubmit = async(values) => {
    const userId = userData()._id
    const res = await reviewCreate(productId, {user: userId, ...values})

    if(res) {
      addReview(values)
      setCanComment([false, false])
    }
  }

  const formikSetting = {
    initialValues: { text: "", rating: starCount },
    validationSchema: reviewSchema,
    onSubmit: (values) => {onSubmit(values)},
  }

  return (
    <div className="review-form-wrapper">
      {isLogined() && canComment && canComment[0] && canComment[1] && <div>
      <h2>Add a review</h2>
      <Formik {...formikSetting}>
        {({ setFieldValue }) => (
          <Form className="comment-form">
            {!isAdmin() && <div className="comment-form-rating">
              <label>
                Your rating
                <span className="required">*</span>
              </label>
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <a key={index} className={`star ${starCount === index + 1 ? "active" : ""}`} onClick={() => { setStarCount(index + 1); setFieldValue("rating", index + 1);}}>
                    {[...Array(index + 1)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  </a>
                ))}
              </div>
              <ErrorMessage name="rating" component="div" className="error" />
            </div>}
            <div className="comment-form-comment form-comment">
              <label htmlFor="comment">
                Your review
                <span className="required">*</span>
              </label>
              <Field as="textarea" id="text" name="text" rows="10" />
              <ErrorMessage name="text" component="div" className="error" />
            </div>
            <div className="form-submit">
              <button type="submit" className="btn submit">
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>        
      </div>}
      {isLogined() && !isAdmin() && !canComment[0] && <h2>Bu ürüne zaten yorum yaptınız.</h2>}
      {isLogined() && !isAdmin() && !canComment[1] && canComment[0] && <h2>Bu ürüne yorum yapmak için ürünü sipariş ediniz.</h2>}
      {!isLogined() && <h2>Yorum yapmak için <a onClick={() => {navigate("/auth")}}>giriş</a> yapınız.</h2>}
    </div>
  );
}

export default ReviewForm