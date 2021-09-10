#!/usr/bin/env bash
# clean
npm run clean
rm -f lint.err
# run babel
env BABEL_ENV=production babel js/ --out-dir js/build
env BABEL_ENV=production babel options/ --out-dir options/build
echo "const PROVISIONED_DB = `cat db.json`;" > js/db.js
# lint
npm run lint 2> lint.err
if [ -s lint.err ]; then
  cat lint.err
  exit 1
fi
# copy to dist
cp -r css dist/css
cp -r js/build dist/js
cp -r icons dist/icons
cp -r options dist/
mv dist/options/build/* dist/options/
rmdir dist/options/build/
cp manifest.json dist
cp LICENSE dist
cp db.json dist
