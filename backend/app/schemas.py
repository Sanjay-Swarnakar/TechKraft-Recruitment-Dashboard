from pydantic import BaseModel
from typing import Optional


class CandidateCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[int] = 0
    
class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[int] = None
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
class UserLogin(BaseModel):
    email: str
    password: str