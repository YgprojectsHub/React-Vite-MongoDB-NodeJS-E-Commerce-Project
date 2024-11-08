import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Space,
  message,
  Spin,
  TreeSelect,
} from "antd";
import {
  UploadOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import {
  productUpdate,
  product,
  categories,
  coupons,
  products,
  tags,
} from "../../../http-requests/requests";
import { getFileName } from "../../../helper/getFileName";
import { transformCategories } from "../../../helper/transformCategories";
import { findRootCategoryId } from "../../../helper/findRootCategoryId";
import "react-quill/dist/quill.snow.css";

const { Option } = Select;
const { TextArea } = Input;

const ProductUpdate = () => {
  const { seoLink } = useParams();
  const [form] = Form.useForm();

  const [categoryData, setCategories] = useState([]);
  const [productsData, setProducts] = useState([]);
  const [couponData, setCoupons] = useState([]);
  const [tagsData, setTags] = useState([]);

  const [fileList, setFileList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [value, setValue] = useState();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const getCategories = await categories();
        const getCoupons = await coupons();
        const getProducts = await products();
        const getTags = await tags();

        const transformedData = transformCategories(getCategories.response).map(
          (cat) => {
            return cat.children[0];
          }
        );

        setCategories([getCategories.response, transformedData]);
        setCoupons(getCoupons.response);
        setProducts(getProducts.response);
        setTags(getTags.response);

        const { response } = await product(seoLink);
        const {
          category,
          colors,
          description,
          price,
          name,
          stockCount,
          awardCoupon,
          seoKeys,
          sku,
          additionalDetails,
          imgs,
          recommendedProducts,
        } = response;

        const formattedFileList = imgs.map((img, index) => {
          const fileName = getFileName(img);
          return {
            uid: `-${index}`,
            name: fileName,
            status: "done",
            url: img,
            thumbUrl: img,
          };
        });

        setFileList(formattedFileList);
        setDescription(description);

        const selectedRecommendedProductIds = recommendedProducts.map((p) => p._id.toString());

        const selectedRecommendedProduct = getProducts.response.filter((p) => 
          selectedRecommendedProductIds.includes(p._id.toString())
        ).map((p) => p.name)

        form.setFieldsValue({
          category: category.selectedKey,
          name,
          description,
          colors,
          price: price.current,
          discount: price.discount,
          fileList: formattedFileList,
          stockCount,
          awardCoupon: awardCoupon.code,
          seoKeys,
          sku,
          additionalDetails,
          tags: response.tags.map((tag) => {
            return tag.name;
          }),
          recommendedProducts: selectedRecommendedProduct
        });
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [seoLink, form]);

  const onFinish = (values) => {
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
      recommendedProducts
    } = values;

    const rootCategoryId = findRootCategoryId(categoryData[0], value);

    const selectedAwardCouponId = couponData.find((coupon) => coupon.code == awardCoupon)._id

    const selectedTagsId = tagsData
      .filter((tag) => tags.includes(tag.name))
      .map((item) => item._id);

    const selectedRecommendedProductsId = productsData
      .filter((pD) => recommendedProducts.includes(pD.seoLink))
      .map((item) => item._id);

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
      awardCoupon: selectedAwardCouponId,
      seoKeys,
      sku,
      additionalDetails,
      tags: selectedTagsId,
      recommendedProducts: selectedRecommendedProductsId
    };

    const updatedFiles = fileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj);

    productUpdate(seoLink, updatedFiles, formData);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const props = {
    beforeUpload: () => false,
    onChange: (info) => {
      setFileList(info.fileList);
    },
  };

  const fakeOptions = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

  return (
    <Spin spinning={isLoading}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        <Form
          form={form}
          name="productForm"
          onFinish={onFinish}
          layout="vertical"
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
              {
                max: 1000,
                message: "Açıklama en fazla 1000 karakter olabilir!",
              },
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
              value={0}
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
            <Input type="number" value={0} min={0} placeholder="Stok sayısı" />
          </Form.Item>

          <Form.Item
            label="Ürün Resmi"
            name="fileList"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Lütfen ürün resmini yükleyin." },
            ]}
          >
            <Upload
              {...props}
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
                      <Input type="color" initialvalue="#ffffff" />
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
                      <Select
                        defaultValue="input"
                        onChange={() =>
                          form.setFieldsValue({
                            additionalDetails:
                              form.getFieldValue("additionalDetails"),
                          })
                        }
                      >
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
                <Option key={coupon._id} value={coupon.code}>
                  {coupon.code}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="recommendedProducts" label="Önerilen ürünler">
            <Select placeholder="Ürünleri seçiniz" mode="multiple">
              {productsData.map(
                (product) =>
                  product.seoLink != seoLink && (
                    <Option key={product._id} value={product.seoLink}>
                      {product.name}
                    </Option>
                  )
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="Etiketler"
            rules={[{ required: true, message: "Etiketleri seçiniz." }]}
          >
            <Select
              placeholder="Etiketleri seçiniz"
              mode="multiple"
              onChange={(value) => {
                const selectedTagIds = tagsData
                  .filter((tag) => value.includes(tag._id))
                  .map((tag) => tag._id);
                form.setFieldsValue({ tags: selectedTagIds });
              }}
            >
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
            rules={[{ required: true, message: "Seo kelimlerini giriniz." }]}
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
            ]}
          >
            <Input placeholder="SKU numarası" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Güncelle
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default ProductUpdate;
