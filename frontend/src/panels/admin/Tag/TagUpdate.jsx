/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Spin } from "antd";
import { tag, tagUpdate } from "../../../http-requests/requests";
import { useParams } from "react-router-dom";

const TagUpdate = () => {
  const { seoLink } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const getTag = async () => {
      try {
        const { response } = await tag(seoLink);

        form.setFieldsValue({ name: response.name });
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    getTag();
  }, []);

  const onFinish = async (values) => {
    try {
      await tagUpdate(seoLink, values);
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
        style={{ width: 450 }}
      >
        <Form.Item
          label="Etiket Adı"
          name="name"
          rules={[{ required: true, message: "Lütfen etiket adını girin." }]}
        >
          <Input placeholder="Etiket adını girin" />
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

export default TagUpdate;
