#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

echo "Waiting for Postgres at $host..."
until pg_isready -h "$host" -U "postgres"; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Postgres is up - running migrations..."
  
  npx drizzle-kit generate
  npx drizzle-kit migrate

  # Wait until at least one file exists inside drizzle folder
  echo "Waiting for migration files to appear..."
  while [ -z "$(ls -A ./drizzle 2>/dev/null)" ]; do
    echo "No migration files yet, sleeping 1s..."
    sleep 1
  done
  echo "Migration files detected. Continuing..."
else
  echo "Postgres is up - skipping migrations (hybrid mode)"
  echo "Deleting contents inside drizzle folder only..."
  rm -rf ./drizzle/* ./drizzle/.* 2>/dev/null
fi

echo "Starting backend..."
exec $cmd