from datetime import datetime, timedelta
from zoneinfo import ZoneInfo 
from jose import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256") 

def creer_token(data: dict, expire_minutes=30):
    expire = datetime.now(ZoneInfo("Europe/Paris")) + timedelta(minutes=expire_minutes)
    to_encode = {**data, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


