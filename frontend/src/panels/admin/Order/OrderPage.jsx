/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { orders, user } from "../../../http-requests/requests";
import { formatCurrency } from "../../../helper/formatCurrency";
import { localDate } from "../../../helper/formatLocalDate";
import { useNavigate } from "react-router-dom";
import PopupConfirm from "../../../helper/PopupConfirm";

const OrderPage = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [emailData, setEmailData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      const data = await orders();
      setOrdersData(data.response || []);
      setLoading(false);
    };

    getOrders();
  }, []);

  const getUserEmail = async (userId) => {
    if (!emailData[userId]) {
      const { response } = await user(userId);
      setEmailData((prev) => ({ ...prev, [userId]: response.email }));
    }
  };

  useEffect(() => {
    ordersData.forEach((order) => {
      if (!emailData[order.userId]) {
        getUserEmail(order.userId);
      }
    });
  }, [ordersData]);

  const statusFilters = [
    { text: "Beklemede", value: 100 },
    { text: "Kargoya Verildi", value: 101 },
    { text: "Teslim Edildi", value: 102 },
    { text: "İptal Edildi", value: 200 },
    { text: "İade Talebi Edilen", value: 201 },
    { text: "İade Edildi", value: 202 },
  ];

  const getStatusText = (statusCode) => {
    const statusMap = {
      100: "Beklemede",
      101: "Kargoya Verildi",
      102: "Teslim Edildi",
      200: "İptal Edildi",
      201: "İade Talebi Oluşturuldu",
      202: "İade Edildi",
    };

    return statusMap[statusCode];
  };

  const columns = [
    {
      title: "Customer Email",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => (
        <p>{emailData[userId] ? emailData[userId] : "Yükleniyor..."}</p>
      ),
    },
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (orderCode) => <p>{orderCode}</p>,
    },
    {
      title: "Product Quantity",
      dataIndex: "orders",
      key: "orders",
      render: (orders) => <p>{orders.length}</p>,
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => <p>{formatCurrency(totalPrice, "TRY")}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statusFilters,
      onFilter: (value, record) => record.status === value,
      render: (status) => <p>{getStatusText(status)}</p>,
    },
    {
      title: "Created Date",
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
          <PopupConfirm
            title="Siparişi Güncelle"
            description="Siparişi güncellemek istediğinizden emin misiniz?"
            func={() => {
              navigate("/p/admin/order/" + order.seoLink);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={ordersData}
      columns={columns}
      loading={isLoading}
      rowKey={(orderData) => orderData._id}
    />
  );
};

export default OrderPage;
