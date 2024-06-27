FROM python:3.11-slim-bookworm

WORKDIR /app
COPY . /app/

RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip install -r requirements.txt

ENTRYPOINT ["docker-entrypoint.sh"]