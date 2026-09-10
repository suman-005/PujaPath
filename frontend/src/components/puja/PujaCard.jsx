import React from 'react';
import { Link } from 'react-router-dom';
import { getDirectionsUrl } from '../../utils/directions';

export function PujaCard({ puja, distance = null }) {
  if (!puja) return null;

  const directionsUrl = getDirectionsUrl(puja.latitude, puja.longitude);
  const isVerified = Boolean(puja.verified);

  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#8b0000', fontWeight: '700' }}>
            <Link to={`/puja/${puja.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {puja.name}
            </Link>
          </h3>
          {distance !== null && !Number.isNaN(distance) && (
            <span
              style={{
                backgroundColor: '#e6f4ea',
                color: '#137333',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
              }}
            >
              📍 {distance} km away
            </span>
          )}
        </div>

        {/* Trust Badge */}
        <div style={{ marginBottom: '8px' }}>
          {isVerified ? (
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#137333',
                backgroundColor: '#e6f4ea',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ✓ Verified Puja
            </span>
          ) : (
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#b06000',
                backgroundColor: '#fef7e0',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ⚠️ Demo / Unverified
            </span>
          )}
        </div>

        <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#555' }}>
          <strong>Area:</strong> {puja.area} {puja.address ? `• ${puja.address}` : ''}
        </p>

        {puja.theme && (
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
            <strong>Theme:</strong> {puja.theme}
          </p>
        )}

        {/* Crowd status pill */}
        <div style={{ marginBottom: '10px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: '600',
              backgroundColor:
                puja.crowd_status === 'Heavy' ? '#fce8e6' : puja.crowd_status === 'Moderate' ? '#fef7e0' : '#e6f4ea',
              color:
                puja.crowd_status === 'Heavy' ? '#c5221f' : puja.crowd_status === 'Moderate' ? '#b06000' : '#137333',
            }}
          >
            Crowd: {puja.crowd_status || 'Low'}
          </span>
        </div>

        {/* Facilities badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
          {puja.parking && (
            <span style={{ fontSize: '11px', backgroundColor: '#f1f3f4', padding: '2px 6px', borderRadius: '4px', color: '#444' }}>
              🅿️ Parking
            </span>
          )}
          {puja.toilet && (
            <span style={{ fontSize: '11px', backgroundColor: '#f1f3f4', padding: '2px 6px', borderRadius: '4px', color: '#444' }}>
              🚻 Toilet
            </span>
          )}
          {puja.food && (
            <span style={{ fontSize: '11px', backgroundColor: '#f1f3f4', padding: '2px 6px', borderRadius: '4px', color: '#444' }}>
              🍛 Food
            </span>
          )}
          {puja.medical_assistance && (
            <span style={{ fontSize: '11px', backgroundColor: '#f1f3f4', padding: '2px 6px', borderRadius: '4px', color: '#444' }}>
              🏥 Medical
            </span>
          )}
          {puja.accessibility && (
            <span style={{ fontSize: '11px', backgroundColor: '#f1f3f4', padding: '2px 6px', borderRadius: '4px', color: '#444' }}>
              ♿ Accessible
            </span>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '10px' }}>
          <Link
            to={`/puja/${puja.id}`}
            style={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: '#8b0000',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            View Details
          </Link>
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textAlign: 'center',
                backgroundColor: '#e67e22',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              Directions ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default PujaCard;
