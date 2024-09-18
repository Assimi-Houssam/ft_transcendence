FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1 
ENV DJANGO_SETTINGS_MODULE=backend.settings
WORKDIR /app
COPY . /app/

RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip install -r requirements.txt

CMD sh -c "sleep 3 && daphne -b 0.0.0.0 -p 8000 backend.asgi:application"