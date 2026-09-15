import json
import os
from pathlib import Path
from sqlalchemy import text

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

            desc = rec.get('theme_description') or rec.get('description')
            parking_val = rec.get('parking') if 'parking' in rec else rec.get('parking_available', False)
            toilet_val = rec.get('toilet') if 'toilet' in rec else rec.get('restrooms_available', False)
            med_val = rec.get('medical_assistance') if 'medical_assistance' in rec else rec.get('medical_facility', False)
            access_val = rec.get('accessibility') if 'accessibility' in rec else rec.get('wheelchair_accessible', False)

            if existing:
                existing.theme = rec.get('theme', existing.theme)
                if desc:
                    existing.description = desc
                if existing.latitude is None and rec.get('latitude') is not None:
                    existing.latitude = rec.get('latitude')
                    existing.longitude = rec.get('longitude')
                updated += 1
            else:
                # Use raw SQL insert for explicit ID retention without tripping sequence errors
                insert_stmt = text("""
                    INSERT INTO pujas (
                        id, name, area, address, latitude, longitude,
                        theme, description, parking, toilet, medical_assistance,
                        accessibility, food, verified, created_at, updated_at
                    ) VALUES (
                        :id, :name, :area, :address, :latitude, :longitude,
                        :theme, :description, :parking, :toilet, :medical_assistance,
                        :accessibility, :food, :verified, NOW(), NOW()
                    )
                    ON CONFLICT (id) DO UPDATE SET
                        theme = EXCLUDED.theme,
                        description = COALESCE(EXCLUDED.description, pujas.description),
                        latitude = COALESCE(pujas.latitude, EXCLUDED.latitude),
                        longitude = COALESCE(pujas.longitude, EXCLUDED.longitude)
                """)
                db.execute(insert_stmt, {
                    'id': rec.get('id'),
                    'name': rec.get('name'),
                    'area': rec.get('area'),
                    'address': rec.get('address'),
                    'latitude': rec.get('latitude'),
                    'longitude': rec.get('longitude'),
                    'theme': rec.get('theme'),
                    'description': desc,
                    'parking': parking_val,
                    'toilet': toilet_val,
                    'medical_assistance': med_val,
                    'accessibility': access_val,
                    'food': rec.get('food', False),
                    'verified': rec.get('verified', False)
                })
                inserted += 1

        db.commit()

        # Update Postgres sequence to highest ID so future inserts won't conflict
        try:
            db.execute(text("SELECT setval(pg_get_serial_sequence('pujas', 'id'), coalesce(max(id), 1)) FROM pujas;"))
            db.commit()
        except Exception:
            pass

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
