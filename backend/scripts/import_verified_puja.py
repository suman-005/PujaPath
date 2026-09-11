"""
PujaPath Stage 19: Staged Production Ingestion Utility
Safely imports the first verified batch of Pujas and Emergency Contacts.
Guarantees:
- Never touches existing demo records.
- Enforces single database transaction with automatic rollback on error.
- Enforces strict Purba Bardhaman coordinate boundaries.
- Prevents duplicate insertions.
- Supports dry-run validation mode.
"""
import os
import sys
import argparse
from datetime import datetime, timezone
from pathlib import Path

backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.db.session import SessionLocal
from app.models.puja import Puja
from app.models.emergency import EmergencyContact

BARDHAMAN_BOUNDS = {
    "min_lat": 22.8,
    "max_lat": 23.8,
    "min_lng": 87.3,
    "max_lng": 88.5,
}

# Approved First Safe Batch: Maximum 5 Pujas with verified identity, location & coordinates
VERIFIED_PUJA_BATCH = [
    {
        "candidate_id": "CAND-11",
        "name": "Sarvamangala Mandir Durgotsav",
        "area": "Sarvamangala Para",
        "address": "Sarvamangala Temple Complex, Bardhaman",
        "latitude": 23.2389,
        "longitude": 87.8638,
        "theme": "Sabeki Traditional Sharad Mahotsav",
        "description": "Centuries-old presiding deity temple of Bardhaman; traditional royal Navapatrika rituals followed per historic customs.",
        "opening_time": "05:30",
        "closing_time": "22:00",
        "parking": False,
        "toilet": True,
        "food": True,
        "medical_assistance": True,
        "accessibility": False,
        "contact": None,
        "crowd_status": "High",
        "verified": True,
    },
    {
        "candidate_id": "CAND-12",
        "name": "Baikunthapur Joydurga Mandir",
        "area": "Baikunthapur",
        "address": "Baikunthapur Temple Compound, Bardhaman",
        "latitude": 23.2420,
        "longitude": 87.8920,
        "theme": "Traditional Joydurga Puja",
        "description": "Historic temple housing Ashtadhatu Joydurga worshipped under royal sanction of the Maharaja of Burdwan.",
        "opening_time": "06:00",
        "closing_time": "21:00",
        "parking": True,
        "toilet": False,
        "food": False,
        "medical_assistance": False,
        "accessibility": False,
        "contact": None,
        "crowd_status": "Moderate",
        "verified": True,
    },
    {
        "candidate_id": "CAND-10",
        "name": "Mayur Mahal Sarbojanin",
        "area": "Rajbati Precinct",
        "address": "Mayur Mahal Gate, Bardhaman Rajbati Campus",
        "latitude": 23.2505,
        "longitude": 87.8520,
        "theme": None,  # 2026 theme announcement pending
        "description": "Heritage community puja located at the gateway of the historic Burdwan Raj Palace compound.",
        "opening_time": None,
        "closing_time": None,
        "parking": False,
        "toilet": False,
        "food": False,
        "medical_assistance": False,
        "accessibility": False,
        "contact": None,
        "crowd_status": "Low",
        "verified": True,
    },
    {
        "candidate_id": "CAND-13",
        "name": "Guskara Chongder Bari Durga Puja",
        "area": "Guskara",
        "address": "Chongder Para, Guskara Municipality, Purba Bardhaman",
        "latitude": 23.4985,
        "longitude": 87.7510,
        "theme": "Traditional Bonedi Bari Sabeki Puja",
        "description": "Century-old heritage Bonedi Bari Durga Puja in Guskara celebrated with traditional Ekchala protima and ancestral rites.",
        "opening_time": "07:00",
        "closing_time": "22:00",
        "parking": True,
        "toilet": False,
        "food": False,
        "medical_assistance": False,
        "accessibility": False,
        "contact": None,
        "crowd_status": "Low",
        "verified": True,
    },
    {
        "candidate_id": "CAND-14",
        "name": "Guskara Patra Bari Durga Puja",
        "area": "Guskara",
        "address": "Patra Para, Guskara Municipality, Purba Bardhaman",
        "latitude": 23.4960,
        "longitude": 87.7535,
        "theme": "Sabeki Bonedi Puja",
        "description": "Traditional heritage family puja in Guskara celebrated with classical Dhaak and ancestral rituals.",
        "opening_time": "07:00",
        "closing_time": "21:30",
        "parking": False,
        "toilet": False,
        "food": False,
        "medical_assistance": False,
        "accessibility": False,
        "contact": None,
        "crowd_status": "Low",
        "verified": True,
    },
]

VERIFIED_EMERGENCY_BATCH = [
    {
        "category": "Police",
        "name": "Burdwan Sadar Police Station",
        "phone": "0342-2662495",
        "location": "Purba Bardhaman Sadar",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
    {
        "category": "Police",
        "name": "District Police Control Room (Purba Bardhaman)",
        "phone": "0342-2662498",
        "location": "SP Office, Burdwan",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
    {
        "category": "Hospital",
        "name": "Burdwan Medical College & Hospital (BMCH)",
        "phone": "0342-2656661",
        "location": "Baburbag, Bardhaman",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
    {
        "category": "Fire",
        "name": "Burdwan Fire Station",
        "phone": "0342-2560101",
        "location": "Burdwan Town",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
    {
        "category": "Ambulance",
        "name": "National Emergency Ambulance Service",
        "phone": "108",
        "location": "Purba Bardhaman (Statewide)",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
    {
        "category": "Child Support",
        "name": "Childline India Emergency Helpline",
        "phone": "1098",
        "location": "Purba Bardhaman (Nationwide)",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
    {
        "category": "Women Safety",
        "name": "West Bengal Women Helpline",
        "phone": "1091",
        "location": "Purba Bardhaman (Statewide)",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
    {
        "category": "Disaster Management",
        "name": "District Emergency Operation Centre (DEOC)",
        "phone": "0342-2662580",
        "location": "Collectorate Compound, Burdwan",
        "verified": True,
        "last_verified_at": datetime(2026, 9, 10, tzinfo=timezone.utc),
    },
]

def validate_coords(lat: float, lng: float):
    if not (BARDHAMAN_BOUNDS["min_lat"] <= lat <= BARDHAMAN_BOUNDS["max_lat"]):
        raise ValueError(f"Latitude {lat} out of bounds ({BARDHAMAN_BOUNDS['min_lat']} - {BARDHAMAN_BOUNDS['max_lat']})")
    if not (BARDHAMAN_BOUNDS["min_lng"] <= lng <= BARDHAMAN_BOUNDS["max_lng"]):
        raise ValueError(f"Longitude {lng} out of bounds ({BARDHAMAN_BOUNDS['min_lng']} - {BARDHAMAN_BOUNDS['max_lng']})")

def execute_ingest(commit: bool = False):
    db = SessionLocal()
    try:
        print("=" * 60)
        print(f"RUNNING INGESTION (mode={'COMMIT (PRODUCTION)' if commit else 'DRY RUN'})")
        print("=" * 60)

        # 1. Baseline Counts
        puja_before = db.query(Puja).count()
        emergency_before = db.query(EmergencyContact).count()
        print(f"Baseline Counts -> Pujas: {puja_before}, Emergency: {emergency_before}")

        # 2. Process Pujas
        pujas_to_insert = []
        for p in VERIFIED_PUJA_BATCH:
            validate_coords(p["latitude"], p["longitude"])
            existing = db.query(Puja).filter(Puja.name.ilike(p["name"]), Puja.area.ilike(p["area"])).first()
            if existing:
                print(f"[SKIP] Puja '{p['name']}' ({p['area']}) already exists with ID={existing.id}")
                continue
            
            new_puja = Puja(
                name=p["name"],
                area=p["area"],
                address=p["address"],
                latitude=p["latitude"],
                longitude=p["longitude"],
                theme=p["theme"],
                description=p["description"],
                opening_time=p["opening_time"],
                closing_time=p["closing_time"],
                parking=p["parking"],
                toilet=p["toilet"],
                food=p["food"],
                medical_assistance=p["medical_assistance"],
                accessibility=p["accessibility"],
                contact=p["contact"],
                crowd_status=p["crowd_status"],
                verified=p["verified"],
            )
            pujas_to_insert.append(new_puja)
            print(f"[STAGE PUJA] '{p['name']}' ({p['area']}) @ ({p['latitude']}, {p['longitude']}) - Verified: {p['verified']}")

        # 3. Process Emergency Contacts
        emergency_to_insert = []
        for e in VERIFIED_EMERGENCY_BATCH:
            existing = db.query(EmergencyContact).filter(
                EmergencyContact.name.ilike(e["name"]),
                EmergencyContact.phone == e["phone"]
            ).first()
            if existing:
                print(f"[SKIP] Emergency Contact '{e['name']}' already exists with ID={existing.id}")
                continue
            
            new_em = EmergencyContact(
                category=e["category"],
                name=e["name"],
                phone=e["phone"],
                location=e["location"],
                verified=e["verified"],
                last_verified_at=e["last_verified_at"],
            )
            emergency_to_insert.append(new_em)
            print(f"[STAGE EMERGENCY] [{e['category']}] '{e['name']}' - {e['phone']}")

        if commit:
            for p in pujas_to_insert:
                db.add(p)
            for e in emergency_to_insert:
                db.add(e)
            
            db.commit()
            print("\n[SUCCESS] Transaction committed successfully to database.")
            
            # Post-commit verification
            puja_after = db.query(Puja).count()
            emergency_after = db.query(EmergencyContact).count()
            print(f"Updated Counts -> Pujas: {puja_after} (+{puja_after - puja_before}), Emergency: {emergency_after} (+{emergency_after - emergency_before})")
            
            print("\nNewly Inserted Pujas:")
            for p in pujas_to_insert:
                db.refresh(p)
                print(f"  ID={p.id} | Name='{p.name}' | Verified={p.verified} | Theme={p.theme}")
                
            print("\nNewly Inserted Emergency Contacts:")
            for e in emergency_to_insert:
                db.refresh(e)
                print(f"  ID={e.id} | Category={e.category} | Name='{e.name}' | Phone={e.phone}")
        else:
            db.rollback()
            print(f"\n[DRY RUN COMPLETE] Validated {len(pujas_to_insert)} Pujas and {len(emergency_to_insert)} Emergency contacts. Database untouched.")
            
    except Exception as ex:
        db.rollback()
        print(f"\n[ERROR] Ingestion transaction failed and was rolled back: {ex}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Stage 19 Production Ingestion")
    parser.add_argument("--commit", action="store_true", help="Commit changes to production database")
    args = parser.parse_args()
    execute_ingest(commit=args.commit)
