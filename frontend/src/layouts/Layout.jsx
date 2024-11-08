import { useLocation } from "react-router-dom";
import { isLogined } from "../helper/auth";
import { whichLayout } from "../helper/whichLayout";
import AccountLayout from "./AccountLayout";
import AdminLayout from "./AdminLayout";
import MainLayout from "./MainLayout";
import React from "react";

const layouts = [MainLayout, AccountLayout, AdminLayout];

export const Layout = ({ children }) => {
  const location = useLocation();
  const layout =
    !isLogined() || location.pathname === "/"
      ? MainLayout
      : layouts[whichLayout()];

  return React.createElement(layout, null, children);
};
