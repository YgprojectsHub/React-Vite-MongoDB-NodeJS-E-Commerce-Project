/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Spin } from "antd";
import { couponUpdate, coupon } from "../../../http-requests/requests";
import { useParams } from "react-router-dom";

const CouponUpdate = () => {
  const { seoLink } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const getCoupon = async () => {
      try {
        const {response} = await coupon(seoLink)

        form.setFieldsValue({ ...response });
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    getCoupon();
  }, []);

  const onFinish = async (values) => {
    try {
      await couponUpdate(seoLink, values);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ couponCode: "", discount: 1 }}
        style={{ width: 450 }}
      >
        <Form.Item
          label="Kupon Kodu"
          name="code"
          rules={[
            { required: true, message: "Lütfen kupon kodunu girin." },
            { min: 6, message: "Kupon kodu en az 6 karakter olmalıdır." },
            { max: 12, message: "Kupon kodu en fazla 12 karakter olmalıdır." },
          ]}
        >
          <Input placeholder="Kupon kodu girin" />
        </Form.Item>

        <Form.Item
          label="İndirim Oranı (%)"
          name="discountPercent"
          rules={[
            { required: true, message: "Lütfen indirim oranını girin." },
            {
              type: "number",
              min: 1,
              max: 99,
              message: "İndirim oranı 1 ile 99 arasında olmalıdır.",
            },
          ]}
        >
          <InputNumber min={1} max={99} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Güncelle
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default CouponUpdate;
