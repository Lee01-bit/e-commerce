// src/OrderStatusTracker.js
import React from 'react';
import { format } from 'date-fns';

const OrderStatusTracker = ({ statusHistory }) => {
  return (
    <div className="container mt-4">
      <h4>Order Status</h4>
      <ul className="list-group">
        {statusHistory.map((statusRecord, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            <div>
              <h5>{statusRecord.status}</h5>
              <p>{format(statusRecord.timestamp.seconds * 1000, 'dd MMM yyyy, hh:mm a')}</p>
            </div>
            <span className={`badge ${getStatusBadge(statusRecord.status)}`}>{statusRecord.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Function to determine the badge class based on the status
const getStatusBadge = (status) => {
  switch (status) {
    case 'Pending':
      return 'badge-warning';
    case 'Shipped':
      return 'badge-info';
    case 'Delivered':
      return 'badge-success';
    case 'Cancelled':
      return 'badge-danger';
    default:
      return 'badge-secondary';
  }
};

export default OrderStatusTracker;
