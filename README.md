# ReVens: Reverse Engineering Toolkit AIO

[![ReVens](assets/preview/banner.png)](#)

ReVens is a Windows-based and AI-powered Reverse Engineering Toolkit "All-In-One", built for security purposes (malware analysis, penetration testing) and educational use only. It serves as a comprehensive package manager for reverse engineering tools.

> [!Note]
> I made ReVens AIO software to share personal experience in RE since **2008**.  
> RE tools are priceless, especially the legacy ones. They deserve a nice place where they can live in peace.  
> You can still find legacy items on **Wayback Machine**.  
> [Watch online preview](https://revens.jihadsinnaour.com).

## 🔧 Features

* **Cross-platform & Modern UI** software launcher "Blackhat style"
* **90% clean**: All detections are **false positives**, No malware injected
* **90% portable**: Using portable versions or resolved/included dependencies
* **Original assets**: Themes, Sounds (e.g. BRD - Teleport Pro.mx, CORE - Power ISO.xm)
* **Packages manager**: JSON based Downloader, Versioning, Updater
* **AI-powered**: Basic AI assistant using Ollama (llama3.2:1b)
* **Boilerplate**: For other projects (Electron.js X React.js)

## 🔧 Screenshot

This is how it looks, Made with {heart} using **Electron.js** X **React.js**.  
*The App background is the WebView DevTools itself*.

[![ReVens main GUI](assets/preview/screenshot.png)](#)

Each item can be downloaded **separately** from trusted sources.

[![ReVens item downloader](assets/preview/screenshot-1.png)](#)

Packages are **automatically downloaded**.

[![ReVens packages downloader](assets/preview/screenshot-2.png)](#)

Local AI assistant integrated using **Ollama**.

[![ReVens packages downloader](assets/preview/screenshot-3.png)](#)

## 💡 Notices

> [!Important]
> Respecting the rights of software developers is paramount. Engaging in activities such as bypassing software protections or reverse engineering software without explicit permission is not only generally illegal, but also unethical. It's essential to utilize software in the manner intended by its creators and in compliance with the stipulated terms of service or license agreement.

* ReVens will focus only on the **package manager** itself and not the packages!
* Reverse engineering tools are flagged by **Antivirus** (due to binary patching algorithms, debugging, packing, etc.).
* You should use a **secure** virtual machine or a sandbox.
* Many of the included tools are **outdated** and provided solely for legacy purposes!
* The primary architecture of the packages is **x64**, but other architectures (x86, ARM) can also be supported.
* ReVens is Windows-based, but still **cross-platform** if you want to build it for Linux.
* *— Use it at your own risk. Better Call Saul! —*

## 🔧 Requirements

* **Windows** 10/11 x64 (Runtime)
* **Electron.js ^29.4.6 (Node 24.11.0)**
* **MinGW-w64** or [**Git for Windows**](https://git-scm.com/downloads/win)
* **Ollama** for AI Assistant [**ReVens AI Assistant Setup**](AI.md)

## 🔧 Build

```sh
git clone https://github.com/Jakiboy/ReVens .
bash init.sh
bash run.sh
bash build.sh
```

## 🔧 Test

```cmd
./scripts/test.cmd
./scripts/fix.cmd
./scripts/generate.cmd
```

## 🔧 Download

* Download latest ReVens from: [Releases](https://github.com/Jakiboy/ReVens/releases).

## 🔧 TODO

* We need contributors for: Advanced AI, Settings, and the Package Downloader.

## 🔧 Packages

ReVens packages includes:

<!-- Auto-generated: ReVens Packages Begin -->

### ⚡ Analyzing
Analyze portable-executables and related files (EXE, DLL, OCX, SYS).

##### Binary
*Analyze PE and other binary files.*
* **FileAlyzer** - *Understand files by analyzing their structure.*
* **[PE-bear](https://github.com/hasherezade/pe-bear)** - *PE reversing tool.*
* **DLL Analyzer** - *Display function names in DLLs.*
* **[ReverseKit](https://github.com/zer0condition/ReverseKit)** - *Comprehensive reverse engineering toolkit.*
* **[Spyre](https://github.com/spyre-project/spyre)** - *Simple YARA-based scanner.*
* **[Capa](https://github.com/mandiant/capa)** - *Identify capabilities in executables.*
* **ClamAV** - *Open-source antivirus engine.*
* **[Yara](https://github.com/VirusTotal/yara)** - *Malware pattern matching tool.*
* **ExeInfo** - *Universal binary analyzer.*
* **Manalyze** - *Static analyzer for PE executables.*
* **PEstudio** - *Malware Analysis in a private context.*
* **[GoBug](https://github.com/goretk)** - *Debugging tool for Go programs.*
* **A-Ray Scanner** - *CD/DVD Scanner.*
* **CD Identifier** - *CD/DVD Device Capabilities Viewer.*
* **CPSV** - *Protected Storage Viewer.*

##### Compilation
*Analyze PE compilation, signature and more.*
* **[Detect It Easy (DiE)](https://github.com/horsicq/DIE-engine)** - *File type identifier.*
* **[Nauz File Detector](https://github.com/horsicq/Nauz-File-Detector)** - *Detects compiler tools.*
* **PE Detective** - *Identifies PE files.*
* **Language 2000** - *Comprehensive compiler detector.*
* **gAPE** - *PE Viewer/Editor.*
* **GT2** - *GetType2 (CLI).*
* **PE Verify** - *PE Verify (CLI).*

##### Packaging
*Analyze PE packaging and protection.*
* **[Exeinfo PE (ASL)](https://github.com/ExeinfoASL/ASL)** - *Detects packers and compressors.*
* **[UPX-Analyser](https://github.com/bdunlap9/UPX-Unpackers)** - *Analyzes UPX-packed files.*
* **[PEiD](https://www.aldeid.com/wiki/PEiD)** - *Identifies packed executables.*
* **ARiD** - *Identifies archive formats.*
* **[RDG Packer Detector](https://github.com/rdgsoft/rdg-packer-detector)** - *Detects packers and protectors.*
* **Armadillo FP** - *Armadillo Find Protected.*
* **OverSaver Plugin** - *PEiD OverSaver Plugin Plugin.*
* **PEiD P2E** - *PEiD Plugin To Exe.*
* **PEiD Sigtool** - *PEiD Sigtool.*
* **PEiDSO** - *PEID Signature Organizer.*
* **PEPirate** - *Detect protectors/emulators/crypters.*
* **PlgLdr** - *Plugin Loader for PEiD and PE Tools.*
* **Protection ID** - *CD/DVD protection detector.*
* **SCANiT** - *PE scanner.*
* **Sleuth Kit** - *Sleuth Kit.*
* **SpectroByte** - *PE byte inspector.*
* **TrID** - *File Identifier (CLI).*
* **TrIDNet** - *Binary Signature Identifier.*

##### System
*Dynamic system analysis (Runtime).*
* **SysInspector** - *Rootkits scanner.*
* **[Windows Kernel Explorer](https://github.com/AxtMueller/Windows-Kernel-Explorer)** - *Another rootkits scanner.*
* **[Driver Store Explorer](https://github.com/lostindark/DriverStoreExplorer)** - *Driver Store Explorer.*
* **[RealTemp](https://www.techpowerup.com/realtemp/)** - *CPU temperature monitoring tool.*
* **RunAlyzer** - *Startup program analyzer.*
* **RootAlyzer** - *Rootkit detection and analysis tool.*
* **Open Hardware Monitor** - *Hardware monitoring tool.*

##### System (API)
* **API Monitor** - *Monitor Windows API calls.*
* **Reg DLL View** - *Display the list of all registered DLL/OCX/EXE.*
* **[Regshot](https://github.com/Seabreg/Regshot)** - *Registry snapshot and comparison utility.*
* **WinObj** - *Windows object manager.*
* **DxWnd** - *Window information tool.*
* **[NTLDD](https://github.com/LRN/ntldd)** - *List DLL dependencies for Windows executables.*
* **WinID** - *Window information tool.*
* **Regalyz** - *Registry analyzer and editor.*
* **Zero Dump** - *Create memory dumps.*
* **[DLL Function Viewer](https://www.nirsoft.net/utils/dll_function_viewer.html)** - *View DLL functions.*
* **Dependency Walker** - *32-bit/64-bit Windows module scanner.*
* **APIx** - *WinAPI Visualizator.*

##### System (Process)
* **Process Monitor** - *Advansed monitoring tool for Windows.*
* **CPU Stress** - *CPU stress testing tool.*
* **Device IO View** - *Monitor device I/O.*
* **HijackThis** - *Malware analyser.*
* **Autoruns** - *Manage startup programs.*
* **[RenderDoc](https://renderdoc.org)** - *Stand-alone graphics debugger.*
* **[WinDbg](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools)** - *Windows Low-level debugger.*
* **[PE-sieve](https://github.com/hasherezade/pe-sieve)** - *Scans a given process.*
* **Process Explorer** - *Detailed process viewer.*
* **Process Hacker** - *Advanced process manager.*
* **[Hollows Hunter](https://github.com/hasherezade/hollows_hunter)** - *Scans running processes for code injection artifacts.*
* **GDI View** - *Inspect GDI handles.*

##### System (Memory)
* **VMMap** - *Virtual and physical memory analyzer.*
* **Heap Mem View** - *Inspect heap memory.*
* **ProcAlyzer** - *Process analyzer and monitoring tool.*
* **[Volatility](https://github.com/volatilityfoundation/volatility)** - *A memory forensics analysis platform.*

##### System (Network)
* **Wireshark** - *Network packet analyzer.*
* **TCP View** - *TCP/UDP viewer.*
* **[HTTP Toolkit](https://github.com/httptoolkit/httptoolkit-desktop)** - *Intercept, view & edit any HTTP traffic.*
* **[ZAP](https://www.zaproxy.org)** - *Open source web app scanner.*
* **[PacketSender](https://github.com/dannagle/PacketSender)** - *Send & receive TCP, UDP, SSL, DTLS. HTTP Requests.*
* **[Fiddler (Classic)](https://www.telerik.com/fiddler/fiddler-classic)** - *Web debugging proxy.*
* **Aircrack-ng** - *WiFi network security.*
* **PE Network Manager** - *Network Manager.*
* **Smart Sniff** - *TCP/IP packets monitoring.*
* **[Whois This Domain](https://www.nirsoft.net/utils/whois_this_domain.html)** - *Domain registration lookup utility (WhoisThisDomain).*
* **[Papercut](https://github.com/ChangemakerStudios/Papercut)** - *Simple SMTP server for testing.*
* **DNS Lookup View** - *DNS tracing tool.*
* **CopyIP** - *Copy IP address information to clipboard.*
* **[Malzilla](https://github.com/Malzilla/Malzilla)** - *Detect malicious scripts.*
* **Sniff Password** - *Network passwords monitoring.*
* **WhoIs Connected Sniffer** - *Network packets discovery tool.*
* **NetworkMiner** - *Network forensics tool.*
* **PacketCache** - *PCAP file pre-processor and cache tool.*
* **PolarProxy** - *TLS proxy for decrypting and analyzing HTTPS traffic.*
* **RawCap** - *Raw socket packet capture tool.*
* **SplitCap** - *PCAP file splitter tool.*
* **PCResView** - *Remote PC Res View.*

##### System (File)
* **Search My Files** - *Advansed files finder.*
* **Exif Data View** - *Exif data Viewer.*
* **CSV File View** - *CSV File Viewer.*
* **BrowsAlyzer** - *Browser history analyzer.*
* **SQLite Tools** - *SQLite database tools.*
* **SQLite Browser** - *SQLite database browser.*
* **[XMachO Viewer](https://github.com/horsicq/XMachOViewer)** - *Mac OS XMachO Viewer.*
* **[SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)** - *SQLite database manager.*
* **[Sqliteman](https://github.com/pvanek/sqliteman)** - *SQLite database management GUI.*
* **[GrepWin (Text)](https://github.com/stefankueng/grepWin)** - *Search tool for Windows.*

##### Comparing
*Compare binary files (Binary diffing).*
* **REPT File Compare** - *Tool for comparing binary files.*
* **WinMerge** - *Open-source tool for visual file comparison and merging.*
* **[TableTextCompare](https://www.nirsoft.net/utils/csv_file_comparison.html)** - *Simple CSV/Tab files compare.*
* **File CompareR** - *Utility for comparing files and directories.*
* **ReloX** - *Win32 relocations rebuilder.*
* **SideBySide** - *Utility for side-by-side file comparison.*
* **Signature Manager** - *Utility for managing digital signatures.*

##### Calculating
*Mathematical and reverse calculating.*
* **[Math Solver](https://www.alternate-tools.com/pages/c_mathsolver.php)** - *Alternate Math Solver: Mathematical helper.*
* **Reversers Calculator** - *Calculator for reverse engineering.*
* **Jump Calculator** - *Calculates JMP instructions.*
* **[XOpcodeCalc](https://github.com/horsicq/XOpcodeCalc)** - *Opcode calculator tool.*
* **[RHash](https://github.com/rhash/RHash)** - *Utility for computing hash sums.*
* **Hex-Dec** - *Hexadecimal to Decimal converter.*
* **[Hash Calculator](http://sanity-free.org/5252/viewtopic.php?id=20)** - *Calculates cryptographic hashes.*
* **Base Calculator** - *Calculates in different bases.*
* **Base Converter** - *Converts between bases.*
* **Jump to Hex** - *Jump instruction to hexadecimal.*

### ⚡ Unpacking
Unpack and remove binary protection (UPX, ASPack, VMProtect).

##### Unprotect
*Remove PE protection and obfuscation.*
* **[XVolkolak](https://n10info.blogspot.com/2018/07/xvolkolak-021.html)** - *Unpacker emulator for malware analysis.*
* **[.NET Reactor Slayer](https://github.com/SychicBoy/NETReactorSlayer)** - *Deobfuscator and unpacker for .NET Reactor.*
* **[MalUnpack](https://github.com/hasherezade/mal_unpack)** - *Dynamic unpacker for malware analysis.*
* **[ILPUnpack](https://github.com/ElektroKill/ILPUnpack)** - *ILProtector unpacker tool.*
* **[ConfuserEx Unpacker](https://github.com/XenocodeRCE/ConfuserEx-Unpacker)** - *Confuserex unpacker.*
* **[ILProtector Unpacker](https://github.com/RexProg/ILProtectorUnpacker)** - *ILProtector unpacker.*
* **RL!deUPX** - *UPX unpacker.*
* **RL!deASPack** - *ASPack unpacker.*
* **RL!dePacker** - *Generic unpacker.*
* **[GUnPacker](https://github.com/unipacker/unipacker)** - *Universal unpacker.*
* **[de4dot](https://github.com/ViRb3/de4dot-cex)** - *.NET deobfuscator and unpacker.*
* **[ASPack Unpacker](https://github.com/orcastor/unpack)** - *Another ASPack unpacker.*
* **[IsXunpack](https://github.com/lifenjoiner/ISx)** - *InstallShield installer extractor.*
* **[ISx](https://github.com/lifenjoiner/ISx)** - *InstallShield installer extractor and unpacker.*
* **Unpacker ExeCryptor** - *ExeCryptor unpacker.*
* **Universal Unprotector** - *Another universal unpacker.*
* **[Quick Unpack](https://github.com/fatrolls/Quick-Unpack)** - *Quick and automated unpacker tool.*
* **[Magicmida](https://github.com/Hendi48/Magicmida)** - *Themida/WinLicense unpacker.*

##### Decoding
*Decode hashed values (Crypto).*
* **Ophcrack** - *Windows password cracker based on rainbow tables.*
* **[Armadillo Key Tool](https://github.com/mrexodia/akt)** - *Tool for working with Armadillo software protection.*
* **[CyberChef](https://github.com/gchq/CyberChef)** - *Analyzing and decoding data.*
* **Hashcat** - *Advanced password recovery.*
* **Keygener Assistant** - *Assists in generating keys for software.*
* **[SND Reverse Tool](https://github.com/sceners/snd-reverser-tool)** - *Reverse engineering tool for Windows binaries.*
* **[Hash Identifier](https://github.com/blackploit/hash-identifier)** - *Identifies the type of hash used in a string.*
* **[RSA-Tool 2](https://github.com/ius/rsatool)** - *Tool for generating and analyzing RSA keys.*
* **[RSATool](https://github.com/ius/rsatool)** - *Generate, convert and analyze RSA keys.*
* **[RSABox](https://github.com/ohEmily/RSA_accelerator)** - *Toolkit for working with RSA encryption.*
* **[MD5 Toolbox](https://github.com/Smithsonian/MD5_tool)** - *Toolbox for working with MD5 hashes.*
* **BarsWF SSE2** - *World Fastest MD5 cracker.*
* **Wordlist** - *Cracking Wordlist Dictionary of 3163421 Words.*

##### Extracting
*Extract PE and other binary files.*
* **[PDBRipper](https://github.com/horsicq/PDBRipper/)** - *PDB file ripper and information extractor.*
* **[DLL Export Viewer](https://www.nirsoft.net/utils/dll_export_viewer.html)** - *View exported functions of a DLL file.*
* **[UEFITool](https://github.com/LongSoft/UEFITool)** - *UEFI firmware image viewer and editor.*
* **[Firmware Tables View](https://www.nirsoft.net/utils/firmware_tables_view.html)** - *Firmware tables (ACPI, SMBIOS) viewer.*
* **[Ratr](https://github.com/Jakiboy/Ratr)** - *Router Config Extractor.*
* **[ResourcesExtract](https://www.nirsoft.net/utils/resources_extract.html)** - *Extract resources from executable files.*
* **DotNetResExtract** - *Extract .NET assembly resources.*
* **[BinText](https://www.aldeid.com/wiki/BinText)** - *Fast and powerful text extractor.*
* **ExeDumper** - *Utility to dump executable files.*
* **Table Extractor** - *Extract tables from executables or libraries.*

##### Extracting (Setup)
* **[UniExtract](https://github.com/Bioruebe/UniExtract2)** - *Universal archive extractor.*
* **[Inno Extractor](https://www.havysoft.cl/innoextractor.html)** - *Tool for extracting Inno Setup installers.*
* **[InnoBF](https://github.com/Malzilla/InnoBF)** - *Inno Setup brute force password finder.*
* **[Innoextract](https://constexpr.org/innoextract/)** - *Command-line Inno Setup unpacker.*
* **InnoCry** - *Inno Setup extactor.*
* **[Innounp](https://github.com/WhatTheBlock/innounp/)** - *Inno Setup unpacker, a command-line version.*
* **MSI Unpacker** - *Extract files from MSI installers.*
* **Fearless MSI Unpacker** - *Tool for unpacking MSI installers.*
* **[LessMSI](https://github.com/activescott/lessmsi)** - *Command-line tool to extract data from MSI files.*
* **Mextract** - *Command-line MSI and CAB extractor.*

##### Extracting (Game)
* **[Ninja Ripper](https://github.com/blackninja23/NinjaRipper)** - *Tool for extracting 3D models from games.*
* **[Asset Bundle Extractor](https://github.com/DerPopo/UABE)** - *Utility for extracting Unity assets.*
* **[Dragon UnPACKer](https://github.com/elbereth/DragonUnPACKer)** - *Tool for opening and extracting game resource files.*
* **[3D Ripper DX](http://www.deep-shadows.com/hax/3DRipperDX.htm)** - *Capture 3D models from DirectX 9 games.*
* **[QuickBMS](https://github.com/aluigi/quickbms)** - *File extraction and reimporting script engine.*
* **[Unity Asset Editor](https://github.com/Perfare/UnityAssetEditor)** - *Tool for modifying Unity game assets.*
* **DevX Unity Unpacker** - *Utility for unpacking Unity game files.*
* **[Unity Studio](https://github.com/Perfare/UnityStudio)** - *Viewer and editor for Unity assets and bundles.*
* **[UnityEx](https://github.com/IIIIIIIIIIII/UnityEx)** - *Utility for extracting assets from Unity games.*
* **[uTinyRipper](https://github.com/mafaca/UtinyRipper)** - *Unity asset extractor and exporter.*

##### Extracting (Registry)
* **[RegJump](https://learn.microsoft.com/en-us/sysinternals/downloads/regjump)** - *Registry Key Jumper.*
* **[RegScanner](https://www.nirsoft.net/utils/regscanner.html)** - *Registry scanner.*
* **[RegFileExport](https://www.nirsoft.net/utils/reg_file_export.html)** - *Extract registry entries to a .reg file.*
* **[RegFromApp](https://www.nirsoft.net/utils/reg_file_from_application.html)** - *Extracts registry entries created by an application.*
* **[RegRipper](https://github.com/keydet89/RegRipper3.0)** - *Another registry extractor.*

##### Extracting (Password)
* **[Browser Pass View](https://www.nirsoft.net/utils/browser_password_recovery.html)** - *Web password recovery tool.*
* **[RouterDP](https://www.sordum.org/10411/router-default-password-v1-1/)** - *Router password view tool.*
* **[Wireless Key View](https://www.nirsoft.net/utils/wireless_key.html)** - *Router password view tool (WirelessKeyView).*
* **ChromePass** - *Google chrome password recovery tool.*
* **[Password Sec. Scanner](https://www.nirsoft.net/utils/password_security_scanner.html)** - *Windows password recovery tool.*
* **[PasswordFox](https://www.nirsoft.net/utils/passwordfox.html)** - *Mozilla firefox password recovery tool.*
* **[Product Key Scanner](https://github.com/keshon/mskeys)** - *Windows product key Scanner.*
* **[ProduKey](https://www.nirsoft.net/utils/product_cd_key_viewer.html)** - *Another Windows product key Scanner.*
* **Accent Office PR** - *Accent Office Password Recovery.*
* **IGHASHGPU** - *GPU Password Recovery.*
* **MPR** - *Multi Password Recovery.*
* **PSPV** - *Protected Storage PassView.*
* **PWLInside** - *Forgotten Password Recovery.*
* **RAR Pswd Recover** - *RAR Password Recover.*
* **RAR Pswd Unlocker** - *RAR Password Unlocker.*
* **RarPC** - *RAR Password Cracker.*
* **SAMInside** - *Windows User Password Recovery.*
* **Tbpv** - *The Bat! Password Viewer.*
* **Tbup** - *The Bat! UnPass.*
* **Wise Finder** - *Wise Installer Password Finder.*

### ⚡ Debugging
View and change the running state of a program (Disassembling, Decompiling, Hexing).

##### Manipulating
*Interactive disassembly and runtime manipulation.*
* **[x64dbg](https://github.com/x64dbg/x64dbg)** - *Graphical debugger for x86 and x86-64 executables.*
* **[Immunity Debugger](https://www.immunityinc.com/products/debugger/)** - *Powerful and flexible debugger for Windows.*
* **[Cutter](https://github.com/rizinorg/cutter)** - *Free and open-source reverse engineering platform.*
* **[dnSpy](https://github.com/dnSpy/dnSpy)** - *.NET assembly editor, decompiler, and debugger.*
* **[OllyDbg](http://www.ollydbg.de/)** - *Dynamic, 32-bit assembler level debugger for Windows.*
* **[Radare2](https://github.com/radareorg/radare2)** - *A portable and multi-architecture reverse engineering framework.*

##### Disassembling
*Transforme machine code into Assembly language.*
* **[Ghidra](https://github.com/NationalSecurityAgency/ghidra)** - *Open-source software reverse engineering suite.*
* **[ViDi](https://github.com/hasherezade/ViDi)** - *Visual disassembler and hex editor.*
* **[WABT](https://github.com/WebAssembly/wabt)** - *WebAssembly Binary Toolkit - disassembler and tools.*
* **[IDA](https://hex-rays.com/ida-free/)** - *Interactive Disassembler for binary analysis.*
* **[Capstone](https://github.com/capstone-engine/capstone)** - *Lightweight multi-architecture disassembly framework.*
* **Delphi Disassembler** - *Disassembler for Delphi executables.*
* **[Bddisasm](https://github.com/bitdefender/bddisasm)** - *Binary Ninja's disassembly library.*
* **Disasm** - *Generic disassembler for various architectures.*
* **[Refractor](https://github.com/Rustemsoft/Refractor-.NET-assembly-browser-and-decompiler)** - *.NET decompiler and assembly browser.*
* **[Win32Dasm](https://www.exetools.com/)** - *Windows 32-bit disassembler.*

##### Decompiling
*Revert the process of compilation.*
* **[BinaryNinja](https://binary.ninja/)** - *Advanced binary analysis platform.*
* **[dotPeek](https://www.jetbrains.com/decompiler/)** - *.NET decompiler and assembly browser.*
* **[JD-GUI](https://github.com/java-decompiler/jd-gui)** - *Decompile Java class files.*
* **[JADX](https://github.com/skylot/jadx)** - *Dex to Java decompiler.*
* **[Bytecode Viewer](https://github.com/Konloch/bytecode-viewer)** - *Decompile Java/Android bytecode & more.*
* **[ILSpy](https://github.com/icsharpcode/ILSpy)** - *Open-source .NET assembly browser.*
* **[.NET Reflector](https://www.red-gate.com/products/dotnet-development/reflector/)** - *.NET assembly browser and decompiler.*
* **[Java Decompiler](https://github.com/java-decompiler/jd-gui)** - *Decompile Java class files.*
* **[JByteMod](https://github.com/GraxCode/JByteMod-Beta)** - *Java bytecode editor and decompiler.*
* **[VB Decompiler](https://www.vb-decompiler.org/)** - *Decompile Visual Basic executables.*
* **[DJ Java Decompiler](https://www.neshkov.com/dj.html)** - *Java decompiler and disassembler.*
* **Dis# Net decompiler** - *.NET decompiler for C#.*
* **[FFDec](https://github.com/jindrapetrik/jpexs-decompiler)** - *Flash Decompiler.*
* **Exe2Aut** - *AutoIt3 based EXE decompiler.*
* **Py2Exe Dumper** - *Py based EXE decompiler.*

##### Hexing
*Edit PE hexadecimal representation.*
* **[ImHex](https://github.com/WerWolv/ImHex)** - *A fast and powerful hex editor.*
* **[010Editor](https://www.sweetscape.com/010editor/)** - *Hex editor with binary templates.*
* **HEX Editor** - *A tool for viewing and editing hexadecimal files.*
* **[HxD](https://mh-nexus.de/en/hxd/)** - *A fast, basic hex editor.*
* **[Hiew](https://www.hiew.ru/)** - *A hex viewer and editor for Windows.*

### ⚡ Editing
Edit executable files.

##### Manipulating
*Compile, build and reconstruct PE (PE, DLL, Import tables, Setup, Res).*
* **[Resource Hacker](http://www.angusj.com/resourcehacker/)** - *Resource Hacker.*
* **[PPEE](https://www.mzrst.com/)** - *Powerful PE file viewer and editor.*
* **PE Lab** - *Interactive PE file (executable) analysis tool.*
* **[PE Tools](https://github.com/petoolse/petools)** - *PE manipulation toolkit.*
* **[XPEViewer](https://github.com/horsicq/XPEViewer)** - *Executable file viewer and editor.*
* **[ReClassEx](https://github.com/namazso/ReClassEx)** - *Structure class reverser.*
* **[ReClass.NET](https://github.com/ReClassNET/ReClass.NET)** - *.Net structure class reverser.*
* **[ResEdit](https://github.com/resedit/resedit)** - *Resource editor for Windows programs.*
* **[CFF Explorer](https://ntcore.com/?page_id=388)** - *PE editor, hex editor, and more for Windows files.*
* **[Resource Builder](https://www.resource-builder.com/download-resource-builder/)** - *Resource file editor and compiler.*
* **Splash Injector** - *Tool for injecting splash screens into programs.*
* **[KDiff3](https://github.com/KDE/kdiff3)** - *File and directory diff and merge tool.*
* **[XELFViewer](https://github.com/horsicq/XELFViewer)** - *ELF files viewer and editor.*
* **[Cheat Engine](https://github.com/cheat-engine/cheat-engine)** - *Memory scanner/debugger for games and applications.*
* **[Scylla](https://github.com/NtQuery/Scylla)** - *Powerful and advanced x86/x86-64 executable unpacker.*
* **[LordPE](http://www.woodmann.com/collaborative/tools/index.php/LordPE)** - *PE editor including imports reconstructing.*
* **[ImpREC](https://github.com/crypto2011/ImpREC)** - *Import reconstructor for reconstructing imports in PE files.*
* **[Frida](https://github.com/frida/frida)** - *Dynamic instrumentation toolkit.*
* **eXeScope** - *16 and 32 bit resource editor.*
* **FixupPak** - *Fix PE Packing.*
* **PE Explorer** - *PE resources editor & explorer.*
* **PE Master** - *PE M@ster.*
* **PE Studio** - *PE Studio.*
* **PE Tools SignMan** - *PE Tools Signature Manager.*
* **PE-DIY Tools** - *PE-DIY Tools.*
* **PE2NE** - *PE to NE.*
* **Peoptim** - *PE Optimizer.*
* **PESnoop** - *OBJ, LIB dumper PE32/PE32+/COFF (CLI).*
* **PETool32** - *x32 PE Tool.*
* **PResFix** - *Resource Fixer for Dump Files (CLI).*
* **ProcDump** - *PE unpacker/decryptor.*
* **ResCrypt** - *Protection of PE program resources.*
* **Resfixer** - *Resource Fixer.*
* **Resource Grabber** - *Grab resources from other programs.*
* **Resource Tuner** - *Advanced visual resource editor for 32 bit.*
* **Resrebld** - *Resource Rebuilder (CLI).*
* **StudPE** - *Portable Executable Editor.*
* **TLS Analiser** - *Northfox's TLS table analiser.*
* **XN ResEdit** - *XN Resource Editor.*
* **[Codejock Toolkit](https://codejock.com/products/toolkitpro/)** - *UI toolkit for Windows applications.*

##### Manipulating (DLL)
* **[Xenos](https://github.com/DarthTon/Xenos)** - *DLL injector.*
* **[Robber](https://github.com/MojtabaTajik/Robber)** - *DLL hijacker tool.*
* **DLL Injector Slait** - *Tool for injecting DLLs into processes.*
* **DLL Packager** - *A tool for bundling DLLs with executables.*
* **Addr&Func Converter** - *Converts DLL addresses to function names.*
* **DLL Injector** - *Tool for injecting DLLs into processes.*
* **DLL Rebaser** - *DLL Rebaser.*
* **DLL Loader** - *Utility for loading DLL files into processes.*
* **IID King** - *Interface identifier lookup tool.*
* **[EasyHook](https://github.com/EasyHook/EasyHook)** - *Windows API Hooking framework.*
* **RemoteDLL** - *Remote DLL.*

##### Manipulating (Setup)
* **[Inno Setup](https://jrsoftware.org/isinfo.php)** - *Installer for Windows programs.*
* **[Inno Script Studio](https://www.kymoto.org/products/inno-script-studio)** - *Inno Setup script manager GUI.*

##### Manipulating (File)
* **EXIF Data Changer** - *Meta data editor.*
* **[Alternate Splitter](https://www.alternate-tools.com/pages/c_splitter.php)** - *Split files into several files with the same size.*
* **[Notepad++](https://notepad-plus-plus.org/)** - *Best Text/Code editor.*
* **[Far Manager](https://github.com/FarGroup/FarManager)** - *Text-based file and archive manager for Windows.*
* **[Hosts Editor](https://hosts.codeplex.com/)** - *Tool for editing Windows hosts file.*
* **[DM CSV Editor](https://github.com/darhmedia/DMcsvEditor)** - *Simple CSV/Tab file editor (DMcsvEditor).*
* **[XML Tree Edit](https://www.donkeydevelopment.com/xmltreeedit/)** - *Simple XML file editor.*
* **[INI Editor](https://sourceforge.net/projects/iniedit/)** - *Tool for editing INI configuration files.*
* **[PDF Metadata Editor](https://github.com/zaro/pdf-metadata-editor)** - *Open Source PDF Metadata Editor.*
* **[Exiftool](https://github.com/exiftool/exiftool)** - *Meta data editor.*
* **[Steghide](https://github.com/StefanoDeVuono/steghide)** - *Hide data in images and audio.*
* **CSV Split** - *Split CSV files.*

##### System
*Tweak system.*
* **[DriveProtect](https://www.sordum.org/8104/drive-protect-v1-0/)** - *Tool for protecting drives from unauthorized access.*
* **[Ratool](https://www.sordum.org/7952/ratool-v1-3/)** - *Resource attributes manipulation tool.*

##### System (Network)
* **[NetPnc](https://www.sordum.org/14327/network-profile-name-changer-v1-4/)** - *Network Profile Name Changer.*
* **[NetDisabler](https://www.sordum.org/9660/netdisabler-v1-0/)** - *Tool for disabling network adapters.*
* **[UrlDisabler](https://www.sordum.org/10636/url-disabler-v1-0/)** - *Tool for blocking URLs and websites.*
* **[Fab](https://www.sordum.org/8125/firewall-app-blocker-fab-v1-9/)** - *Firewall and blocking utility.*
* **[DNS-Lock](https://www.sordum.org/9181/dns-lock-v1-0/)** - *Tool for locking DNS settings.*
* **[WinSCP](https://github.com/winscp/winscp)** - *Free SFTP, SCP, and FTP client for Windows.*

##### System (Process)
* **[ExcTool](https://www.sordum.org/10636/defender-exclusion-tool-v1-4)** - *Process exception handling tool.*
* **Eso** - *Enhanced process management utility.*
* **[RunBlock](https://www.sordum.org/8098/run-block-v1-0/)** - *Tool for blocking process execution.*
* **[ReduceMemory](https://www.sordum.org/9197/reduce-memory-v1-6/)** - *Tool for reducing process memory usage.*
* **MHS** - *Memory Hacking Software.*

##### Converting
*Convert scripts and binary files.*
* **[BAT to EXE](https://www.f2ko.de/en/b2e.php)** - *Convert batch script files to executable format.*
* **PS1 to EXE** - *Convert PowerShell scripts to executable format.*
* **VBS to EXE** - *Convert VBScript files to executable format.*
* **JAR to EXE** - *Convert Java JAR files to Windows executable format.*
* **REG to EXE** - *Convert Windows registry files to executable format.*
* **[PNG to ICO](https://github.com/AndresMorelos/PNG-to-ICO)** - *Convert PNG images to Windows icon format.*
* **Media to EXE** - *Convert audio and video files to executable format.*
* **PHP to EXE** - *Convert PHP scripts to standalone executables using RapidEXE.*
* **DLL to EXE** - *Convert Dynamic Link Library files to executable format.*
* **EXE to DLL** - *Convert executable files to Dynamic Link Library format.*
* **PE to SHC** - *Convert PE executables to shellcode format.*

### ⚡ Patching
Generate patching program using binary compare.

##### Patcher
*Build binary patcher.*
* **dUP 2** - *Utility for creating patches for software.*
* **AT4RE Patcher** - *Patch creator for software modification.*
* **Apatch** - *Tool for creating patches for software.*
* **CodeFusion** - *Patch creator and modifier for software.*
* **Graphical Patch Maker** - *Tool for creating graphical patches.*
* **[XDELTA Patch Maker](https://github.com/jmacd/xdelta)** - *Patch creator for Inno Setup installers.*
* **uPPP** - *Patch creation tool for software modification.*
* **PEiD Patch Maker** - *Patch creator for PEiD signatures.*

##### Loader
*Build binary patch loader.*
* **Advanced Loader Generator** - *Tool for generating loaders.*
* **Abel Loader Generator** - *Another tool for generating loaders.*

##### Keygen
*Build Keygen.*
* **REPT Keygen Maker** - *Tool for generating keygens.*

##### Release
*Build patcher release and NFO file.*
* **Release Builder** - *Tool for building software releases.*
* **DizView** - *View and edit file descriptions (DIZ files).*
* **Fast Cracktro Maker** - *Create fast crack intros for software.*
* **mRelease Builder** - *Tool for building software releases.*
* **NFO Maker** - *Create NFO files for software releases.*
* **NFO Scroller** - *Scroll NFO files in a marquee style.*
* **NFO View** - *View NFO files with syntax highlighting.*
* **NFO Viewer 2** - *View NFO files with enhanced features.*

##### ASCII
*Build patcher release ASCII.*
* **[Ascgen](https://ascgendotnet.jmsoftware.co.uk/)** - *Generate ASCII art from images.*
* **1337 Converter** - *Convert text to leet speak (1337).*
* **ASCII Art studio** - *Create ASCII art and export images.*
* **ASCII Converter** - *Convert text to ASCII characters.*
* **ASCII Generator** - *Generate ASCII art from text.*
* **ASCII Table** - *Display an ASCII character table.*
* **Magic ASCII Pic** - *Create ASCII art from images.*

##### Skin
*Build patcher skins.*
* **Dup2AP Skin Converter** - *Converts skins for Dup2AP software.*
* **Image Flipper** - *Flips images horizontally or vertically.*
* **Skin Builder** - *Tool for creating custom skins.*
* **Skin Extractor** - *Extracts skins from applications.*
* **uPPP2AP Skin Converter** - *Converts skins for uPPP2AP software.*
* **RGNerator** - *Generates resource scripts for skinning tools.*

##### Skin (Patcher skins)
* **ReVens** - *ReVens custom patcher skin theme.*
* **Vista PinStripe** - *Vista-styled pinstripe patcher skin.*
* **Blackitem Gui IREC** - *Blackitem IREC themed patcher skin.*
* **Blackitem Gui SND** - *Blackitem SND themed patcher skin.*
* **Blackitem Gui Kit** - *Blackitem themed patcher skin kit.*
* **Wordbeast** - *Wordbeast themed patcher skin.*
* **Classic Fight!** - *Classic Fight themed patcher skin.*
* **Code Cracker!** - *Code Cracker themed patcher skin.*
* **Danger Skin** - *Danger themed patcher skin.*
* **Secureteam** - *Secureteam themed patcher skin.*
* **Windows 8** - *Windows 8 styled patcher skin.*
* **UNDF** - *UNDF themed patcher skin.*
* **UNDF2b** - *UNDF2b themed patcher skin.*
* **TCCT Metal** - *TCCT Metal themed patcher skin.*
* **MacOSX** - *MacOSX styled patcher skin.*
* **GCT 19** - *GCT 19 themed patcher skin.*
* **Kartui** - *Kartui themed patcher skin.*

##### Sound
*Build patcher sounds (MX).*
* **FastTracker** - *Popular tracker software for creating music.*
* **[MilkyTracker](https://github.com/milkytracker/MilkyTracker)** - *Multi-platform music tracker inspired by FastTracker 2.*
* **[OpenMPT](https://github.com/OpenMPT/openmpt)** - *Open-source tracker software.*
* **[ProTracker](https://github.com/8bitbubsy/pt2-clone)** - *Classic Amiga music tracker software.*
* **[ModPlug Player](https://sourceforge.net/projects/modplugplayer/)** - *Player for module files including MOD, S3M, and XM.*
* **ChipRip** - *Tool for extracting audio from chiptune files.*

##### Sound (Patcher sounds)
* **BRD - Teleport Pro** - *Original BRD Teleport Pro patcher music.*
* **AAOCG - mIRC** - *Original AAOCG mIRC patcher music.*
* **CORE - Get Backup Pro** - *Original CORE Get Backup Pro patcher music.*
* **CORE - Power ISO** - *Original CORE Power ISO patcher music.*
* **DYNAMITE - Winamp** - *Original DYNAMITE Winamp patcher music.*
* **ECLiPSE - Battleship Chess** - *Original ECLiPSE Battleship Chess patcher music.*
* **FFF - AB Commander** - *Original FFF AB Commander patcher music.*
* **FFF - ACDSee** - *Original FFF ACDSee patcher music.*
* **BRD - Video Converter** - *Original BRD Video Converter patcher music.*
* **Tetris** - *Classic Tetris game music theme.*
* **Super Mario Bros** - *Classic Super Mario Bros game music theme.*
* **Super Mario Cave** - *Super Mario underground cave music theme.*
* **Famous** - *Collection of famous patcher music tracks.*
* **Others** - *Additional patcher music tracks collection.*

### ⚡ Misc
Helper tools and miscellaneous content.

##### Assembling
*Assembling Machine code.*
* **[RadASM](http://www.radasm.com/)** - *Rapid Application Development IDE.*
* **[Flat assembler (FASM)](https://flatassembler.net/)** - *A fast, self-hosting assembly language compiler for x86 architecture.*
* **[GoAsm](http://www.goasm.com/)** - *Free x86/x64 assembler for Windows.*
* **[Nasm](https://github.com/netwide-assembler/nasm)** - *Netwide Assembler for x86 architecture.*
* **AsmEdit** - *ASM Editor.*
* **Borland TASM** - *Borland TASM Turbo Assembler.*
* **COFF2OMF** - *COFF to OMF Conversion Utility.*
* **DLL2ANSI** - *DLL to ANSI FASM include file converter.*
* **Goldroad** - *GameBoy Advance Assembler.*
* **jByteCode** - *Java bytecode disassembler/assembler.*
* **LZASM** - *Lazy Assembler.*
* **MASM32** - *ASM 32 Assembler.*
* **Objdump** - *OBJ OMF Dumper.*
* **WinAsm** - *Windows Assembler Studio.*

##### Bypassing
*Bypass runtime protections and anti-debugging.*
* **[RunAsDate](https://www.nirsoft.net/utils/run_as_date.html)** - *Utility for running programs with a specified date.*
* **DateHack** - *Tool for modifying system dates for software trials.*
* **Trial-Reset** - *Tool for extending trial periods of software.*
* **[RunFromProcess](https://www.nirsoft.net/utils/run_from_process.html)** - *Tool for running processes from a different process.*
* **[SkipUAC](https://www.sordum.org/16219/skip-uac-prompt-v1-2/)** - *Tool for bypassing Windows User Account Control.*
* **[ScyllaHide](https://github.com/x64dbg/ScyllaHide)** - *Anti-(anti-debugger).*

##### Encoding
*Data encoding.*
* **[hasher](https://github.com/JetBrains/hasher)** - *Generate hash values for files using various algorithms.*
* **[Hash Generator](https://github.com/ashutosh1206/Crypto-Hash-Generator)** - *Hashing tool for file verification.*
* **[XCA](https://hohnstaedt.de/xca/)** - *A certificate generation tool.*
* **[PuTTY keygen](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)** - *PuTTY SSH key generator.*
* **[Password Generator](https://www.sordum.org/10946/sordum-random-password-generator/)** - *Sordum Random Password Generator.*
* **[WinHasher](https://sourceforge.net/projects/winhasher/)** - *Hash generator and checker for Windows.*
* **[HashMyFiles](https://www.nirsoft.net/utils/hash_my_files.html)** - *Tool to calculate and verify hash values.*
* **XOR** - *Tool for bitwise XOR operations on files.*
* **DSS-DSA Generator** - *Tool for generating DSA keys.*
* **gRn-Rsa-Donkey** - *RSA key generator.*
* **VeraCrypt** - *Disk encryption software.*
* **Xorer** - *Xor converter.*
* **Base64 (CLI)** - *Command-line tool for Base64 encoding and decoding.*
* **MD5 (CLI)** - *Command-line tool for MD5 hashing.*
* **SHA1 (CLI)** - *Command-line tool for SHA1 hashing.*
* **Dissecting RC4 Algo.** - *Analyzes the RC4 encryption algorithm.*

##### Packing
*Compress and protect executable files.*
* **[EXE Packer](https://www.alternate-tools.com/pages/c_exepacker.php)** - *Alternate EXE Packer: A program to pack executable files.*
* **[ConfuserEx](https://github.com/mkaring/ConfuserEx)** - *Open-source protector for .NET applications.*
* **[Netshrink](https://www.pelock.com/products/netshrink)** - *.NET executable compressor and DLL binder.*
* **[Obfuscator](https://www.pelock.com/products/obfuscator)** - *x86 assembler obfuscator (⚠ Network API).*
* **[JObfuscator](https://www.pelock.com/jobfuscator/)** - *Java obfuscator (⚠ Network API).*
* **[PELock](https://www.pelock.com/products/pelockK)** - *32 bit Windows application security solution.*
* **[PEunion](https://github.com/bytecode77/pe-union)** - *Crypter with native & .NET stub.*
* **[UPX](https://github.com/upx/upx)** - *Free, portable, and extendable executable packer.*
* **[AutoIt Obfuscator](https://www.pelock.com/autoit-obfuscator/)** - *AutoIt obfuscator (⚠ Network API).*
* **Amber** - *Reflective PE packer for bypassing security.*

##### Mobile
*Mbile RE toolkits.*
* **[Etcher](https://github.com/balena-io/etcher)** - *A cross-platform tool to flash OS images onto SD cards and USB.*
* **[WhatsApp Viewer](https://github.com/andreas-marschke/whatsapp-viewer)** - *Viewer for WhatsApp chat histories.*
* **[OTP Extractor](https://github.com/scito/extract_otp_secrets)** - *Tool for extracting OTPs (One-Time Passwords).*
* **WhatsApp Extractor** - *Command-line tool for extracting WhatsApp data.*

##### Mobile (Android)
* **[APK Editor Studio](https://github.com/kefir500/apk-editor-studio)** - *Powerful APK editing tool.*
* **[APK Easy Tool](https://forum.xda-developers.com/t/tool-windows-apk-easy-tool-v1-60-2023-02-23.3333960/)** - *APK management utility for Windows.*
* **[ADB Installer](https://github.com/koush/adb-install)** - *Android Debug Bridge installer for Windows.*
* **[ADB Driver Installer](https://adbdriver.com/)** - *Universal ADB driver installer for Android devices.*
* **[APK Installer](https://github.com/pepakriz/apk-installer)** - *Tool for installing APK files on Android devices.*
* **APK Protect** - *Tool for protecting Android applications.*
* **XAPK Detector** - *Detects and handles XAPK files.*
* **[APK Multi-Tool](https://github.com/APK-Multi-Tool/APK-Multi-Tool)** - *Tool for managing and modifying Android APK files.*
* **[Apktool](https://github.com/iBotPeaches/Apktool)** - *Tool for decompiling and recompiling Android APK files.*
* **[Odin3](https://odindownload.com/)** - *Samsung Android ROM flashing tool.*

##### Mobile (IOS)
* **SSH Ramdisk** - *iPhone ramdisk control.*
* **F0recast** - *Check iOS device jailbreak/unlock status.*
* **iDetector** - *Check iOS bootrom.*
* **[Pangu](http://en.pangu.io/)** - *iOS jailbreak tool.*
* **jailsn0w** - *iCloud activation bypass.*
* **[Sn0wbreeze](https://ih8sn0w.com/)** - *Custom IPSWs generator.*
* **[P0sixspwn](https://ih8sn0w.com/p0sixspwn.html)** - *iOS jailbreaking tool.*
* **[iREB](https://ih8sn0w.com/ireb.html)** - *iTunes custom IPSWs bypass tool.*
* **[3uTools](https://www.3u.com/)** - *Tool for flashing and jailbreaking iOS.*
* **[Checkra1n (CLI)](https://checkra.in/)** - *Command-line jailbreak tool for iOS devices.*
* **[Checkn1x (ISO)](https://github.com/asineth0/checkn1x)** - *Jailbreaking iOS devices bootable ISO.*
* **[Bootra1n (ISO)](https://github.com/foxlet/bootra1n)** - *Enough Linux for checkra1n jailbreak.*

##### Simulating
*Circuit and logical simulation.*
* **[Fritzing](https://github.com/fritzing/fritzing-app)** - *An open-source electronics design software.*
* **[SimulIDE](https://github.com/simulide/simulide)** - *Real-time electronics simulator.*
* **arduino-simulator** - *Software for simulating Arduino circuits.*
* **[PICSimLab](https://github.com/lcgamboa/picsimlab)** - *PIC microcontroller simulator.*
* **[UnoArduSim](http://www.unoardusim.com/)** - *Arduino simulator and debugger.*
* **[Circuit Simulator](https://github.com/pfalcon/awesome-circuit-simulator)** - *Software for simulating electronic circuits.*
* **[Logisim](https://github.com/logisim-evolution/logisim-evolution)** - *Educational digital circuit simulator.*
* **[Arduino CLI](https://github.com/arduino/arduino-cli)** - *Command-line interface for Arduino.*
* **[Dia](https://gitlab.gnome.org/GNOME/dia)** - *Diagram creation software.*

##### Programming
*Programming tools (+ Compilators).*
* **[PyScripter](https://github.com/pyscripter/pyscripter)** - *Free and open-source Python integrated development environment (IDE).*
* **[Dev-C++](https://github.com/Embarcadero/Dev-Cpp)** - *A fast, portable, simple, and free C/C++ IDE.*
* **AutoPlay Media Studio** - *AutoPlay Media Studio Installer with serial key.*
* **[Cmder](https://github.com/cmderdev/cmder)** - *Console emulator.*
* **[DevToys](https://github.com/DevToys-app/DevToys)** - *A Swiss Army knife for developers.*
* **[GoLink](https://www.godevtool.com/GolinkHelp/GoLink.htm)** - *Linker.*
* **[GoRC](https://www.godevtool.com/GorcFrame.htm)** - *Resource Compiler.*
* **[Small Basic](https://smallbasic-publicwebsite.azurewebsites.net/)** - *A simple, beginner-friendly programming language and IDE.*
* **CLI Tools** - *Archive of .exe CLI Tools to play with.*

##### Automating
*Automation and macro tools.*
* **[AutoIt](https://www.autoitscript.com/site/autoit/)** - *Scripting language designed for automating the Windows GUI.*
* **[AutoClicker](https://sourceforge.net/projects/orphamielautoclicker/)** - *Automate mouse clicks.*
* **[Mouse Recorder](https://www.mouserecorder.com/index.html)** - *Record mouse actions for infinite replay.*
* **[SendWKey](1.1)** - *Send Windows Key.*

##### Dependencies
*Toolkit's standalone and offline dependencies installers.*
* **[Sandboxie](https://github.com/sandboxie-plus/Sandboxie)** - *Enhanced version of the popular sandboxing program.*
* **[.NET Framework AIO](https://www.microsoft.com/net)** - *.NET Framework AIO Runtime installer.*
* **[DirectX](https://learn.microsoft.com/en-us/windows/win32/directx)** - *DirectX End-User Runtime installer.*
* **[JDK](https://www.oracle.com/java/technologies/downloads/)** - *Java Development Kit installer.*
* **[JRE](https://www.oracle.com/java/technologies/javase-downloads.html)** - *Java Runtime Environment installer.*
* **[Cmake](https://github.com/Kitware/CMake)** - *C, C++ builder.*
* **[Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/)** - *Visual Basic Runtime installer.*
* **Python** - *Python installer.*
* **[Visual C++ AIO](https://learn.microsoft.com/en-us/cpp/)** - *Visual C++ AIO installer.*
* **[Npcap](https://github.com/nmap/npcap)** - *Packet capture library installer.*
* **[MSYS2](https://github.com/nmap/npcap)** - *Unix SDK installer for Windows.*
* **[Zip](https://gnuwin32.sourceforge.net/packages/zip.htm)** - *Zip installer for Windows.*

<!-- Auto-generated: ReVens Packages End -->

### ⭐ Support:

Skip the coffee! If you like the project, a **star** would mean a lot.
