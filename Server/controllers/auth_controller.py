from sqlmodel import SQLModel, Session, create_engine, select
from Model import User as UserTable
from fastapi import HTTPException
from .Chat_controller import engine, init_db
import bcrypt
from config.config import JWT_SECRET_KEY, JWT_ALGORITHM
from datetime import datetime, timedelta
import jwt

def create_access_token(user_id: int):

    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=7)
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )
def verify_token(token: str):

    return jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM]
    )
def RegisterUser(username: str, email: str, password: str):
    init_db()
    with Session(engine) as session:
        # Check if the user already exists
        existing_user = session.exec(select(UserTable).where(UserTable.email == email)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash the password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create a new user
        new_user = UserTable(username=username, email=email, password_hash=password_hash.decode('utf-8'))
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
    
    return {"message": "User registered successfully", "user_id": new_user.id}


def LoginUser(email:str , password:str):
    init_db()
    with Session(engine) as session:
        user = session.exec(select(UserTable).where(UserTable.email == email)).first()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        access_token = create_access_token(user.id)
        return {"access_token": access_token, "token_type": "bearer"}    
    

def verify_token(token:str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return int(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")