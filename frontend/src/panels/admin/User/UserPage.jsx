import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { users, userDelete } from "../../../http-requests/requests";
import PopupConfirm from "../../../helper/PopupConfirm";
import { localDate } from "../../../helper/formatLocalDate";

const UserPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const data = await users()
      setUsersData(data.response);
      setLoading(false)
    };
    getUsers();
  }, []);

  const deleteUser = (email) => {
    const res = userDelete(email)
    if(res){
      const newUsers = usersData.filter(user => user.email !== email)
      setUsersData(newUsers)
    }
  }

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (imgSrc) => (<img src={imgSrc} alt="Avatar" style={{width: "50px", height: "50px", borderRadius: "50%"}}/>)
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin) => <h5>{localDate(lastLogin)}</h5>,
    },
    {
      title: "Register Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => <h5>{localDate(createdAt)}</h5>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, user) => (
        <div>
          <PopupConfirm title="Kullanıcıyı Sil" description="Kullanıcıyı silmek istediğinizden emin misiniz?" func={() => {deleteUser(user._id)}}/>
          {/* <PopupConfirm title="Kullanıcıyı Görüntüle" description="Kullanıcıyı görüntülemek istediğinizden emin misiniz?" func={() => {lastFunc(user._id)}}/> */}
        </div>
      ),
    },
  ];

  return (
    <Table dataSource={usersData} columns={columns} loading={isLoading} rowKey={(user) => user._id} />
  );
};

export default UserPage;
