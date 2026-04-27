import React, { useState } from 'react'
import { Search, Mail, Phone, MapPin } from 'lucide-react'
import './AdminCustomers.css'

const AdminCustomers = () => {
  const [customers] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 234-567-8901', address: '123 Main St, New York, NY', orders: 5, totalSpent: 245.99, joined: '2023-06-15' },
    { id: 2, name: 'Mike Davis', email: 'mike@email.com', phone: '+1 234-567-8902', address: '456 Oak Ave, Los Angeles, CA', orders: 3, totalSpent: 125.50, joined: '2023-08-22' },
    { id: 3, name: 'Emma Wilson', email: 'emma@email.com', phone: '+1 234-567-8903', address: '789 Pine Rd, Chicago, IL', orders: 8, totalSpent: 456.00, joined: '2023-04-10' },
    { id: 4, name: 'James Brown', email: 'james@email.com', phone: '+1 234-567-8904', address: '321 Elm St, Houston, TX', orders: 2, totalSpent: 78.99, joined: '2023-11-05' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@email.com', phone: '+1 234-567-8905', address: '654 Maple Dr, Phoenix, AZ', orders: 6, totalSpent: 312.00, joined: '2023-07-18' },
    { id: 6, name: 'David Lee', email: 'david@email.com', phone: '+1 234-567-8906', address: '987 Cedar Ln, Philadelphia, PA', orders: 1, totalSpent: 45.99, joined: '2024-01-02' },
    { id: 7, name: 'Jennifer Taylor', email: 'jen@email.com', phone: '+1 234-567-8907', address: '147 Birch Way, San Antonio, TX', orders: 4, totalSpent: 189.50, joined: '2023-09-30' },
    { id: 8, name: 'Robert Martinez', email: 'rob@email.com', phone: '+1 234-567-8908', address: '258 Spruce St, San Diego, CA', orders: 7, totalSpent: 398.00, joined: '2023-05-12' },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="admin-customers">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customers</h1>
        <span className="admin-customer-count">{customers.length} customers</span>
      </div>

      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="customer-name">{customer.name}</span>
                  </div>
                </td>
                <td>
                  <div className="customer-contact">
                    <span><Mail size={14} /> {customer.email}</span>
                    <span><Phone size={14} /> {customer.phone}</span>
                  </div>
                </td>
                <td>
                  <div className="customer-address">
                    <MapPin size={14} />
                    <span>{customer.address}</span>
                  </div>
                </td>
                <td>{customer.orders}</td>
                <td className="customer-spent">₹{customer.totalSpent.toFixed(2)}</td>
                <td>{customer.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCustomers
