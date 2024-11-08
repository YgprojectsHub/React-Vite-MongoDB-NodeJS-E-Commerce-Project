import React from 'react';
import { Form, Input, Button } from 'antd';
import { tagCreate } from '../../../http-requests/requests';

const TagCreate = () => {
  const [form] = Form.useForm();

  const onFinish = async(values) => {
    try {
      await tagCreate(values)
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{width: 450}}
    >
      <Form.Item
        label="Etiket Adı"
        name="name"
        rules={[
          { required: true, message: 'Lütfen etiket adını girin.' },
        ]}
      >
        <Input placeholder="Etiket adını girin" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TagCreate;
