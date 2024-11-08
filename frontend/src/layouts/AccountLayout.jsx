import { Layout, Menu } from "antd";
import {
  UserOutlined,
  RollbackOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  MailOutlined,
  KeyOutlined,
  TagOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { isAdmin, isLogined, logout } from "../helper/auth";
import { useEffect } from "react";

const { Sider, Header, Content } = Layout;

const AccountLayout = ({ children }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Ana Sayfa",
      path: "/p/account/",
      onClick: () => {
        navigate(`/p/account`);
      },
    },
    {
      key: "2",
      icon: <ShoppingCartOutlined />,
      label: "Siparişlerim",
      path: "/p/account/my-orders",
      onClick: () => {
        navigate(`/p/account/my-orders`);
      },
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Profilim",
      path: "/p/account/profile",
      onClick: () => {
        navigate(`/p/account/profile`);
      },
    },
    {
      key: "4",
      icon: <KeyOutlined />,
      label: "Şifre Güncelleme",
      path: "/p/account/password-update",
      onClick: () => {
        navigate(`/p/account/password-update`);
      },
    },
    {
      key: "5",
      icon: <MailOutlined />,
      label: "E-mail Doğrulama",
      path: "/p/account/email-verification",
      onClick: () => {
        navigate(`/p/account/email-verification`);
      },
    },
    {
      key: "6",
      icon: <TagOutlined />,
      label: "Kuponlarım",
      path: "/p/account/my-coupons",
      onClick: () => {
        navigate(`/p/account/my-coupons`);
      },
    },
    {
      key: "9",
      icon: <SettingOutlined />,
      label: "Ayarlar",
      path: "/p/account/settings",
      onClick: () => {
        navigate(`/p/account/settings`);
      },
    },
    {
      key: "7",
      icon: <RollbackOutlined />,
      label: "Ana Sayfaya Git",
      onClick: () => {
        navigate(`/`);
      },
    },
    {
      key: "8",
      icon: <ArrowLeftOutlined />,
      label: "Çıkış Yap",
      onClick: () => {
        logout();
      },
    },
  ];

  const getActiveKey = () => {
    const flatItems = menuItems.flatMap((item) => item.children || item);
    const activeItem = flatItems.find(
      (item) =>
        item.onClick &&
        item.onClick.toString().includes(window.location.pathname)
    );
    return activeItem ? activeItem.key : "";
  };

  const getPageTitle = () => {
    const flatItems = menuItems.flatMap((item) => item.children || item);
    const activeItem = flatItems.find(
      (item) =>
        item.onClick &&
        item.onClick.toString().includes(window.location.pathname)
    );
    return activeItem ? activeItem.label : "";
  };

  useEffect(()=> {
    if(!isLogined() || isAdmin()){
      return undefined
    }
  })

  return (
    <div style={{ display: "" }} className="user-layout">
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={200} theme="dark">
          <Menu
            mode="vertical"
            style={{
              height: "100%",
            }}
            items={menuItems}
            defaultSelectedKeys={[getActiveKey()]}
          />
        </Sider>
        <Layout>
          <Header>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "white",
                borderEndStartRadius: "13px",
                borderEndEndRadius: "13px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"
              }}
            >
            <h2>Admin Paneli</h2>
            <h3>{getPageTitle()}</h3>
            </div>
          </Header>
          <Content>
            <div
              className="site-layout-background"
              style={{
                padding: "24px 50px",
                minHeight: 360,
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AccountLayout;
