7z.exe x "./ReVens.zip.001" -y
copy "./ReVens.bin" "./ReVens.iso"
7z.exe x "./ReVens.iso" -y
del \f "./ReVens.bin"
del \f "./ReVens.zip.*"