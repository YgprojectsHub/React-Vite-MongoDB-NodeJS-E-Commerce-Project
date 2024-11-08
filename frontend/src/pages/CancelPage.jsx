import React, { useEffect, useState } from "react";
import { Button, Result, Row, Col, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { userData } from "../helper/auth";
import { compareHash } from "../helper/hashCompare";
import moment from 'moment';

const CancelPage = () => {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  
  const { userId, token, exp } = useParams();
  const decodedUserId = decodeURIComponent(userId)
  const decodedExp = decodeURIComponent(exp)

  useEffect(() => {
    const verifyUserId = async () => {
      const user = userData();

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

    verifyUserId();
  }, [decodedUserId, decodedExp, token]);

  useEffect(() => {
    if (!loading) {
      if (!isValid) {
        navigate("/");
      }
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
          status="error"
          title="Ödemeniz Başarısız!"
          subTitle="Ödemeniz sırasında bir hata oluştu. Lütfen tekrar deneyin."
          extra={[
            <Button type="primary" onClick={() => navigate("/cart")} key="retry">
              Ödemeyi Tekrar Dene
            </Button>,
            <Button onClick={() => navigate("/")} key="home">
              Anasayfaya Dön
            </Button>,
          ]}
        />
      </Col>
    </Row>
  );
};

export default CancelPage;
