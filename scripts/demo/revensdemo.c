#include <windows.h>
#include <stdio.h>

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR lpCmdLine, int nShowCmd) {
    FILE *file = fopen("item.txt", "r");
    if (!file) {
        MessageBoxA(NULL, "Could not open item.txt", "Error", MB_OK);
        return 0;
    }

    char buffer[4096];
    fread(buffer, 1, sizeof(buffer) - 1, file);
    fclose(file);
    buffer[sizeof(buffer) - 1] = '\0';

    MessageBoxA(NULL, buffer, "ReVens demo", MB_OK);
    return 0;
}
