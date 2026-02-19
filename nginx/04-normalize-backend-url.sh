#!/bin/sh
set -eu

# Ensure BACKEND_URL always has a valid scheme for nginx proxy_pass.
if [ -z "${BACKEND_URL:-}" ]; then
  BACKEND_URL="https://sistema-de-cursos-production.up.railway.app"
elif ! printf '%s' "$BACKEND_URL" | grep -Eq '^https?://'; then
  BACKEND_URL="https://$BACKEND_URL"
fi

export BACKEND_URL
