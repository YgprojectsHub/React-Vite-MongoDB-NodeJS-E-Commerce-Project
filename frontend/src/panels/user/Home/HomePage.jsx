import React, { useEffect, useState, useRef } from "react";
import { Avatar, Card, List, Spin } from "antd";
import { userData } from "../../../helper/auth";
import { ordersByUser } from "../../../http-requests/requests";
import { localDate } from "../../../helper/formatLocalDate";
import { formatCurrency } from "../../../helper/formatCurrency";
import { Link } from "react-router-dom";
import ColorThief from "colorthief";

const HomePage = () => {
  const [user, setUser] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borderColor, setBorderColor] = useState(undefined);
  const imgRef = useRef(null);

  useEffect(() => {
    const currentUser = userData();
    setUser(currentUser);

    const getOrdersByUser = async () => {
      if (currentUser && currentUser._id) {
        const { response } = await ordersByUser(currentUser._id);
        setRecentOrders(response || []);
      }
      setLoading(false);
    };

    getOrdersByUser();
  }, []);

  const fetchColor = async () => {
    const colorThief = new ColorThief();
    if (imgRef.current) {
      const dominantColor = await colorThief.getColor(imgRef.current);
      setBorderColor(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`);
    }
  };

  const handleImageLoad = () => {
    fetchColor();
  };

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
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
      >
        <img
          src={user.avatar}
          ref={imgRef}
          alt="profile"
          style={{ display: "none" }}
          crossOrigin="anonymous"
          onLoad={handleImageLoad}
        />
        <Avatar
          src={user.avatar}
          size={100}
          alt={`${user.username}'s profile`}
          style={{ boxShadow: `0 3px 10px ${borderColor != undefined && borderColor}` }}
        />
      </div>

      <Card
        title={`Hoşgeldiniz, ${user.username}`}
        style={{ marginBottom: 20 }}
      >
        <p>Email: {user.email}</p>
      </Card>

      <Card title="Son Siparişleriniz" style={{ marginBottom: 20 }}>
        <Spin spinning={loading}>
          {recentOrders.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={recentOrders}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`Sipariş No: ${item.orderCode}`}
                    description={
                      <div>
                        <span>
                          Tutar: {formatCurrency(item.totalPrice, "TRY")}
                        </span>
                        <br />
                        <span>Durum: {getStatus(item.status)}</span>
                        <br />
                        <span>
                          Tarih: {localDate(item.createdAt)}
                        </span>
                        <br />
                        <span>
                          <Link to={`/p/account/order/${item.seoLink}`}>
                            Sipariş detayları
                          </Link>
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}

          {recentOrders.length == 0 && <p>Siparişler bulunamadı</p>}
        </Spin>
      </Card>
    </div>
  );
};

export default HomePage;
