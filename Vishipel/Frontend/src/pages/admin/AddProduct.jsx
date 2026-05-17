import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Row, Col, message, Typography, Divider, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAllCategories } from '../../services/categoryService';
import { createProduct, getProductById, updateProduct } from '../../services/productService';
import ImageUploader from '../../components/common/ImageUploader';
import DynamicSpecsSection from '../../components/common/DynamicSpecsSection';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AddProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id;
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [categories, setCategories] = useState([]);

  // 1. KHỞI TẠO DỮ LIỆU
  useEffect(() => {
    const initData = async () => {
      setFetchingData(true);
      try {
        const catRes = await getAllCategories();
        setCategories(catRes.data);

        if (isEditMode) {
          const prodRes = await getProductById(id);
          const product = prodRes.data;
          
          // Map backend fields to form fields
          const formData = {
            name: product.tenThietBi,
            model: product.model,
            brand: product.hangSanXuat,
            origin: product.xuatXu,
            warranty: product.baoHanhThang,
            shortDescription: product.moTaNgan,
            description: product.moTaChiTiet,
            categoryId: product.maLoai,
            status: product.trangThai === 1 ? 'Còn hàng' : 'Ngừng kinh doanh',
            dynamicSpecs: product.thongSoKyThuatJson ? JSON.parse(product.thongSoKyThuatJson) : []
          };

          const existingImages = product.hinhAnhJson ? JSON.parse(product.hinhAnhJson) : [];
          setUploadedImages(existingImages);
          form.setFieldsValue(formData);
        }
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu khởi tạo");
      } finally {
        setFetchingData(false);
      }
    };
    initData();
  }, [id, form, isEditMode]);

  // 2. XỬ LÝ KHI BẤM LƯU
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const rawSpecs = values.dynamicSpecs || [];
      const validSpecs = rawSpecs.filter(item => item && item.label && item.value);

      // Map form fields back to backend fields
      const submitData = {
        ...(isEditMode ? { maThietBi: parseInt(id) } : {}), 
        tenThietBi: values.name,
        model: values.model,
        hangSanXuat: values.brand,
        maLoai: values.categoryId,
        trangThai: values.status === 'Còn hàng' ? 1 : 0,
        moTaNgan: values.shortDescription,
        moTaChiTiet: values.description,
        xuatXu: values.origin,
        baoHanhThang: parseInt(values.warranty) || 12,
        thongSoKyThuatJson: JSON.stringify(validSpecs),
        hinhAnhJson: JSON.stringify(uploadedImages) 
      };

      if (isEditMode) {
        await updateProduct(id, submitData);
        message.success('Cập nhật thiết bị thành công!');
      } else {
        await createProduct(submitData);
        message.success('Thêm mới thiết bị thành công!');
      }
      
      navigate('/admin/products'); 
    } catch (err) {
      console.error("Lỗi khi lưu:", err.response?.data);
      message.error(err.response?.data?.title || 'Có lỗi xảy ra khi lưu thiết bị.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) return <div style={{ textAlign: 'center', marginTop: 150 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Link to="/admin/products"><Button icon={<ArrowLeftOutlined />} shape="circle" /></Link>
          <Title level={3} style={{ margin: 0, color: '#001529' }}>
            {isEditMode ? 'Cập nhật Thiết bị' : 'Thêm Mới Thiết bị'}
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Title level={5} style={{ marginBottom: 20 }}>Thông tin cơ bản</Title>
                <Form.Item name="name" label="Tên thiết bị" rules={[{ required: true }]}><Input size="large" /></Form.Item>
                <Row gutter={16}>
                  <Col span={12}><Form.Item name="model" label="Mã Model / SKU"><Input size="large" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="brand" label="Thương hiệu (Hãng sản xuất)"><Input size="large" /></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}><Form.Item name="origin" label="Xuất xứ"><Input size="large" /></Form.Item></Col>
                  <Col span={12}><Form.Item name="warranty" label="Bảo hành (tháng)"><Input type="number" size="large" /></Form.Item></Col>
                </Row>
                <Form.Item name="shortDescription" label="Mô tả ngắn"><TextArea rows={2} /></Form.Item>
                <Form.Item name="description" label="Bài viết chi tiết"><TextArea rows={6} /></Form.Item>
              </Card>

              <DynamicSpecsSection
                title="Thông số kỹ thuật linh hoạt"
                description='Bạn có thể chủ động thêm các cặp thông số (Ví dụ: Trái điền "Tần số", Phải điền "9410 MHz").'
                addButtonText="Thêm thông số kỹ thuật"
                labelPlaceholder="Tên thông số (VD: Tần số)"
                valuePlaceholder="Giá trị (VD: 9410 MHz)"
              />
            </Col>

            <Col xs={24} lg={8}>
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 20 }}>Phân loại & Trạng thái</Title>
                <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
                  <Select 
                    size="large" 
                    placeholder="Gõ để tìm hoặc chọn danh mục..."
                    showSearch 
                    optionFilterProp="children" 
                    filterOption={(input, option) =>
                      (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    listHeight={250} 
                  >
                    {categories.map(cat => (
                      <Select.Option key={cat.maLoai} value={cat.maLoai}>{cat.tenLoai}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="status" label="Trạng thái hiện tại" initialValue="Còn hàng" rules={[{ required: true }]}>
                  <Select size="large">
                    <Select.Option value="Còn hàng">✅ Còn hàng</Select.Option>
                    <Select.Option value="Ngừng kinh doanh">⛔ Ngừng kinh doanh</Select.Option>
                  </Select>
                </Form.Item>
              </Card>

              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
               <Title level={5} style={{ marginBottom: 20 }}>Hình ảnh sản phẩm</Title>
                <Form.Item>
                  <ImageUploader
                    initialImages={uploadedImages}
                    onImagesChange={setUploadedImages}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Divider />
          <div style={{ textAlign: 'right' }}>
            <Link to="/admin/products"><Button size="large" style={{ marginRight: 16 }}>Hủy bỏ</Button></Link>
            <Button type="primary" size="large" htmlType="submit" icon={<SaveOutlined />} loading={loading} style={{ background: '#0057FF', borderRadius: 8 }}>
              {isEditMode ? 'Lưu Thay Đổi' : 'Tạo Thiết Bị Mới'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
