import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import PopupConfirm from "../../../helper/PopupConfirm";
import { localDate } from "../../../helper/formatLocalDate";
import { useNavigate } from "react-router-dom"
import { productDelete, products } from "../../../http-requests/requests";
import { formatCurrency } from "../../../helper/formatCurrency";

const ProductPage = () => {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const getProducts = async () => {
      const data = await products()

      setProductsData(data.response);
      setLoading(false)
    };

    getProducts();
  }, []);

  const deleteItem = (id) => {
    const res = productDelete(id)
    if(res){
      const newProducts = productsData.filter(product => product._id !== id)
      setProductsData(newProducts)
    }
  }

  const columns = [
    {
      title: "Product Image",
      dataIndex: "imgs",
      key: "imgs",
      render: (imgs) => (<img src={imgs[0]} alt="Product Image" style={{height: "50px"}}/>)
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (<p>{formatCurrency(price.newPrice, price.currency)}</p>)
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
      render: (_, product) => (
        <Space>
          <PopupConfirm title="Ürün Güncelle" description="Ürünü güncellemek istediğinizden emin misiniz?" func={() => {navigate("/p/admin/product/"+product.seoLink)}}/>
          <PopupConfirm title="Ürün Sil" description="Ürünü silmek istediğinizden emin misiniz?" func={() => {deleteItem(product._id)}}/>
        </Space>
      ),
    },
  ];

  return (
    <Table dataSource={productsData} columns={columns} loading={isLoading} rowKey={(product) => product._id} />
  );
};

export default ProductPage;
