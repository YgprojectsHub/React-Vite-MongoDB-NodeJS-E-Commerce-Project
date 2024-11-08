import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localDate } from "../../../helper/formatLocalDate";
import { couponDelete, coupons } from "../../../http-requests/requests";
import PopupConfirm from "../../../helper/PopupConfirm";
import { Space, Table } from "antd";

const CouponPage = () => {
  const [couponsData, setCouponsData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getCoupons = async () => {
      const data = await coupons()
      setCouponsData(data.response);
      setLoading(false)
    };
    getCoupons();
  }, []);

  const deleteItem = (id) => {
    const res = couponDelete(id)
    if(res){
      const newCoupons = couponsData.filter(coupon => coupon._id !== id)
      setCouponsData(newCoupons)
    }
  }

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "Discount Percent",
      dataIndex: "discountPercent",
      key: "discountPercent",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <h5>{localDate(createdAt)}</h5>
      )
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, coupon) => (
        <Space>
          <PopupConfirm title="Kuponu Güncelle" description="Kuponu güncellemek istediğinizden emin misiniz?" func={() => {navigate("/p/admin/coupon/"+coupon.seoLink)}}/>
          <PopupConfirm title="Kuponu Sil" description="Kuponu silmek istediğinizden emin misiniz?" func={() => {deleteItem(coupon._id)}}/>
        </Space>
      ),
    },
  ];

  return (
    <Table dataSource={couponsData} columns={columns} loading={isLoading} rowKey={(coupon) => coupon._id} />
  )
};

export default CouponPage;
