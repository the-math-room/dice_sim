#!/usr/bin/env bash
set -euo pipefail

find . \
  -type f \
  ! -path './node_modules/*' \
  ! -path './.git/*' \
  ! -path './dist/*' \
  ! -path './build/*' \
  ! -path './coverage/*' \
  ! -path './.vite/*' \
  ! -path './.vitest/*' \
  ! -name '*.log' \
  ! -name 'package-lock.json' \
  | sort \
  | while read -r file; do
      echo
      echo "===== $file ====="
      echo
      cat "$file"
    done