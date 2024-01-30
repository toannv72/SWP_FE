import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { LoadingOutlined } from '@ant-design/icons';
const ComUpImgOne = ({ onChange, numberImg }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
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

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const handleFileChange = ( fileList ) => {
   
    getBase64(fileList.file.originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
    console.log(fileList.file.originFileObj);
    onChange(fileList.file.originFileObj);
    // setImageUrl(filteredFileList);

  };


  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  return (
    <>
      <div className=''>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          // beforeUpload={beforeUpload}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.gif" // Chỉ cho phép chọn các tệp hình ảnh
  
        >
  
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: '100px',
                height: '100px',
                objectFit: "cover"
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
    </>
  );
};

export default ComUpImgOne;
