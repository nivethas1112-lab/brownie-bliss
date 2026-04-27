import React, { useState } from 'react'
import { Search, Download, FileText, CreditCard } from 'lucide-react'
import './AdminTransactions.css'

const AdminTransactions = () => {
  const [transactions] = useState([
    { id: 'TXN-9821849', orderId: '#ORD-9821', date: '2026-04-26T14:30:00Z', amount: 112.50, method: 'Credit Card', methodType: 'card', last4: '4242', status: 'completed' },
    { id: 'TXN-9821848', orderId: '#ORD-9820', date: '2026-04-26T11:15:00Z', amount: 72.00, method: 'PayPal', methodType: 'paypal', last4: 'N/A', status: 'completed' },
    { id: 'TXN-9821847', orderId: '#ORD-9819', date: '2026-04-26T09:45:00Z', amount: 25.00, method: 'Apple Pay', methodType: 'wallet', last4: 'N/A', status: 'completed' },
    { id: 'TXN-9821846', orderId: '#ORD-9818', date: '2026-04-25T18:20:00Z', amount: 45.00, method: 'Credit Card', methodType: 'card', last4: '1111', status: 'failed' },
    { id: 'TXN-9821845', orderId: '#ORD-9817', date: '2026-04-25T16:05:00Z', amount: 180.00, method: 'Credit Card', methodType: 'card', last4: '9876', status: 'refunded' },
    { id: 'TXN-9821844', orderId: '#ORD-9816', date: '2026-04-25T14:10:00Z', amount: 55.00, method: 'Google Pay', methodType: 'wallet', last4: 'N/A', status: 'completed' },
    { id: 'TXN-9821843', orderId: '#ORD-9815', date: '2026-04-25T11:30:00Z', amount: 80.00, method: 'Credit Card', methodType: 'card', last4: '5555', status: 'pending' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredTxns = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          txn.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatDateTime = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // Calculate summary stats
  const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const successfulCount = transactions.filter(t => t.status === 'completed').length
  const pendingCount = transactions.filter(t => t.status === 'pending').length
  const refundedAmount = transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="admin-transactions">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Transaction Report</h1>
        <button className="admin-btn-secondary" onClick={() => alert('Downloading CSV Report...')}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="report-summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total Net Revenue</span>
          <span className="summary-value positive">${totalRevenue.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Successful Transactions</span>
          <span className="summary-value">{successfulCount}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Pending Payments</span>
          <span className="summary-value" style={{ color: '#b38600' }}>{pendingCount}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Refunded</span>
          <span className="summary-value" style={{ color: '#c62828' }}>${refundedAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by Transaction ID or Order ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="admin-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Order ID</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.map((txn) => (
              <tr key={txn.id}>
                <td>
                  <span className="txn-id">{txn.id}</span>
                </td>
                <td>{formatDateTime(txn.date)}</td>
                <td>
                  <span className="txn-order-link">{txn.orderId}</span>
                </td>
                <td>
                  <div className={`payment-method ${txn.methodType}`}>
                    <CreditCard size={16} />
                    <span>{txn.method} {txn.last4 !== 'N/A' && `(***${txn.last4})`}</span>
                  </div>
                </td>
                <td>
                  <span className="txn-amount">${txn.amount.toFixed(2)}</span>
                </td>
                <td>
                  <span className={`status ${txn.status}`}>
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </span>
                </td>
                <td>
                  <button className="admin-action-btn edit" title="View Receipt" onClick={() => alert(`Opening receipt for ${txn.id}`)}>
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTxns.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTransactions
