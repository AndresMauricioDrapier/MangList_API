#!/bin/bash

# Detener el contenedor
docker container prune
docker image prune

# Obtener los cambios más recientes del repositorio de Git
git fetch
git pull

# Construir el contenedor
docker-compose build

# Volver a ejecutar el contenedor en segundo plano
docker-compose up -d