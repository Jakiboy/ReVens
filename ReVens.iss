; ======================================================================================================================
; ReVens | Reverse Engineering Toolkit AIO
;
; Author: Jihad Sinnaour (Jakiboy) <j.sinnaour.official@gmail.com>
; URL: https://github.com/Jakiboy/reven
; Copyright (C) 2023 Jihad Sinnaour. All rights reserved.
; ======================================================================================================================

; Define:

#define InstallerRoot "."
#define InstallerAppName "ReVens"
#define InstallerAppVersion "1.0.0"
#define InstallerAppPublisher "Jihad Sinnaour (Jakiboy)"
#define InstallerAppURL "https://github.com/Jakiboy/reven"
#define InstallerAppExeName "ReVens.exe"

; Setup:

[Setup]
AppId={{6BC257DE-E3DC-4298-ADF8-314D054DB461}
AppName={#InstallerAppName}
AppVersion={#InstallerAppVersion}
VersionInfoVersion={#InstallerAppVersion}
VersionInfoCopyright="Copyright (c) 2023 {#InstallerAppPublisher}"
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
Source: "{#InstallerRoot}\build\{#InstallerAppName}\bin\*"; DestDir: "{app}\bin"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#InstallerRoot}\build\{#InstallerAppName}\locales\*"; DestDir: "{app}\locales"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#InstallerRoot}\build\{#InstallerAppName}\resources\*"; DestDir: "{app}\resources"; Flags: ignoreversion recursesubdirs createallsubdirs

; Temp files:
Source: "{tmp}/ReVens.zip.001"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.002"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.003"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.004"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.005"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.006"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.007"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.008"; DestDir: "{app}\bin"; Flags: external;
Source: "{tmp}/ReVens.zip.009"; DestDir: "{app}\bin"; Flags: external;

; Icons:

[Icons]
Name: "{autoprograms}\{#InstallerAppName}"; Filename: "{app}\{#InstallerAppExeName}"
Name: "{autodesktop}\{#InstallerAppName}"; Filename: "{app}\{#InstallerAppExeName}"; Tasks: desktopicon

; Run:

[Run]
; Extract ReVens packages
Filename: "{app}\bin\extract.bat"; Parameters: "install"; Flags: runhidden

; Hide ReVens Source
Filename: "{app}\protect.bat"; Parameters: "install"; Flags: runhidden

; Start ReVens
Filename: "{app}\{#InstallerAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(InstallerAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

; Code:

[Code]

// Download external files:
var
  DownloadPage: TDownloadWizardPage;

function OnDownloadProgress(const Url, FileName: String; const Progress, ProgressMax: Int64): Boolean;
begin
  if Progress = ProgressMax then
    Log(Format('Successfully downloaded file to {tmp}: %s', [FileName]));
  Result := True;
end;

procedure InitializeWizard;
begin
  DownloadPage := CreateDownloadPage(SetupMessage(msgWizardPreparing), SetupMessage(msgPreparingDesc), @OnDownloadProgress);
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  if CurPageID = wpReady then begin
    DownloadPage.Clear;
    // Download ReVens packages
    DownloadPage.Add('https://bit.ly/3mot7kZ', 'ReVens.zip.001', '');
    DownloadPage.Add('https://bit.ly/3zRjQVE', 'ReVens.zip.002', '');
    DownloadPage.Add('https://bit.ly/415MEpp', 'ReVens.zip.003', '');
    DownloadPage.Add('https://bit.ly/3MAQORL', 'ReVens.zip.004', '');
    DownloadPage.Add('https://bit.ly/3mCDiSR', 'ReVens.zip.005', '');
    DownloadPage.Add('https://bit.ly/3odaocI', 'ReVens.zip.006', '');
    DownloadPage.Add('https://bit.ly/3L5HLqV', 'ReVens.zip.007', '');
    DownloadPage.Add('https://bit.ly/3MAR8jr', 'ReVens.zip.008', '');
    DownloadPage.Add('https://bit.ly/406sIRY', 'ReVens.zip.009', '');
    DownloadPage.Show;
    try
      try
        DownloadPage.Download;
        Result := True;
      except
        SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
        Result := False;
      end;
    finally
      DownloadPage.Hide;
    end;
  end else
    Result := True;
end;
