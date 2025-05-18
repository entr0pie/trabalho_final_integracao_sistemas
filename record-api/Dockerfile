FROM python:3.13-slim

RUN apt-get update && apt-get install -y curl libpq-dev
RUN curl -sSL https://install.python-poetry.org | python3

ENV PATH="/root/.local/bin:/app/.venv/bin:$PATH"
ENV POETRY_VIRTUALENVS_IN_PROJECT=true

WORKDIR /app

COPY . .
COPY .env.docker .env

RUN poetry install --no-root

EXPOSE 8000

CMD ["uvicorn", "src.record_api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]