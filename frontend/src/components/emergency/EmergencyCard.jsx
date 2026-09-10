import React from 'react';
import { sanitizePhoneUri } from '../../utils/phone';

export function EmergencyCard({ contact }) {
  if (!contact) return null;

  const phoneUri = sanitizePhoneUri(contact.phone);
  const formattedDate = contact.last_verified_at
    ? new Date(contact.last_verified_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
      aria-labelledby={`contact-name-${contact.id}`}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h3
            id={`contact-name-${contact.id}`}
            style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#1a1a1a', fontWeight: '700' }}
          >
            {contact.name}
          </h3>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: '600',
              backgroundColor: contact.verified ? '#e6f4ea' : '#fce8e6',
              color: contact.verified ? '#137333' : '#c5221f',
              border: `1px solid ${contact.verified ? '#ceead6' : '#fad2cf'}`,
            }}
          >
            {contact.verified ? '✓ Verified' : '⚠ Not Verified'}
          </span>
        </div>

        {contact.category && (
          <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#666', fontWeight: '500' }}>
            Category: {contact.category}
          </p>
        )}

        {contact.location && (
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#444' }}>
            📍 {contact.location}
          </p>
        )}

        {contact.verified && formattedDate && (
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#666' }}>
            Last verified: {formattedDate}
          </p>
        )}
      </div>

      <div style={{ marginTop: '12px' }}>
        {phoneUri ? (
          <a
            href={phoneUri}
            aria-label={`Call ${contact.name} at ${contact.phone}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: '48px',
              backgroundColor: '#b30000',
              color: '#ffffff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '16px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(179,0,0,0.3)',
            }}
          >
            📞 Call {contact.phone}
          </a>
        ) : (
          <span style={{ fontSize: '14px', color: '#888' }}>Phone unavailable</span>
        )}
      </div>
    </article>
  );
}

export default EmergencyCard;