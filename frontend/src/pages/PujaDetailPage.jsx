import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CrowdStatusBadge } from '../components/crowd/CrowdStatusBadge';
import { CrowdReportForm } from '../components/crowd/CrowdReportForm';
import { getDirectionsUrl } from '../utils/directions';

export function PujaDetailPage() {
  const { id } = useParams();
  const [puja, setPuja] = useState(null);
  const [images, setImages] = useState([]);
  const [crowdSummary, setCrowdSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [pujaData, imgData, summaryData] = await Promise.all([
        api.getPujaById(id),
        api.getPujaImages(id).catch(() => []),
        api.getPujaCrowdSummary(id).catch(() => null),
      ]);
      setPuja(pujaData);
      setImages(imgData || []);
      setCrowdSummary(summaryData);
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
        <h2 style={{ color: '#c5221f' }}>Puja Not Found</h2>
        <p style={{ color: '#666' }}>{error || 'The requested Puja pandal does not exist.'}</p>
        <Link to="/pujas" style={{ color: '#8b0000', fontWeight: '600', textDecoration: 'underline' }}>
          Back to Explore Pujas
        </Link>
      </main>
    );
  }

  const directionsUrl = getDirectionsUrl(puja.latitude, puja.longitude);

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px 80px 16px' }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
        <Link to="/pujas" style={{ color: '#8b0000', textDecoration: 'none' }}>
          ← Back to All Pujas
        </Link>
      </nav>

      <article style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '24px' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#8b0000', fontWeight: '800' }}>
            {puja.name}
          </h1>
          <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#555' }}>
            📍 {puja.address} ({puja.area})
          </p>
          {puja.theme && (
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
              <strong>Theme:</strong> {puja.theme}
            </p>
          )}

          {/* Crowd Status Section */}
          <div style={{ padding: '12px 16px', backgroundColor: '#fcfcfc', borderRadius: '6px', border: '1px solid #eee' }}>
            <CrowdStatusBadge summary={crowdSummary} baselineStatus={puja.crowd_status} />
          </div>
        </header>

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