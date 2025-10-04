#!/bin/bash

# helper to wait for a service
wait_for_service() {
  local host=$1
  local port=$2
  local name=$3

  echo "waiting for $name at $host:$port......................."
  until nc -z "$host" "$port"; do
    sleep 1
  done
  echo "$name is up!"
}

# wait for mysql
wait_for_service mysql 3306 "mysql"

# wait for rabbitmq
wait_for_service rabbitmq 5672 "rabbitmq"

# wait for redis
wait_for_service redis 6379 "redis"

echo "all dependencies are ready. starting the snapnet app......................"
exec node dist/index.js
