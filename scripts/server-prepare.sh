#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
umask 077
if [ ! -e .env ]; then
  postgres_password="$(openssl rand -hex 24)"
  auth_secret="$(openssl rand -hex 32)"
  printf 'POSTGRES_PASSWORD=%s\nBETTER_AUTH_SECRET=%s\nENABLE_CUSTOMER_SIGNUP=false\n' "$postgres_password" "$auth_secret" > .env
  echo 'Created private server environment file.'
else
  echo 'Private server environment file already exists; left untouched.'
fi
chmod 600 .env
