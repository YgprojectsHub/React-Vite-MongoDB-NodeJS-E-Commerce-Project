import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import { couponsByUserId } from '../../../http-requests/requests';

const Coupons = () => {
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    const getCouponsByUserId = async() => {
      const {response} = await couponsByUserId()
      setCoupons(response.gainedCoupons)
    }

    getCouponsByUserId()
  }, [])

  return (
    <List
      itemLayout="horizontal"
      dataSource={coupons}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={`%${item.discountPercent} İndirim kuponu, hemen harca!`}
            description={`Kod: ${item.code}`}
          />
        </List.Item>
      )}
    />
  );
};

export default Coupons;
