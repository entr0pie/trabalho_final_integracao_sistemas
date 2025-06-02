FROM postgres:latest

ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=secret
ENV POSTGRES_DB=api_messaging

WORKDIR /docker-entrypoint-initdb.d

COPY sql/1_create_tables.sql ./

EXPOSE 5433
