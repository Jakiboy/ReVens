#!/bin/bash
npm i electron -g
npm i electron-packager -g
npm i asar -g
npm i uglify-js -g
npm i uglifycss -g
npm i html-minifier -g

git config core.ignorecase false

cd source
npm install
export NODE_ENV=dev
