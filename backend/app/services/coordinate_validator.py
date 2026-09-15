from typing import Optional, Tuple, Dict, Any

# Purba Bardhaman geographical envelope
LAT_MIN = 22.8000
LAT_MAX = 23.8000
LNG_MIN = 87.3000
LNG_MAX = 88.5000

def validate_purba_bardhaman_coordinates(lat: Any, lng: Any) -> Tuple[bool, Optional[str]]:
    """
    Validates that latitude and longitude fall strictly within
    the Purba Bardhaman geographical envelope.
    Rejects strings, NaNs, non-numerics, swapped coords, or out-of-district coords.
    """
    if lat is None or lng is None:
        return False, "Coordinates cannot be None."

    try:
        lat_f = float(lat)
        lng_f = float(lng)
    except (ValueError, TypeError):
        return False, "Coordinates must be numeric."

    # Check for NaN / Infinite
    if lat_f != lat_f or lng_f != lng_f or abs(lat_f) == float('inf') or abs(lng_f) == float('inf'):
        return False, "Coordinates cannot be NaN or Infinite."

    # Check for swapped coordinates (where lng is in lat range or vice versa)
    if LNG_MIN <= lat_f <= LNG_MAX and LAT_MIN <= lng_f <= LAT_MAX:
        return False, "Latitude and Longitude appear to be inverted/swapped."

    # Check envelope
    if not (LAT_MIN <= lat_f <= LAT_MAX):
        return False, f"Latitude {lat_f} is outside Purba Bardhaman envelope [{LAT_MIN}, {LAT_MAX}]."

    if not (LNG_MIN <= lng_f <= LNG_MAX):
        return False, f"Longitude {lng_f} is outside Purba Bardhaman envelope [{LNG_MIN}, {LNG_MAX}]."

    return True, None
