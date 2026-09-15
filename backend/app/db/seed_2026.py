import json
import os
from pathlib import Path

try:
    from app.db.session import SessionLocal
    from app.models.puja import Puja
except ModuleNotFoundError:
    from backend.app.db.session import SessionLocal
    from backend.app.models.puja import Puja

def get_default_seed_file():
    base_dir = Path(__file__).resolve().parent.parent
    candidate = base_dir / 'data' / 'pujas_seed_2026.json'
    if candidate.exists():
        return candidate
    alt = Path('backend/app/data/pujas_seed_2026.json')
    if alt.exists():
        return alt
    return candidate

def seed_pujas_idempotent(seed_file=None):
    if seed_file is None:
        seed_file = get_default_seed_file()
    
    seed_path = Path(seed_file)
    if not seed_path.exists():
        print(f'Error: Seed file {seed_path} does not exist.')
        return False

    db = SessionLocal()
    try:
        with open(seed_path, 'r', encoding='utf-8') as f:
            records = json.load(f)

        print(f'Loaded {len(records)} records from {seed_path}')
        inserted = 0
        updated = 0

        for rec in records:
            puja_id = rec.get('id')
            existing = None
            if puja_id:
                existing = db.query(Puja).filter(Puja.id == puja_id).first()
            if not existing and rec.get('name') and rec.get('area'):
                existing = db.query(Puja).filter(Puja.name == rec['name'], Puja.area == rec['area']).first()

            if existing:
                existing.theme = rec.get('theme', existing.theme)
                existing.theme_year = rec.get('theme_year', existing.theme_year)
                existing.theme_description = rec.get('theme_description', existing.theme_description)
                if existing.latitude is None and rec.get('latitude') is not None:
                    existing.latitude = rec.get('latitude')
                    existing.longitude = rec.get('longitude')
                updated += 1
            else:
                new_p = Puja(
                    id=rec.get('id'),
                    name=rec.get('name'),
                    area=rec.get('area'),
                    address=rec.get('address'),
                    latitude=rec.get('latitude'),
                    longitude=rec.get('longitude'),
                    theme=rec.get('theme'),
                    theme_year=rec.get('theme_year'),
                    theme_description=rec.get('theme_description'),
                    verified=rec.get('verified', False),
                    wheelchair_accessible=rec.get('wheelchair_accessible', False),
                    parking_available=rec.get('parking_available', False),
                    restrooms_available=rec.get('restrooms_available', False),
                    medical_facility=rec.get('medical_facility', False)
                )
                db.add(new_p)
                inserted += 1

        db.commit()
        print(f'Seed execution finished: {inserted} inserted, {updated} existing preserved/reconciled.')
        
        total_now = db.query(Puja).count()
        print(f'Total Pujas in database now: {total_now}')
        return True
    except Exception as e:
        db.rollback()
        print(f'Error seeding pujas: {e}')
        return False
    finally:
        db.close()

if __name__ == '__main__':
    seed_pujas_idempotent()
