; ======================================================================================================================
; Author  : Jakiboy (Jihad Sinnaour)
; Package : ReVens | Reverse Engineering Toolkit AIO
; Version : 2.0.0
; Link    : https://github.com/Jakiboy/ReVens
; license : MIT
;
; Copyright (c) 2025 Jihad Sinnaour <mail@jihadsinnaour.com>
; ======================================================================================================================

; Define:

#define InstallerRoot "."
#define InstallerAppName "ReVens"
#define InstallerAppVersion "2.0.0"
#define InstallerAppPublisher "Jakiboy (Jihad Sinnaour)"
#define InstallerAppURL "https://github.com/Jakiboy/ReVens"
#define InstallerAppExeName "ReVens.exe"

; Setup:

[Setup]
AppId={{6BC257DE-E3DC-4298-ADF8-314D054DB461}
AppName={#InstallerAppName}
AppVersion={#InstallerAppVersion}
VersionInfoVersion={#InstallerAppVersion}
VersionInfoCopyright="Copyright (c) 2025 {#InstallerAppPublisher}"
AppPublisher={#InstallerAppPublisher}
AppPublisherURL={#InstallerAppURL}
AppSupportURL={#InstallerAppURL}
AppUpdatesURL={#InstallerAppURL}
DisableProgramGroupPage=yes
DefaultDirName={commonpf64}\{#InstallerAppName}
LicenseFile={#InstallerRoot}\LICENSE
InfoBeforeFile={#InstallerRoot}\Readme.txt
OutputDir={#InstallerRoot}\build
OutputBaseFilename="{#InstallerAppName}-v{#InstallerAppVersion}-Windows-Installer-x64"
SetupIconFile={#InstallerRoot}\assets\icon.ico
WizardImageFile={#InstallerRoot}\assets\large.bmp
WizardSmallImageFile={#InstallerRoot}\assets\small.bmp
Compression=lzma
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64

; Languages:

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

; Tasks:

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

; Files:

[Files]

; App files:
Source: "{#InstallerRoot}\build\{#InstallerAppName}\{#InstallerAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\chrome_100_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\chrome_200_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\d3dcompiler_47.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\ffmpeg.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\icudtl.dat"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\libEGL.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\libGLESv2.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\protect.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\resources.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\{#InstallerAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\snapshot_blob.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\v8_context_snapshot.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\vk_swiftshader.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\vk_swiftshader_icd.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\vulkan-1.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\changelog.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#InstallerRoot}\build\{#InstallerAppName}\bin\*"; DestDir: "{app}\bin"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#InstallerRoot}\build\{#InstallerAppName}\locales\*"; DestDir: "{app}\locales"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#InstallerRoot}\build\{#InstallerAppName}\resources\*"; DestDir: "{app}\resources"; Flags: ignoreversion recursesubdirs createallsubdirs

; Icons:

[Icons]
Name: "{autoprograms}\{#InstallerAppName}"; Filename: "{app}\{#InstallerAppExeName}"
Name: "{autodesktop}\{#InstallerAppName}"; Filename: "{app}\{#InstallerAppExeName}"; Tasks: desktopicon

; Run:

[Run]
; Hide ReVens Source
Filename: "{app}\protect.bat"; Parameters: "install"; Flags: runhidden

; Start ReVens
Filename: "{app}\{#InstallerAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(InstallerAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent