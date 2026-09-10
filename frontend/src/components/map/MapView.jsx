import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDirectionsUrl } from '../../utils/directions';

// Default center: Purba Bardhaman (Bardhaman town)
const DEFAULT_CENTER = [23.2324, 87.8615];
const DEFAULT_ZOOM = 13;

// Custom Puja Marker Pin
const createPujaIcon = () =>
  L.divIcon({
    className: 'custom-puja-pin',
    html: `
      <div style="background-color: #8b0000; color: white; border: 2px solid #ffcc00; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
        <span style="transform: rotate(45deg); font-size: 14px; font-weight: bold;">🪔</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });

// Custom User Location Pin
const createUserIcon = () =>
  L.divIcon({
    className: 'custom-user-location-pin',
    html: `
      <div style="background-color: #0066cc; color: white; border: 3px solid white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(0,102,204,0.7);">
        <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });

export function MapView({
  pujas = [],
  userPosition = null,
  center = null,
  zoom = null,
  height = '600px',
  onLocateUser = null,
  locating = false,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userLayerRef = useRef(null);

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = center || DEFAULT_CENTER;
    const initialZoom = zoom || DEFAULT_ZOOM;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Sync Puja Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const validPujas = pujas.filter(
      (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
    );

    const latLngs = [];

    validPujas.forEach((puja) => {
      const lat = puja.latitude;
      const lng = puja.longitude;
      latLngs.push([lat, lng]);

      const directionsUrl = getDirectionsUrl(lat, lng);

      const popupHtml = `
        <div style="font-family: inherit; min-width: 200px;">
          <h3 style="margin: 0 0 4px 0; color: #8b0000; font-size: 15px; font-weight: bold;">${puja.name}</h3>
          ${puja.theme ? `<p style="margin: 0 0 4px 0; font-size: 13px; color: #555;"><strong>Theme:</strong> ${puja.theme}</p>` : ''}
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;"><strong>Area:</strong> ${puja.area}</p>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <a href="/puja/${puja.id}" style="background-color: #8b0000; color: white; text-decoration: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; display: inline-block;">View Details</a>
            ${
              directionsUrl
                ? `<a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #e67e22; color: white; text-decoration: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; display: inline-block;">Get Directions ↗</a>`
                : ''
            }
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: createPujaIcon() });
      marker.bindPopup(popupHtml);
      markersLayerRef.current.addLayer(marker);
    });

    if (latLngs.length > 1 && !userPosition) {
      mapInstanceRef.current.fitBounds(latLngs, { padding: [40, 40], maxZoom: 16 });
    } else if (latLngs.length === 1 && !userPosition) {
      mapInstanceRef.current.setView(latLngs[0], 15);
    }
  }, [pujas, userPosition]);

  // 3. Sync User Position
  useEffect(() => {
    if (!mapInstanceRef.current || !userLayerRef.current) return;

    userLayerRef.current.clearLayers();

    if (
      userPosition &&
      typeof userPosition.latitude === 'number' &&
      typeof userPosition.longitude === 'number'
    ) {
      const userLatLng = [userPosition.latitude, userPosition.longitude];

      const marker = L.marker(userLatLng, { icon: createUserIcon() });
      marker.bindPopup(
        `<div style="font-family: inherit; font-size: 13px;"><strong style="color: #0066cc;">Your Current Location</strong></div>`
      );
      userLayerRef.current.addLayer(marker);

      if (userPosition.accuracy) {
        const circle = L.circle(userLatLng, {
          radius: userPosition.accuracy,
          color: '#0066cc',
          fillColor: '#0066cc',
          fillOpacity: 0.1,
          weight: 1,
        });
        userLayerRef.current.addLayer(circle);
      }

      mapInstanceRef.current.setView(userLatLng, 15);
    }
  }, [userPosition]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
      {onLocateUser && (
        <button
          type="button"
          onClick={onLocateUser}
          disabled={locating}
          aria-label="Locate my position on the map"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1000,
            backgroundColor: '#fff',
            border: '2px solid rgba(0,0,0,0.2)',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#333',
            cursor: locating ? 'wait' : 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🎯</span>
          <span>{locating ? 'Locating...' : 'My Location'}</span>
        </button>
      )}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default MapView;