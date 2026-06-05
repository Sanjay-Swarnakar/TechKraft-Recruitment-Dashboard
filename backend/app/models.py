from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database import Base


# 👤 USER TABLE
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# 👨‍💼 CANDIDATE TABLE
class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    skills = Column(Text, nullable=True)
    experience = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)