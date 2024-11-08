import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import CartProvider from "./context/CartProvider.jsx";
import ReviewProvider from "./context/ReviewProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "./layouts/Layout.jsx";

import { Elements } from "@stripe/react-stripe-js";

import stripePromise from "./helper/stripePromise.jsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/index.css";
import "./css/App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <ReviewProvider>
        <CartProvider>
          <Layout>
            <App />
          </Layout>
        </CartProvider>
      </ReviewProvider>
    </BrowserRouter>
  </Elements>
);
