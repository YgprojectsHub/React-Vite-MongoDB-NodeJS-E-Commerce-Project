/* eslint-disable react-hooks/exhaustive-deps */ 
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Spin } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { encryptData, userData } from "../../../helper/auth";
import { userUpdate } from "../../../http-requests/requests";
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isChanged, setChanged] = useState(false);
  const [initialFileList, setInitialFileList] = useState([]);

  let user = userData();

  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const { username, email, avatar } = user;

      const avatarData = [
        {
          uid: "-1",
          name: "profile-picture.png",
          status: "done",
          url: avatar,
          thumbUrl: avatar,
        },
      ];
      
      setFileList(avatarData);
      setInitialFileList(avatarData);

      form.setFieldsValue({
        username,
        email,
      });

      setLoading(false);
    }
  }, [form]);
  
  const handleUpdate = async (values) => {
    const profilePictureChanged = fileList[0]?.uid !== initialFileList[0]?.uid

    const newUserData = {email: values.email, username: values.username}

    const resData = await userUpdate(fileList[0].originFileObj, newUserData, profilePictureChanged)

    let userData = {
      ...user,
      ...newUserData
    };

    if(resData[0] == true) {
      userData.avatar = resData[1]
      userData.isEmailVerification = values.email != user.email ? false : true,

      encryptData(userData, "user");
      navigate("/p/account/")
    }
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 1) {
      fileList = [fileList[fileList.length - 1]];
    }
    setFileList(fileList);
    setChanged(true)
  };

  const handleFormChange = () => setChanged(true)

  const props = {
    beforeUpload: () => false,
    onChange: handleFileChange,
    fileList,
  };

  return (
    <Spin spinning={isLoading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        onValuesChange={handleFormChange} // Formda değişiklikleri izler
      >
        <Form.Item
          label="İsim"
          name="username"
          rules={[{ required: true, message: "Lütfen isminizi giriniz" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="İsim" />
        </Form.Item>

        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Geçerli bir e-mail giriniz",
            },
          ]}
        >
          <Input placeholder="E-mail" />
        </Form.Item>

        <Form.Item label="Profil Fotoğrafı" name="fileList">
          <Upload
            {...props}
            listType="picture"
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
            rules={[
              {
                required: true,
                message: "Lütfen bir profil fotoğrafı yükleyin.",
              },
            ]}
          >
            <Button icon={<UploadOutlined />}>Fotoğraf Yükle</Button>
          </Upload>
        </Form.Item>

        <Button
          style={{ marginTop: "5px" }}
          type="primary"
          htmlType="submit"
          disabled={!isChanged}
        >
          Güncelle
        </Button>
      </Form>
    </Spin>
  );
};

export default Profile;
