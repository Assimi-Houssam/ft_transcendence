FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app
COPY . /app/

RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip install -r requirements.txt

CMD sh -c "sleep 3 && python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"