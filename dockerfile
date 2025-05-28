# Usa uma imagem oficial do Node.js
FROM node:18-alpine

# Define diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos para o container
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Expõe a porta da API
EXPOSE 3000
