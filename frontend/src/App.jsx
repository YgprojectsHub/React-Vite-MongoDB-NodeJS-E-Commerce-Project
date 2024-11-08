import React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import BlogPage from './pages/BlogPage';
import SingleBlogPage from './pages/SingleBlogPage';
import SingleProductPage from './pages/SingleProductPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

// Admin Panel Pages
import UserPage from './panels/admin/User/UserPage';
import CategoryPage from './panels/admin/Category/CategoryPage';
import CategoryUpdate from './panels/admin/Category/CategoryUpdate';
import CategoryCreate from './panels/admin/Category/CategoryCreate';
import ProductPage from './panels/admin/Product/ProductPage';
import ProductCreate from './panels/admin/Product/ProductCreate';
import ProductUpdate from './panels/admin/Product/ProductUpdate';
import CouponPage from './panels/admin/Coupon/CouponPage';
import CouponCreate from './panels/admin/Coupon/CouponCreate';
import CouponUpdate from './panels/admin/Coupon/CouponUpdate';
import OrderPage from './panels/admin/Order/OrderPage';
import DashboardPage from './panels/admin/Dashboard/DashboardPage';

// User Panel Pages
import Home from './panels/user/Home/HomePage';
import Orders from './panels/user/Order/Order';
import Profile from './panels/user/Profile/Profile';
import PasswordUpdate from './panels/user/Password-Update/Password-Update';
import EmailVerification from './panels/user/Email-Verification/Email-Verification';
import Coupons from './panels/user/Coupons/Coupons';
import Settings from './panels/user/Settings/Settings';
import OrderDetail from './panels/admin/Order/OrderDetail';
import OrderDetailUser from './panels/user/Order/OrderDetail';
import TagPage from './panels/admin/Tag/TagPage';
import TagCreate from './panels/admin/Tag/TagCreate';
import TagUpdate from './panels/admin/Tag/TagUpdate';
import ProductsByCategoryPage from './pages/ProductsByCategory';

// Guard
import Guard from './guard/Guard';

function App() {
  return (
    <div>

    <Guard/>

    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/blog/:seoLink" element={<SingleBlogPage />} />
      <Route path="/category/:seoLink" element={<ProductsByCategoryPage />} />
      <Route path="/product/:seoLink" element={<SingleProductPage />} />

      <Route path="/p/admin">
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="category/:seoLink" element={<CategoryUpdate />} />
        <Route path="category/create" element={<CategoryCreate />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="product/create" element={<ProductCreate />} />
        <Route path="product/:seoLink" element={<ProductUpdate />} />
        <Route path="coupons" element={<CouponPage />} />
        <Route path="coupon/create" element={<CouponCreate />} />
        <Route path="coupon/:seoLink" element={<CouponUpdate />} />
        <Route path="tags" element={<TagPage />} />
        <Route path="tag/create" element={<TagCreate />} />
        <Route path="tag/:seoLink" element={<TagUpdate />} />
        <Route path="order/:seoLink" element={<OrderDetail />} />
      </Route>

      <Route path="/p/account">
        <Route index element={<Home />} />
        <Route path="my-orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="password-update" element={<PasswordUpdate />} />
        <Route path="email-verification" element={<EmailVerification />} />
        <Route path="my-coupons" element={<Coupons />} />
        <Route path="settings" element={<Settings />} />
        <Route path="order/:seoLink" element={<OrderDetailUser />} />
      </Route>


      {/* Payment Routes */}
      <Route path="/payment">
        <Route path="success/:userId/:token/:exp" element={<SuccessPage />} />
        <Route path="cancel/:userId/:token/:exp" element={<CancelPage />} />
      </Route>

      {/* Catch-All Route (404 Redirect to Home) */}
      <Route path="*" element={<HomePage />} />
    </Routes>      
    </div>

  );
}

export default App;
