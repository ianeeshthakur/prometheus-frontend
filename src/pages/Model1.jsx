import React from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { cameraNetworkSnapshot, cameraNetworkStats } from '../data/mockData';
import './Model1.css';

const cameraIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
);

function Model1() {
  return (
    <div className="camera-network-page">
      <header className="camera-network-header">
        <div><h1>Camera Network</h1><p>Monitor heterogeneous CCTV feeds and camera health</p></div>
        <button type="button" className="discover-cameras-button">Discover Cameras <span aria-hidden="true">→</span></button>
      </header>

      <section className="camera-network-stats" aria-label="Camera network health">
        <StatCard cardIndex={0} id="network-total" label="Total Cameras" targetValue={cameraNetworkStats.total} trendText="Registered fleet" accentColor="#334155" icon={cameraIcon} />
        <StatCard cardIndex={1} id="network-online" label="Online" targetValue={cameraNetworkStats.online} trendText="Operational" accentColor="#16a34a" icon={cameraIcon} />
        <StatCard cardIndex={2} id="network-degraded" label="Degraded" targetValue={cameraNetworkStats.degraded} trendText="Needs attention" isPositive={false} accentColor="#d97706" icon={cameraIcon} />
        <StatCard cardIndex={3} id="network-offline" label="Offline" targetValue={cameraNetworkStats.offline} trendText="Requires action" isPositive={false} accentColor="#dc2626" icon={cameraIcon} />
      </section>

      <section className="camera-registry-card">
        <header className="camera-registry-header"><h2>Camera Registry</h2><p>Representative network-health snapshot across Gujarat districts</p></header>
        <div className="camera-table-wrap">
          <table className="camera-table">
            <thead><tr><th>Camera (ID)</th><th>Location</th><th>District</th><th>Protocol</th><th>Status</th></tr></thead>
            <tbody>{cameraNetworkSnapshot.map((camera) => <tr key={camera.id}><td className="camera-id">{camera.id}</td><td className="camera-location">{camera.location}</td><td>{camera.district}</td><td className="camera-protocol">{camera.protocol}</td><td><StatusBadge status={camera.status} /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Model1;
