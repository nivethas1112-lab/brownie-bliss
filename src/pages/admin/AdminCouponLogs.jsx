import React, { useState } from 'react'
import { Search, Calendar } from 'lucide-react'
import './AdminCouponLogs.css'

const AdminCouponLogs = () => {
  const [logs, setLogs] = useState([
    { id: 1, date: '2026-04-26T14:30:00Z', orderId: '#ORD-9821', customerName: 'Alice Johnson', couponCode: 'WELCOME10', discountAmount: 12.50, orderTotal: 112.50 },
    { id: 2, date: '2026-04-26T11:15:00Z', orderId: '#ORD-9820', customerName: 'Bob Smith', couponCode: 'WELCOME10', discountAmount: 8.00, orderTotal: 72.00 },
    { id: 3, date: '2026-04-25T16:45:00Z', orderId: '#ORD-9815', customerName: 'Charlie Brown', couponCode: 'BROWNIE20', discountAmount: 20.00, orderTotal: 80.00 },
    { id: 4, date: '2026-04-24T09:20:00Z', orderId: '#ORD-9810', customerName: 'Diana Prince', couponCode: 'BROWNIE20', discountAmount: 35.00, orderTotal: 140.00 },
    { id: 5, date: '2026-04-23T18:05:00Z', orderId: '#ORD-9805', customerName: 'Eve Davis', couponCode: 'FREESHIP', discountAmount: 15.00, orderTotal: 150.00 },
    { id: 6, date: '2026-04-23T10:10:00Z', orderId: '#ORD-9801', customerName: 'Frank Miller', couponCode: 'WELCOME10', discountAmount: 5.50, orderTotal: 49.50 },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = logs.filter(log => 
    log.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  return (
    <div className="admin-coupon-logs">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Coupon Usage Log</h1>
      </div>

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by coupon code, order ID, or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Coupon Code</th>
              <th>Discount Amount</th>
              <th>Order Total (After Discount)</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{formatDateTime(log.date)}</td>
                <td>
                  <span className="log-order-id">{log.orderId}</span>
                </td>
                <td>{log.customerName}</td>
                <td>
                  <span className="log-coupon-code">{log.couponCode}</span>
                </td>
                <td>
                  <span className="log-discount-amount">-₹{log.discountAmount.toFixed(2)}</span>
                </td>
                <td>₹{log.orderTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No logs found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCouponLogs
