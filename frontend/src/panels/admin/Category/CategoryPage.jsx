import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import PopupConfirm from "../../../helper/PopupConfirm";
import { localDate } from "../../../helper/formatLocalDate";
import { useNavigate } from "react-router-dom"
import { categories, categoryDelete } from "../../../http-requests/requests";

const CategoryPage = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const getCategories = async () => {
      const data = await categories()
      setCategoriesData(data.response);
      setLoading(false)
    };
    getCategories();
  }, []);

  const deleteItem = (id) => {
    const res = categoryDelete(id)
    if(res){
      const newcategories = categoriesData.filter(category => category._id !== id)
      setCategoriesData(newcategories)
    }
  }

  const columns = [
    {
      title: "Category Image",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgSrc) => (<img src={imgSrc} alt="Category Image" style={{height: "50px"}}/>)
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <h5>{localDate(createdAt)}</h5>
      )
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, category) => (
        <Space>
          <PopupConfirm title="Kategoriyi Güncelle" description="Kategoriyi güncellemek istediğinizden emin misiniz?" func={() => {navigate("/p/admin/category/"+category.seoLink)}}/>
          <PopupConfirm title="Kategoriyi Sil" description="Kategoriyi silmek istediğinizden emin misiniz?" func={() => {deleteItem(category._id)}}/>
        </Space>
      ),
    },
  ];

  return (
    <Table dataSource={categoriesData} columns={columns} loading={isLoading} rowKey={(category) => category._id}/>
  );
};

export default CategoryPage;
