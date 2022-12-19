#!/usr/bin/env bash
# clean
npm run clean
# run babel
env BABEL_ENV=production babel src/js/ --out-dir src/js/build
env BABEL_ENV=production babel src/options/ --out-dir src/options/build
# lint
rm -f lint.err
npm run lint 2> lint.err
if [ -s lint.err ]; then
  cat lint.err
  exit 1
fi
# copy to dist
cp -r src/* dist
mv dist/options/build/* dist/options/
rmdir dist/options/build/
cp LICENSE dist
# clean up
rm -f lint.err
