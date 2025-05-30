import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import i18n from 'i18next';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from 'qrcode.react';  // Correct import
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchOrderById } from '../../Api/fetchingData/FetchOrderById';
import { FileText } from 'lucide-react';

import './ViewOrderDetails.css';

const ViewOrderDetails = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { id } = useParams();
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id),
  })

  

  const invoiceRef = useRef();

  const exportInvoice = () => {
    const invoiceElement = invoiceRef.current;

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 80; // عرض ورقة thermal
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${order.id}.pdf`);
    });
  };


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading order details</div>;
  
  return (
    <div className="content" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={setIsOpen} />
      <div className={`main-content ${isOpen ? 'shifted' : 'inshiftd'}`}>
        <Navbar pagePath={t('order_information')} />
        <div className="actions">
          <button className="btn btn-primary" onClick={exportInvoice}>
            <FileText className="icon" size={30} />
             <span>Export</span>
          </button>
          </div>
        <div className="container2">

          <div className="order-details">
            <p><strong>{t('order_id')}:</strong> {order?.order_number}</p>
            <p><strong>{t('name')}:</strong> {order?.name}</p>
            <p><strong>{t('phone_number')}:</strong> {order?.phonenumber}</p>
            <p><strong>{t('order_date')}:</strong> {order?.created_at}</p>
            <p><strong>{t('street')}:</strong> {order?.street}</p>
            <p><strong>{t('house_number')}:</strong> {order?.housenumber}</p>
            <h2>{t('order_items')}</h2>
            <div className="items">
              {order?.items?.map((item, i) => (
                <div key={i} className="item">
                  <img src={`http://localhost:8000/storage/${item.image_path}`} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.total_price/item.quantity} {t('dirham')} x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="total">{t('total_price')}: {order.total_order} {t('dirham')}</h3>
          </div>

          <div className="invoice" ref={invoiceRef}>
            <div style={{ textAlign: 'center' }}>
                   <h2>Gusto Fast Food</h2>
                   <p>TEL : 0640606282</p>
            </div>
            <div className="invoice-info">
              <p><strong>Order No:</strong> #{order.order_number}</p>
              <p><strong>Order Time:</strong> {order.created_at}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity || 1}</td>
                    <td>{item.total_price/item.quantity}</td>
                    <td>{item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="grand-total">TOTAL TTC: {order.total_order} {t('dirham')}</h3>
            <div className="invoice-footer QrCode">
              {/* Only this QR Code will be displayed */}
              <hr className='line' />
              <p>Merci pour votre achat</p>
              <QRCodeCanvas value="https://www.hespress.com/" size={100} />
              <p>Scan to visit our website</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
