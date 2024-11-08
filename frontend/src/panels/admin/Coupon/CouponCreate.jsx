import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { couponCreate } from '../../../http-requests/requests';

const CouponCreate = () => {
  const [form] = Form.useForm();

  const onFinish = async(values) => {
    try {
      await couponCreate(values)
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ code: '', discount: 1 }}
      style={{width: 450}}
    >
      <Form.Item
        label="Kupon Kodu"
        name="code"
        rules={[
          { required: true, message: 'Lütfen kupon kodunu girin.' },
          { min: 6, message: 'Kupon kodu en az 6 karakter olmalıdır.' },
          { max: 12, message: 'Kupon kodu en fazla 12 karakter olmalıdır.' },
        ]}
      >
        <Input placeholder="Kupon kodu girin" />
      </Form.Item>

      <Form.Item
        label="İndirim Oranı (%)"
        name="discountPercent"
        rules={[
          { required: true, message: 'Lütfen indirim oranını girin.' },
          { type: 'number', min: 1, max: 99, message: 'İndirim oranı 1 ile 99 arasında olmalıdır.' },
        ]}
      >
        <InputNumber min={1} max={99} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CouponCreate;
