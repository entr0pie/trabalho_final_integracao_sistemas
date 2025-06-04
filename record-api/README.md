# record-api

## Fazendo o build do app

```sh
poetry install
uvicorn src.record_api:app --reload  
```

- Acesse http://localhost:8000/docs.

## Criando o Container Docker

```sh
docker build -t record_api .
docker run -p 8000:8000 record_api
```