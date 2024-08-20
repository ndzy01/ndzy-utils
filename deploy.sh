#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

npm run build
npm version patch
npm publish
git push
