import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, authStorage } from '../../services/api';

const LEVELS = [
  { value: 'Low', label: 'Low Crowd', desc: 'Easy movement, minimal queue', icon: '🟢' },
  { value: 'Moderate', label: 'Moderate Crowd', desc: 'Active crowd, short wait', icon: '🟡' },
  { value: 'Heavy', label: 'Heavy Crowd', desc: 'Packed pandal, long queues', icon: '🔴' },
];

export function CrowdReportForm({ pujaId, onReportSubmitted }) {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentUser = authStorage.getUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLevel) {
      setErrorMsg('Please select a crowd level before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.submitCrowdReport({
        puja_id: pujaId,
        crowd_level: selectedLevel,
      });
      setSuccessMsg('Thank you! Your crowd report has been recorded.');
      setSelectedLevel('');
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to submit crowd report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '20px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#333' }}>How crowded is it now?</h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666' }}>
          Please log in to report the crowd status and help fellow pandal hoppers.
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            backgroundColor: '#8b0000',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          Log In to Report
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
      }}
    >
      <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', color: '#8b0000', fontWeight: '700' }}>
        How crowded is it right now?
      </h3>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#666' }}>
        Help visitors plan their visit. Select the approximate crowd level you are observing:
      </p>

      {successMsg && (
        <div
          role="status"
          style={{
            backgroundColor: '#e6f4ea',
            color: '#137333',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '14px',
            border: '1px solid #ceead6',
          }}
        >
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fce8e6',
            color: '#c5221f',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '14px',
            border: '1px solid #fad2cf',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          role="radiogroup"
          aria-label="Crowd level options"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}
        >
          {LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl.value;
            return (
              <button
                type="button"
                key={lvl.value}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedLevel(lvl.value)}
                disabled={submitting}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '6px',
                  border: `2px solid ${isSelected ? '#8b0000' : '#e0e0e0'}`,
                  backgroundColor: isSelected ? '#fdf2f2' : '#ffffff',
                  cursor: submitting ? 'wait' : 'pointer',
                  textAlign: 'center',
                  minHeight: '48px',
                }}
              >
                <span style={{ fontSize: '18px', marginBottom: '4px' }}>{lvl.icon}</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: '#222' }}>{lvl.label}</span>
                <span style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{lvl.desc}</span>
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={submitting || !selectedLevel}
          style={{
            backgroundColor: submitting || !selectedLevel ? '#cccccc' : '#8b0000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: submitting || !selectedLevel ? 'not-allowed' : 'pointer',
            minHeight: '44px',
            width: '100%',
          }}
        >
          {submitting ? 'Submitting report...' : 'Submit Crowd Report'}
        </button>
      </form>
    </div>
  );
}

export default CrowdReportForm;