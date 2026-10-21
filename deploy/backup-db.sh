#!/usr/bin/env bash
set -euo pipefail

cd /home/benjafyl/apps/bobbys-petshop
backup_dir=/backups/bobbys-petshop
mkdir -p "$backup_dir"
chmod 700 "$backup_dir"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
temporary=$(mktemp "$backup_dir/.bobbys-${stamp}.XXXXXX")
trap 'rm -f "$temporary"' EXIT

docker compose exec -T postgres pg_dump -U bobbys_app -d bobbys_petshop -Fc > "$temporary"
test -s "$temporary"
docker compose exec -T postgres pg_restore --list < "$temporary" > /dev/null
chmod 600 "$temporary"
mv "$temporary" "$backup_dir/bobbys-${stamp}.dump"
trap - EXIT
