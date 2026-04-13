import React, { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { BACKEND_ORIGIN } from '../../config/api';
import { uploadImage } from '../../services/uploadService';

const { Dragger } = Upload;

const ImageUploader = ({ initialImages = [], onImagesChange, hint = 'Chỉ chấp nhận file .jpg, .png, .webp (tối đa 5MB)' }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const mapped = initialImages.slice(0, 1).map((imgPath, index) => ({
      uid: `existing-${index}`,
      name: imgPath.split('/').pop() || `image-${index + 1}.jpg`,
      status: 'done',
      url: `${BACKEND_ORIGIN}${imgPath}`,
    }));
    setFileList(mapped);
  }, [initialImages]);

  const beforeUpload = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.');
      return Upload.LIST_IGNORE;
    }

    if (file.size / 1024 / 1024 >= 5) {
      message.error('Kích thước ảnh phải nhỏ hơn 5MB.');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const imageUrl = await uploadImage(file);
      onImagesChange([imageUrl]);
      setFileList([
        {
          uid: file.uid || `${Date.now()}`,
          name: file.name,
          status: 'done',
          url: `${BACKEND_ORIGIN}${imageUrl}`,
        },
      ]);
      message.success(`Tải ảnh ${file.name} lên thành công.`);
      onSuccess?.({ url: imageUrl });
    } catch (err) {
      message.error(`Tải ảnh ${file.name} thất bại.`);
      onError?.(err);
    }
  };

  return (
    <Dragger
      name="file"
      multiple={false}
      customRequest={handleUpload}
      beforeUpload={beforeUpload}
      fileList={fileList}
      listType="picture"
      onRemove={() => {
        onImagesChange([]);
        setFileList([]);
      }}
    >
      <p className="ant-upload-drag-icon"><UploadOutlined style={{ color: '#0057FF' }} /></p>
      <p className="ant-upload-text">Kéo thả để tải ảnh lên</p>
      <p className="ant-upload-hint">{hint}</p>
    </Dragger>
  );
};

export default ImageUploader;
