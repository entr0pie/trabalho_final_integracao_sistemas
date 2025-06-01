# avaliacao_final_integracao_sistemas

### • Kauan Alexandre Mendes da Silva - RGM

## 

#### Para subir o docker-compose execute no terminal: 
```
cd \PASTA_DO_REPOSTORIO

docker-compose up -d --build
```
##
#### Como subir o POSTGRESS no DBeaver: 
- Clicar em **Nova conexão (CTRL + SHIFT + N)** e escolher **Postgress**
- inserir:
    - Banco de dados: **api_messaging**
    - Nome de usuário: **root**
    - Senha: **secret**         
    ![alt text](image.png)

##

#### Como acessar as chaves do Redis:
```
docker exec -it redis_trabalho_final redis-cli

KEYS *
```

##


