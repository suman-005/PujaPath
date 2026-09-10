import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { PujaCard } from '../components/puja/PujaCard';
import { PujaFilters } from '../components/puja/PujaFilters';
import { MapView } from '../components/map/MapView';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistanceKm } from '../utils/distance';

const INITIAL_FILTERS = {
  theme: '',
  area: '',
  crowdStatus: '',
  parking: null,
  toilet: null,
  food: null,
  medicalAssistance: null,
  accessibility: null,
  distanceRadius: '',
};

export function PujasPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search input state with debouncing
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Filters state initialized from URL
  const [filters, setFilters] = useState(() => ({
    theme: searchParams.get('theme') || '',
    area: searchParams.get('area') || '',
    crowdStatus: searchParams.get('crowd_status') || '',
    parking: searchParams.get('parking') === 'true' ? true : null,
    toilet: searchParams.get('toilet') === 'true' ? true : null,
    food: searchParams.get('food') === 'true' ? true : null,
    medicalAssistance: searchParams.get('medical_assistance') === 'true' ? true : null,
    accessibility: searchParams.get('accessibility') === 'true' ? true : null,
    distanceRadius: searchParams.get('distance') ? Number(searchParams.get('distance')) : '',
  }));

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const [pujas, setPujas] = useState([]);
  const [themes, setThemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Geolocation
  const { position: userPosition, loading: locating, error: geoError, requestLocation } = useGeolocation();

  // 1. Debounce search input (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Load themes once
  useEffect(() => {
    api.getThemes()
      .then((data) => setThemes(Array.isArray(data) ? data : []))
      .catch(() => setThemes([]));
  }, []);

  // 3. Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (filters.theme) params.set('theme', filters.theme);
    if (filters.area) params.set('area', filters.area);
    if (filters.crowdStatus) params.set('crowd_status', filters.crowdStatus);
    if (filters.parking) params.set('parking', 'true');
    if (filters.toilet) params.set('toilet', 'true');
    if (filters.food) params.set('food', 'true');
    if (filters.medicalAssistance) params.set('medical_assistance', 'true');
    if (filters.accessibility) params.set('accessibility', 'true');
    if (filters.distanceRadius) params.set('distance', String(filters.distanceRadius));
    if (sortBy !== 'recommended') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters, sortBy, setSearchParams]);

  // 4. Fetch Pujas from backend (without transmitting user coordinates)
  const fetchPujas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getPujas({
        search: debouncedSearch,
        theme: filters.theme,
        area: filters.area,
        crowdStatus: filters.crowdStatus,
        parking: filters.parking,
        toilet: filters.toilet,
        food: filters.food,
        medicalAssistance: filters.medicalAssistance,
        accessibility: filters.accessibility,
        page: 1,
        pageSize: 100, // Fetch up to 100 records for client-side distance processing
      });
      setPujas(response.items || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError(err.message || 'Unable to load Puja locations.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters]);

  useEffect(() => {
    fetchPujas();
  }, [fetchPujas]);

  // 5. Client-Side Distance Calculation, Radius Filtering & Sorting
  const processedPujas = useMemo(() => {
    let list = pujas.map((p) => {
      let dist = null;
      if (
        userPosition &&
        typeof userPosition.latitude === 'number' &&
        typeof userPosition.longitude === 'number' &&
        typeof p.latitude === 'number' &&
        typeof p.longitude === 'number'
      ) {
        dist = calculateDistanceKm(userPosition.latitude, userPosition.longitude, p.latitude, p.longitude);
      }
      return { ...p, _distance: dist };
    });

    // Client-side distance radius filter
    if (userPosition && filters.distanceRadius) {
      list = list.filter((p) => p._distance !== null && p._distance <= filters.distanceRadius);
    }

    // Sorting
    if (sortBy === 'nearest' && userPosition) {
      list.sort((a, b) => {
        if (a._distance === null) return 1;
        if (b._distance === null) return -1;
        return a._distance - b._distance;
      });
    }

    return list;
  }, [pujas, userPosition, filters.distanceRadius, sortBy]);

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm('');
    setSortBy('recommended');
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 80px 16px' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#8b0000', fontSize: '28px', margin: '0 0 6px 0', fontWeight: '800' }}>
          Explore Durga Pujas
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
          Discover pandals across Purba Bardhaman with real-time filters and Near Me assistance.
        </p>
      </header>

      {/* Geolocation Alert */}
      {geoError && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '10px 14px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          {geoError} You can still browse all pandals normally.
        </div>
      )}

      {/* Search Bar & Primary Actions */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Puja, area or theme..."
            aria-label="Search Puja, area or theme"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Locate Me button */}
        <button
          type="button"
          onClick={requestLocation}
          disabled={locating}
          style={{
            backgroundColor: userPosition ? '#e6f4ea' : '#ffffff',
            color: userPosition ? '#137333' : '#333',
            border: `1px solid ${userPosition ? '#ceead6' : '#ccc'}`,
            borderRadius: '6px',
            padding: '10px 16px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: locating ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '44px',
          }}
        >
          <span>🎯</span>
          <span>{locating ? 'Locating...' : userPosition ? 'Location Active' : 'Near Me'}</span>
        </button>

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort Puja results"
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            fontWeight: '500',
            minHeight: '44px',
          }}
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="nearest" disabled={!userPosition}>
            Sort: Nearest {userPosition ? '' : '(Enable Near Me)'}
          </option>
        </select>

        {/* List / Map view switcher */}
        <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ccc' }}>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="Show list view"
            style={{
              backgroundColor: viewMode === 'list' ? '#8b0000' : '#ffffff',
              color: viewMode === 'list' ? '#ffffff' : '#333',
              border: 'none',
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            📋 List
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            aria-label="Show map view"
            style={{
              backgroundColor: viewMode === 'map' ? '#8b0000' : '#ffffff',
              color: viewMode === 'map' ? '#ffffff' : '#333',
              border: 'none',
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            🗺️ Map
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <PujaFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
        themes={themes}
        userPosition={userPosition}
      />

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#666', fontSize: '16px' }}>
          Finding Puja locations...
        </div>
      )}

      {/* Error state */}
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
            onClick={fetchPujas}
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

      {/* Empty states */}
      {!loading && !error && processedPujas.length === 0 && (
        <div
          style={{
            backgroundColor: '#f8f9fa',
            color: '#555',
            padding: '36px 20px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '15px',
            border: '1px solid #e9ecef',
            margin: '20px 0',
          }}
        >
          {total === 0 && !debouncedSearch ? (
            'No Puja locations are currently available.'
          ) : filters.distanceRadius ? (
            'No Puja locations found within this distance. Try increasing the distance radius.'
          ) : (
            <>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>No Puja locations found for your search.</p>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#777' }}>Try a different search or clear some filters.</p>
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  backgroundColor: '#8b0000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Clear all filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Results Rendering: List View */}
      {!loading && !error && processedPujas.length > 0 && viewMode === 'list' && (
        <>
          <div style={{ marginBottom: '14px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
            Showing {processedPujas.length} {processedPujas.length === 1 ? 'Puja pandal' : 'Puja pandals'}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {processedPujas.map((puja) => (
              <PujaCard key={puja.id} puja={puja} distance={puja._distance} />
            ))}
          </div>
        </>
      )}

      {/* Results Rendering: Map View (Synchronized with filtered list) */}
      {!loading && !error && processedPujas.length > 0 && viewMode === 'map' && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ marginBottom: '12px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
            Displaying {processedPujas.length} locations on interactive map
          </div>
          <MapView
            pujas={processedPujas}
            userPosition={userPosition}
            height="560px"
            onLocateUser={requestLocation}
            locating={locating}
          />
        </div>
      )}
    </main>
  );
}

export default PujasPage;