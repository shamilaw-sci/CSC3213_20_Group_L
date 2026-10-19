import React from 'react';

const Badge = ({ type = 'primary', children, className = '' }) => {
  let badgeClass = 'badge-primary';
  
  switch (type) {
    case 'success':
    case 'COMPLETED':
    case 'DISPENSED':
      badgeClass = 'badge-success';
      break;
    case 'warning':
    case 'WAITING':
    case 'PENDING':
      badgeClass = 'badge-warning';
      break;
    case 'danger':
    case 'CANCELLED':
    case 'EMERGENCY':
    case 'LOW_STOCK':
      badgeClass = 'badge-danger';
      break;
    case 'info':
    case 'IN_CONSULTATION':
    case 'PHARMACY_PENDING':
    case 'FIRST':
      badgeClass = 'badge-info';
      break;
    case 'neutral':
    case 'SUBS':
      badgeClass = 'badge-neutral';
      break;
    default:
      badgeClass = 'badge-primary';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
