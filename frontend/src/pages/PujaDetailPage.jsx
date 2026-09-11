import { useTranslation } from 'react-i18next';
﻿import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CrowdStatusBadge } from '../components/crowd/CrowdStatusBadge';
import { CrowdReportForm } from '../components/crowd/CrowdReportForm';
import { getDirectionsUrl } from '../utils/directions';

export function PujaDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [puja, setPuja] = useState(null);
  const [images, setImages] = useState([]);
  const [crowdReports, setCrowdReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [pujaData, imgData, crowdData] = await Promise.all([
        api.getPujaById(id),
        api.getPujaImages(id).catch(() => []),
        api.getPujaCrowdReports(id).catch(() => []),
      ]);
      setPuja(pujaData);
      setImages(imgData || []);
      setCrowdReports(crowdData || []);
    } catch (err) {
      setError(err.message || 'Unable to load Puja details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px', textAlign: 'center', color: '#666' }}>
        Loading Puja details...
      </main>
    );
  }

  if (error || !puja) {
    return (
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ color: '#d32f2f', marginBottom: '16px' }}>{error || 'Puja not found.'}</p>
        <Link to="/pujas" style={{ color: '#8b0000', fontWeight: 'bold' }}>← Back to All Pujas</Link>
      </main>
    );
  }

  const directionsUrl = getDirectionsUrl(puja.latitude, puja.longitude);
  const isVerified = Boolean(puja.verified);

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/pujas" style={{ color: '#8b0000', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
          ← Back to All Pujas
        </Link>
      </div>

      <article style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '24px' }}>
        <header style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#8b0000' }}>
              {puja.name}
            </h1>
            <div>
              {isVerified ? (
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#137333', backgroundColor: '#e6f4ea', padding: '4px 10px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Verified Record
                </span>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#b06000', backgroundColor: '#fef7e0', padding: '4px 10px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ Unverified / Demo Data
                </span>
              )}
            </div>
          </div>

          <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#555' }}>
            📍 {puja.address} ({puja.area})
          </p>

          {puja.theme && (
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
              <strong>Theme:</strong> {puja.theme}
            </p>
          )}

          {puja.updated_at && (
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#888' }}>
              Last updated: {new Date(puja.updated_at).toLocaleString()}
            </p>
          )}

          {/* Crowd Status Section */}
          <div style={{ padding: '12px 16px', backgroundColor: '#fcfcfc', borderRadius: '6px', border: '1px solid #eee' }}>
            <CrowdStatusBadge reports={crowdReports} baselineStatus={puja.crowd_status} />
          </div>
        </header>

        {/* Real / Verified Photo Gallery & Empty State */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '12px' }}>{t('noRealPhotosTitle') || 'Photographs & Gallery'}</h2>
          {images && images.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {images.map((img) => (
                <div key={img.id} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                  <img
                    src={img.image_url}
                    alt={img.caption || puja.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{ padding: '8px', fontSize: '12px', backgroundColor: '#f9f9f9' }}>
                    <span style={{
                      fontWeight: '600',
                      color: img.is_real_photo ? '#137333' : '#b06000',
                      backgroundColor: img.is_real_photo ? '#e6f4ea' : '#fef7e0',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      display: 'inline-block',
                      marginBottom: '4px'
                    }}>
                      {img.is_real_photo ? '📷 Real Photo' : '🎨 Artwork / Render'}
                    </span>
                    {img.caption && <p style={{ margin: '4px 0 0 0', color: '#555' }}>{img.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px dashed #ced4da',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#e8eaed',
                color: '#5f6368',
                fontWeight: '600',
                fontSize: '11px',
                letterSpacing: '0.5px',
                padding: '3px 8px',
                borderRadius: '4px',
                marginBottom: '8px'
              }}>
                {t('photoStatusNeeded') || 'OWNER / COMMITTEE PHOTO NEEDED'}
              </div>
              <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
                {t('noRealPhotosMsg') || 'Real Puja photographs will be added after verification.'}
              </p>
            </div>
          )}
        </section>

        {puja.description && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '8px' }}>About this Puja</h2>
            <p style={{ lineHeight: '1.6', color: '#444', margin: 0 }}>{puja.description}</p>
          </section>
        )}

        {/* Facilities Section */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '12px' }}>Available Facilities</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: puja.parking ? '#e6f4ea' : '#f1f3f4', color: puja.parking ? '#137333' : '#666', fontSize: '13px', fontWeight: '500' }}>
              {puja.parking ? '✓ Parking Available' : '× No Parking'}
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: puja.toilet ? '#e6f4ea' : '#f1f3f4', color: puja.toilet ? '#137333' : '#666', fontSize: '13px', fontWeight: '500' }}>
              {puja.toilet ? '✓ Restrooms Available' : '× No Restrooms'}
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: puja.food ? '#e6f4ea' : '#f1f3f4', color: puja.food ? '#137333' : '#666', fontSize: '13px', fontWeight: '500' }}>
              {puja.food ? '✓ Food Stalls / Bhog' : '× No Food Stalls'}
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: puja.medical_assistance ? '#e6f4ea' : '#f1f3f4', color: puja.medical_assistance ? '#137333' : '#666', fontSize: '13px', fontWeight: '500' }}>
              {puja.medical_assistance ? '✓ Medical Aid' : '× No Medical Aid'}
            </span>
            <span style={{ padding: '6px 12px', borderRadius: '4px', backgroundColor: puja.accessibility ? '#e6f4ea' : '#f1f3f4', color: puja.accessibility ? '#137333' : '#666', fontSize: '13px', fontWeight: '500' }}>
              {puja.accessibility ? '✓ Wheelchair Accessible' : '× Not Wheelchair Accessible'}
            </span>
          </div>
        </section>

        {directionsUrl && (
          <div style={{ marginBottom: '24px' }}>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#e67e22',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
              }}
            >
              Get Directions on Map ↗
            </a>
          </div>
        )}

        {/* Interactive Crowd Reporting Form */}
        <CrowdReportForm pujaId={puja.id} onReportSubmitted={loadData} />
      </article>
    </main>
  );
}

export default PujaDetailPage;
