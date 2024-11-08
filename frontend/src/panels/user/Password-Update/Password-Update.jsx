import React from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { passwordUpdate } from "../../../http-requests/requests";

const PasswordUpdate = () => {
  const handlePasswordUpdate = async (values) => await passwordUpdate(values)

  return (
    <Form layout="vertical" onFinish={handlePasswordUpdate}>
      <Form.Item
        label="Eski Şifre"
        name="oldPassword"
        rules={[
          { required: true, message: "Lütfen eski şifrenizi girin" },
          { min: 6, message: "Şifre en az 6 karakter olmalı" },
          { max: 16, message: "Şifre en fazla 16 karakter olmalı" },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Eski Şifre" />
      </Form.Item>

      <Form.Item
        label="Yeni Şifre"
        name="newPassword"
        rules={[
          { required: true, message: "Lütfen yeni şifrenizi girin" },
          { min: 6, message: "Şifre en az 6 karakter olmalı" },
          { max: 16, message: "Şifre en fazla 16 karakter olmalı" },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Yeni Şifre" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Şifre Güncelle
      </Button>
    </Form>
  );
};

export default PasswordUpdate;
