#!/bin/bash
npm i electron -g
npm i electron-packager -g
npm i asar -g
npm i uglify-js -g
npm i uglifycss -g
npm i html-minifier -g
npm i webpack -g
npm i webpack-cli -g

if [ ! -f "./inc/7z.exe" ]; then
    echo "Download 7z..."
    mkdir -p "./inc"
    git clone "https://github.com/Jakiboy/7z.git/" "./inc/temp"
    mv "./inc/temp/bin/7z.exe" "./inc/7z.exe"
    mv "./inc/temp/bin/7z.dll" "./inc/7z.dll"
    rm -rf "./inc/temp"
    sleep 2
    clear
fi

git config core.ignorecase false

cd src
npm install

# export NODE_ENV=dev
