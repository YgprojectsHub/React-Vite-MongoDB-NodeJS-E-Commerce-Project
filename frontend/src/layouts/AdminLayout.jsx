import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  RollbackOutlined,
  BarcodeOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { isAdmin, isLogined, logout } from "../helper/auth";
import { useEffect } from "react";

const { Sider, Header, Content } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate(`/p/admin/`),
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: "Kategoriler",
      children: [
        {
          key: "3",
          label: "Kategori Listesi",
          onClick: () => navigate(`/p/admin/categories`),
        },
        {
          key: "4",
          label: "Yeni Kategori Oluştur",
          onClick: () => navigate("/p/admin/category/create"),
        },
      ],
    },
    {
      key: "5",
      icon: <LaptopOutlined />,
      label: "Ürünler",
      children: [
        {
          key: "6",
          label: "Ürün Listesi",
          onClick: () => navigate(`/p/admin/products`),
        },
        {
          key: "7",
          label: "Yeni Ürün Oluştur",
          onClick: () => navigate("/p/admin/product/create"),
        },
      ],
    },
    {
      key: "8",
      icon: <BarcodeOutlined />,
      label: "Kuponlar",
      children: [
        {
          key: "9",
          label: "Kupon Listesi",
          onClick: () => navigate(`/p/admin/coupons`),
        },
        {
          key: "10",
          label: "Yeni Kupon Oluştur",
          onClick: () => navigate("/p/admin/coupon/create"),
        },
      ],
    },
    {
      key: "11",
      icon: <TagsOutlined />,
      label: "Etiketler",
      children: [
        {
          key: "12",
          label: "Etiket Listesi",
          onClick: () => navigate(`/p/admin/tags`),
        },
        {
          key: "13",
          label: "Yeni Etiket Oluştur",
          onClick: () => navigate("/p/admin/tag/create"),
        },
      ],
    },
    {
      key: "14",
      icon: <UserOutlined />,
      label: "Kullanıcı Listesi",
      onClick: () => navigate(`/p/admin/users`),
    },
    {
      key: "15",
      icon: <ShoppingCartOutlined />,
      label: "Siparişler",
      onClick: () => navigate(`/p/admin/orders`),
    },
    {
      key: "16",
      icon: <RollbackOutlined />,
      label: "Ana Sayfaya Git",
      onClick: () => navigate(`/`),
    },
    {
      key: "17",
      icon: <ArrowLeftOutlined />,
      label: "Çıkış Yap",
      onClick: () => {
        logout();
        navigate("/auth");
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
    <div className="admin-layout">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={200} theme="dark">
          <Menu
            mode="vertical"
            style={{ height: "100%" }}
            items={menuItems}
            defaultSelectedKeys={[getActiveKey()]}
          />
        </Sider>
        <Layout>
          <Header
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
          </Header>
          <Content style={{ padding: "24px 50px", minHeight: 360 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminLayout;
