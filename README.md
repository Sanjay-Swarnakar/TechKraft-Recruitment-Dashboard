# TechKraft Recruitment Dashboard (Backend)

A FastAPI-based backend system for managing user authentication and candidate records with JWT-based security.

---

## 🚀 Tech Stack

- FastAPI
- SQLAlchemy
- SQLite
- Passlib (bcrypt)
- JWT (python-jose)
- Uvicorn

---

## 📁 Project Structure
backend/
│
├── app/
│ ├── main.py
│ ├── database.py
│ ├── models.py
│ ├── schemas.py
│ ├── auth.py
│ ├── routers/
│ │ ├── auth.py
│ │ └── candidates.py
│
├── requirements.txt
└── venv/


---

## ⚙️ Setup Instructions

####1. github setup

```bash
git clone <repo-url>
cd TechKraft-Recruitment-Dashboard/backend

### 2. Create Virtual Environment
python -m venv venv
venv\Scripts\activate   # Windows

###3. install dependencies
pip install -r requirements.txt

###4.Run Server
uvicorn app.main:app --reload

### 5. Open API Docs
http://127.0.0.1:8000/docs