7z.exe x "./ReVen.zip.001" -y
copy "./ReVen.bin" "./ReVen.iso"
7z.exe x "./ReVen.iso" -y
del \f "./ReVen.bin"
del \f "./ReVen.zip.*"