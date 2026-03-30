import os
import sys
import secrets
import string
from apps.api.database import SessionLocal, engine, Base
from apps.api.models.user import User
from apps.api.core.security import get_password_hash
import apps.api.models

def generate_random_password(length=16):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

# Create tables
Base.metadata.create_all(bind=engine)

# Get credentials from environment or defaults
admin_user = os.getenv("ADMIN_USERNAME", "admin")
admin_pass = os.getenv("ADMIN_PASSWORD")

db = SessionLocal()
try:
    admin = db.query(User).filter(User.username == admin_user).first()
    if not admin:
        if not admin_pass:
            admin_pass = generate_random_password()
            print(f"!!! GENERATED RANDOM ADMIN PASSWORD: {admin_pass} !!!")
            print("Please save this password securely.")
        
        print(f"Creating admin user: {admin_user}...")
        admin = User(
            username=admin_user,
            email=f"{admin_user}@markos.local",
            hashed_password=get_password_hash(admin_pass)
        )
        db.add(admin)
        db.commit()
        print(f"Admin user created: {admin_user}")
    else:
        # Optionally update password if provided
        if os.getenv("FORCE_UPDATE_ADMIN") == "true":
            admin.hashed_password = get_password_hash(admin_pass)
            db.commit()
            print(f"Admin user {admin_user} password updated.")
        else:
            print(f"Admin user {admin_user} already exists.")
finally:
    db.close()
