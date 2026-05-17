import React, { useRef } from 'react';
import { Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { BACKEND_ORIGIN } from '../../config/api';

const InvoiceDocument = ({ order }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=900,height=800');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Hoá Đơn Bán Hàng - ${order?.orderCode}</title>
          <style>
            body { font-family: "Times New Roman", Times, serif; font-size: 14pt; line-height: 1.5; color: #000; padding: 40px; }
            .doc-title { text-align: center; font-weight: bold; font-size: 20pt; margin-bottom: 20px; }
            .line-container { display: flex; margin-bottom: 5px; }
            .dotted-line { flex: 1; border-bottom: 1px dotted #000; margin-left: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { font-weight: bold; }
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
  const khachHang = d.khachHang || {};
  const total = d.tongGiaTri || 0;
  const vat = total * 0.1;
  const finalTotal = total + vat;

  // Simple number to words in Vietnamese
  const numberToWords = (num) => {
    if (!num) return "Không đồng";
    // This is a simplified placeholder. A real implementation would parse the number properly.
    return num.toLocaleString('vi-VN') + " đồng"; 
  };

  return (
    <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="primary" 
          icon={<PrinterOutlined />} 
          onClick={handlePrint}
          style={{ background: '#1677ff' }}
        >
          Xuất PDF / In Hóa Đơn
        </Button>
      </div>

      <div style={{ border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: '#fff', padding: '40px', color: '#000', fontFamily: '"Times New Roman", serif', fontSize: '16px' }} ref={printRef}>
        
        {/* Header */}
        <table style={{ width: '100%', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
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

        <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          HOÁ ĐƠN BÁN HÀNG
        </div>

        <div style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ width: '150px' }}>Kính gửi:</span>
            <span style={{ flex: 1, borderBottom: '1px dotted #000', fontWeight: 'bold' }}>{khachHang.tenKH || d.receiverName}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ width: '150px' }}>Địa chỉ:</span>
            <span style={{ flex: 1, borderBottom: '1px dotted #000' }}>{d.shippingAddress || khachHang.diaChi || '...................................................'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ width: '150px' }}>Mã số thuế:</span>
            <span style={{ flex: 1, borderBottom: '1px dotted #000' }}>{khachHang.mst || '...................................................'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ width: '150px' }}>Số tài khoản:</span>
            <span style={{ flex: 1, borderBottom: '1px dotted #000' }}>{khachHang.soTaiKhoan || '...................................................'}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ width: '150px' }}>Nội dung:</span>
            <span style={{ flex: 1, borderBottom: '1px dotted #000' }}>Thanh toán đơn hàng {d.orderCode || `ĐH-${d.maDonHang}`}</span>
          </div>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <span style={{ width: '150px' }}>Hình thức thanh toán:</span>
            <span style={{ flex: 1, borderBottom: '1px dotted #000' }}>{d.paymentMethod || 'Chuyển khoản'}</span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }} border="1">
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #000' }}>STT</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Tên hàng hóa, dịch vụ</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Đơn vị tính</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Số lượng</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Đơn giá<br/>(VND)</th>
              <th style={{ padding: '8px', border: '1px solid #000' }}>Thành tiền<br/>(VND)</th>
            </tr>
          </thead>
          <tbody>
            {d.chiTietDonHangs?.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ padding: '8px', border: '1px solid #000' }}>{item.thietBi?.tenThietBi}</td>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>Bộ</td>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'center' }}>{item.soLuong}</td>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'right' }}>{item.donGia.toLocaleString('vi-VN')}</td>
                <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'right' }}>{(item.soLuong * item.donGia).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" style={{ padding: '8px', border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>Cộng tiền hàng:</td>
              <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>{total.toLocaleString('vi-VN')}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ padding: '8px', border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>Tiền thuế GTGT (10%):</td>
              <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>{vat.toLocaleString('vi-VN')}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ padding: '8px', border: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>Tổng cộng tiền thanh toán:</td>
              <td style={{ padding: '8px', border: '1px solid #000', textAlign: 'right', fontWeight: 'bold', color: '#cf1322' }}>{finalTotal.toLocaleString('vi-VN')}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '15px' }}>
          <span style={{ fontWeight: 'bold' }}>Số tiền viết bằng chữ: </span> 
          <span style={{ fontStyle: 'italic' }}>{numberToWords(finalTotal)}</span>
        </div>
        
        <table style={{ width: '100%', marginTop: '40px', textAlign: 'center' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', fontWeight: 'bold' }}>Người mua hàng<br/><span style={{ fontWeight: 'normal', fontSize: '14px', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</span></td>
              <td style={{ width: '50%', fontWeight: 'bold' }}>Người bán hàng<br/><span style={{ fontWeight: 'normal', fontSize: '14px', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</span></td>
            </tr>
            <tr>
              <td style={{ height: '100px', verticalAlign: 'bottom', color: '#52c41a' }}>
                <i>(Đã thanh toán)</i>
              </td>
              <td style={{ height: '100px', verticalAlign: 'bottom', color: '#0056b3' }}>
                <i>(Đã phát hành điện tử)</i>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default InvoiceDocument;
