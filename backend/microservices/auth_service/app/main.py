import os
import sys
from datetime import datetime
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, field_validator, model_validator
from pydantic import StringConstraints
from typing import Annotated, Optional
import re

from werkzeug.security import generate_password_hash, check_password_hash

from shared.database.countries_data.countries_schema import Cities, Countries, States
from shared.database.database import Session 
from shared.database.users.user_schema import User


# ------------------------
# Dummy OTP API call
# ------------------------
def send_otp_to_user(phone_number: int):
    # Here you would call an external OTP service.
    print(f"Sending OTP to phone number: {phone_number}")
    # This is just a dummy print. You'd actually integrate with Twilio, Msg91, etc.


# ------------------------
# Pydantic v2 Schema
# ------------------------
class RegisterUser(BaseModel):
    fullName: str
    email: Optional[EmailStr] = None
    password: Optional[Annotated[
        str, 
        StringConstraints(min_length=8, max_length=18)
    ]] = None
    confirmPassword: Optional[str] = None
    phoneNumber: Optional[int] = None
    country: str
    state: str
    city: str

    @model_validator(mode='after')
    def check_email_or_phone_and_passwords(self) -> 'RegisterUser':
        if not self.email and not self.phoneNumber:
            raise ValueError("Either email or phoneNumber must be provided")
        
        if self.phoneNumber and not self.password:
            # Assume OTP flow, so skip password checks
            return self
        
        # Normal password checks if using email or both
        if self.password != self.confirmPassword:
            raise ValueError("password and confirmPassword do not match")
        return self

    @field_validator('password')
    def password_strength(cls, v):
        if v is None:
            return v  # Allow None for OTP flow
        if not re.search(r"[A-Z]", v):
            raise ValueError("password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("password must contain at least one number")
        return v


def validate_location(db: Session, country_name: Optional[str], state_name: Optional[str], city_name: Optional[str]):
    """
    Validates the provided country, state, and city names and returns their IDs.
    If any of them is None, it skips validation for that level.
    """
    country_id, state_id, city_id = None, None, None

    if country_name:
        country = db.query(Countries).filter(Countries.name.ilike(country_name)).first()
        if not country:
            raise HTTPException(status_code=400, detail=f"Invalid country: {country_name}")
        country_id = country.id
    else:
        country = None

    if state_name:
        if not country:
            raise HTTPException(status_code=400, detail="State provided but no valid country specified.")
        state = db.query(States).filter(
            States.name.ilike(state_name),
            States.country_id == country_id
        ).first()
        if not state:
            raise HTTPException(status_code=400, detail=f"Invalid state: {state_name}")
        state_id = state.id

    if city_name:
        if not country or not state_id:
            raise HTTPException(status_code=400, detail="City provided but no valid state or country specified.")
        city = db.query(Cities).filter(
            Cities.name.ilike(city_name),
            Cities.state_id == state_id,
            Cities.country_id == country_id
        ).first()
        if not city:
            raise HTTPException(status_code=400, detail=f"Invalid city: {city_name}")
        city_id = city.id

    return country_id, state_id, city_id



# ------------------------
# FastAPI app
# ------------------------
app = FastAPI(
    title="Authentication Microservice",
    description="NONE",
    version="1.0.0"
)


# ------------------------
# This api is to register new user 
# ------------------------
@app.post("/api/signup")
async def register_user(user: RegisterUser):
    db = Session()
    try:
        # Check if user already exists (by email or phone)
        existing_user = db.query(User).filter(
            (User.email == user.email) | (User.mobile_number == user.phoneNumber)
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists with this email or phone")

        # Validate location only if provided
        country_id, state_id, city_id = validate_location(
            db,
            user.country,
            user.state,
            user.city
        )

        # Handle OTP registration
        if user.phoneNumber and not user.password:
            send_otp_to_user(user.phoneNumber)
            return {"message": f"OTP sent to {user.phoneNumber}"}

        # Insert user with password
        new_user = User(
            username=user.fullName,
            email=user.email,
            password=generate_password_hash(user.password),
            mobile_number=user.phoneNumber,
            country_id=country_id,
            region_id=state_id,
            city_id=city_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User registered successfully",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "mobile_number": new_user.mobile_number,
                "country": user.country,
                "state": user.state,
                "city": user.city
            }
        }

    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    finally:
        db.close()


# ------------------------
# This API is to login a user by email 
# ------------------------
@app.post("/api/login-by-email")
async def email_login():
    return { "message": "this is user login by email" }


# ------------------------
# This API is to login a user by phonenumber 
# ------------------------
@app.post("/api/login-by-phonenumber")
async def phonenumber_login():
    return { "message": "this is user login by phonenumber" }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

