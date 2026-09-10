import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MapView } from '../components/map/MapView';
import { useGeolocation } from '../hooks/useGeolocation';

export function MapPage() {
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { position: userPosition, loading: locating, error: geoError, requestLocation, clearError: clearGeoError } = useGeolocation();

  const loadPujas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPujas({ pageSize: 100 });
      setPujas(data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load Puja locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPujas();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
      <header style={{ marginBottom: '16px' }}>
        <h1 style={{ color: '#8b0000', margin: '0 0 6px 0', fontSize: '26px' }}>
          Interactive Puja Map
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Explore registered Durga Puja pandals in Purba Bardhaman.
        </p>
      </header>

      {geoError && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '14px',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{geoError}</span>
          <button
            type="button"
            onClick={clearGeoError}
            aria-label="Dismiss location warning"
            style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#856404' }}
          >
            ×
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
          <p style={{ fontSize: '16px' }}>Loading Puja locations...</p>
        </div>
      )}

      {error && !loading && (
        <div
          role="alert"
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '16px',
            borderRadius: '6px',
            textAlign: 'center',
            margin: '20px 0',
          }}
        >
          <p style={{ margin: '0 0 10px 0' }}>{error}</p>
          <button
            type="button"
            onClick={loadPujas}
            style={{
              backgroundColor: '#8b0000',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {pujas.length === 0 && (
            <div
              style={{
                backgroundColor: '#f8f9fa',
                color: '#555',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '14px',
                fontSize: '14px',
                border: '1px solid #e9ecef',
              }}
            >
              No Puja locations are currently available.
            </div>
          )}

          <MapView
            pujas={pujas}
            userPosition={userPosition}
            height="580px"
            onLocateUser={requestLocation}
            locating={locating}
          />
        </>
      )}
    </div>
  );
}

export default MapPage;