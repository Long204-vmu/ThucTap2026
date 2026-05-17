import React, { useRef } from 'react';
import { Button, Space, message, Typography, Divider, Row, Col, Table } from 'antd';
import { PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { BACKEND_ORIGIN } from '../../config/api';
import apiClient from '../../services/apiClient';
import moment from 'moment';

const { Title, Text } = Typography;

const AcceptanceDocument = ({ acceptanceRecord, order, onConfirm, isCustomerView }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=800');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Biên bản nghiệm thu, bàn giao - ${order?.orderCode}</title>
          <style>
            body { font-family: "Times New Roman", Times, serif; font-size: 14pt; line-height: 1.5; color: #000; padding: 40px; }
            .header-table { width: 100%; border-bottom: 2px solid #000; margin-bottom: 20px; padding-bottom: 10px; }
            .header-table td { vertical-align: top; }
            .logo { width: 120px; }
            .company-info { text-align: left; padding-left: 20px; }
            .company-name { font-weight: bold; font-size: 14pt; color: #0056b3; }
            .company-name-en { font-weight: bold; font-size: 12pt; color: #0056b3; }
            .company-contact { font-size: 11pt; color: #555; }
            .doc-title { text-align: center; font-weight: bold; font-size: 18pt; margin: 20px 0; }
            .info-row { display: flex; margin-bottom: 5px; }
            .info-label { width: 250px; }
            .info-value { flex: 1; border-bottom: 1px dotted #000; }
            .section-title { font-weight: bold; font-style: italic; margin-top: 15px; margin-bottom: 5px; }
            table.items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            table.items-table th, table.items-table td { border: 1px solid #000; padding: 8px; text-align: center; }
            table.items-table th { background-color: #f2f2f2; font-weight: bold; }
            .signature-section { width: 100%; margin-top: 40px; display: table; }
            .signature-box { display: table-cell; width: 50%; text-align: center; font-weight: bold; }
            .signature-space { height: 100px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-left: 20px; }
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

  const renderPrintableForm = () => {
    const r = acceptanceRecord || {};
    const d = order || {};
    
    // Parse dates
    const dateObj = r.ngayLap ? moment(r.ngayLap) : moment();
    const startDate = r.thoiGianBatDau ? moment(r.thoiGianBatDau) : null;
    const endDate = r.thoiGianKetThuc ? moment(r.thoiGianKetThuc) : null;

    return (
      <div ref={printRef} style={{ background: '#fff', padding: '20px', color: '#000', fontFamily: '"Times New Roman", serif' }}>
        
        {/* Header */}
        <table className="header-table" style={{ width: '100%', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
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

        {/* Title */}
        <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>
          BIÊN BẢN NGHIỆM THU, BÀN GIAO
        </div>

        <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <div style={{ fontStyle: 'italic' }}>
            Hôm nay, ngày {dateObj.format('DD')} tháng {dateObj.format('MM')} năm {dateObj.format('YYYY')},
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ width: '50px' }}>Tại:</span> 
            <span style={{ flex: 1, borderBottom: '1px dotted #000' }}>{r.diaDeim || d.shippingAddress || '....................................................................................................'}</span>
          </div>
          <div>Chúng tôi gồm:</div>
          
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
            Đại diện bên mua (bên A): <span style={{ fontWeight: 'normal', borderBottom: '1px dotted #000' }}>{d.khachHang?.tenKH || '......................................................'}</span>
          </div>
          <div style={{ paddingLeft: '40px' }}>
            Đại diện là: <span style={{ borderBottom: '1px dotted #000' }}>{r.daiDienBenA || '........................................................................'}</span>
          </div>
          <div style={{ paddingLeft: '40px' }}>
            Chức vụ: <span style={{ borderBottom: '1px dotted #000' }}>{r.chucVuBenA || '..............................................................................'}</span>
          </div>

          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
            Bên cung cấp (bên B): <span style={{ fontWeight: 'normal', borderBottom: '1px dotted #000' }}>CÔNG TY TNHH MTV THÔNG TIN ĐIỆN TỬ HÀNG HẢI VN</span>
          </div>
          <div style={{ paddingLeft: '40px' }}>
            Đại diện là: <span style={{ borderBottom: '1px dotted #000' }}>{r.daiDienBenB || r.nguoiLap?.hoTen || '........................................................................'}</span>
          </div>
          <div style={{ paddingLeft: '40px' }}>
            Chức vụ: <span style={{ borderBottom: '1px dotted #000' }}>{r.chucVuBenB || 'Kỹ thuật viên...........................................................'}</span>
          </div>

          <div style={{ fontStyle: 'italic', fontWeight: 'bold', marginTop: '15px' }}>
            Nội dung nghiệm thu, bàn giao gồm các hạng mục:
          </div>
          <div style={{ fontStyle: 'italic' }}>
            1. Danh mục, số lượng thiết bị nghiệm thu, bàn giao
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', marginBottom: '15px' }} border="1">
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                <th style={{ padding: '8px', border: '1px solid #000' }}>STT</th>
                <th style={{ padding: '8px', border: '1px solid #000' }}>Hạng mục</th>
                <th style={{ padding: '8px', border: '1px solid #000' }}>Số SN/ ICC-ID</th>
                <th style={{ padding: '8px', border: '1px solid #000' }}>Đơn vị</th>
                <th style={{ padding: '8px', border: '1px solid #000' }}>Số lượng</th>
                <th style={{ padding: '8px', border: '1px solid #000' }}>Xuất xứ</th>
              </tr>
            </thead>
            <tbody>
              {d.chiTietDonHangs?.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: '8px', border: '1px solid #000' }}>{item.thietBi?.tenThietBi}</td>
                  <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{item.thietBi?.maThietBi}</td>
                  <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>Cái/Bộ</td>
                  <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{item.soLuong}</td>
                  <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{item.thietBi?.xuatXu || 'VN'}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="6" style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>Không có thiết bị</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ fontStyle: 'italic' }}>2. Tình trạng thiết bị khi nghiệm thu, bàn giao</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingLeft: '20px', marginTop: '5px' }}>
            <div>2.1 Đúng chủng loại</div>
            <div>2.4 Đúng nhà sản xuất</div>
            <div>2.2 Đúng quy cách</div>
            <div>2.5 Tình trạng hoạt động: {r.danhGiaChung || 'Tốt'}</div>
            <div>2.3 Đúng tính năng kỹ thuật</div>
            <div>2.6 Thiết bị mới 100%</div>
          </div>

          <div style={{ fontWeight: 'bold', marginTop: '15px' }}>3. Nội dung dịch vụ lắp đặt</div>
          <div style={{ borderBottom: '1px dotted #000', minHeight: '30px' }}>
            {r.noiDungDichVu || r.ghiChuKiemTra || 'Đã thi công lắp đặt, đấu nối và cấu hình hoàn thiện hệ thống.'}
          </div>

          <div style={{ fontWeight: 'bold', marginTop: '15px' }}>4. Thời gian thực hiện lắp đặt, nghiệm thu:</div>
          <div>
            Bắt đầu từ, <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{startDate ? startDate.format('HH') : '....'}</span> 
            giờ, ngày <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{startDate ? startDate.format('DD') : '....'}</span> 
            tháng <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{startDate ? startDate.format('MM') : '....'}</span> 
            năm <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{startDate ? startDate.format('YYYY') : '........'}</span>
          </div>
          <div>
            Kết thúc lúc, <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{endDate ? endDate.format('HH') : '....'}</span> 
            giờ, ngày <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{endDate ? endDate.format('DD') : '....'}</span> 
            tháng <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{endDate ? endDate.format('MM') : '....'}</span> 
            năm <span style={{ borderBottom: '1px dotted #000', padding: '0 10px' }}>{endDate ? endDate.format('YYYY') : '........'}</span>
          </div>

          <div style={{ marginTop: '15px', textIndent: '30px' }}>
            Biên bản này được lập thành 04 (bốn) bản bằng tiếng Việt, có giá trị pháp lý như nhau. Mỗi bên giữ 02 (hai) bản. Sau khi đọc lại, hai bên nhất trí các nội dung nêu trên đây và cùng ký vào Biên bản này.
          </div>

          <table style={{ width: '100%', marginTop: '30px', textAlign: 'center' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', fontWeight: 'bold' }}>ĐẠI DIỆN BÊN CUNG CẤP</td>
                <td style={{ width: '50%', fontWeight: 'bold' }}>ĐẠI DIỆN BÊN MUA</td>
              </tr>
              <tr>
                <td style={{ height: '100px', verticalAlign: 'bottom', color: '#0056b3' }}>
                  <i>(Đã ký bởi {r.nguoiLap?.hoTen || 'Kỹ thuật viên'})</i>
                </td>
                <td style={{ height: '100px', verticalAlign: 'bottom', color: r.customerConfirmed ? '#52c41a' : '#faad14' }}>
                  {r.customerConfirmed ? <i>(Khách hàng đã xác nhận điện tử)</i> : <i>(Chờ khách hàng ký/xác nhận)</i>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button 
          type="primary" 
          icon={<PrinterOutlined />} 
          onClick={handlePrint}
          style={{ background: '#1677ff' }}
        >
          Xuất PDF / In Biên Bản
        </Button>
        
        {/* Nếu khách hàng xem và chưa xác nhận, hiển thị nút Xác nhận */}
        {isCustomerView && !acceptanceRecord?.customerConfirmed && (
          <Button 
            type="primary" 
            style={{ background: '#52c41a' }} 
            icon={<CheckCircleOutlined />} 
            onClick={onConfirm}
          >
            Xác nhận Biên Bản (Khách Hàng)
          </Button>
        )}
      </div>

      <div style={{ border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {renderPrintableForm()}
      </div>
    </div>
  );
};

export default AcceptanceDocument;
