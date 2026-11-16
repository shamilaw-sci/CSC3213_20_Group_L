import React from 'react';

const StatCard = ({ label, value, icon, color = 'maroon' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      {icon && (
        <div className={`stat-icon-wrapper stat-icon-${color}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
