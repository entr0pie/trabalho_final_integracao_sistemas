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



