#!/usr/bin/env bash
# Build the web app and deploy it to the gh-pages branch (GitHub Pages).
# Usage: bash scripts/deploy-web.sh
set -e
cd "$(dirname "$0")/.."

echo "▸ Exporting web build…"
npx expo export --platform web

cd dist

# Clean URLs: expose each root-level route as <route>/index.html
for f in *.html; do
  case "$f" in
    index.html|404.html|+not-found.html|_sitemap.html) ;;
    *) name="${f%.html}"; mkdir -p "$name"; cp "$f" "$name/index.html" ;;
  esac
done
# Dynamic [id] routes: publish known ids as clean URLs.
for f in *"[id]".html */*"[id]".html; do
  [ -e "$f" ] || continue
  dir="$(dirname "$f")"
  case "$dir" in
    brief) ids="logo brand-identity websites mobile-apps" ;;
    *) ids="" ;;
  esac
  for id in $ids; do
    mkdir -p "$dir/$id"
    cp "$f" "$dir/$id/index.html"
  done
done

cp "+not-found.html" 404.html
touch .nojekyll

# Relocate the JS bundle to a root-level path.
# GitHub Pages occasionally delays serving freshly-built files under /_expo/,
# while root-level files propagate reliably within seconds.
for f in _expo/static/js/web/entry-*.js; do
  [ -e "$f" ] || continue
  base=$(basename "$f")
  newname="app-${base#entry-}"
  cp "$f" "$newname"
  grep -rl "_expo/static/js/web/$base" --include="*.html" . | while read -r h; do
    sed -i "s|_expo/static/js/web/$base|$newname|g" "$h"
  done
  echo "▸ Bundle relocated to /$newname"
done

TMP=$(mktemp -d)
git -C "$TMP" init -q
git -C "$TMP" checkout -q -b gh-pages
cp -r . "$TMP"/
git -C "$TMP" add -A
git -C "$TMP" -c user.name="Pixel Studios Bot" -c user.email="bot@pixelstudios.ng" \
  commit -qm "deploy: web build $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git -C "$TMP" remote add origin "$(git remote get-url origin)"
git -C "$TMP" push -q -f origin gh-pages
rm -rf "$TMP"

echo "✅ Deployed → https://useeman32-design.github.io/pixel_studios/"
