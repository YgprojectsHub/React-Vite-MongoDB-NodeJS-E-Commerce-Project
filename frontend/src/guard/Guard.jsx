import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAdmin, isLogined } from '../helper/auth';
import { isStartsWith } from '../helper/isStartsWith';

const Guard = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const adminPath = "/p/admin"
  const accountPath = "/p/account"

  useEffect(() => {
    if (pathname === "/auth" && isLogined()) {
      navigate("/");
    }
    else if (pathname === "/cart" && !isLogined()) {
      navigate("/auth");
    }
    else if (isStartsWith(adminPath) && !isLogined()) {
      navigate("/auth");
    } 
    else if (isStartsWith(adminPath) && !isAdmin()) {
      navigate("/p/account");
    }
    else if (isStartsWith(accountPath) && !isLogined()) {
      navigate("/auth");
    } 
    else if (isStartsWith(accountPath) && isAdmin()) {
      navigate("/p/admin");
    }
    
    if (!isStartsWith("/payment/success") && localStorage.getItem("paymentDatas")) {
      localStorage.removeItem("paymentDatas")
    }
  }, [pathname, navigate]);

  return null
};

export default Guard;
