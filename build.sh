#!/bin/bash
R='\033[0;31m'
G='\033[0;32m'
B='\033[0;96m'

NAME='ReVens'
VERSION='1.3.0'
DESCRIPTION='ReVens - Reverse Engineering Toolkit AIO 2026'
AUTHOR='Jakiboy'
COPYRIGHT="Copyright (c) 2026 ${AUTHOR}"
OUTPUT='build' # Output path
SOURCE='src' # Source path
RESOURCES='resources' # Resources folder

# Creating output folder
echo -e "${G}Creating output folder..."
if [ -d "${OUTPUT}" ]; then
    rm -rf "${OUTPUT}"
fi
mkdir "${OUTPUT}"
sleep 2
clear

# Building package
npx webpack --production
echo -e "${G}Building package..."
electron-packager "${SOURCE}" --icon="./app/assets/icon.ico" --out="./${OUTPUT}" --app-copyright="${COPYRIGHT}" --app-version="${VERSION}" --win32metadata.CompanyName="${AUTHOR}" --win32metadata.FileDescription="${DESCRIPTION}" # --x64
sleep 2
clear

echo -e "${G}Renaming path..."
mv "./${OUTPUT}/${NAME}-win32-x64" "./${OUTPUT}/${NAME}"
sleep 2
clear

# Adding pre-install files
echo -e "${G}Adding pre-install files..."
cp "./app/assets/protect.bat" "./${OUTPUT}/${NAME}/protect.bat"
if [ ! -f "./app/assets/bin/7z.exe" ]; then
    echo "Download 7z..."
    git clone "https://github.com/Jakiboy/7z.git/" "./app/assets/bin/temp"
    mv "./app/assets/bin/temp/bin/7z.exe" "./app/assets/bin/7z.exe"
    mv "./app/assets/bin/temp/bin/7z.dll" "./app/assets/bin/7z.dll"
    rm -rf "./app/assets/bin/temp"
    sleep 2
    clear
fi
cp -r "./app/assets/bin" "./${OUTPUT}/${NAME}/bin"
cp -r "./changelog.txt" "./${OUTPUT}/${NAME}/changelog.txt"
cp -r "./${NAME}.md" "./${OUTPUT}/${NAME}/${NAME}.md"
sleep 2
clear

# Minify CSS files
echo -e "${G}Minify CSS files..."
uglifycss "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/css/style.css" --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/css/style.css"
uglifycss "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/font/roboto.css" --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/font/roboto.css"
sleep 2
clear

# Minify JS files
echo -e "${G}Minify JS files..."
uglifyjs "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.js" -c -m --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.js"
uglifyjs "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/js/main.js" -c -m --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/js/main.js"
sleep 2
clear

# Minify HTML files
echo -e "${G}Minify HTML files..."
HTML='--collapse-whitespace'
HTML="${HTML} --remove-comments"
HTML="${HTML} --remove-optional-tags"
HTML="${HTML} --remove-redundant-attributes"
HTML="${HTML} --remove-script-type-attributes"
HTML="${HTML} --remove-tag-whitespace"
HTML="${HTML} --use-short-doctype"
html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.html"
html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/splash.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/splash.html"
html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/doc.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/doc.html"
html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/about.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/about.html"
sleep 2
clear

# Removing Dev files
echo -e "${R}Removing Dev files..."
rm "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/vendor/mdb/mdb.dark.min.css.map"
rm "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/vendor/mdb/mdb.min.js.map"
sleep 2
clear

# Encrypting package
echo -e "${G}Encrypting package..."
asar pack "./${OUTPUT}/${NAME}/${RESOURCES}/app" "./${OUTPUT}/${NAME}/${RESOURCES}/app.asar"
sleep 2
clear

# Removing additional files
echo -e "${R}Removing additional files..."
rm "./${OUTPUT}/${NAME}/LICENSES.chromium.html"
rm "./${OUTPUT}/${NAME}/LICENSE"
rm "./${OUTPUT}/${NAME}/version"
rm -rf "./${OUTPUT}/${NAME}/${RESOURCES}/app"
find "./${OUTPUT}/${NAME}/locales/"* -type f -not -name "en-US.pak" -delete
sleep 2
clear

echo -e "${G}Compiling setup..."
if [ ! -d "compiler" ]; then
    echo "Download ISCC..."
    git clone "https://github.com/Jakiboy/ISCC.git/" "./temp"
    mv "./temp/bin" "./compiler"
    rm -rf "./temp"
    sleep 2
    clear
fi
"$(pwd)/compiler/ISCC.exe" "$(pwd)/${NAME}.iss" # Abs. path

echo -e "${G}Building archive..."
cd "./${OUTPUT}"
rm "./${NAME}/protect.bat"
zip "./${NAME}-v${VERSION}-Windows-x64.zip" -r "./${NAME}"
rm -rf "./${NAME}"
sleep 2
clear

echo -e "${G}--------------------"
read -p "Press enter to exit"
