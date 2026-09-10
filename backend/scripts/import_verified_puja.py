"""
Administrative utility to safely validate and import verified Purba Bardhaman Durga Puja records.
Enforces the mandatory Data Trust Rule:
- No synthetic or fake locations allowed.
- Validates geo-coordinates within Purba Bardhaman district bounds.
- Explicitly flags verified status and records timestamp.
"""
import sys
from pathlib import Path

# Ensure backend root is on sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from datetime import datetime, timezone
from app.db.session import SessionLocal
from app.models.puja import Puja

BARDHAMAN_BOUNDS = {
    "min_lat": 22.8,
    "max_lat": 23.8,
    "min_lng": 87.3,
    "max_lng": 88.5,
}

def validate_coords(lat: float, lng: float):
    if not (BARDHAMAN_BOUNDS["min_lat"] <= lat <= BARDHAMAN_BOUNDS["max_lat"]):
        raise ValueError(f"Latitude {lat} is outside Purba Bardhaman bounds ({BARDHAMAN_BOUNDS['min_lat']} - {BARDHAMAN_BOUNDS['max_lat']})")
    if not (BARDHAMAN_BOUNDS["min_lng"] <= lng <= BARDHAMAN_BOUNDS["max_lng"]):
        raise ValueError(f"Longitude {lng} is outside Purba Bardhaman bounds ({BARDHAMAN_BOUNDS['min_lng']} - {BARDHAMAN_BOUNDS['max_lng']})")

def add_verified_puja(name: str, area: str, address: str, lat: float, lng: float, theme: str = None, description: str = None):
    validate_coords(lat, lng)
    db = SessionLocal()
    try:
        new_puja = Puja(
            name=name.strip(),
            area=area.strip(),
            address=address.strip(),
            latitude=lat,
            longitude=lng,
            theme=theme.strip() if theme else None,
            description=description.strip() if description else None,
            verified=True,
            crowd_status="Low",
        )
        db.add(new_puja)
        db.commit()
        db.refresh(new_puja)
        print(f"[SUCCESS] Verified Puja created: ID={new_puja.id} Name='{new_puja.name}' Verified={new_puja.verified}")
        return new_puja.id
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Could not insert verified puja: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Purba Bardhaman Verified Puja Management Tool Ready.")
