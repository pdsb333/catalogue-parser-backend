FROM python:3.12-slim

RUN apt-get update && apt-get upgrade -y

WORKDIR /app

RUN pip install --upgrade pip

COPY requirements/base.txt .
RUN pip install -r base.txt

#COPY requirements/test.txt .
#RUN pip install -r test.txt

COPY . .

CMD alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT