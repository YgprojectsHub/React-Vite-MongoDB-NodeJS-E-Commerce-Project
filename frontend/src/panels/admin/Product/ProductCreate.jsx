/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Space,
  message,
  TreeSelect,
} from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import {
  productCreate,
  categories,
  coupons,
  products,
  tags,
} from "../../../http-requests/requests";
import "react-quill/dist/quill.snow.css";
import { transformCategories } from "../../../helper/transformCategories";
import { findRootCategoryId } from "../../../helper/findRootCategoryId";

const { TextArea } = Input;
const { Option } = Select;

const ProductCreate = () => {
  const [form] = Form.useForm();
  const [categoryData, setCategories] = useState([]);
  const [productsData, setProducts] = useState([]);
  const [tagsData, setTags] = useState([]);
  const [couponData, setCoupon] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState();

  useEffect(() => {
    const fetchCategories = async () => {
      const {response} = await categories();
      const transformedData = transformCategories(response).map((cat) => {
        return cat.children[0];
      });

      setCategories([response, transformedData]);
    };

    const fetchCoupons = async () => {
      const {response} = await coupons();
      setCoupon(response);
    };

    const fetchProducts = async () => {
      const {response} = await products();
      setProducts(response);
    };

    const fetchTags = async () => {
      const {response} = await tags();
      setTags(response);
    };

    fetchCategories();
    fetchCoupons();
    fetchProducts();
    fetchTags();
  }, []);

  const onFinish = async (values) => {
    if (fileList.length < 3) {
      message.warning("En az 3 fotoğraf yüklenmeli.");
      return;
    }

    const {
      category,
      colors,
      discount,
      price,
      name,
      stockCount,
      awardCoupon,
      seoKeys,
      sku,
      additionalDetails,
      tags,
      recommendedProducts,
    } = values;

    const rootCategoryId = findRootCategoryId(categoryData[0], value);

    const formData = {
      category: {
        rootCategoryId,
        key: category,
      },
      colors,
      description,
      discount,
      price,
      name,
      stockCount,
      awardCoupon,
      seoKeys,
      sku,
      additionalDetails,
      tags,
      recommendedProducts,
    };

    const files = fileList.map((file) => file.originFileObj);

    await productCreate(files, formData);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const uploadProps = {
    beforeUpload: () => false, // Prevent automatic upload
    onChange: (info) => {
      setFileList(info.fileList);
    },
  };

  const handleValueTypeChange = (_, allValues) => {
    const updatedKeyValues = allValues.additionalDetails.map((item) => ({
      ...item,
      valueType: item.valueType || "input",
    }));
    form.setFieldsValue({ additionalDetails: updatedKeyValues });
  };

  const fakeOptions = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <Form
        form={form}
        name="productForm"
        onFinish={onFinish}
        layout="vertical"
        onValuesChange={handleValueTypeChange}
      >
        <Form.Item
          name="name"
          label="Ürün Adı"
          rules={[
            { required: true, message: "Ürün adı giriniz!" },
            { min: 15, message: "Ürün adı en az 15 karakter olmalıdır!" },
            { max: 50, message: "Ürün adı en fazla 50 karakter olabilir!" },
          ]}
        >
          <Input placeholder="Ürün adı" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Açıklama"
          rules={[
            { required: true, message: "Açıklama giriniz!" },
            { min: 20, message: "Açıklama en az 20 karakter olmalıdır!" },
            { max: 1000, message: "Açıklama en fazla 1000 karakter olabilir!" },
          ]}
        >
          <ReactQuill
            theme="snow"
            style={{ backgroundColor: "white" }}
            value={description}
            onChange={setDescription}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Kategori"
          rules={[{ required: true, message: "Kategori seçiniz!" }]}
        >
          <TreeSelect
            treeData={categoryData[1]}
            onChange={(val) => setValue(val)}
            placeholder="Kategori seçiniz"
            allowClear
            treeDefaultExpandAll
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Fiyat"
          rules={[{ required: true, message: "Fiyat giriniz!" }]}
        >
          <Input type="number" min={0} placeholder="Fiyat" />
        </Form.Item>

        <Form.Item name="discount" label="İndirim (%)">
          <Input
            type="number"
            initialvalues={0}
            min={0}
            max={100}
            placeholder="İndirim"
          />
        </Form.Item>

        <Form.Item
          name="stockCount"
          label="Stok sayısı"
          rules={[{ required: true, message: "Stok sayısını giriniz!" }]}
        >
          <Input
            type="number"
            initialvalues={0}
            min={0}
            placeholder="Stok sayısı"
          />
        </Form.Item>

        <Form.Item
          label="Ürün Resmi"
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Lütfen ürün resmini yükleyin." }]}
        >
          <Upload
            {...uploadProps}
            listType="picture"
            fileList={fileList}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            multiple
          >
            <Button icon={<UploadOutlined />}>Resim Yükle</Button>
          </Upload>
        </Form.Item>

        <Form.List
          name="colors"
          rules={[
            {
              validator: async (_, colors) => {
                if (!colors || colors.length < 1) {
                  return Promise.reject(
                    new Error("Lütfen en az 1 renk ekleyin.")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name]}
                    fieldKey={[fieldKey]}
                    label="Ürün Renkleri"
                    rules={[{ required: true, message: "Renk seçiniz" }]}
                  >
                    <Input type="color" initialvalues="#ffffff" />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )}
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Renk Ekle
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.List
          name="additionalDetails"
          initialValue={[{ key: "", valueType: "input", value: "" }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "key"]}
                    fieldKey={[fieldKey, "key"]}
                    label={`Detay ${index + 1}`}
                    rules={[{ required: true, message: "Detay zorunludur." }]}
                  >
                    <Input placeholder="Detay giriniz" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "valueType"]}
                    fieldKey={[fieldKey, "valueType"]}
                    label="Girdi Tipi"
                  >
                    <Select initialvalues="input">
                      <Option value="input">Yazı</Option>
                      <Option value="select">Seçenek</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    fieldKey={[fieldKey, "value"]}
                    label="Girdi"
                    rules={[{ required: true, message: "Girdi zorunludur." }]}
                  >
                    {form.getFieldValue([
                      "additionalDetails",
                      index,
                      "valueType",
                    ]) === "input" ? (
                      <Input placeholder="Değer giriniz" />
                    ) : (
                      <Select placeholder="Seçenek seçiniz">
                        {fakeOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Detay Ekle
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="awardCoupon" label="Ödül kuponu">
          <Select placeholder="Ödül kuponu seçiniz">
            {couponData.map((coupon) => (
              <Option key={coupon._id} value={coupon._id}>
                {coupon.code}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="recommendedProducts" label="Önerilen ürünler">
          <Select placeholder="Ürünleri seçiniz" mode="multiple">
            {productsData.map((product) => (
              <Option key={product._id} value={product._id}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label="Etiketler"
          rules={[{ required: true, message: "Etiketleri seçiniz." }]}
        >
          <Select placeholder="Etiketleri seçiniz" mode="multiple">
            {tagsData.map((tag) => (
              <Option key={tag._id} value={tag._id}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Seo kelimeleri"
          name="seoKeys"
          rules={[{ required: true, message: "Seo kelimelerini giriniz." }]}
        >
          <TextArea
            rows={6}
            placeholder="Ürün ile bağlantılı kelimeler girin..."
          />
        </Form.Item>

        <Form.Item
          name="sku"
          label="Ürün SKU numarası"
          rules={[
            { required: true, message: "SKU numarası giriniz!" },
            { min: 13, message: "SKU numarası 13 haneli olmalıdır!" },
            { max: 13, message: "SKU numarası 13 haneli olmalıdır!" },
          ]}
        >
          <Input placeholder="SKU numarası" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Oluştur
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductCreate;
