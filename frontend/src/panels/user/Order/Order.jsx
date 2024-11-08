import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { ordersByUser } from "../../../http-requests/requests";
import { userData } from "../../../helper/auth";
import { localDate } from "../../../helper/formatLocalDate";
import { formatCurrency } from "../../../helper/formatCurrency";
import { useNavigate } from "react-router-dom";
import PopupConfirm from "../../../helper/PopupConfirm";

const Orders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = userData();

    const getOrdersByUser = async () => {
      if (currentUser && currentUser._id) {
        const { response } = await ordersByUser(currentUser._id);
        setRecentOrders(response || []);
      }
      setLoading(false);
    };

    getOrdersByUser();
  }, []);

  const getStatus = (statusCode) => {
    const statusDatas = [
      { code: 100, text: "Beklemede" },
      { code: 101, text: "Kargoya Verildi" },
      { code: 102, text: "Teslim Edildi" },
      { code: 200, text: "İptal Edildi" },
      { code: 201, text: "İade Talebi Oluşturuldu" },
      { code: 202, text: "İade Edildi" },
    ];

    const status = statusDatas.find((statusData) => statusData.code == statusCode)

    return status.text
  }

  const columns = [
    { title: "Order Code", dataIndex: "orderCode", key: "orderCode" },
    { title: "Total price", dataIndex: "totalPrice", key: "totalPrice", render: (totalPrice) => (
      <p>{formatCurrency(totalPrice, "TRY")}</p>
    ) },
    { title: "Status", dataIndex: "status", key: "status", render: (status) => (
      <p>{getStatus(status)}</p>
    )},
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => <h5>{localDate(createdAt)}</h5>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, order) => (
        <Space>
          <PopupConfirm title="Siparişi Görüntüle" description="Siparişi görüntülemek istediğinizden emin misiniz?" func={() => {navigate("/p/account/order/" + order.seoLink)}}/>
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={recentOrders}
      rowKey={(order) => order._id}
    />
  );
};

export default Orders;
