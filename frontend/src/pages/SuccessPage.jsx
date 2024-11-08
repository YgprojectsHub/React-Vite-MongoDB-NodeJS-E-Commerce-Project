/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Button, Result, Row, Col, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { decryptData, userData } from "../helper/auth";
import { compareHash } from "../helper/hashCompare";
import moment from 'moment';
import { CartContext } from "../context/CartProvider";
import { orderCreate } from "../http-requests/requests";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const { userId, token, exp } = useParams();
  const decodedUserId = decodeURIComponent(userId)
  const decodedExp = decodeURIComponent(exp)

  const { cartItems, removeCartItems} = useContext(CartContext)

  useEffect(() => {
    const user = userData();

    const verifyLink = async () => {

      const currentTime = moment().toISOString();
      const isExpired = moment(currentTime).isAfter(moment(decodedExp));

      if (user && user._id && token && !isExpired) {
        const isValid = await compareHash(user._id, decodedUserId);
        setIsValid(isValid);
      } else {
        setIsValid(false);
      }
      setLoading(false);
    };

    const createOrder = async () => {
      const data = localStorage.getItem("paymentDatas")
      const paymentDatas = data && JSON.parse(data)

      const appliedCoupon = decryptData("appliedCoupon")

      const newItems = cartItems.map((item) => {
        return {
          productId: item._id,
          name: item.name,
          img: item.imgs[0],
          price: item.price.newPrice,
          quantity: item.quantity,
          color: item.color,
          awardCoupon: item.awardCoupon,
          size: item.size
        };
      });

      const orderData = {
        userId: user._id,
        orders: newItems,
        paymentSessionId: paymentDatas[0],
        totalPrice: paymentDatas[1],
        isFastCargo: paymentDatas[2],
        usedCoupon: appliedCoupon.length != 0 ? appliedCoupon : null,
      }

      const {status} = await orderCreate(orderData)

      if(status==201){
        removeCartItems()
        localStorage.removeItem("appliedCoupon")
        localStorage.removeItem("paymentDatas")
      }
    }

    createOrder();
    verifyLink();
  }, [decodedUserId, token, decodedExp, removeCartItems]);

  useEffect(() => {
    if (!loading && !isValid) {
      navigate("/")
    }
  }, [loading, isValid, navigate]);

  if (loading) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col>
          <Spin size="large" tip="Yükleniyor..." />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={22} sm={18} md={14} lg={10}>
        <Result
          status="success"
          title="Ödemeniz Başarılı!"
          subTitle="Siparişiniz başarıyla tamamlandı. Sipariş detaylarınızı e-posta ile gönderdik."
          extra={[
            <Button type="primary" onClick={() => navigate("/")} key="home">
              Anasayfaya Dön
            </Button>,
          ]}
        />
      </Col>
    </Row>
  );
};

export default SuccessPage;
