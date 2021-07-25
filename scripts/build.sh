#!/usr/bin/env bash
npx pkg ./package.json --out-path ./dist \
 --targets node14-macos-x64,node14-linux-x64,node14-win-x64 \
 --compress Brotli;
 ls -p ./dist | grep -v / | xargs -I{} tar -czvf ./dist/compressed/{}.tar.gz {}