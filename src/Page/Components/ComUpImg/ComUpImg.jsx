import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
const ComUpImg = ({ onChange, numberImg }) => {
  const [fileList, setFileList] = useState([]);
  const maxImages = numberImg || 5;
  const isImageFile = (file) => {
    const acceptedFormats = ['.jpeg', '.jpg', '.png', '.gif'];
    const fileExtension = file.name.toLowerCase();
  
    if (!acceptedFormats.some(format => fileExtension.endsWith(format))) {
      message.error('Chỉ cho phép chọn các tệp hình ảnh.');
      return false; // Ngăn tải lên nếu không phải là hình ảnh
    }
  
    return true;
  };
  
  const handleFileChange = ({ fileList }) => {
    const filteredFileList = fileList.filter((file) => isImageFile(file));
    if (filteredFileList.length > maxImages) {
      message.error(`Chỉ được chọn tối đa ${maxImages} ảnh.`);
      const firstFiveImages = filteredFileList.slice(0, maxImages);
      setFileList(firstFiveImages);
      onChange(firstFiveImages);
    } else {
      setFileList(filteredFileList);
      onChange(filteredFileList);
    }
  };
  return (
    <>
      <Upload
        fileList={fileList}
        listType="picture-card"
        onChange={handleFileChange}
        beforeUpload={() => false} // Để tránh tải lên tự động
        accept=".jpg,.jpeg,.png,.gif" // Chỉ cho phép chọn các tệp hình ảnh
        multiple={true} // Cho phép chọn nhiều tệp
      >
        <PlusOutlined />
      </Upload>
    </>
  );
};

export default ComUpImg;
