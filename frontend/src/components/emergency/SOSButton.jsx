import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { sanitizePhoneUri } from '../../utils/phone';

export function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Load emergency contacts when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getEmergencyContacts()
      .then((data) => {
        if (isMounted) setContacts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Unable to load emergency contacts.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Trap focus & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Group contacts by priority categories for instant SOS selection
  const categories = ['Medical', 'Police / Safety', 'Fire', 'Women Safety', 'Hospital'];
  const groupedContacts = contacts.reduce((acc, c) => {
    const cat = c.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  return (
    <>
      {/* Floating SOS Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open emergency SOS assistance menu"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1100,
          backgroundColor: '#d93025',
          color: '#ffffff',
          border: '3px solid #ffffff',
          borderRadius: '50px',
          padding: '12px 20px',
          fontSize: '16px',
          fontWeight: '800',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(217,48,37,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          touchAction: 'manipulation',
        }}
      >
        <span style={{ fontSize: '20px' }}>🚨</span>
        <span>SOS</span>
      </button>

      {/* Accessible SOS Action Modal */}
      {isOpen && (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-dialog-title"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2
                id="sos-dialog-title"
                style={{ margin: 0, fontSize: '22px', color: '#b30000', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>🚨</span> Emergency Assistance
              </h2>
              <button
                type="button"
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                aria-label="Close emergency assistance dialog"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  color: '#444',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#666', marginTop: 0, marginBottom: '20px', lineHeight: '1.4' }}>
              Select a service below to initiate a phone call. Emergency calls must be confirmed explicitly on your device.
            </p>

            {loading && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#666' }}>
                Loading emergency contacts...
              </div>
            )}

            {error && (
              <div role="alert" style={{ backgroundColor: '#fce8e6', color: '#c5221f', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {!loading && !error && contacts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                No emergency contacts are currently available.
              </div>
            )}

            {!loading && !error && contacts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {contacts.map((c) => {
                  const phoneUri = sanitizePhoneUri(c.phone);
                  if (!phoneUri) return null;
                  return (
                    <div
                      key={c.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#222' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{c.category} {c.location ? `• ${c.location}` : ''}</div>
                      </div>
                      <a
                        href={phoneUri}
                        aria-label={`Call ${c.name} at ${c.phone}`}
                        style={{
                          backgroundColor: '#b30000',
                          color: '#ffffff',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: '700',
                          fontSize: '14px',
                          minHeight: '44px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Call
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  backgroundColor: '#f1f3f4',
                  color: '#3c4043',
                  border: '1px solid #dadce0',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  width: '100%',
                  minHeight: '44px',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SOSButton;