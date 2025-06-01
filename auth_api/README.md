# Auth_api

> API de autenticação e registro de usuários

## Setup

- **Verifique o arquivo `.env`**
  
##

### Funcionamento

#### Registrar Usuário: `POST - http://localhost:8000/user`
```
Payload para envio no Body:

{
    "name": "teste_name",
    "lastName": "teste_lastName",
    "email": "teste@teste.com",
    "password": "123"
} 
```
```
Resposta esperada:

{
    "message": "ok",
    "user": {
        "name": "teste_name",
        "lastName": "teste_lastName",
        "email": "teste@teste.com",
        "password": "123"
    }
}
```
#
#### Login - gerar Token: `POST - http://localhost:8000/login`
```
Payload para envio no Body:

{
    "email": "teste@teste.com",
    "password": "123"
}
```
```
Resposta esperada:

{
    "token": "TOKEN_FORNECIDO_PELA_API"
}
```

#
#### Validador de Token (Cacheado): `GET - http://localhost:8000/validate-token`

- Em **Authorization**, escolher **Bearer Token** em **Auth Type**
- Inserir **Token fornecido** no input do Token 

```
Resposta esperada:

{
    "message": "Token válido"
}
```

#
#### Buscar usuário por email: `GET - http://localhost:8000/user?email=[EMAIL DO USUARIO]`
```
Resposta esperada:

{
    "user_id": ID,
    "name": NAME,
    "lastName": LASTNAME,
    "email": EMAIL,
    "password": PASSWORD
}
```
