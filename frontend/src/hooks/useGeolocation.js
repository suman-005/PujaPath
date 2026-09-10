import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location services.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access was denied. You can still explore Puja locations on the map.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is currently unavailable.');
            break;
          case err.TIMEOUT:
            setError('The request to get your location timed out. Please try again.');
            break;
          default:
            setError('An error occurred while retrieving your location.');
            break;
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    position,
    error,
    requestLocation,
    clearError,
  };
}