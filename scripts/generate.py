#!/usr/bin/env python3
"""
Script to generate dynamic content
"""

import json
import os
import sys
import re
import shutil
import zipfile
import hashlib
from pathlib import Path

# Paths
SECTIONS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'sections.json')
ITEMS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'items.json')
APP_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'app.json')
README_PATH = os.path.join(os.path.dirname(__file__), '..', 'README.md')
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), 'Readme.md.tpl')
DOWNLOAD_DIR = os.path.join(os.path.dirname(__file__), '.download')
TEST_EXE_PATH = os.path.join(os.path.dirname(__file__), 'demo', 'revensdemo.exe')

# Markers for auto-generated content
BEGIN_MARKER = "<!-- Auto-generated: ReVens Packages Begin -->"
END_MARKER = "<!-- Auto-generated: ReVens Packages End -->"

def load_sections():
    """Load sections from sections.json"""
    try:
        with open(SECTIONS_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('sections', [])
    except Exception as e:
        print(f"ERROR: Could not read sections.json: {e}")
        return []

def load_items():
    """Load items from items.json"""
    try:
        with open(ITEMS_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('items', [])
    except Exception as e:
        print(f"ERROR: Could not read items.json: {e}")
        return []

def load_app_config():
    """Load app config from app.json"""
    try:
        with open(APP_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        print(f"ERROR: Could not read app.json: {e}")
        return None

def save_app_config(config):
    """Save app config to app.json"""
    try:
        with open(APP_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent='\t', ensure_ascii=False)
        return True
    except Exception as e:
        print(f"ERROR: Could not write app.json: {e}")
        return False

def calculate_md5(file_path):
    """Calculate MD5 hash of a file"""
    md5_hash = hashlib.md5()
    try:
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                md5_hash.update(chunk)
        return md5_hash.hexdigest()
    except Exception as e:
        print(f"ERROR: Could not calculate MD5 for {file_path}: {e}")
        return None

def load_readme():
    """Load current README.md content"""
    try:
        with open(README_PATH, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"ERROR: Could not read README.md: {e}")
        return None

def save_readme(content):
    """Save updated README.md content"""
    try:
        with open(README_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"ERROR: Could not write README.md: {e}")
        return False

def strip_html_tags(text):
    """Remove HTML tags from text"""
    return re.sub(r'<[^>]+>', '', text)

def generate_packages_content(sections, items):
    """Generate markdown content for packages based on sections and items"""
    content = []
    
    for section in sections:
        section_name = section.get('name')
        section_title = section.get('title')
        section_desc = strip_html_tags(section.get('desc', ''))
        
        # Skip AI and Docs sections
        if section_name in ['ai', 'docs']:
            continue
        
        # Add section header
        content.append(f"\n### ⚡ {section_title}\n")
        content.append(f"{section_desc}.\n")
        
        # Process subs
        for sub in section.get('sub', []):
            sub_name = sub.get('name')
            sub_title = sub.get('title')
            sub_desc = strip_html_tags(sub.get('desc', ''))
            
            # Add sub header
            content.append(f"\n##### {sub_title}\n")
            content.append(f"*{sub_desc}.*\n")
            
            # Get items for this section/sub (without extra)
            section_items = []
            for item in items:
                if item.get('section') == section_name and item.get('sub') == sub_name and not item.get('extra'):
                    section_items.append(item)
            
            # Add items
            for item in section_items:
                item_name = item.get('name', '')
                item_desc = item.get('desc', '')
                item_url = item.get('url')
                
                if item_url and item_url is not False:
                    content.append(f"* **[{item_name}]({item_url})** - *{item_desc}.*\n")
                else:
                    content.append(f"* **{item_name}** - *{item_desc}.*\n")
            
            # Process extras if they exist
            extras = sub.get('extra', [])
            if extras:
                for extra in extras:
                    extra_name = extra.get('name') if isinstance(extra, dict) else extra
                    extra_title = extra.get('title') if isinstance(extra, dict) else extra
                    
                    # Get items for this extra
                    extra_items = []
                    for item in items:
                        if item.get('section') == section_name and item.get('sub') == sub_name and item.get('extra') == extra_name:
                            extra_items.append(item)
                    
                    # Only add extra header if there are items
                    if extra_items:
                        content.append(f"\n##### {sub_title} ({extra_title})\n")
                        
                        for item in extra_items:
                            item_name = item.get('name', '')
                            item_desc = item.get('desc', '')
                            item_url = item.get('url')
                            
                            if item_url and item_url is not False:
                                content.append(f"* **[{item_name}]({item_url})** - *{item_desc}.*\n")
                            else:
                                content.append(f"* **{item_name}** - *{item_desc}.*\n")
    
    return ''.join(content)

def create_zip_with_password(folder_path, zip_path, password):
    """Create a password-protected zip file using 7z with deterministic output"""
    import time
    import datetime
    
    try:
        # Set fixed timestamp for all files to ensure deterministic hashes
        # Use 2020-01-01 00:00:00 as the fixed time
        fixed_timestamp = datetime.datetime(2020, 1, 1, 0, 0, 0).timestamp()
        
        # Walk through all files and set their modification time
        for root, dirs, files in os.walk(folder_path):
            for name in files:
                filepath = os.path.join(root, name)
                os.utime(filepath, (fixed_timestamp, fixed_timestamp))
        
        # Using 7z command for password protection
        cmd = f'7z a -tzip -p{password} -mem=AES256 "{zip_path}" "{folder_path}"'
        result = os.system(cmd)
        if result != 0:
            print(f"WARNING: Failed to create password-protected zip for {folder_path}")
            print(f"         Trying alternative method...")
            # Fallback: create zip without password protection but with fixed timestamp
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(folder_path):
                    # Sort files for deterministic order
                    for file in sorted(files):
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, os.path.dirname(folder_path))
                        # Create ZipInfo with fixed timestamp
                        zinfo = zipfile.ZipInfo(arcname)
                        zinfo.date_time = (2020, 1, 1, 0, 0, 0)
                        zinfo.compress_type = zipfile.ZIP_DEFLATED
                        with open(file_path, 'rb') as f:
                            zipf.writestr(zinfo, f.read())
            print(f"         Created unprotected zip (7z not available)")
        return True
    except Exception as e:
        print(f"ERROR: Could not create zip for {folder_path}: {e}")
        return False

def get_package_title(package_name):
    """Get a title for the package from sections.json mapping"""
    # Map package names to section titles
    title_map = {
        'Analyzing': 'Analyzing',
        'Assembling': 'Assembling',
        'Automating': 'Automating',
        'Bypassing': 'Bypassing',
        'Calculating': 'Calculating',
        'Comparing': 'Comparing',
        'Converting': 'Converting',
        'Debugging': 'Debugging',
        'Decoding': 'Decoding',
        'Decompiling': 'Decompiling',
        'Dependencies': 'Dependencies',
        'Disassembling': 'Disassembling',
        'Documentation': 'Documentation',
        'Editing': 'Editing',
        'Encoding': 'Encoding',
        'Extracting': 'Extracting',
        'Hexing': 'Hexing',
        'Mobile': 'Mobile',
        'Packing': 'Packing',
        'Patching': 'Patching',
        'Programming': 'Programming',
        'Simulating': 'Simulating',
        'Unpacking': 'Unpacking'
    }
    return title_map.get(package_name, package_name)

def generate_test_downloads():
    """Generate test download packages based on app.json parts"""
    print("=" * 80)
    print("GENERATE TEST DOWNLOADS")
    print("=" * 80)
    print()
    
    # Load data
    print("Loading app.json...")
    app_config = load_app_config()
    if not app_config:
        return False
    
    password = app_config.get('items', {}).get('pswd', '')
    if not password:
        print("ERROR: No password found in app.json")
        return False
    
    parts = app_config.get('items', {}).get('parts', [])
    if not parts:
        print("ERROR: No parts found in app.json")
        return False
    
    print(f"Using password: {password}")
    print(f"Found {len(parts)} packages to generate")
    
    print("Loading items.json...")
    items = load_items()
    if not items:
        return False
    
    # Create download directory
    if os.path.exists(DOWNLOAD_DIR):
        print(f"Removing existing download directory: {DOWNLOAD_DIR}")
        shutil.rmtree(DOWNLOAD_DIR)
    
    print(f"Creating download directory: {DOWNLOAD_DIR}")
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    
    # Check if test exe exists
    if not os.path.exists(TEST_EXE_PATH):
        print(f"ERROR: Test executable not found: {TEST_EXE_PATH}")
        return False
    
    total_folders = 0
    total_items_created = 0
    
    # Store package info with hashes
    packages_with_hashes = []
    
    # Process each part from app.json
    for part in parts:
        # Extract folder name from part
        # Support both old format (string) and new format (object)
        if isinstance(part, dict):
            folder_name = part.get('name', '').replace('.zip', '')
        else:
            folder_name = part.replace('.zip', '')
        
        folder_path = os.path.join(DOWNLOAD_DIR, folder_name)
        
        print(f"\nProcessing package: {folder_name}")
        os.makedirs(folder_path, exist_ok=True)
        
        # Create content.txt with package title
        package_title = get_package_title(folder_name)
        content_file = os.path.join(folder_path, 'content.txt')
        with open(content_file, 'w', encoding='utf-8') as f:
            f.write(package_title)
        print(f"  Created content.txt")
        
        # Special case: Documentation only has content.txt, no items
        if folder_name == 'Documentation':
            # Create password-protected zip for Documentation
            zip_name = f"{folder_name}.zip"
            zip_path = os.path.join(DOWNLOAD_DIR, zip_name)
            
            print(f"  Creating password-protected archive: {zip_name}")
            create_zip_with_password(folder_path, zip_path, password)
            
            # Calculate MD5 hash
            print(f"  Calculating MD5 hash...")
            md5_hash = calculate_md5(zip_path)
            if md5_hash:
                print(f"  MD5: {md5_hash}")
                packages_with_hashes.append({
                    "name": zip_name,
                    "hash": md5_hash
                })
            
            # Remove the folder after compression
            print(f"  Removing folder: {folder_name}")
            shutil.rmtree(folder_path)
            
            total_folders += 1
            continue
        
        # Get items for this package (match path starting with /FolderName/)
        path_prefix = f"/{folder_name}/"
        package_items = [item for item in items if item.get('path', '').startswith(path_prefix)]
        
        if not package_items:
            print(f"  WARNING: No items found for {folder_name}")
        
        # Categorize items by type
        exe_items = [item for item in package_items if item.get('type') == 'exe']
        cmd_items = [item for item in package_items if item.get('type') in ['cli', 'cmd']]
        zip_items = [item for item in package_items if item.get('type') == 'zip']
        
        items_created = 0
        
        # Take first exe item
        if exe_items:
            item = exe_items[0]
            item_name = item.get('name')
            item_path = item.get('path', '')
            
            # Extract the relative path structure from item path
            # E.g., "/Calculating/Math Solver/MathSolver.exe" -> "Math Solver"
            # E.g., "/Analyzing/System/API/NTLDD/ntldd.exe" -> "System/API/NTLDD"
            path_parts = item_path.strip('/').split('/')
            # Remove first part (package name) and last part (filename)
            if len(path_parts) >= 2:
                relative_path_parts = path_parts[1:-1]  # Everything between package and filename
                item_subfolder = '/'.join(relative_path_parts)
            else:
                item_slug = item.get('slug', item_name.replace(' ', '-').lower())
                item_subfolder = item_slug
            
            # Create folder for the item (preserving full path structure)
            item_folder = os.path.join(folder_path, item_subfolder)
            os.makedirs(item_folder, exist_ok=True)
            
            # Get the actual exe filename from path
            exe_filename = os.path.basename(item_path)
            
            # Copy test exe and rename it
            exe_path = os.path.join(item_folder, exe_filename)
            shutil.copy2(TEST_EXE_PATH, exe_path)
            
            # Create item.txt
            item_txt = os.path.join(item_folder, 'item.txt')
            with open(item_txt, 'w', encoding='utf-8') as f:
                f.write(item_name)
            
            print(f"  Created EXE: {item_subfolder}/{exe_filename}")
            items_created += 1
        
        # Take first cmd item
        if cmd_items:
            item = cmd_items[0]
            item_name = item.get('name')
            item_path = item.get('path', '')
            
            # Extract the relative path structure
            # E.g., "/Calculating/RHash/run.cmd" -> "RHash"
            # E.g., "/Analyzing/System/API/NTLDD/ntldd.cmd" -> "System/API/NTLDD"
            path_parts = item_path.strip('/').split('/')
            # Remove first part (package name) and last part (filename)
            if len(path_parts) >= 2:
                relative_path_parts = path_parts[1:-1]  # Everything between package and filename
                item_subfolder = '/'.join(relative_path_parts)
            else:
                item_slug = item.get('slug', item_name.replace(' ', '-').lower())
                item_subfolder = item_slug
            
            # Create folder for the item (preserving full path structure)
            item_folder = os.path.join(folder_path, item_subfolder)
            os.makedirs(item_folder, exist_ok=True)
            
            # Get the actual cmd filename from path
            cmd_filename = os.path.basename(item_path)
            exe_filename = cmd_filename.replace('.cmd', '.exe').replace('.bat', '.exe')
            
            # Copy test exe
            exe_path = os.path.join(item_folder, exe_filename)
            shutil.copy2(TEST_EXE_PATH, exe_path)
            
            # Create item.txt
            item_txt = os.path.join(item_folder, 'item.txt')
            with open(item_txt, 'w', encoding='utf-8') as f:
                f.write(item_name)
            
            # Create cmd file to start the exe
            cmd_file = os.path.join(item_folder, cmd_filename)
            with open(cmd_file, 'w', encoding='utf-8') as f:
                f.write(f'@echo off\n')
                f.write(f'start "" "%~dp0{exe_filename}"\n')
            
            print(f"  Created CMD: {item_subfolder}/{cmd_filename}")
            items_created += 1
        
        # Take first zip item
        if zip_items:
            item = zip_items[0]
            item_name = item.get('name')
            item_path = item.get('path', '')
            
            # Get the actual zip filename from path
            zip_filename = os.path.basename(item_path)
            
            # Create temporary folder for the zip content
            temp_folder = os.path.join(folder_path, f"_temp_{zip_filename}")
            os.makedirs(temp_folder, exist_ok=True)
            
            # Create item.txt in temp folder
            item_txt = os.path.join(temp_folder, 'item.txt')
            with open(item_txt, 'w', encoding='utf-8') as f:
                f.write(item_name)
            
            # Create zip file
            zip_path = os.path.join(folder_path, zip_filename)
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                zipf.write(item_txt, 'item.txt')
            
            # Remove temp folder
            shutil.rmtree(temp_folder)
            
            print(f"  Created ZIP: {zip_filename}")
            items_created += 1
        
        total_items_created += items_created
        
        # Create password-protected zip for the entire folder
        zip_name = f"{folder_name}.zip"
        zip_path = os.path.join(DOWNLOAD_DIR, zip_name)
        
        print(f"  Creating password-protected archive: {zip_name}")
        create_zip_with_password(folder_path, zip_path, password)
        
        # Calculate MD5 hash of the created zip
        print(f"  Calculating MD5 hash...")
        md5_hash = calculate_md5(zip_path)
        if md5_hash:
            print(f"  MD5: {md5_hash}")
            packages_with_hashes.append({
                "name": zip_name,
                "hash": md5_hash
            })
        
        # Remove the folder after compression
        print(f"  Removing folder: {folder_name}")
        shutil.rmtree(folder_path)
        
        total_folders += 1
    
    # Update app.json with the new parts structure including hashes
    print("\n" + "=" * 80)
    print("UPDATING APP.JSON WITH HASHES")
    print("=" * 80)
    app_config['items']['parts'] = packages_with_hashes
    if save_app_config(app_config):
        print("* Updated app.json with MD5 hashes")
    else:
        print("* Failed to update app.json")
    
    print("\n" + "=" * 80)
    print("GENERATION COMPLETED!")
    print("=" * 80)
    print(f"* Created {total_folders} compressed packages")
    print(f"* Generated {total_items_created} test items")
    print(f"* Output directory: {DOWNLOAD_DIR}")
    print("=" * 80)
    
    return True

def generate_readme():
    """Generate README.md with dynamic packages content"""
    print("=" * 80)
    print("GENERATE README.MD")
    print("=" * 80)
    print()
    
    # Load data
    print("Loading sections.json...")
    sections = load_sections()
    if not sections:
        return False
    
    print("Loading items.json...")
    items = load_items()
    if not items:
        return False
    
    print("Loading README.md...")
    readme_content = load_readme()
    if readme_content is None:
        return False
    
    # Check if markers exist
    if BEGIN_MARKER not in readme_content or END_MARKER not in readme_content:
        print(f"ERROR: Markers not found in README.md")
        print(f"  Expected: {BEGIN_MARKER}")
        print(f"  Expected: {END_MARKER}")
        return False
    
    # Generate packages content
    print("Generating packages content...")
    packages_content = generate_packages_content(sections, items)
    
    # Replace content between markers
    pattern = f"{re.escape(BEGIN_MARKER)}.*?{re.escape(END_MARKER)}"
    new_content = f"{BEGIN_MARKER}\n{packages_content}\n{END_MARKER}"
    updated_readme = re.sub(pattern, new_content, readme_content, flags=re.DOTALL)
    
    # Save updated README
    print("Saving README.md...")
    if save_readme(updated_readme):
        print("✓ Successfully generated README.md")
        print(f"✓ Generated content for {len(sections)-1} sections")
        print(f"✓ Total items: {len(items)}")
        print("\n" + "=" * 80)
        print("GENERATION COMPLETED!")
        print("=" * 80)
        return True
    
    return False

def main():
    """Main function"""
    # Check for arguments
    if '--readme' in sys.argv:
        success = generate_readme()
        sys.exit(0 if success else 1)
    elif '--download' in sys.argv:
        success = generate_test_downloads()
        sys.exit(0 if success else 1)
    else:
        print("Usage: python generate.py [--readme | --download]")
        print("  --readme     Generate dynamic README.md content")
        print("  --download   Generate test download packages")
        sys.exit(1)

if __name__ == '__main__':
    main()
