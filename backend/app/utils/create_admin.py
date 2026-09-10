import argparse
import sys
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.user import User
from sqlalchemy import select


def bootstrap_admin(name: str, email: str, password: str):
    email = email.strip().lower()
    if len(password) < 8:
        print("Error: Password must be at least 8 characters long.")
        sys.exit(1)

    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == email))
        if user:
            user.role = "admin"
            user.password_hash = get_password_hash(password)
            user.name = name
            print(f"Existing user '{email}' successfully promoted to admin.")
        else:
            admin_user = User(
                name=name,
                email=email,
                password_hash=get_password_hash(password),
                role="admin",
            )
            db.add(admin_user)
            print(f"Admin account '{email}' created successfully.")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Bootstrap or promote an administrative account.")
    parser.add_argument("--name", required=True, help="Full name of admin user")
    parser.add_argument("--email", required=True, help="Email address of admin user")
    parser.add_argument("--password", required=True, help="Secure password for admin user")
    args = parser.parse_args()
    bootstrap_admin(args.name, args.email, args.password)