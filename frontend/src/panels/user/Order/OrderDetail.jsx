import React, { useEffect, useState } from "react";
import {
  Descriptions,
  List,
  Card,
  Image,
  Button,
  Typography,
  Spin,
  Space,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { order, orderUpdate, product } from "../../../http-requests/requests";
import { formatCurrency } from "../../../helper/formatCurrency";

const { Title } = Typography;

const OrderDetail = () => {
  const { seoLink } = useParams();

  const [orderDetail, setOrderDetail] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [productLinks, setProductLinks] = useState({});

  useEffect(() => {
    const getOrder = async () => {
      const { response } = await order(seoLink);
      setOrderDetail(response);
      setLoading(false);
    };

    getOrder();
  }, [seoLink]);

  const getStatus = (statusCode) => {
    const statusDatas = [
      { code: 100, text: "Beklemede" },
      { code: 101, text: "Kargoya Verildi" },
      { code: 102, text: "Teslim Edildi" },
      { code: 200, text: "İptal Edildi" },
      { code: 201, text: "İade Talebi Oluşturuldu" },
      { code: 202, text: "İade Edildi" },
    ];

    const status = statusDatas.find(
      (statusData) => statusData.code == statusCode
    );

    return status.text;
  };

  const cancelOrder = async () => await orderUpdate(seoLink, 200);
  const retrieveOrder = async () => await orderUpdate(seoLink, 201);

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

  return (
    <div>
      {orderDetail && (
        <Spin spinning={loading}>
          <Descriptions title="Sipariş Bilgileri" bordered>
            <Descriptions.Item label="Sipariş durumu" span={3}>
              {getStatus(orderDetail.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Hızlı kargo" span={3}>
              {orderDetail.isFastCargo == true ? "Seçildi" : "Seçilmedi"}
            </Descriptions.Item>
            <Descriptions.Item label="Kullanılan kupon" span={3}>
              {orderDetail?.usedCoupon?.coupon ? `${orderDetail.usedCoupon.coupon.code} (%${orderDetail.usedCoupon.coupon.discountPercent})` : "Kupon kullanılmadı"}
            </Descriptions.Item>
            <Descriptions.Item label="Sipariş tutarı" span={3}>
              {formatCurrency(orderDetail.totalPrice, "TRY")}
            </Descriptions.Item>
            <Descriptions.Item label="İşlemler" span={3}>
              <Space size="small">
                <Button type="primary" onClick={retrieveOrder} disabled={orderDetail.status !== 102}>
                  İade Et
                </Button>
                <Button type="primary" onClick={cancelOrder} danger disabled={orderDetail.status !== 100 && orderDetail.status !== 101}>
                  İptal Et
                </Button>                
              </Space>
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
                        </p>

                        <p>
                          {productLinks[item.productId] ? (
                            <Link to={`/product/${productLinks[item.productId]}`}>
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
        </Spin>
      )}
    </div>
  );
};

export default OrderDetail;
