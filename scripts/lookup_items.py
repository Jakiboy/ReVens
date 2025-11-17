#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to find tools in Bin directory that are not in items.json
"""

import json
import os
import sys

# Paths
ITEMS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'items.json')
PATHS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'paths.json')
APP_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'app.json')
IGNORE_FILE_PATH = os.path.join(os.path.dirname(__file__), '.ignore')

# Base directory for scanning (default to Bin folder)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Bin'))

def get_base_dir():
    """Get base directory from app.json or use default Bin folder"""
    try:
        with open(APP_JSON_PATH, 'r', encoding='utf-8') as f:
            app_config = json.load(f)
            custom_base_dir = app_config.get('baseDir')
            if custom_base_dir and os.path.exists(custom_base_dir):
                return os.path.abspath(custom_base_dir)
            elif custom_base_dir:
                print(f"⚠ Warning: Custom baseDir '{custom_base_dir}' from app.json does not exist")
                print(f"  Falling back to default: {BASE_DIR}")
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"⚠ Warning: Could not read app.json ({e}), using default baseDir")
    
    return BASE_DIR

def load_items():
    """Load items from items.json and extract folder/archive names from paths"""
    try:
        with open(ITEMS_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"ERROR: Could not read items.json: {e}")
        return set()
    
    items = data.get('items', [])
    registered_items = set()
    
    # Load paths and sort by length (longest first) to match most specific paths first
    paths = sorted(load_paths(), key=len, reverse=True)
    
    for item in items:
        path = item.get('path', '')
        if not path:
            continue
        
        # Find which category path this item belongs to
        matching_path = None
        for category_path in paths:
            if path.startswith(category_path + '/'):
                matching_path = category_path
                break
        
        if matching_path:
            # Remove the category path to get the tool-specific part
            # e.g., "/Analyzing/Compilation/Detect It Easy/x64/die.exe" 
            # -> "Detect It Easy/x64/die.exe"
            relative_path = path[len(matching_path):].strip('/')
            parts = relative_path.split('/')
            
            if len(parts) > 0:
                # The first part after the category is the tool folder/archive
                tool_name = parts[0]
                # Remove .zip extension if present for comparison
                tool_name_clean = tool_name.replace('.zip', '').lower()
                registered_items.add(tool_name_clean)
    
    return registered_items

def load_paths():
    """Load paths from paths.json"""
    try:
        with open(PATHS_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"ERROR: Could not read paths.json: {e}")
        return []
    
    return data.get('paths', [])

def load_ignore_patterns():
    """Load ignore patterns from .ignore file"""
    if not os.path.exists(IGNORE_FILE_PATH):
        return set()
    
    try:
        with open(IGNORE_FILE_PATH, 'r', encoding='utf-8') as f:
            patterns = set()
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if line and not line.startswith('#'):
                    patterns.add(line.lower())
            return patterns
    except Exception as e:
        print(f"⚠ Warning: Could not read .ignore file: {e}")
        return set()

def load_local_ignore_patterns(directory_path):
    """Load ignore patterns from .ignore file in a specific directory"""
    ignore_file = os.path.join(directory_path, '.ignore')
    
    if not os.path.exists(ignore_file):
        return set()
    
    try:
        with open(ignore_file, 'r', encoding='utf-8') as f:
            patterns = set()
            for line in f:
                line = line.strip()
                # Skip empty lines and comments
                if line and not line.startswith('#'):
                    patterns.add(line.lower())
            return patterns
    except Exception as e:
        print(f"⚠ Warning: Could not read .ignore file in {directory_path}: {e}")
        return set()

def scan_directory(base_dir, rel_path, global_ignored_patterns):
    """Scan a directory and return list of folders/files found"""
    full_path = os.path.join(base_dir, rel_path.lstrip('/'))
    
    if not os.path.exists(full_path):
        return []
    
    # Load local .ignore patterns from this directory
    local_ignored_patterns = load_local_ignore_patterns(full_path)
    
    # Combine global and local ignore patterns
    all_ignored_patterns = global_ignored_patterns | local_ignored_patterns
    
    try:
        entries = os.listdir(full_path)
        items = []
        
        for entry in entries:
            # Skip .ignore file itself
            if entry == '.ignore':
                continue
            
            # Check if entry should be ignored
            if entry.lower() in all_ignored_patterns:
                continue
            
            entry_path = os.path.join(full_path, entry)
            # Include both folders and zip files
            if os.path.isdir(entry_path) or entry.endswith('.zip'):
                items.append(entry)
        
        return items
    except PermissionError:
        print(f"⚠ Warning: Permission denied accessing {full_path}")
        return []

def main():
    """Main function to find missing tools"""
    global BASE_DIR
    BASE_DIR = get_base_dir()
    
    print("=" * 80)
    print("FINDING MISSING TOOLS")
    print("=" * 80)
    print(f"Base directory: {BASE_DIR}")
    print(f"Items JSON: {ITEMS_JSON_PATH}")
    print(f"Paths JSON: {PATHS_JSON_PATH}")
    print()
    
    # Load registered items
    print("Loading items.json...")
    registered_folders = load_items()
    print(f"Found {len(registered_folders)} registered tools in items.json")
    print()
    
    # Load paths to scan
    print("Loading paths.json...")
    paths = load_paths()
    print(f"Found {len(paths)} paths to scan")
    print()
    
    # Load ignore patterns
    ignored_patterns = load_ignore_patterns()
    if ignored_patterns:
        print(f"Loaded {len(ignored_patterns)} ignore patterns from .ignore file")
        print()
    
    # Scan each path
    print("Scanning directories for missing tools...")
    print("-" * 80)
    
    missing_tools = []
    
    for path in paths:
        items_in_dir = scan_directory(BASE_DIR, path, ignored_patterns)
        
        if items_in_dir:
            for item in items_in_dir:
                item_name_clean = item.replace('.zip', '').lower()
                
                if item_name_clean not in registered_folders:
                    missing_tools.append({
                        'path': path,
                        'name': item,
                        'full_path': os.path.join(BASE_DIR, path.lstrip('/'), item)
                    })
    
    # Display results
    if missing_tools:
        print(f"\n⚠ Found {len(missing_tools)} missing tools not in items.json:\n")
        
        # Group by path
        by_path = {}
        for tool in missing_tools:
            if tool['path'] not in by_path:
                by_path[tool['path']] = []
            by_path[tool['path']].append(tool['name'])
        
        for path in sorted(by_path.keys()):
            print(f"\n{path}:")
            for name in sorted(by_path[path]):
                print(f"  - {name}")
    else:
        print("\n✓ All tools in the Bin directory are registered in items.json!")
    
    print("\n" + "=" * 80)
    print(f"Scan complete - {len(missing_tools)} missing tools found")
    print("=" * 80)
    
    return 0 if len(missing_tools) == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
