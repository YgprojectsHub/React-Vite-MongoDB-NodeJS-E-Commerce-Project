// src/components/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import {
  Descriptions,
  List,
  Card,
  Image,
  Select,
  Button,
  Typography,
  Spin,
} from "antd";
import { Link, useParams } from "react-router-dom";
import {
  order,
  orderUpdate,
  product,
  user,
} from "../../../http-requests/requests";
import { formatCurrency } from "../../../helper/formatCurrency";

const { Option } = Select;
const { Title } = Typography;

const OrderDetail = () => {
  const { seoLink } = useParams();
  const [hasChanges, setHasChanges] = useState(false);

  const [orderDetail, setOrderDetail] = useState(undefined);
  const [orderStatus, setOrderStatus] = useState(100);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [productLinks, setProductLinks] = useState({});

  useEffect(() => {
    const getOrder = async () => {
      const { response } = await order(seoLink);

      setOrderDetail(response);
      setOrderStatus(response.status);

      const { response: userResponse } = await user(response.userId);
      setUserEmail(userResponse.email);

      setLoading(false);
    };

    getOrder();
  }, [seoLink]);

  const handleStatusChange = (code) => {
    setOrderStatus(code);
    setHasChanges(true);
  };

  const handleUpdate = async () => await orderUpdate(seoLink, orderStatus);

  const fetchProductSeoLink = async (productId) => {
    const { response } = await product(productId);
    setProductLinks((prevLinks) => ({
      ...prevLinks,
      [productId]: response,
    }));
  };

  useEffect(() => {
    if (orderDetail?.orders) {
      orderDetail.orders.forEach((item) => {
        fetchProductSeoLink(item.productId);
      });
    }
  }, [orderDetail]);

  const getStatus = (statusCode) => {
    const statusDatas = [
      { code: 100, text: "Beklemede" },
      { code: 101, text: "Kargoya Verildi" },
      { code: 102, text: "Teslim Edildi" },
      { code: 200, text: "İptal Edildi" },
      { code: 201, text: "İade Talep Edildi" },
      { code: 202, text: "İade Edildi" },
    ];

    const status = statusDatas.find(
      (statusData) => statusData.code == statusCode
    );

    return status.text;
  };

  return (
    <div>
      {orderDetail && (
        <Spin spinning={loading}>
          <Descriptions title="Sipariş Bilgileri" bordered>
            <Descriptions.Item label="Kullanıcı emaili" span={3}>
              {userEmail || "Email yükleniyor..."}
            </Descriptions.Item>
            <Descriptions.Item label="Sipariş durumu" span={3}>
              {getStatus(orderDetail.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Hızlı kargo" span={3}>
              {orderDetail.isFastCargo ? "Seçildi" : "Seçilmedi"}
            </Descriptions.Item>
            <Descriptions.Item label="Sipariş tutarı" span={3}>
              {formatCurrency(orderDetail.totalPrice, "TRY")}
            </Descriptions.Item>
            <Descriptions.Item label="Kullanılan kupon" span={3}>
              {orderDetail?.usedCoupon?.coupon ? `${orderDetail.usedCoupon.coupon.code} (%${orderDetail.usedCoupon.coupon.discountPercent})` : "Kupon kullanılmadı"}
            </Descriptions.Item>
            <Descriptions.Item label="İşlemler" span={3}>
              <Select
                value={orderStatus}
                style={{ width: 200 }}
                onChange={handleStatusChange}
                disabled={
                  orderDetail.status == 202 || orderDetail.status == 102 || orderDetail.status == 200
                }
              >
                {orderDetail.status != 200 && orderDetail.status != 201 && orderDetail.status != 202 && (
                  <>
                  <Option value={100} disabled>Beklemede</Option>
                  <Option value={101} disabled={orderDetail.status == 101 || orderDetail.status == 201}>Kargoya Verildi</Option>
                  <Option value={102} disabled={orderDetail.status == 100}>Teslim Edildi</Option>
                  </>
                )}

                {(orderDetail.status == 200 || orderDetail.status == 201 || orderDetail.status == 202) && (
                  <>
                  <Option value={200} disabled>İptal Edildi</Option>
                  <Option value={201} disabled>İade Talep Edildi</Option>
                  <Option value={202}>İade Edildi</Option>
                  </>
                )}
              </Select>
            </Descriptions.Item>
          </Descriptions>

          <Title level={4} style={{ marginTop: "20px" }}>
            Ürün bilgileri
          </Title>

          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={orderDetail.orders}
            style={{ marginTop: "10px" }}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <Card>
                  <List.Item.Meta
                    avatar={<Image width={100} src={item.img} />}
                    title={item.name}
                    description={
                      <>
                        <p>Tutar: {formatCurrency(item.price, "TRY")}</p>
                        <p>Adet: {item.quantity}</p>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          Renk:
                          <label
                            className="color-label"
                            style={{
                              background: item.color,
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              display: "inline-block",
                              marginLeft: "8px",
                              position: "relative",
                            }}
                          >
                            <input
                              type="radio"
                              name="product-color"
                              className="color-radio"
                              style={{ display: "none" }}
                            />
                          </label>
                          &nbsp; ({item.color})
                        </p>
                        <p>
                          {productLinks[item.productId] ? (
                            <Link
                              to={`/product/${productLinks[item.productId]}`}
                            >
                              Ürün detayları
                            </Link>
                          ) : (
                            "Yükleniyor..."
                          )}
                        </p>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />

          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <Button
              type="primary"
              onClick={handleUpdate}
              disabled={!hasChanges}
            >
              Güncelle
            </Button>
          </div>
        </Spin>
      )}
    </div>
  );
};

export default OrderDetail;
