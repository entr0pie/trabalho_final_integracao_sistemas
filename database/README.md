# Para executar o Dockerfile

* Precisa abrir um CMD dentro da pasta do repositório 

```sh
CD avaliacao_final_integracao_sistemas\DATABASE 
docker build -t bd_api-messaging .
docker run -p 5432:5432 --name=bd_api-messaging
```
