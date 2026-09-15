import json
import os
import sys
from backend.app.db.session import SessionLocal
from backend.app.models.puja import Puja

def seed_pujas_idempotent(seed_file="backend/app/data/pujas_seed_2026.json"):
    """
    Idempotent, non-destructive Puja dataset seeder.
    - Matches records by primary ID or normalized name.
    - Preserves existing verified flags and demo records (5, 6, 7).
    - Never deletes records.
    - Safe to run multiple times without duplicating data.
    """
    if not os.path.exists(seed_file):
        print(f"Error: Seed file {seed_file} does not exist.")
        return False

    with open(seed_file, "r", encoding="utf-8") as f:
        records = json.load(f)

    db = SessionLocal()
    try:
        inserted = 0
        updated = 0
        existing_pujas = {p.id: p for p in db.query(Puja).all()}
        existing_by_name = {p.name.strip().lower(): p for p in existing_pujas.values()}

        for rec in records:
            rec_id = rec.get("id")
            rec_name = rec.get("name", "").strip().lower()

            existing_record = existing_pujas.get(rec_id) or existing_by_name.get(rec_name)

            if existing_record:
                # Update non-destructive attributes if not verified
                if not existing_record.verified and existing_record.id not in [5, 6, 7]:
                    existing_record.theme = rec.get("theme")
                    existing_record.theme_year = rec.get("theme_year")
                    existing_record.theme_description = rec.get("theme_description")
                    existing_record.area = rec.get("area")
                    existing_record.address = rec.get("address")
                updated += 1
            else:
                new_p = Puja(
                    name=rec.get("name"),
                    area=rec.get("area"),
                    address=rec.get("address"),
                    latitude=rec.get("latitude"),
                    longitude=rec.get("longitude"),
                    theme=rec.get("theme"),
                    theme_year=rec.get("theme_year"),
                    theme_description=rec.get("theme_description"),
                    verified=rec.get("verified", False),
                    wheelchair_accessible=rec.get("wheelchair_accessible", False),
                    parking_available=rec.get("parking_available", False),
                    restrooms_available=rec.get("restrooms_available", False),
                    medical_facility=rec.get("medical_facility", False)
                )
                db.add(new_p)
                inserted += 1

        db.commit()
        print(f"Seed execution finished: {inserted} inserted, {updated} existing preserved/reconciled.")
        return True
    except Exception as e:
        db.rollback()
        print(f"Error seeding pujas: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    seed_pujas_idempotent()
