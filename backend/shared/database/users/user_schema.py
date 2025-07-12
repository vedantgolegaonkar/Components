import json
from sqlalchemy import Column, Integer, String, BigInteger, Boolean, DateTime, ForeignKey
from shared.database.base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  # will store hashed
    mobile_number = Column(BigInteger)
    country_id = Column(Integer, ForeignKey('countries.id'))
    region_id = Column(Integer, ForeignKey('states.id'))
    city_id = Column(Integer, ForeignKey('cities.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "mobile_number": self.mobile_number,
            "country_id": self.country_id,
            "region_id": self.region_id,
            "city_id": self.city_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_active": self.is_active
            })

