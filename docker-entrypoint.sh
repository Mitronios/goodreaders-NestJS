#!/bin/sh
set -e

HOST="${MONGO_HOST:-mongo}"
PORT="${MONGO_PORT:-27017}"

echo "Waiting for MongoDB at ${HOST}:${PORT}..."
# wait until Mongo accepts TCP connections
until nc -z "$HOST" "$PORT"; do
  echo "mongo not ready - sleeping..."
  sleep 1
done

echo "Mongo is available, starting app..."
exec node dist/main
