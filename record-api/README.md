# 📡 record-api

API para registro e recuperação de mensagens entre usuários, utilizando FastAPI + Redis + PostgreSQL, com cache e testes automatizados via Postman.

---

## 🚀 Stack 

- **Linguagem:** Python 3.13
- **Framework:** FastAPI
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **ORM:** SQLModel (SQLAlchemy)
- **Containerização:** Docker + Docker Compose
- **Gerenciador de pacotes:** Poetry

---

## 🏗️ Estrutura de Pastas

```
record-api/
├── src/
│   └── record_api/
│       ├── config/         # Redis, env, health
│       ├── dtos/           # DTOs (request/response)
│       ├── model/          # Modelos SQLModel
│       ├── routers/        # Rotas
│       ├── services/       # Serviços (lógica de negócio)
│       └── __init__.py     # Inicializador da API
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔌 Endpoints

### `GET /health`
Verifica a saúde da API, conexão com PostgreSQL e Redis.

**Response:**
```json
{
  "status": "UP",
  "detail": {
    "database": true,
    "redis": true
  }
}
```

---

### `POST /messages`
Salva uma nova mensagem entre dois usuários.

**Request Body:**
```json
{
  "message": "Olá, tudo bem?",
  "user_id_send": 1,
  "user_id_receive": 2
}
```

**Response:**
```json
{
  "status": "success",
  "message_id": 1
}
```

---

### `GET /messages`
Lista mensagens entre dois usuários paginadas.

**Query Params:**
- `user_id_send` (int)
- `user_id_receive` (int)
- `page` (int, default=1)
- `size` (int, default=10)

**Response:**
```json
[
  {
    "message_id": 1,
    "message": "Olá, tudo bem?",
    "user_id_send": 1,
    "user_id_receive": 2
  }
]
```

---

## Build e Deploy

- Primeiro, instale o [Poetry](https://python-poetry.org).
- Depois, instale as dependências do projeto.

```bash
poetry install
```

- Por fim, execute a API com o seguinte comando:

```bash
uvicorn src.record_api:app --port 8080
```

Acesse:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
---
