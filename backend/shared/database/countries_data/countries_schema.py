import json
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from shared.database.base import Base

class Cities(Base):
    __tablename__ = 'cities'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    state_id = Column(Integer, ForeignKey('states.id'))
    country_id = Column(Integer, ForeignKey('countries.id'))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "name": self.name,
            "state_id": self.state_id,
            "country_id": self.country_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
            })

class Countries(Base):
    __tablename__ = 'countries'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    phonecode = Column(Integer)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "name": self.name,
            "phonecode": self.phonecode,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
            })

class States(Base):
    __tablename__ = 'states'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    country_id = Column(Integer, ForeignKey('countries.id'))
    country_code = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

    def __repr__(self):
        return json.dumps({
            "id": self.id,
            "name": self.name,
            "country_id": self.country_id,
            "country_code": self.country_code,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
            })
