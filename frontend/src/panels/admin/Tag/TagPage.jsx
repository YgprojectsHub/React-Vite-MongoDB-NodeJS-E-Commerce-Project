import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localDate } from "../../../helper/formatLocalDate";
import { tagDelete, tags } from "../../../http-requests/requests";
import PopupConfirm from "../../../helper/PopupConfirm";
import { Space, Table } from "antd";

const TagPage = () => {
  const [tagsData, setTagsData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getTags = async () => {
      const { response } = await tags()
      setTagsData(response);
      setLoading(false)
    };

    getTags();
  }, []);

  const deleteItem = (id) => {
    const res = tagDelete(id)
    if(res){
      const newTags = tagsData.filter(tag => tag._id !== id)
      setTagsData(newTags)
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
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
      render: (_, tag) => (
        <Space>
          <PopupConfirm title="Etiketi Güncelle" description="Etiketi güncellemek istediğinizden emin misiniz?" func={() => {navigate("/p/admin/tag/"+tag.seoLink)}}/>
          <PopupConfirm title="Etiketi Sil" description="Etiketi silmek istediğinizden emin misiniz?" func={() => {deleteItem(tag._id)}}/>
        </Space>
      ),
    },
  ];

  return (
    <Table dataSource={tagsData} columns={columns} loading={isLoading} rowKey={(tag) => tag._id} />
  )
};

export default TagPage;
