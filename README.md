# ReVen: Reverse Engineering Toolkit AIO

<img src="./assets/logo.png" width="100%" alt="ReVen">

ReVen is a Reverse Engineering Toolkit AIO built for Security (Penetration testing) & Educational purposes **only**.
It contains almost everything about RE *-At least to begin-* .  
ReVen is built to share personal experience (*passion*) in RE since **2008**, it can be useful for new future **Reversers** / **Developers**.

## Requirements

To run ReVen:

* **Windows 10/11 x64** *-VM recommended-*.
* **ReVen.iso** *-External ReVen packages-* not available in this repository (More than **300** items).

To build ReVen:

* **Node.js** ^24.

## Notices

* Reverse Engineering tools are denied by **Antivirus** (Due to binary patching algorithms, debugging ...etc).
* You should make an **Antivirus** exception to avoid detection, or use a virtual machine.
* **ReVen.iso** is automatically downloaded & extracted during installation.
* **ReVen.iso** includes docs & basic tutorials about RE.
* **100% clean**, *-but use it on your own responsibility-*.
* **90% portable**.

## Download

**ReVen AIO**

* Download from: [Releases](https://github.com/Jakiboy/ReVen/releases).

**ReVen Packages** (**6Go**)

Download manually from:

* ReVen Packages [Part 1](https://bit.ly/3mot7kZ).
* ReVen Packages [Part 2](https://bit.ly/3zRjQVE).
* ReVen Packages [Part 3](https://bit.ly/415MEpp).
* ReVen Packages [Part 4](https://bit.ly/3MAQORL).
* ReVen Packages [Part 5](https://bit.ly/3mCDiSR).
* ReVen Packages [Part 6](https://bit.ly/3odaocI).
* ReVen Packages [Part 7](https://bit.ly/3L5HLqV).
* ReVen Packages [Part 8](https://bit.ly/3MAR8jr).
* ReVen Packages [Part 9](https://bit.ly/406sIRY).

## Screenshot

This is how it looks, Built with {heart} using **Electron.js** + Some legacy {stuff}.

<img src="./assets/screenshot.png" width="100%" alt="ReVen AIO">

*The App background is the electron DevTools itself*.

---

## Install, Run & Build

```bash
bash global.sh
bash init.sh
bash run.sh
bash build.sh
```

---

## Packages
  
ReVen packages includes:

### Analysing

Analyse binary executable files (**EXE, DLL, OCX...**).

#### Binary

*Analyse binary.*

* **FileAlyzer**
* Alternate DLL Analyzer
* ExeInfo (*Archived*)

#### Compilation

*Analyse PE compilation.*

* **Detect It Easy (DiE)**
* Nauz File Detector (*Archived*)
* Language 2000 (*Archived*)
* PE Detective (*Archived*)
* Signature Explorer (*Archived*)

#### Bytecode (p-code)

*Object code converted by interpreter into binary machine code to be read by CPU.*

* Bytecode Viewer (*Archived*)

#### Packaging

*Analyse PE packaging / protection.*

* **Exeinfo PE**
* PEiD (*Archived*)
* ARiD (*Archived*)
* UPX-Analyser (*Archived*)

#### System

*Analyse system files, processing & memory.*

* HijackThis
* SearchMyFiles
* Process Monitor
* API Monitor
* RegDLLView
* WinObj
* WinID
* HeapMemView
* CPU Stress
* DeviceIOView
* Autoruns
* Fiddler
* Wireshark (*Archived*)
* DLL Function Viewer (*Archived*)
* Process Explorer (*Archived*)
* Process Hacker (*Archived*)
* Zero Dump (*Archived*)
* GDIView (*Archived*)
* grepWin (*Archived*)

### Calculating

Mathematical & reverse calculating.

* Alternate Math Solver
* Reverser Calculator
* Hex-Dec
* JMP Calculator
* XOpcodeCalc (*Archived*)
* Jump to Hex (*Archived*)
* Hash Calculator (*Archived*)
* Base Calculator (*Archived*)
* Base Converter (*Archived*)

### Converting

Convert binary files.

* BAT to EXE
* PS1 to EXE
* VBS to EXE
* JAR to EXE
* PNG to ICO
* Audio Video to EXE
* RapidEXE (PHP - EXE) - CLI
* RegConvert (REG - EXE)
* vbstoexe - CLI (*Archived*)

### Decompiling

Revert the process of compilation. Transforming binary program file into a **structured higher-level language**.

* **BinaryNinja**
* ILSpy (*Archived*)
* dotPeek (*Archived*)
* .NET Reflector (*Archived*)
* Java Decompiler (*Archived*)
* JByteMod (*Archived*)
* VB Decompiler (*Archived*)
* DJ Java Decompiler (*Archived*)
* Dis# Net Decompiler (*Archived*)

### Disassembling

Transforming machine code into a human readable mnemonic representation (**Assembly language**).

* **Ghidra**
* IDA (*Archived*)
* Capstone - CLI (*Archived*)
* Delphi Disassembler (*Archived*)
* bddisasm - CLI (*Archived*)
* Disasm (*Archived*)
* Refractor (*Archived*)
* RadASM (*Archived*)
* Win32Dasm (*Archived*)

### Debugging

View and change the running state of a program. (**Disassembling, Decompiling, Hexing**).

* **x64dbg**
* Immunity Debugger (*Archived*)
* dnSpy (*Archived*)
* OllyDbg (*Archived*)
* Cutter (*Archived*)
* Radare2 - CLI (*Archived*)

### Hexing

Edit binary **hexadecimal values**.

* **ImHex**
* HEX Editor (*Archived*)
* Hiew (*Archived*)

### Rebuilding

Rebuild PE import table (**Imports Reconstructor**).

* **Scylla**
* DLL Packager
* ImpREC (*Archived*)

### Decoding

Decode hash.

* **Ophcrack**
* CyberChef (*Archived*)
* Armadillo KeyTool (*Archived*)
* Keygener Assistant (*Archived*)
* SND Reverse Tool (*Archived*)
* Hash Identifier (*Archived*)
* RSA-Tool 2 (*Archived*)
* RSATool (*Archived*)
* RSABox (*Archived*)
* MD5 Toolbox (*Archived*)

### Comparing

Binary compare.

* **REPT file compare**
* File CompareR (*Archived*)
* ReloX (*Archived*)
* SideBySide (*Archived*)
* SignMan (*Archived*)

### Editing

Binary edit (**EXE, RES, DLL**).

* **Resource Hacker**
* PPEE (Professional PE Explorer)
* PE Lab
* XPEViewer
* XELFViewer
* WinMerge
* DLL Injector Slait
* Codejock Skin Builder
* Codejock Resource Editor
* Codejock MarkupPad
* Codejock Command Bars Designer
* Notepad++
* DLL Addr&Func Converter (*Archived*)
* DLL Injector (*Archived*)
* DLL Loader (*Archived*)
* DLL Rebaser (*Archived*)
* ResEdit (*Archived*)
* CFF Explorer (*Archived*)
* Resource Builder (*Archived*)
* Splash Injector (*Archived*)
* Far Manager (*Archived*)
* KDiff3 (*Archived*)
* IID King (*Archived*)
* Cheat Engine (*Archived*)

### Extracting

Binary extracting (**EXE, RES, DLL**).

* **UniExtract2**
* DLL Export Viewer
* RegFileExport
* ResourcesExtract (*Archived*)
* DotNetResExtract (*Archived*)
* RegFromApp (*Archived*)
* Inno Extractor (*Archived*)
* Innoextract - CLI (*Archived*)
* Innounp - CLI (*Archived*)
* MSI Unpacker (*Archived*)
* Fearless MSI Unpacker (*Archived*)
* LessMSI - CLI (*Archived*)
* Mmextract - CLI (*Archived*)
* ExeDumper (*Archived*)
* Table Extractor (*Archived*)

**Games**

* **Dragon UnPACKer**
* Unity Assets Bundle Extractor
* Ninja Ripper
* 3D Ripper DX (*Archived*)
* QuickBMS (*Archived*)
* Unity Asset Editor (*Archived*)
* DevX Unity Unpacker (*Archived*)
* Unity Studio (*Archived*)
* UnityEx (*Archived*)
* uTinyRipper (*Archived*)

### Unpacking

Unpack & remove binary protection (**EXE, DLL**).

* **XVolkolak**
* .NET Reactor Slayer
* ConfuserEx Unpacker - CLI
* ILProtector Unpacker (*Archived*)
* de4dot (*Archived*)
* RL!deUPX (*Archived*)
* RL!deASPack (*Archived*)
* RL!dePacker (*Archived*)
* GUnPacker (*Archived*)
* ASPack Unpacker (*Archived*)
* IsXunpack (*Archived*)
* Unpacker ExeCryptor (*Archived*)
* Universal Unprotector (*Archived*)

### Patching

#### Patcher

*Generate patching program using binary compare.*

* **dUP 2**
* AT4RE Patcher (*Archived*)
* CodeFusion (*Archived*)
* uPPP (*Archived*)
* Apatch (*Archived*)
* Inno Setup XDELTA Patch Maker (*Archived*)
* PEiD Patch Maker (*Archived*)
* Graphical Patch Maker (*Archived*)

#### Loader

*Build binary patch loader.*

* **Advanced Loader Generator**
* Abel Loader Generator (*Archived*)

#### Keygen

*Build Key generator.*

* **REPT Keygen Maker**

#### Skin

*Build patcher skin.*

* **Dup2AP Skin Converter**
* Image Flipper
* Skin Builder
* Skin Extractor
* uPPP2AP Skin Converter (*Archived*)
* RGNerator (*Archived*)

#### Release

*Build patcher release file.*

* **Release Builder**
* DizView
* Fast Cracktro Maker (*Archived*)
* mRelease Builder (*Archived*)
* NFO Maker (*Archived*)
* NFO Scroller (*Archived*)
* NFO View (*Archived*)
* NFO Viewer 2 (*Archived*)

#### ASCII

*Build patcher release ASCII.*

* **Ascgen**
* 1337 Converter (*Archived*)
* ASCII Art studio (*Archived*)
* ASCII Converter (*Archived*)
* ASCII Generator (*Archived*)
* ASCII Table (*Archived*)
* Magic ASCII Pic (*Archived*)

#### Sound

*Build patcher sound (MX).*

* **FastTracker 2**
* OpenMPT (*Archived*)
* MilkyTracker (*Archived*)
* ModPlug Player (*Archived*)
* ChipRip (*Archived*)

### Bypassing

#### Trial

*Trial reset.*

* **RunAsDate**
* DateHack (*Archived*)
* Trial-Reset (*Archived*)

#### System

*Bypassing system.*

* RunFromProcess
* ScyllaHide

---

### Assembling

Assembling **Machine code**.

* Flat assembler (FASM)

### Programming

Programming tools (**+Compilator**).

* **PyScripter**
* Embarcadero Dev-C++ (*Archived*)
* Dev-C++ (*Archived*)
* Small Basic (*Archived*)

### Encoding

Data encoding (**Hash**).

* **WinHasher**
* Alternate Hash-Generator
* PuTTY
* HashMyFiles (*Archived*)
* XOR (*Archived*)
* Base64 - CLI (*Archived*)
* MD5 - CLI (*Archived*)
* SHA1 - CLI (*Archived*)
* Dissecting RC4 Algorithm (*Archived*)
* DSS-DSA Generator (*Archived*)
* gRn-Rsa-Donkey (*Archived*)

### Packing

Executable packing.

* **UPX**
* ConfuserEx
* Alternate EXE Packer
* Amber (*Archived*)

### Testing

#### Simulating

Circuit / Logical simulation.

* **Fritzing**
* Arduino Simulator
* Arduino CLI
* PICSimLab (*Archived*)
* UnoArduSim (*Archived*)
* Dia (*Archived*)
* Logisim (*Archived*)
* SimulIDE (*Archived*)
* Circuit Simulator (*Archived*)

#### Sandboxing

*Executables safe testing.*

* **Sandboxie Plus**
* Sandboxie Classic (*Archived*)

---

### Mobile

Mobile application reverse.

* APK Editor Studio
* OTP Extractor
* WhatsApp Extractor (CLI)
* WhatsApp Viewer
* Apktool - CLI (*Archived*)
* APK Protect (*Archived*)
* XAPK Detector (*Archived*)
* APK Multi-Tool (*Archived*)

---

## Authors:

* **Jihad Sinnaour** - [Jakiboy](https://github.com/Jakiboy) (*Initial work*)

## ⭐ Support:

Please give it a Star if you like the project.
