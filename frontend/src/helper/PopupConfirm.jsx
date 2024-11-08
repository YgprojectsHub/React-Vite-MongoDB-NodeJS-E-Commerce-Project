import React from "react";
import { Button, Popconfirm } from "antd";

const PopupConfirm = ({ title, description, func }) => {

  const lastWord = getLastWord(title)

  return (
    <Popconfirm
      title={title}
      description={description}
      okText="Evet"
      cancelText="Hayır"
      onConfirm={func}
    >
      <Button type="primary" danger={lastWord=="Sil" || lastWord=="Et"}>
        {lastWord == "Et" ? "İptal Et" : lastWord}
      </Button>
    </Popconfirm>
  );
};

const getLastWord = (sentence) => {
  const words = sentence.trim().split(" ")
  return words[words.length - 1]
}

export default PopupConfirm;
