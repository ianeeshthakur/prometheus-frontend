import React, { useEffect, useState } from 'react';
import './ArchitectureFlow.css';

const STAGE_DURATION = 2600;
const DWELL_DURATION = STAGE_DURATION * 0.65;
const STAGE_COUNT = 7;

const stages = [
  {
    name: 'Cameras',
    description: 'Heterogeneous camera fleet across Gujarat',
    tags: ['Fixed CCTV', 'PTZ', 'ANPR', 'Body Cams'],
    color: '#a855f7',
  },
  {
    name: 'Integration Adapters',
    description: 'Protocol normalization layer',
    tags: ['RTSP Connector', 'ONVIF Adapter', 'VMS API Bridge', 'Vendor SDK'],
    color: '#3b82f6',
  },
  {
    name: 'Stream Gateway',
    description: 'Frame extraction, buffering, pre-processing',
    tags: ['Ingestion Nodes', 'FFmpeg/GStreamer', 'Frame Rate Control', 'Load Balancing'],
    color: '#22d3ee',
  },
  {
    name: 'AI Processing Pool',
    description: 'Distributed GPU-accelerated inference',
    tags: ['YOLOv8', 'PaddleOCR', 'ByteTrack', 'Re-ID Engine'],
    color: '#10b981',
  },
  {
    name: 'Event Bus',
    description: 'Normalized AI event streaming',
    tags: ['Event Schema', 'Deduplication', 'Priority Routing', 'Kafka'],
    color: '#f59e0b',
  },
  {
    name: 'Central Intelligence',
    description: 'Correlation, watchlist, GIS',
    tags: ['Watchlist Match', 'Cross-Camera Correlation', 'GIS Integration', 'Alert Engine'],
    color: '#fb4d5c',
  },
  {
    name: 'Investigation Platform',
    description: 'G-VISTA frontend & investigation tools',
    tags: ['Command Center', 'Investigation Workspace', 'Audit & Evidence', 'RBAC'],
    color: '#38bdf8',
  },
];

const easeInOutQuad = (value) => (
  value < 0.5 ? 2 * value * value : 1 - ((-2 * value + 2) ** 2) / 2
);

const getNodePosition = (index, radius = 198) => {
  const angle = (-90 + (index * 360) / STAGE_COUNT) * (Math.PI / 180);
  return {
    left: `${50 + (Math.cos(angle) * radius * 100) / 480}%`,
    top: `${50 + (Math.sin(angle) * radius * 100) / 480}%`,
  };
};

function ArchitectureFlow() {
  const [animation, setAnimation] = useState({ stage: 0, progress: 0, angle: -90 });

  useEffect(() => {
    let animationFrame;
    const startedAt = performance.now();

    const animate = (timestamp) => {
      const elapsed = (timestamp - startedAt) % (STAGE_DURATION * STAGE_COUNT);
      const stage = Math.floor(elapsed / STAGE_DURATION);
      const stageElapsed = elapsed % STAGE_DURATION;
      const currentAngle = -90 + (stage * 360) / STAGE_COUNT;
      const nextAngle = currentAngle + 360 / STAGE_COUNT;
      const travelProgress = stageElapsed <= DWELL_DURATION
        ? 0
        : easeInOutQuad((stageElapsed - DWELL_DURATION) / (STAGE_DURATION - DWELL_DURATION));

      setAnimation({
        stage,
        progress: Math.min(stageElapsed / DWELL_DURATION, 1),
        angle: currentAngle + (nextAngle - currentAngle) * travelProgress,
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const activeStage = stages[animation.stage];
  const cometAngle = animation.angle * (Math.PI / 180);
  const cometPosition = {
    left: `${50 + (Math.cos(cometAngle) * 198 * 100) / 480}%`,
    top: `${50 + (Math.sin(cometAngle) * 198 * 100) / 480}%`,
  };

  return (
    <section className="architecture-flow">
      <header className="architecture-header">
        <div>
          <span className="architecture-kicker">SYSTEM BLUEPRINT</span>
          <h1>Architecture Flow</h1>
          <p>Seven connected layers powering Gujarat&apos;s statewide intelligence network.</p>
        </div>
        <div className="flow-status"><span />Live pipeline</div>
      </header>

      <div className="architecture-grid">
        <div className="flow-visual" aria-label={`Currently processing ${activeStage.name}`}>
          <div className="flow-circle">
            <svg className="flow-ring" viewBox="0 0 480 480" aria-hidden="true">
              <circle cx="240" cy="240" r="198" />
              <circle className="flow-ring-inner" cx="240" cy="240" r="170" />
            </svg>
            <div className="flow-comet" style={{ ...cometPosition, backgroundColor: activeStage.color }} aria-hidden="true" />
            {stages.map((stage, index) => {
              const state = index === animation.stage ? 'current' : index < animation.stage ? 'done' : 'upcoming';
              return (
                <div
                  className={`flow-node flow-node-${state}`}
                  key={stage.name}
                  style={{ ...getNodePosition(index), '--stage-color': stage.color }}
                  title={stage.name}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
              );
            })}
            <div className="flow-center">
              <span className="flow-step">STEP {animation.stage + 1} / 7</span>
              <h2>{activeStage.name}</h2>
              <p>{activeStage.description}</p>
            </div>
          </div>
          <div className="flow-legend"><span className="legend-dot" /> Data moving through live services</div>
        </div>

        <div className="stage-list">
          {stages.map((stage, index) => {
            const isCurrent = index === animation.stage;
            const isDone = index < animation.stage;
            const progress = isDone ? 100 : isCurrent ? animation.progress * 100 : 0;
            return (
              <article
                className={`stage-card ${isCurrent ? 'stage-card-current' : ''} ${isDone ? 'stage-card-done' : ''}`}
                key={stage.name}
                style={{ '--stage-color': stage.color }}
              >
                <div className="stage-card-topline">
                  <span className="stage-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{stage.name}</h3>
                  {isCurrent && <span className="stage-live">ACTIVE</span>}
                </div>
                <p>{stage.description}</p>
                <div className="stage-tags">{stage.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="stage-progress" aria-label={`${stage.name} progress`}><span style={{ width: `${progress}%` }} /></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ArchitectureFlow;