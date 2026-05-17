import React, { useRef } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { BACKEND_ORIGIN } from '../../config/api';
import moment from 'moment';

const WarrantyDocument = ({ order, acceptanceRecord }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=800');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Phiếu Bảo Hành - ${order?.orderCode}</title>
          <style>
            body { font-family: "Times New Roman", Times, serif; font-size: 14pt; line-height: 1.5; color: #000; padding: 40px; }
            .header-table { width: 100%; border-bottom: 2px solid #000; margin-bottom: 20px; padding-bottom: 10px; }
            .header-table td { vertical-align: top; }
            .doc-title { text-align: center; font-weight: bold; font-size: 22pt; margin: 20px 0; }
            table.items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            table.items-table th, table.items-table td { border: 1px solid #000; padding: 8px; text-align: center; }
            table.items-table th { font-weight: bold; }
            .signature-section { text-align: right; margin-top: 40px; margin-right: 50px; font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 500);
  };

  const d = order || {};
  const r = acceptanceRecord || {};
  const khachHang = d.khachHang || {};
  
  const dateObj = r.ngayLap ? moment(r.ngayLap) : moment();

  return (
    <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="primary" 
          icon={<PrinterOutlined />} 
          onClick={handlePrint}
          style={{ background: '#1677ff' }}
        >
          Xuất PDF / In Phiếu Bảo Hành
        </Button>
      </div>

      <div style={{ border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff', padding: '40px', color: '#000', fontFamily: '"Times New Roman", serif', fontSize: '16px' }} ref={printRef}>
        
        {/* Header */}
        <div style={{ position: 'relative' }}>
          <table className="header-table" style={{ width: '100%', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginTop: '10px' }}>
            <tbody>
              <tr>
                <td style={{ width: '150px' }}>
                  <img src={`${BACKEND_ORIGIN}/image/logo.jpg`} alt="Vishipel" style={{ width: '100%', maxWidth: '140px' }} />
                </td>
                <td style={{ paddingLeft: '15px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#0056b3' }}>CÔNG TY TNHH MTV THÔNG TIN ĐIỆN TỬ HÀNG HẢI VIỆT NAM</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#0056b3' }}>VIETNAM MARITIME COMMUNICATION AND ELECTRONICS LLC</div>
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>Số 2 Nguyễn Thượng Hiền, P. Minh Khai, Q. Hồng Bàng, TP. Hải Phòng</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>Điện thoại: (0225) 3746464 * Fax: (0225) 3747062 * Website: www.vishipel.com.vn</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>
          PHIẾU BẢO HÀNH
        </div>
        
        <div style={{ textAlign: 'right', fontStyle: 'italic', marginBottom: '15px', marginRight: '50px' }}>
          Ngày {dateObj.format('DD')} tháng {dateObj.format('MM')} năm {dateObj.format('YYYY')}
        </div>

        <div style={{ marginBottom: '5px' }}>
          Tên khách hàng: <span style={{ fontWeight: 'bold', borderBottom: '1px dotted #000' }}>{khachHang.tenKH || '..................................................................'}</span>
        </div>
        <div style={{ marginBottom: '15px' }}>
          Địa chỉ: <span style={{ borderBottom: '1px dotted #000' }}>{d.shippingAddress || khachHang.diaChi || '..................................................................'}</span>
        </div>
        
        <div>Danh mục thiết bị bảo hành như sau:</div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', marginBottom: '20px' }} border="1">
          <thead>
            <tr style={{ textAlign: 'center' }}>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Stt</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Tên thiết bị</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Serial No/IMEI</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Số lượng<br/>(bộ)</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Thời gian<br/>bảo hành</th>
            </tr>
          </thead>
          <tbody>
            {d.chiTietDonHangs?.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '8px', border: '1px solid #000' }}>{item.thietBi?.tenThietBi}</td>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{item.thietBi?.maThietBi}</td>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{item.soLuong}</td>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>12 Tháng</td>
              </tr>
            )) || (
              <tr>
                <td colSpan="5" style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>Không có thiết bị</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ textAlign: 'justify', lineHeight: '1.6' }}>
          <div>1. Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam (VISHIPEL) đã hoàn thành bàn giao cho <b>{khachHang.tenKH}</b> toàn bộ các thiết bị với số lượng và chủng loại đúng như trên, bảo đảm các yêu cầu kỹ thuật;</div>
          <div>2. Toàn bộ các máy móc, thiết bị bàn giao mới 100% và tình trạng hoạt động tốt;</div>
          <div>3. Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam (VISHIPEL) không chịu trách nhiệm bảo hành thiết bị trong các trường hợp sau:
            <div style={{ paddingLeft: '30px' }}>- Thiết bị hết hạn bảo hành;</div>
            <div style={{ paddingLeft: '30px' }}>- Sản phẩm bị cháy nổ hay hư hỏng do tác động cơ học, biến dạng, rơi, vỡ, va đập, bị xước, bị hỏng do ngập nước, thiên tai, hỏa hoạn;</div>
            <div style={{ paddingLeft: '30px' }}>- Thiết bị bị rách tem bảo hành, có dấu hiệu cạy mở thiết bị;</div>
            <div style={{ paddingLeft: '30px' }}>- Do người sử dụng sai điện áp quy định, bảo quản không tốt.</div>
          </div>
          <div>4. Thời gian bảo hành: 12 tháng được tính từ ngày ký biên bản bàn giao thiết bị giữa hai bên.</div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '40px', marginRight: '30px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>CÔNG TY TNHH MTV THÔNG TIN</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>ĐIỆN TỬ HÀNG HẢI VIỆT NAM</div>
        </div>

      </div>
    </div>
  );
};

export default WarrantyDocument;
