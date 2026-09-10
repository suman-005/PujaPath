"""
Administrative utility to safely validate and import verified Purba Bardhaman Durga Puja records.
Enforces the mandatory Data Trust Rule:
- Zero fabrication: requires verifiable data sources.
- Validates geo-coordinates within Purba Bardhaman district bounds.
- Prevents duplicate entries (matching name + area).
- Supports dry-run validation mode without touching the database.
"""
import sys
import os
import csv
import argparse
from pathlib import Path

# Ensure backend root is on sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

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
        raise ValueError(
            f"Latitude {lat} is outside Purba Bardhaman bounds ({BARDHAMAN_BOUNDS['min_lat']} - {BARDHAMAN_BOUNDS['max_lat']})"
        )
    if not (BARDHAMAN_BOUNDS["min_lng"] <= lng <= BARDHAMAN_BOUNDS["max_lng"]):
        raise ValueError(
            f"Longitude {lng} is outside Purba Bardhaman bounds ({BARDHAMAN_BOUNDS['min_lng']} - {BARDHAMAN_BOUNDS['max_lng']})"
        )

def parse_bool(val):
    if isinstance(val, bool):
        return val
    if not val:
        return False
    return str(val).strip().lower() in ("true", "1", "yes", "y")

def import_puja_record(row: dict, db, dry_run: bool = False):
    name = row.get("name", "").strip()
    area = row.get("area", "").strip()
    address = row.get("address", "").strip()
    source = row.get("source", "").strip()
    verification_notes = row.get("verification_notes", "").strip()

    if not name or not area or not address:
        raise ValueError(f"Record missing required identity fields (name, area, or address): {row}")

    is_verified = parse_bool(row.get("verified", False))
    if is_verified and not source:
        raise ValueError(f"Data Trust Violation: Puja '{name}' is marked verified=True but has no source.")

    lat = float(row["latitude"])
    lng = float(row["longitude"])
    validate_coords(lat, lng)

    # Duplicate check
    existing = db.query(Puja).filter(Puja.name.ilike(name), Puja.area.ilike(area)).first()
    if existing:
        print(f"[SKIP DUPLICATE] Puja '{name}' in '{area}' already exists with ID={existing.id}")
        return existing.id

    if dry_run:
        print(f"[DRY-RUN VALID] Validated '{name}' ({area}) @ ({lat}, {lng}) | Source: {source or 'None'}")
        return None

    new_puja = Puja(
        name=name,
        area=area,
        address=address,
        latitude=lat,
        longitude=lng,
        theme=row.get("theme", "").strip() or None,
        description=row.get("description", "").strip() or None,
        opening_time=row.get("opening_time", "").strip() or None,
        closing_time=row.get("closing_time", "").strip() or None,
        parking=parse_bool(row.get("parking", False)),
        toilet=parse_bool(row.get("toilet", False)),
        food=parse_bool(row.get("food", False)),
        medical_assistance=parse_bool(row.get("medical_assistance", False)),
        accessibility=parse_bool(row.get("accessibility", False)),
        contact=row.get("contact", "").strip() or None,
        crowd_status=row.get("crowd_status", "Low").strip() or "Low",
        verified=is_verified,
    )
    db.add(new_puja)
    db.commit()
    db.refresh(new_puja)
    print(f"[INSERTED] Verified Puja created: ID={new_puja.id} Name='{new_puja.name}' Verified={new_puja.verified}")
    return new_puja.id

def import_from_csv(csv_path: str, dry_run: bool = False):
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found: {csv_path}")

    db = SessionLocal()
    processed = 0
    try:
        with open(csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Skip comments or empty rows
                if not row or not row.get("name") or row["name"].startswith("#"):
                    continue
                import_puja_record(row, db, dry_run=dry_run)
                processed += 1
        print(f"[SUMMARY] Processed {processed} records (dry_run={dry_run}).")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Import failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Purba Bardhaman Verified Puja Import Utility")
    parser.add_argument("--csv", type=str, help="Path to verified pujas CSV file")
    parser.add_argument("--dry-run", action="store_true", help="Validate records without inserting into the database")
    args = parser.parse_args()

    if args.csv:
        import_from_csv(args.csv, dry_run=args.dry_run)
    else:
        print("Purba Bardhaman Verified Puja Management Tool Ready. Use --csv <path> [--dry-run] to import.")
