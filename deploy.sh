#!/bin/bash

set -e  # Encerra em caso de erro
set -o pipefail

COMPOSE_FILE="docker-compose.yml"
SERVICES=("postgres_custom" "redis_trabalho_final" "auth_api")

echo "🚀 Iniciando deploy com Docker Compose..."
docker-compose -f "$COMPOSE_FILE" up -d --build

echo "⌛ Aguardando serviços ficarem saudáveis..."

# Função para aguardar saúde de um serviço
wait_for_health() {
  local container_name=$1
  local retries=30

  echo "⏳ Aguardando saúde de $container_name..."

  for ((i=1; i<=retries; i++)); do
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no_healthcheck")

    if [[ "$health" == "healthy" ]]; then
      echo "✅ $container_name está saudável!"
      return 0
    elif [[ "$health" == "no_healthcheck" ]]; then
      echo "⚠️  $container_name não possui healthcheck definido. Continuando..."
      return 0
    fi

    sleep 2
  done

  echo "❌ Timeout aguardando saúde de $container_name"
  exit 1
}

# Aguarda todos os serviços
for service in "${SERVICES[@]}"; do
  wait_for_health "$service"
done

echo "📜 Logs recentes (últimas 20 linhas por serviço):"
for service in "${SERVICES[@]}"; do
  echo -e "\n🔹 Logs de $service:"
  docker logs --tail 20 "$service"
done

echo -e "\n✅ Deploy finalizado com sucesso!"
