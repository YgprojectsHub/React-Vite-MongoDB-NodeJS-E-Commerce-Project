import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../context/CartProvider";
import { Link, useLocation } from "react-router-dom";
import { isLogined, logout, isAdmin, userData } from "../../../helper/auth";
import { Avatar } from "antd";
import "./Header.css";

const Header = ({ setSearchShow }) => {
  const { cartItems } = useContext(CartContext);
  const [whichActive, setActive] = useState(1);
  const { pathname } = useLocation();

  const user = userData()

  useEffect(() => {
    if (pathname == "/") setActive(1);
    else if (pathname == "/shop") setActive(2);
    else if (pathname == "/blog") setActive(3);
    else if (pathname == "/contact") setActive(4);
  }, [pathname]);

  const redirect = () => {
    if (isLogined()) {
      if (isAdmin()) {
        window.location.href = "/p/admin";
      } else {
        window.location.href = "/p/account";
      }
    } else {
      window.location.href = "/auth";
    }
  };

  return (
    <div>
      <header>
        <div className="global-notification">
          <div className="container">
            <p>
              SUMMER SALE FOR ALL SWIM SUITS AND FREE EXPRESS INTERNATIONAL
              DELIVERY - OFF 50%!
              <Link to={"/shop"}> SHOP NOW</Link>
            </p>
          </div>
        </div>
        <div className="header-row">
          <div className="container">
            <div className="header-wrapper">
              <div className="header-mobile">
                <i className="bi bi-list" id="btn-menu"></i>
              </div>
              <div className="header-left">
                <Link to={"/"} className="logo">
                  LOGO
                </Link>
              </div>
              <div className="header-center" id="sidebar">
                <nav className="navigation">
                  <ul className="menu-list">
                    <li className="menu-list-item">
                      <Link
                        to={"/"}
                        className={`menu-link ${whichActive == 1 && "active"}`}
                      >
                        Home
                        <i className="bi bi-chevron-down"></i>
                      </Link>
                      <div className="menu-dropdown-wrapper">
                        <ul className="menu-dropdown-content">
                          <li>
                            <a href="#">Home Clean</a>
                          </li>
                          <li>
                            <a href="#">Home Collection</a>
                          </li>
                          <li>
                            <a href="#">Home Minimal</a>
                          </li>
                          <li>
                            <a href="#">Home Modern</a>
                          </li>
                          <li>
                            <a href="#">Home Parallax</a>
                          </li>
                          <li>
                            <a href="#">Home Strong</a>
                          </li>
                          <li>
                            <a href="#">Home Style</a>
                          </li>
                          <li>
                            <a href="#">Home Unique</a>
                          </li>
                          <li>
                            <a href="#">Home RTL</a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="menu-list-item megamenu-wrapper">
                      <Link
                        to={"/shop"}
                        className={`menu-link ${whichActive == 2 && "active"}`}
                      >
                        Shop
                        <i className="bi bi-chevron-down"></i>
                      </Link>
                      <div className="menu-dropdown-wrapper">
                        <div className="menu-dropdown-megamenu">
                          <div className="megamenu-links">
                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Shop Style
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="#">Shop Standard</a>
                                </li>
                                <li>
                                  <a href="#">Shop Full</a>
                                </li>
                                <li>
                                  <a href="#">Shop Only Categories</a>
                                </li>
                                <li>
                                  <a href="#">Shop Image Categories</a>
                                </li>
                                <li>
                                  <a href="#">Shop Sub Categories</a>
                                </li>
                                <li>
                                  <a href="#">Shop List</a>
                                </li>
                                <li>
                                  <a href="#">Hover Style 1</a>
                                </li>
                                <li>
                                  <a href="#">Hover Style 2</a>
                                </li>
                                <li>
                                  <a href="#">Hover Style 3</a>
                                </li>
                              </ul>
                            </div>
                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Filter Layout
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="#">Sidebar</a>
                                </li>
                                <li>
                                  <a href="#">Filter Side Out</a>
                                </li>
                                <li>
                                  <a href="#">Filter Dropdown</a>
                                </li>
                                <li>
                                  <a href="#">Filter Drawer</a>
                                </li>
                              </ul>
                            </div>
                            <div className="megamenu-products">
                              <h3 className="megamenu-products-title">
                                Shop Loader
                              </h3>
                              <ul className="megamenu-menu-list">
                                <li>
                                  <a href="#">Shop Pagination</a>
                                </li>
                                <li>
                                  <a href="#">Shop Infinity</a>
                                </li>
                                <li>
                                  <a href="#">Shop Load More</a>
                                </li>
                                <li>
                                  <a href="#">Cart Modal</a>
                                </li>
                                <li>
                                  <a href="#">Cart Drawer</a>
                                </li>
                                <li>
                                  <a href="#">Cart Page</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="megamenu-single">
                            <a href="#">
                              <img src="/img/mega-menu.jpg" alt="" />
                            </a>
                            <h3 className="megamenu-single-title">
                              JOIN THE LAYERING GANG
                            </h3>
                            <h4 className="megamenu-single-subtitle">
                              Suspendisse faucibus nunc et pellentesque
                            </h4>
                            <a
                              href="#"
                              className="megamenu-single-button btn btn-sm"
                            >
                              Shop Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="menu-list-item">
                      <Link
                        to={"/blog"}
                        className={`menu-link ${whichActive == 3 && "active"}`}
                      >
                        Blog
                      </Link>
                    </li>
                    <li className="menu-list-item">
                      <Link
                        to={"/contact"}
                        className={`menu-link ${whichActive == 4 && "active"}`}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </nav>
                <i className="bi-x-circle" id="close-sidebar"></i>
              </div>
              <div className="header-right">
                <div className="header-right-links">
                  <Link to="#" onClick={redirect} className="header-account">
                    {!isLogined() && <i className="bi bi-person"></i>}
                    {isLogined() && (
                      <Avatar
                        src={user.avatar}
                        size={35}
                        alt={`${user.username}'s profile`}
                        style={{ border: "2px solid #000" }}
                      />
                    )}
                  </Link>
                  <button
                    onClick={() => setSearchShow(true)}
                    className="search-button"
                  >
                    <i className="bi bi-search"></i>
                  </button>
                  {!isAdmin() && (
                    <div className="header-cart">
                      <Link to={"/cart"} className="header-cart-link">
                        <i className="bi bi-bag"></i>
                        <span className="header-cart-count">
                          {cartItems.length}
                        </span>
                      </Link>
                    </div>
                  )}
                  {isLogined() && (
                    <button onClick={() => logout()}>
                      <i
                        className="bi bi-box-arrow-right"
                        style={{ background: "#fff" }}
                      ></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;

Header.propTypes = {
  setSearchShow: PropTypes.func,
};
