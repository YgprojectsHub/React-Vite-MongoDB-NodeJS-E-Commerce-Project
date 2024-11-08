import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Button, Upload, Spin, Tree, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { category, categoryUpdate } from "../../../http-requests/requests";
import { getFileName } from "../../../helper/getFileName";

const CategoryUpdate = () => {
  const [firstCategoryKey] = useState((Math.random() * 1000 + "-0"));
  const { seoLink } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([
    { title: "Ana Kategori", key: `${firstCategoryKey}`, children: [] },
  ]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      try {
        const { response } = await category(seoLink);
        const fileName = getFileName(response.imgUrl);

        setFileList([
          {
            uid: "-1",
            name: fileName,
            status: "done",
            url: response.imgUrl,
            thumbUrl: response.imgUrl,
          },
        ]);

        setCategories(response.children);

        form.setFieldsValue({
          name: response.name,
          fileList: [
            {
              uid: "-1",
              name: fileName,
              status: "done",
              url: response.imgUrl,
              thumbUrl: response.imgUrl,
            },
          ],
        });
      } catch (error) {
        console.error("Bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategory();
  }, [seoLink, form]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = async (values) => {
    try {
      if (values.fileList && values.fileList.length > 0) {
        
        const updatedFiles = values.fileList[0].originFileObj;

        await categoryUpdate(seoLink, updatedFiles, {
          name: values.name,
          children: categories[0],
        });
      } else {
        console.error("Dosya yüklenmedi");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  const addSubCategory = (key) => {
    const newCategory = {
      title: newSubCategoryName || "Yeni Alt Kategori",
      key: `${key}-${Math.random() * 1000}`,
      children: [],
    };
    const updateCategories = (data) => {
      return data.map((category) => {
        if (category.key === key) {
          return { ...category, children: [...category.children, newCategory] };
        }
        if (category.children) {
          return { ...category, children: updateCategories(category.children) };
        }
        return category;
      });
    };
    setCategories(updateCategories(categories));
    setNewSubCategoryName(""); // Girdi alanını temizle
  };

  const onTreeSelect = (keys) => {
    if (keys.length > 0) {
      setSelectedKey(keys[0]);
    }
  };

  const showEditModal = () => {
    const category = findCategoryByKey(categories, selectedKey);
    if (category && selectedKey != firstCategoryKey) {
      setEditingName(category.title);
      setIsModalVisible(true);
    }
  };

  const handleEdit = () => {
    const updatedCategories = updateCategoryName(
      categories,
      selectedKey,
      editingName
    );
    setCategories(updatedCategories);
    setIsModalVisible(false);
  };

  const updateCategoryName = (data, key, newName) => {
    return data.map((category) => {
      if (category.key === key) {
        return { ...category, title: newName };
      }
      if (category.children) {
        return {
          ...category,
          children: updateCategoryName(category.children, key, newName),
        };
      }
      return category;
    });
  };

  const findCategoryByKey = (data, key) => {
    for (const category of data) {
      if (category.key === key) {
        return category;
      }
      if (category.children) {
        const found = findCategoryByKey(category.children, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleDelete = () => {
    if (selectedKey != firstCategoryKey) {
      const updatedCategories = deleteCategory(categories, selectedKey);
      setCategories(updatedCategories);
      setSelectedKey(null);
    }
  };

  const deleteCategory = (data, key) => {
    return data
      .map((category) => {
        if (category.children) {
          return {
            ...category,
            children: deleteCategory(category.children, key),
          };
        }
        return category;
      })
      .filter((category) => category.key !== key);
  };

  const handleAddSubCategory = () => {
    if (selectedKey) {
      addSubCategory(selectedKey);
    }
  };

  const props = {
    beforeUpload: () => false,
    onChange: (info) => {
      setFileList(info.fileList);
    },
  };

  return (
    <Spin spinning={isLoading}>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        onFinish={onFinish}
        initialValues={{ name: "", fileList: [] }}
      >
        <Form.Item
          label="Kategori Adı"
          name="name"
          rules={[
            { required: true, message: "Lütfen kategori adını girin." },
            {
              type: "string",
              min: 4,
              max: 20,
              message: "Kategori adı 4 ile 20 karakter arasında olmalıdır.",
            },
          ]}
        >
          <Input placeholder="kategori adı giriniz" />
        </Form.Item>

        <Form.Item
          label="Kategori Resmi"
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: true, message: "Lütfen kategori resmini yükleyin." },
          ]}
        >
          <Upload
            {...props}
            maxCount={1}
            fileList={fileList}
            listType="picture"
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Resim Yükle</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Kategoriler" style={{ marginBottom: 20 }}>
          <Tree
            defaultExpandAll
            treeData={categories}
            onSelect={onTreeSelect}
            style={{ marginBottom: 20, padding: 5 }} // Ağaç bileşeni için alt alan
          />

          <Input
            placeholder="Alt kategori adı"
            value={newSubCategoryName}
            onChange={(e) => setNewSubCategoryName(e.target.value)}
            style={{ marginBottom: 10 }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Button
              type="primary"
              onClick={handleAddSubCategory}
              disabled={!selectedKey}
              style={{ flex: 1, marginRight: 5 }} // Butonlar arasındaki boşluk
            >
              Alt Kategori Ekle
            </Button>

            <Button
              type="primary"
              onClick={showEditModal}
              disabled={!selectedKey}
              style={{ flex: 1, marginRight: 5 }} // Butonlar arasındaki boşluk
            >
              Düzenle
            </Button>

            <Button
              type="danger"
              onClick={handleDelete}
              disabled={!selectedKey}
              style={{ flex: 1 }} // Sil butonu
            >
              Sil
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Güncelle
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Kategoriyi Düzenle"
        open={isModalVisible}
        onOk={handleEdit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          placeholder="Yeni kategori adını girin"
        />
      </Modal>
    </Spin>
  );
};

export default CategoryUpdate;
