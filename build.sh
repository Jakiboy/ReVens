#!/bin/bash
R='\033[0;31m'
G='\033[0;32m'
B='\033[0;96m'

NAME='ReVens'
VERSION='1.5.0'
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
mkdir "${OUTPUT}/${SOURCE}"

# Copy src files to output
echo -e "${G}Copying source files..."
cd "${SOURCE}"
find . -type f -not -path "*/node_modules/*" -exec cp --parents {} "../${OUTPUT}/${SOURCE}" \;
cd ..
sleep 2
clear

# Set debug to false in app.json
echo -e "${G}Setting debug to false..."
sed -i 's/"debug": true/"debug": false/' "./${OUTPUT}/${SOURCE}/config/app.json"
sleep 2
clear

# Install dependencies
echo -e "${G}Installing dependencies..."
cd "./${OUTPUT}/${SOURCE}"
npm install
cd "../.."
sleep 2
clear

# Building package
echo -e "${G}Building package..."
cd "./${OUTPUT}/${SOURCE}"
webpack --mode production
cd "../.."
sleep 2
clear

echo -e "${G}Packaging application..."
electron-packager "./${OUTPUT}/${SOURCE}" --icon="./assets/installer/icon.ico" --out="./${OUTPUT}" --app-copyright="${COPYRIGHT}" --app-version="${VERSION}" --win32metadata.CompanyName="${AUTHOR}" --win32metadata.FileDescription="${DESCRIPTION}" # --x64
sleep 2
clear

echo -e "${G}Renaming path..."
mv "./${OUTPUT}/${NAME}-win32-x64" "./${OUTPUT}/${NAME}"

# Remove temporary src folder from output
rm -rf "./${OUTPUT}/${SOURCE}"
sleep 2
clear

# Adding pre-install files
echo -e "${G}Adding pre-install files..."
cp "./assets/installer/protect.bat" "./${OUTPUT}/${NAME}/protect.bat"

# Download 7z if not exists
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

# Copy included files
cp -r "./inc" "./${OUTPUT}/${NAME}/${RESOURCES}/inc"
cp -r "./assets/installer/changelog.txt" "./${OUTPUT}/${NAME}/changelog.txt"
cp -r "./assets/installer/packages.txt" "./${OUTPUT}/${NAME}/packages.txt"
cp -r "./assets/installer/notice.txt" "./${OUTPUT}/${NAME}/notice.txt"
sleep 2
clear

# Minify CSS files
echo -e "${G}Minify CSS files..."
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/css/style.css" ]; then
    uglifycss "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/css/style.css" --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/css/style.css"
fi
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/font/roboto.css" ]; then
    uglifycss "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/font/roboto.css" --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/font/roboto.css"
fi
sleep 2
clear

# Minify JS files
echo -e "${G}Minify JS files..."
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.js" ]; then
    uglifyjs "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.js" -c -m --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.js"
fi
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/js/main.js" ]; then
    uglifyjs "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/js/main.js" -c -m --output "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/js/main.js"
fi
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
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.html" ]; then
    html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/main.html"
fi
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/splash.html" ]; then
    html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/splash.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/splash.html"
fi
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/doc.html" ]; then
    html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/doc.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/doc.html"
fi
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/about.html" ]; then
    html-minifier ${HTML} "./${OUTPUT}/${NAME}/${RESOURCES}/app/about.html" -o "./${OUTPUT}/${NAME}/${RESOURCES}/app/about.html"
fi
sleep 2
clear

# Removing Dev files
echo -e "${R}Removing Dev files..."
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/vendor/mdb/mdb.dark.min.css.map" ]; then
    rm "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/vendor/mdb/mdb.dark.min.css.map"
fi
if [ -f "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/vendor/mdb/mdb.min.js.map" ]; then
    rm "./${OUTPUT}/${NAME}/${RESOURCES}/app/assets/vendor/mdb/mdb.min.js.map"
fi
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
cp "$(pwd)/assets/installer/${NAME}.iss" "$(pwd)/${NAME}.tmp.iss"
"$(pwd)/compiler/ISCC.exe" "$(pwd)/${NAME}.tmp.iss" # Abs. path

echo -e "${G}Building archive..."
cd "./${OUTPUT}"
rm "./${NAME}/protect.bat"
"$(pwd)/../inc/7z.exe" a -tzip "./${NAME}-v${VERSION}-Windows-x64.zip" "./${NAME}"
rm -rf "./${NAME}"
cd ..
rm "./${NAME}.tmp.iss"
sleep 2
clear

echo -e "${G}--------------------"
read -p "Press enter to exit"
