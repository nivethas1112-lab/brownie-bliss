import React, { useState, useEffect } from 'react'
import { Search, Filter, RotateCcw, FileSpreadsheet, FileText, List, TrendingUp, LucideIndianRupee, ShoppingBag, CreditCard, Edit2 } from 'lucide-react'
import api from '../../services/api.js'
import Loader from '../../components/Loader.jsx'
import './AdminTransactions.css'

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    orderId: 'ORD-20260409-ABKZWX',
    customer: 'RAMACHANDRAN',
    date: '09 Apr, 2026',
    time: '11:11',
    taxable: 4236.44,
    gst: 762.56,
    totalAmnt: 4999,
    status: 'Paid',
    notes: ''
  },
  {
    id: '2',
    orderId: 'ORD-20260408-XYZABC',
    customer: 'ANJALI SHARMA',
    date: '08 Apr, 2026',
    time: '14:30',
    taxable: 847.45,
    gst: 152.55,
    totalAmnt: 1000,
    status: 'Paid',
    notes: 'Express delivery requested'
  },
  {
    id: '3',
    orderId: 'ORD-20260407-LMNOPQ',
    customer: 'ROHIT KUMAR',
    date: '07 Apr, 2026',
    time: '09:15',
    taxable: 1271.18,
    gst: 228.82,
    totalAmnt: 1500,
    status: 'Pending',
    notes: ''
  },
  {
    id: '4',
    orderId: 'ORD-20260406-QWERTY',
    customer: 'SNEHA PATEL',
    date: '06 Apr, 2026',
    time: '16:45',
    taxable: 2118.64,
    gst: 381.36,
    totalAmnt: 2500,
    status: 'Paid',
    notes: ''
  }
]

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [noteText, setNoteText] = useState('')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount)
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'paid'
      case 'pending': return 'pending'
      case 'failed': return 'failed'
      default: return ''
    }
  }

  const updateStatus = async (id, newStatus) => {
    const isValidId = /^[0-9a-fA-F]{24}$/.test(id);
    try {
      if (isValidId) {
        await api.orders.updateStatus(id, newStatus.toLowerCase())
      } else {
        console.warn('Updating mock transaction locally only.');
      }
      setTransactions(transactions.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
      ))
    } catch (err) {
      console.error('Failed to update transaction status:', err)
      alert('Failed to update status')
    }
  }

  const handleFilter = () => {
    console.log('Filtering...', { searchTerm, statusFilter, startDate, endDate })
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('All Statuses')
    setStartDate('')
    setEndDate('')
  }

  const openNotesModal = (transaction) => {
    setEditingTransaction(transaction)
    setNoteText(transaction.notes || '')
    setIsNotesModalOpen(true)
  }

  const closeNotesModal = () => {
    setIsNotesModalOpen(false)
    setEditingTransaction(null)
    setNoteText('')
  }

  const saveNote = async () => {
    if (!editingTransaction) return
    try {
      const isValidId = /^[0-9a-fA-F]{24}$/.test(editingTransaction.id)
      if (isValidId) {
        await api.transactions.update(editingTransaction.id, { notes: noteText })
      }
      setTransactions(transactions.map(t =>
        t.id === editingTransaction.id ? { ...t, notes: noteText } : t
      ))
      closeNotesModal()
    } catch (err) {
      console.error('Failed to save note:', err)
      alert('Failed to save note')
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await api.transactions.getAll()
        const txnList = Array.isArray(response) ? response : response.transactions || []
        const formatted = txnList.map(t => ({
          ...t,
          id: t._id || t.id,
          orderId: t.order?.orderId || t.orderId || (t._id ? t._id.substring(0, 8).toUpperCase() : 'N/A'),
          customer: t.customer?.name || (t.customer?.firstName ? `${t.customer.firstName} ${t.customer.lastName || ''}` : t.customer) || 'Guest',
          date: new Date(t.createdAt || t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date(t.createdAt || t.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
          taxable: t.taxable || (t.totalAmount ? t.totalAmount / 1.18 : 0),
          gst: t.gst || (t.totalAmount ? t.totalAmount - (t.totalAmount / 1.18) : 0),
          totalAmnt: t.totalAmount || t.totalAmnt || 0,
          status: t.status || 'Paid'
        }))
        setTransactions(formatted.length > 0 ? formatted : MOCK_TRANSACTIONS)
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch transactions, using mock data:', err.message)
        setError('Using cached data')
        setTransactions(MOCK_TRANSACTIONS)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])
return (
    <div className="atrn-main-container">
      {/* Header Section */}
      <div className="atrn-header">
        <div>
          <h1 className="atrn-title">Transaction Report</h1>
          <p className="atrn-subtitle">Track and manage your bakery's financial records and sales performance.</p>
        </div>
        <div className="atrn-header-actions">
          <button className="atrn-btn-export-csv">
            <FileSpreadsheet size={16} /> Export Excel
          </button>
          <button className="atrn-btn-export-pdf">
            <FileText size={16} /> Export PDF
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>}

      {/* Stats Grid */}
      <div className="atrn-stats-grid">
        <div className="atrn-stat-card">
          <div className="atrn-stat-icon-wrapper sales">
            <ShoppingBag size={24} />
          </div>
          <div className="atrn-stat-info">
            <span className="atrn-stat-label">Total Orders</span>
            <span className="atrn-stat-value">{transactions.length}</span>
          </div>
        </div>
        <div className="atrn-stat-card">
          <div className="atrn-stat-icon-wrapper revenue">
            <LucideIndianRupee size={24} />
          </div>
          <div className="atrn-stat-info">
            <span className="atrn-stat-label">Net Revenue</span>
            <span className="atrn-stat-value">
              {formatCurrency(transactions.reduce((sum, t) => sum + (t.totalAmnt || 0), 0))}
            </span>
          </div>
        </div>
        <div className="atrn-stat-card">
          <div className="atrn-stat-icon-wrapper trending">
            <TrendingUp size={24} />
          </div>
          <div className="atrn-stat-info">
            <span className="atrn-stat-label">Growth (MoM)</span>
            <span className="atrn-stat-value">+12.5%</span>
          </div>
        </div>
        <div className="atrn-stat-card">
          <div className="atrn-stat-icon-wrapper pending">
            <CreditCard size={24} />
          </div>
          <div className="atrn-stat-info">
            <span className="atrn-stat-label">Pending Payouts</span>
            <span className="atrn-stat-value">₹12,450</span>
          </div>
        </div>
      </div>

      <div className="atrn-content-layout">
        {/* Top: Filters */}
        <div className="atrn-filter-section">
          <div className="atrn-card">
            <div className="atrn-card-header">
              <h2 className="atrn-card-title">Filter Records</h2>
              <span className="atrn-card-badge">SEARCH</span>
            </div>

            <div className="atrn-filter-grid-horizontal">
              <div className="atrn-form-group">
                <label>Search Transaction</label>
                <div className="atrn-input-icon-wrapper">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Order ID, Customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="atrn-form-group">
                <label>Payment Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="atrn-form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="atrn-form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="atrn-filter-actions-horizontal">
                <button className="atrn-btn-primary" onClick={handleFilter}>
                  <Filter size={18} /> Apply
                </button>
                <button className="atrn-btn-secondary" onClick={handleReset}>
                  <RotateCcw size={18} /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Registry Table */}
        <div className="atrn-registry-section">
          <div className="atrn-card">
            <div className="atrn-card-header">
              <h2 className="atrn-card-title">
                <List size={20} className="title-icon" />
                Statement Registry
              </h2>
              <span className="atrn-card-badge">LIVE FEED</span>
            </div>

            <div className="atrn-table-container">
              <table className="atrn-table">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>ORDER #</th>
                    <th>CUSTOMER</th>
                    <th>DATE & TIME</th>
                    <th>TAXABLE</th>
                    <th>GST</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>NOTES</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={txn.orderId || idx}>
                      <td className="atrn-sno-cell">{idx + 1}</td>
                      <td className="atrn-id-cell">{txn.orderId}</td>
                      <td className="atrn-customer-cell">{txn.customer}</td>
                      <td>
                        <div className="atrn-date-time">
                          <span className="atrn-date">{txn.date}</span>
                          <span className="atrn-time">{txn.time}</span>
                        </div>
                      </td>
                      <td className="atrn-amount">{formatCurrency(txn.taxable)}</td>
                      <td className="atrn-amount">{formatCurrency(txn.gst)}</td>
                      <td className="atrn-total-amount">{formatCurrency(txn.totalAmnt)}</td>
                      <td>
                        <select
                          className={`atrn-status-badge ${getStatusClass(txn.status)}`}
                          value={txn.status}
                          onChange={(e) => updateStatus(txn.id, e.target.value)}
                          style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#666', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {txn.notes || '-'}
                      </td>
                       <td>
                         <button 
                           className="atrn-action-btn"
                           onClick={() => openNotesModal(txn)}
                           title="Edit note"
                         >
                           <Edit2 size={16} />
                         </button>
                       </td>
                    </tr>
                  ))}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>

       {/* Notes Edit Modal */}
       {isNotesModalOpen && editingTransaction && (
         <div className="admin-modal-overlay" onClick={closeNotesModal}>
           <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
             <div className="admin-modal-header">
               <h2>Edit Transaction Note</h2>
               <button className="admin-modal-close" onClick={closeNotesModal}>
                 <X size={24} />
               </button>
             </div>
             <div className="admin-modal-body">
               <div className="admin-form-group">
                 <label>Note</label>
                 <textarea
                   value={noteText}
                   onChange={(e) => setNoteText(e.target.value)}
                   placeholder="Add a note for this transaction..."
                   rows={4}
                   style={{ resize: 'vertical' }}
                 />
               </div>
             </div>
             <div className="admin-form-actions">
               <button type="button" className="admin-btn-secondary" onClick={closeNotesModal}>
                 Cancel
               </button>
               <button type="button" className="admin-btn-primary" onClick={saveNote}>
                 Save Note
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }

export default AdminTransactions
