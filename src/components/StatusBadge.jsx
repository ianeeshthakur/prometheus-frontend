import React from 'react';
import './StatusBadge.css';

function StatusBadge({ status }) {
  const statusClass = status.toLowerCase();

  return <span className={`status-badge status-badge-${statusClass}`}><span />{status}</span>;
}

export default StatusBadge;