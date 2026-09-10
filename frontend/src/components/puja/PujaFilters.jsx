import React from 'react';

export function PujaFilters({
  filters,
  onChange,
  onClear,
  themes = [],
  userPosition = null,
}) {
  const updateField = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const removeFilter = (key) => {
    if (typeof filters[key] === 'boolean') {
      onChange({ ...filters, [key]: null });
    } else {
      onChange({ ...filters, [key]: '' });
    }
  };

  // Active filter count and tags
  const activeTags = [];
  if (filters.theme) activeTags.push({ key: 'theme', label: `Theme: ${filters.theme}` });
  if (filters.area) activeTags.push({ key: 'area', label: `Area: ${filters.area}` });
  if (filters.crowdStatus) activeTags.push({ key: 'crowdStatus', label: `Crowd: ${filters.crowdStatus}` });
  if (filters.distanceRadius) activeTags.push({ key: 'distanceRadius', label: `Within ${filters.distanceRadius} km` });
  if (filters.parking) activeTags.push({ key: 'parking', label: 'Parking' });
  if (filters.toilet) activeTags.push({ key: 'toilet', label: 'Toilet' });
  if (filters.food) activeTags.push({ key: 'food', label: 'Food' });
  if (filters.medicalAssistance) activeTags.push({ key: 'medicalAssistance', label: 'Medical' });
  if (filters.accessibility) activeTags.push({ key: 'accessibility', label: 'Wheelchair Accessible' });

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '16px', margin: 0, color: '#333', fontWeight: '700' }}>Filters</h2>
        {activeTags.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b0000',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear all ({activeTags.length})
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {activeTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {activeTags.map((tag) => (
            <span
              key={tag.key}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #8b0000',
                color: '#8b0000',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500',
              }}
            >
              {tag.label}
              <button
                type="button"
                onClick={() => removeFilter(tag.key)}
                aria-label={`Remove filter ${tag.label}`}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b0000',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Filter form controls grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {/* Theme select */}
        <div>
          <label htmlFor="filter-theme" style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#555' }}>
            Theme
          </label>
          <select
            id="filter-theme"
            value={filters.theme || ''}
            onChange={(e) => updateField('theme', e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
          >
            <option value="">All Themes</option>
            {themes.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Crowd status select */}
        <div>
          <label htmlFor="filter-crowd" style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#555' }}>
            Crowd Level
          </label>
          <select
            id="filter-crowd"
            value={filters.crowdStatus || ''}
            onChange={(e) => updateField('crowdStatus', e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
          >
            <option value="">All Crowd Levels</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="Heavy">Heavy</option>
          </select>
        </div>

        {/* Distance radius select (Client-side) */}
        <div>
          <label htmlFor="filter-distance" style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#555' }}>
            Distance Radius
          </label>
          <select
            id="filter-distance"
            value={filters.distanceRadius || ''}
            onChange={(e) => updateField('distanceRadius', e.target.value ? Number(e.target.value) : '')}
            disabled={!userPosition}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '13px',
              backgroundColor: !userPosition ? '#e9ecef' : '#ffffff',
            }}
          >
            <option value="">Any Distance</option>
            <option value="1">Within 1 km</option>
            <option value="3">Within 3 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
          </select>
          {!userPosition && (
            <span style={{ fontSize: '11px', color: '#777', display: 'block', marginTop: '2px' }}>
              Requires "Locate Me" permission
            </span>
          )}
        </div>
      </div>

      {/* Facilities checkboxes */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#555' }}>Facilities</legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(filters.parking)}
              onChange={(e) => updateField('parking', e.target.checked ? true : null)}
            />
            Parking
          </label>
          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(filters.toilet)}
              onChange={(e) => updateField('toilet', e.target.checked ? true : null)}
            />
            Toilet
          </label>
          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(filters.food)}
              onChange={(e) => updateField('food', e.target.checked ? true : null)}
            />
            Food
          </label>
          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(filters.medicalAssistance)}
              onChange={(e) => updateField('medicalAssistance', e.target.checked ? true : null)}
            />
            Medical Assistance
          </label>
          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(filters.accessibility)}
              onChange={(e) => updateField('accessibility', e.target.checked ? true : null)}
            />
            Wheelchair Accessibility
          </label>
        </div>
      </fieldset>
    </div>
  );
}

export default PujaFilters;