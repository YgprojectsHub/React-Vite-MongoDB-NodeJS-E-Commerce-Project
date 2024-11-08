import React, { useState } from "react";
import { Form, Select, Button } from "antd";

const { Option } = Select;

const Settings = () => {
  const [language, setLanguage] = useState("tr");
  const [country, setCountry] = useState("TR");
  const [currency, setCurrency] = useState("TRY");

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const handleCountryChange = (value) => {
    setCountry(value);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  const onFinish = () => {
    console.log({ language, country, currency });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ayarlar</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Dil">
          <Select value={language} onChange={handleLanguageChange}>
            <Option value="tr">Türkçe</Option>
            <Option value="en">İngilizce</Option>
            <Option value="de">Almanca</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ülke">
          <Select value={country} onChange={handleCountryChange}>
            <Option value="TR">Türkiye</Option>
            <Option value="US">ABD</Option>
            <Option value="DE">Almanya</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Para Birimi">
          <Select value={currency} onChange={handleCurrencyChange}>
            <Option value="TRY">Türk Lirası</Option>
            <Option value="USD">ABD Doları</Option>
            <Option value="EUR">Euro</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Kaydet
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Settings;
