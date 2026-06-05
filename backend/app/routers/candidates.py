from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_current_user

from app.database import SessionLocal
from app import models
from fastapi import HTTPException

from app.schemas import CandidateCreate, CandidateUpdate   # ✅ FIXED IMPORT

router = APIRouter(prefix="/candidates", tags=["Candidates"])


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔹 TEST ROUTE
@router.get("/")
def get_candidates():
    return {"message": "Candidates route is working 🚀"}


# 🔹 CREATE CANDIDATE
@router.post("/")
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    new_candidate = models.Candidate(
        name=candidate.name,
        email=candidate.email,
        phone=candidate.phone,
        skills=candidate.skills,
        experience=candidate.experience
    )

    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return {
        "message": "Candidate created successfully",
        "id": new_candidate.id
    }


# 🔹 GET ALL CANDIDATES
@router.get("/all")
def get_all_candidates(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    return db.query(models.Candidate).all()

# 🔹 GET SINGLE CANDIDATE
@router.get("/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(
        status_code=404,
        detail="Candidate not found"
    )


# 🔹 UPDATE CANDIDATE
@router.put("/{candidate_id}")
def update_candidate(
    candidate_id: int,
    updated_data: CandidateUpdate,
    db: Session = Depends(get_db)
):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(
        status_code=404,
        detail="Candidate not found"
    )


    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(candidate, key, value)

    db.commit()
    db.refresh(candidate)

    return {
        "message": "Candidate updated successfully",
        "data": candidate
    }
@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(
        status_code=404,
        detail="Candidate not found"
    )

    db.delete(candidate)
    db.commit()

    return {"message": "Candidate deleted successfully"}