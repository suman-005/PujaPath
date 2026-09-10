import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EmergencyCard } from '../components/emergency/EmergencyCard';

const CATEGORIES = [
  'Medical',
  'Police / Safety',
  'Fire',
  'Women Safety',
  'Child Safety',
  'General Emergency',
  'Accessibility',
];

export function EmergencyPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEmergencyContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load emergency contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts =
    selectedCategory === 'All'
      ? contacts
      : contacts.filter((c) => (c.category || '').toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 16px 80px 16px' }}>
      <header style={{ marginBottom: '24px', borderBottom: '2px solid #e0e0e0', paddingBottom: '16px' }}>
        <h1 style={{ color: '#b30000', fontSize: '28px', margin: '0 0 8px 0', fontWeight: '800' }}>
          Emergency Assistance
        </h1>
        <p style={{ color: '#444', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
          Emergency information is provided for assistance. Verify important information when necessary.
        </p>
      </header>

      {/* Category filter navigation */}
      <nav aria-label="Emergency categories" style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          style={{
            padding: '8px 14px',
            borderRadius: '20px',
            border: '1px solid #b30000',
            backgroundColor: selectedCategory === 'All' ? '#b30000' : '#ffffff',
            color: selectedCategory === 'All' ? '#ffffff' : '#b30000',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            minHeight: '38px',
          }}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: '1px solid #b30000',
              backgroundColor: selectedCategory === cat ? '#b30000' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#b30000',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              minHeight: '38px',
            }}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#555', fontSize: '16px' }}>
          Loading emergency contacts...
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fce8e6',
            color: '#c5221f',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
            margin: '20px 0',
          }}
        >
          <p style={{ margin: '0 0 12px 0' }}>Unable to load emergency contacts.</p>
          <button
            type="button"
            onClick={loadContacts}
            style={{
              backgroundColor: '#b30000',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Overall empty state */}
      {!loading && !error && contacts.length === 0 && (
        <div
          style={{
            backgroundColor: '#f8f9fa',
            color: '#555',
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '15px',
            border: '1px solid #e0e0e0',
          }}
        >
          No emergency contacts are currently available.
        </div>
      )}

      {/* Filtered empty state */}
      {!loading && !error && contacts.length > 0 && filteredContacts.length === 0 && (
        <div
          style={{
            backgroundColor: '#f8f9fa',
            color: '#555',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            border: '1px solid #e0e0e0',
          }}
        >
          No contacts are currently available in this category.
        </div>
      )}

      {/* Contacts grid */}
      {!loading && !error && filteredContacts.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredContacts.map((contact) => (
            <EmergencyCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </main>
  );
}

export default EmergencyPage;