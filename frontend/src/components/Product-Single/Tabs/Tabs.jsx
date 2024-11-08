import { useContext, useEffect, useState } from "react";
import Review from "../../Reviews/Review";
import "./Tabs.css";
import { ReviewContext } from "../../../context/ReviewProvider";

const Tabs = () => {
  const [activeTab, setActive] = useState(1);
  const { productItem } = useContext(ReviewContext);

  return (
    <div id="reviews" className="single-tabs">
      <ul className="tab-list">
        <li>
          <a
            className={`tab-button ${activeTab == 1 ? "active" : null}`}
            onClick={() => setActive(1)}
          >
            Description
          </a>
        </li>
        <li>
          <a
            className={`tab-button ${activeTab == 2 ? "active" : null}`}
            onClick={() => setActive(2)}
          >
            Additional information
          </a>
        </li>
        <li>
          <a
            className={`tab-button ${activeTab == 3 ? "active" : null}`}
            onClick={() => setActive(3)}
          >
            Reviews
          </a>
        </li>
      </ul>
      <div className="tab-panel">
        <div
          hidden={activeTab != 1}
          className="tab-panel-descriptions content active"
          id="desc"
        >
          <div dangerouslySetInnerHTML={{ __html: productItem.description }} />
        </div>
        <div
          hidden={activeTab != 2}
          className="tab-panel-information content"
          id="info"
        >
          <h3>Additional information</h3>
          <table>
            <tbody>
              {productItem?.additionalDetails.map((aD, index) => (
                <tr key={index}>
                  <th>{aD.key.charAt(0).toUpperCase() + aD.key.slice(1)}</th>
                  <td>
                    <p>{aD.value}</p>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {activeTab == 3 && <Review />}
      </div>
    </div>
  );
};

export default Tabs;
