import React, { useEffect, useState } from 'react';
import './StatCard.css';

function useDigitalScramble(targetValue, delayMs = 300, scrambleDuration = 420, isDecimal = false) {
  const [displayValue, setDisplayValue] = useState(isDecimal ? '00.00' : '0000');

  useEffect(() => {
    let scrambleInterval = null;
    let finishTimeout = null;
    const getRandomDigits = () => {
      if (isDecimal) return `${Math.floor(Math.random() * 90 + 10)}.${Math.floor(Math.random() * 90 + 10)}`;
      const numDigits = String(Math.floor(targetValue)).length;
      return Number(Array.from({ length: numDigits }, () => Math.floor(Math.random() * 10)).join('')).toLocaleString();
    };

    const startTimer = setTimeout(() => {
      scrambleInterval = setInterval(() => setDisplayValue(getRandomDigits()), 32);
      finishTimeout = setTimeout(() => {
        clearInterval(scrambleInterval);
        setDisplayValue(isDecimal ? Number(targetValue).toFixed(2) : Math.round(targetValue).toLocaleString());
      }, scrambleDuration);
    }, delayMs);

    return () => {
      clearTimeout(startTimer);
      if (scrambleInterval) clearInterval(scrambleInterval);
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [targetValue, delayMs, scrambleDuration, isDecimal]);

  return displayValue;
}

function Sparkline({ data, strokeColor, id }) {
  const width = 200;
  const height = 40;
  const padding = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1)) * (width - padding * 2),
    y: height - padding - ((value - min) / range) * (height - padding * 2),
  }));
  const pathD = points.reduce((path, point, index) => `${path} ${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  return (
    <div className="sparkline-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg" preserveAspectRatio="none">
        <defs><linearGradient id={`spark-grad-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" /><stop offset="100%" stopColor={strokeColor} stopOpacity="0" /></linearGradient></defs>
        <path d={areaD} fill={`url(#spark-grad-${id})`} />
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={strokeColor} />
      </svg>
    </div>
  );
}

function StatCard({ cardIndex = 0, label, targetValue, isDecimal, suffix = '', trendText = '', isPositive = true, accentColor = '#0f172a', sparkData, icon, id }) {
  const displayValue = useDigitalScramble(targetValue, 300 + cardIndex * 120, 420, isDecimal);

  return (
    <div className="stats-card" style={{ '--card-idx': cardIndex }}>
      <div className="stats-card-accent-bar" style={{ background: `linear-gradient(90deg, ${accentColor}, rgba(255, 255, 255, 0.2))` }} />
      <div className="stats-card-header"><span className="stats-label">{label}</span><div className="stats-icon-badge" style={{ color: accentColor }}>{icon}</div></div>
      <div className="stats-value-row"><span className="stats-value">{displayValue}{suffix}</span>{trendText && <span className={`trend-badge ${isPositive ? 'positive' : 'negative'}`}><span className="trend-arrow">{isPositive ? '↑' : '↓'}</span>{trendText}</span>}</div>
      {sparkData && <Sparkline data={sparkData} strokeColor={accentColor} id={id} />}
      {sparkData && <div className="sparkline-footer"><span>7-day activity</span><span>Current period</span></div>}
    </div>
  );
}

export default StatCard;