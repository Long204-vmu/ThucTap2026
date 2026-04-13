import React from 'react';
import { Form, Input, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DynamicSpecsSection = ({
  title = 'Thông số linh hoạt',
  description = '',
  addButtonText = 'Thêm thông số',
  labelPlaceholder = 'Tên thông số',
  valuePlaceholder = 'Giá trị',
  labelRequiredMessage = 'Nhập tên thông số',
  valueRequiredMessage = 'Nhập giá trị',
}) => {
  return (
    <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0, color: '#1677ff' }}>{title}</Title>
      </div>
      {description ? (
        <div style={{ color: '#8c8c8c', marginBottom: 24, fontSize: 13 }}>
          {description}
        </div>
      ) : null}

      <Form.List name="dynamicSpecs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 16 }} align="start">
                <Form.Item
                  {...restField}
                  name={[name, 'label']}
                  rules={[{ required: true, message: labelRequiredMessage }]}
                  style={{ margin: 0, width: 250 }}
                >
                  <Input placeholder={labelPlaceholder} size="large" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'value']}
                  rules={[{ required: true, message: valueRequiredMessage }]}
                  style={{ margin: 0, width: 450 }}
                >
                  <Input placeholder={valuePlaceholder} size="large" />
                </Form.Item>

                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined style={{ fontSize: 20 }} />}
                  onClick={() => remove(name)}
                  style={{ marginTop: 4 }}
                />
              </Space>
            ))}

            <Form.Item style={{ marginTop: 16 }}>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} size="large">
                {addButtonText}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default DynamicSpecsSection;
