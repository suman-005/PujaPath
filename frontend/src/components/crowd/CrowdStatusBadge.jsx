import React from 'react';

export function CrowdStatusBadge({ summary, baselineStatus = 'Low' }) {
  if (!summary || !summary.has_recent_reports) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              padding: '3px 10px',
              borderRadius: '4px',
              fontWeight: '600',
              backgroundColor: '#f1f3f4',
              color: '#5f6368',
              border: '1px solid #dadce0',
            }}
          >
            ⚪ Crowd: {baselineStatus} (Baseline)
          </span>
          <span style={{ fontSize: '11px', color: '#777' }}>No recent reports</span>
        </div>
        <span style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
          Crowd information is approximate and may not reflect current conditions.
        </span>
      </div>
    );
  }

  const { status, report_count, window_minutes } = summary;

  const config = {
    Low: { bg: '#e6f4ea', color: '#137333', border: '#ceead6', icon: '🟢', label: 'Low Crowd' },
    Moderate: { bg: '#fef7e0', color: '#b06000', border: '#feefc3', icon: '🟡', label: 'Moderate Crowd' },
    Heavy: { bg: '#fce8e6', color: '#c5221f', border: '#fad2cf', icon: '🔴', label: 'Heavy Crowd' },
  }[status] || { bg: '#f1f3f4', color: '#333', border: '#ccc', icon: '⚪', label: status };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '4px 10px',
            borderRadius: '4px',
            fontWeight: '700',
            backgroundColor: config.bg,
            color: config.color,
            border: `1px solid ${config.border}`,
          }}
        >
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </span>
        <span style={{ fontSize: '12px', color: '#555', fontWeight: '500' }}>
          Based on {report_count} recent {report_count === 1 ? 'report' : 'reports'} (past {window_minutes}m)
        </span>
      </div>
      <span style={{ fontSize: '11px', color: '#777', fontStyle: 'italic' }}>
        Crowd information is approximate and based on recent visitor reports.
      </span>
    </div>
  );
}

export default CrowdStatusBadge;