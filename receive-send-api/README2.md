# receive-send-api

> A Receive-Send-API é uma API desenvolvida em Node.js cuja principal função é gerenciar o recebimento, autenticação, enfileiramento e envio de mensagens. Sua estrutura e fluxo operacional seguem os seguintes passos:

### Funcionamento
#### 1
Recebimento de Mensagens
A API expõe um endpoint que recebe mensagens enviadas por usuários.

#### 2
Autenticação com Auth-API
Antes de processar qualquer mensagem, a API realiza uma consulta à Auth-API para verificar se o usuário está autenticado, utilizando JWT (JSON Web Token) como mecanismo de validação.

#### 3
Armazenamento em Fila
Após a autenticação, a mensagem é armazenada em uma fila, garantindo um processamento assíncrono e escalável.

#### 4
Processamento via Worker
Um endpoint específico (worker) consome os dados da fila e os insere em uma tabela de mensagens (message), armazenando de forma persistente.

#### 5
Consulta de Mensagens
A API fornece um endpoint para consultar as mensagens armazenadas na tabela, e esta consulta também exige validação via JWT, garantindo segurança no acesso.

# 📦 Receive-Send API

> Serviço responsável por enviar, processar e recuperar mensagens entre usuários usando filas e armazenamento em banco de dados.

---

## 🚀 Endpoints

### ✅ POST /message
**Descrição:** Envia uma mensagem de um usuário para outro. A mensagem é adicionada na fila e salva no banco de dados.

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userIdSend": 1,
  "userIdReceive": 2,
  "message": "Olá mundo!"
}
```

**Resposta:**
```json
{
  "msg": "Message sent successfully"
}
```

---

### 🛠️ POST /message/worker
**Descrição:** Inicia o consumo de mensagens da fila entre dois usuários e persiste no banco.

**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "userIdSend": 1,
  "userIdReceive": 2
}
```

**Resposta:**
```json
{
  "msg": "Worker listening"
}
```

---

### 📨 GET /message
**Descrição:** Retorna todas as mensagens trocadas entre o usuário autenticado e os demais usuários do sistema.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query:**
```
?userId=2
```

**Resposta:**
```json
[
  {
    "userId": 1,
    "msg": "Olá mundo!"
  },
  {
    "userId": 1,
    "msg": "Tudo certo aí?"
  }
]
```

---

## 🧱 Tecnologias Usadas
- NestJS com TypeScript
- RabbitMQ para mensageria
- PostgreSQL como banco relacional
- Axios para comunicação entre serviços
- JWT para autenticação via token

---

## 🗂️ Organização

```
receive-send-api/
├── src/
│   ├── message/
│   │   ├── message.controller.ts
│   │   ├── message.module.ts
│   │   └── message.service.ts
│   ├── queue/
│   │   └── queue.service.ts
│   └── main.ts
```



