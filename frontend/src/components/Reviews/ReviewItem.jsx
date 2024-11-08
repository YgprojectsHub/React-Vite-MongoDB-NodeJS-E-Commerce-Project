import { useEffect, useState } from "react";
import { user } from "../../http-requests/requests";
import { localDate } from "../../helper/formatLocalDate";

const ReviewItem = ({ review, isPseudo = false }) => {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const getUser = async () => {
      if(!isPseudo){
        const { response } = await user(review.user);
        setUserData(response);
      }
    };

    if(!isPseudo) getUser()
  }, [review.user, isPseudo]);

  return (
    <div>
      {!isPseudo && (
        <li className="comment-item">
          <div className="comment-avatar">
            <img style={{ width: "60px", height: "60px" }} src={userData.avatar} alt="" />
          </div>
          <div className="comment-text">
            <ul className="comment-star">
              {[...Array(review.rating)].map((_, index) => (
                <i className="bi bi-star-fill" key={index}></i>
              ))}
            </ul>
            <div className="comment-meta">
              <span>{userData.username} <strong>({userData.email})</strong></span>
              <span> - </span>
              <time>{localDate(review.createdAt)}</time>
            </div>
            <div className="comment-description">
              <p>{review.text}</p>
            </div>
          </div>
        </li>
      )}

      {isPseudo && (
        <li className="comment-item">
          <div className="comment-avatar">
            <img style={{ width: "60px", height: "60px" }} src={review.avatar} alt="" />
          </div>
          <div className="comment-text">
            <ul className="comment-star">
              {[...Array(review.rating)].map((_, index) => (
                <i className="bi bi-star-fill" key={index}></i>
              ))}
            </ul>
            <div className="comment-meta">
              <span>{userData.username} <strong>({userData.email})</strong></span>
              <span> - </span>
              <time>{localDate(review.createdAt)}</time>
            </div>
            <div className="comment-description">
              <p>{review.text}</p>
            </div>
          </div>
        </li>
      )}
    </div>
  );
};

export default ReviewItem;
