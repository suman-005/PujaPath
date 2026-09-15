import json
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

        for rec in records:
            desc = rec.get('theme_description') or rec.get('description')
            parking_val = rec.get('parking') if 'parking' in rec else rec.get('parking_available', False)
            toilet_val = rec.get('toilet') if 'toilet' in rec else rec.get('restrooms_available', False)
            med_val = rec.get('medical_assistance') if 'medical_assistance' in rec else rec.get('medical_facility', False)
            access_val = rec.get('accessibility') if 'accessibility' in rec else rec.get('wheelchair_accessible', False)
            crowd_val = rec.get('crowd_status') or 'LOW'
            lat_val = rec.get('latitude') if rec.get('latitude') is not None else 23.2400
            lng_val = rec.get('longitude') if rec.get('longitude') is not None else 87.8600

            puja_obj = Puja(
                id=rec.get('id'),
                name=rec.get('name'),
                area=rec.get('area'),
                address=rec.get('address'),
                latitude=lat_val,
                longitude=lng_val,
                theme=rec.get('theme'),
                description=desc,
                parking=parking_val,
                toilet=toilet_val,
                medical_assistance=med_val,
                accessibility=access_val,
                food=rec.get('food', False),
                crowd_status=crowd_val,
                verified=rec.get('verified', False)
            )
            db.merge(puja_obj)

        db.commit()
        total_now = db.query(Puja).count()
        print(f'✓ Success! Total Pujas in database now: {total_now}')
        return True
    except Exception as e:
        db.rollback()
        print(f'Error seeding pujas: {e}')
        return False
    finally:
        db.close()

if __name__ == '__main__':
    seed_pujas_idempotent()
