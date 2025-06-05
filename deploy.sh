#!/bin/bash

set -e
set -o pipefail

echo "===> Iniciando deploy..."
docker compose up -d

echo "===> Aguardando inicialização dos containers..."

TIMEOUT=60
INTERVAL=5
ELAPSED=0

until docker compose ps | grep -q "Up" || [ $ELAPSED -ge $TIMEOUT ]; do
  echo "Aguardando serviços iniciarem..."
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done

echo "===> Verificando logs..."
docker compose logs --tail=20

echo "===> Testando saúde dos serviços..."

until docker exec $(docker compose ps -q postgres) pg_isready -U postgres; do
  echo "Aguardando Postgres..."
  sleep 5
done
echo "Postgres pronto!"

until docker exec $(docker compose ps -q redis) redis-cli ping | grep -q "PONG"; do
  echo "Aguardando Redis..."
  sleep 5
done
echo "Redis pronto!"

until docker exec $(docker compose ps -q rabbitmq) rabbitmq-diagnostics check_running; do
  echo "Aguardando RabbitMQ..."
  sleep 5
done
echo "RabbitMQ pronto!"

echo "===> Executando testes de integração dos serviços"

if [ ! -d "./integration" ]; then
  echo "Erro: Diretório de testes de integração não encontrado!"
  exit 1
fi

cd ./integration
npm i || { echo "Erro ao instalar dependências!"; exit 1; }
node index.js || { echo "Erro nos testes de integração!"; exit 1; }

echo "===> Todos os serviços estão operacionais!"
