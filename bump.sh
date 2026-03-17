#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 2.8.0"
  exit 1
fi

VERSION="$1"

if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Version must be in format X.Y.Z (e.g., 2.8.0)"
  exit 1
fi

cd "$(dirname "$0")"

echo "Bumping version to $VERSION"

jq --arg v "$VERSION" '.version = $v' like/package.json > like/package.json.tmp && mv like/package.json.tmp like/package.json
jq --arg v "$VERSION" '.version = $v' like/jsr.json > like/jsr.json.tmp && mv like/jsr.json.tmp like/jsr.json

git add like/package.json like/jsr.json
git commit -m "Bump to v$VERSION"
git tag "v$VERSION"

echo "✓ Committed and tagged v$VERSION"
echo "Run 'git push --follow-tags' to push"
