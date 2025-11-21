#!/usr/bin/env python3
"""
Script to add missing items to items.json
"""

import json
import os
import sys
from datetime import datetime

# Paths
ITEMS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'items.json')
SECTIONS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'sections.json')
PATHS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'paths.json')
IGNORE_FILE_PATH = os.path.join(os.path.dirname(__file__), '.ignore')
BACKUP_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'items.backup.json')
APP_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'app.json')

# Base directory for scanning (default to Bin folder)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Bin'))

# Required properties with empty values
REQUIRED_PROPERTIES = {
    "name": "",
    "desc": "",
    "type": "",
    "path": "",
    "section": "",
    "sub": False,
    "extra": False,
    "version": False,
    "url": False,
    "download": False,
    "script": False,
    "pswd": False,
    "remove": False
}

# Property order for new items
PROPERTY_ORDER = ["name", "desc", "type", "path", "section", "sub", "extra", "version", "url", "download", "script", "pswd", "remove"]

def get_base_dir_for_scanning():
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

def load_sections_structure():
    """Load full sections structure from sections.json for path parsing"""
    try:
        with open(SECTIONS_JSON_PATH, 'r', encoding='utf-8') as f:
            sections_data = json.load(f)
        
        sections = sections_data.get('sections', [])
        
        # Build a mapping of section name -> {subs: {sub_name -> [extra_values]}}
        structure = {}
        # Build a reverse mapping: sub_name -> section_name (for path-first matching)
        sub_to_section = {}
        # Build a reverse mapping: extra_name -> (section_name, sub_name)
        extra_to_section_sub = {}
        
        for section in sections:
            section_name = section.get('name')
            if section_name == 'ai':
                continue
            
            subs = section.get('sub', [])
            sub_structure = {}
            
            for sub in subs:
                # Use 'name' (slug) instead of 'title' for matching
                sub_name = sub.get('name')
                sub_title = sub.get('title')
                extra_values_raw = sub.get('extra', [])
                
                # Extract extra names (slugs) from objects or strings
                extra_values = []
                for extra in extra_values_raw:
                    if isinstance(extra, dict):
                        extra_values.append(extra.get('name'))
                    else:
                        # Fallback for old string format
                        extra_values.append(extra)
                
                sub_structure[sub_name] = extra_values
                # Map sub slug -> section for reverse lookup
                sub_to_section[sub_name] = section_name
                
                # Map each extra -> (section, sub) for reverse lookup
                for extra in extra_values:
                    extra_to_section_sub[extra] = (section_name, sub_name)
            
            structure[section_name] = sub_structure
        
        return structure, sub_to_section, extra_to_section_sub
    except Exception as e:
        print(f"Warning: Could not load sections.json structure: {e}")
        return {}, {}, {}

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

def load_registered_items(items):
    """Extract folder/archive names from items paths"""
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
            relative_path = path[len(matching_path):].strip('/')
            parts = relative_path.split('/')
            
            if len(parts) > 0:
                # The first part after the category is the tool folder/archive
                tool_name = parts[0]
                # Remove .zip extension if present for comparison
                tool_name_clean = tool_name.replace('.zip', '').lower()
                registered_items.add(tool_name_clean)
    
    return registered_items

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

def find_missing_tools(items):
    """Find tools in Bin directory that are not in items.json"""
    base_dir = get_base_dir_for_scanning()
    
    # Load registered items
    registered_folders = load_registered_items(items)
    
    # Load paths to scan
    paths = load_paths()
    
    # Load ignore patterns
    ignored_patterns = load_ignore_patterns()
    
    # Scan each path
    missing_tools = []
    
    for path in paths:
        items_in_dir = scan_directory(base_dir, path, ignored_patterns)
        
        if items_in_dir:
            for item in items_in_dir:
                item_name_clean = item.replace('.zip', '').lower()
                
                if item_name_clean not in registered_folders:
                    missing_tools.append({
                        'path': path,
                        'name': item,
                        'full_path': os.path.join(base_dir, path.lstrip('/'), item)
                    })
    
    return missing_tools

def parse_path_for_metadata(path, sections_structure, sub_to_section, extra_to_section_sub):
    """Parse item path and extract section, sub, and extra based on folder structure
    
    Parse path with three possible patterns:
    1. /Section/Sub/Extra/...  (e.g., /Analyzing/System/Network/tool.zip)
    2. /Sub/Extra/...          (e.g., /Assembling/tool.zip - where Assembling is a sub of Misc)
    3. /Section/Extra/...      (e.g., /Editing/DLL/tool.zip - where DLL is an extra of Manipulating)
    
    Args:
        path: Item path like "/Analyzing/System/Network/PCResView.zip" or "/Assembling/AsmEdit.zip"
        sections_structure: Dict mapping section -> {sub -> [extras]}
        sub_to_section: Dict mapping sub -> section (for reverse lookup)
        extra_to_section_sub: Dict mapping extra -> (section, sub) (for reverse lookup)
    
    Returns:
        tuple: (section, sub, extra) where False means not applicable
    """
    # Remove leading/trailing slashes and split
    path_parts = path.strip('/').split('/')
    
    if len(path_parts) < 1:
        return ("other", False, False)
    
    # Parse exactly 3 parts: section, sub, extra
    section = "other"
    sub = False
    extra = False
    
    # Check if 1st part (lowercased) is a top-level section
    first_part_lower = path_parts[0].lower()
    if first_part_lower in sections_structure:
        # Pattern 1: /Section/Sub/Extra/... or Pattern 3: /Section/Extra/...
        section = first_part_lower
        
        # 2nd part: check if it's a sub or an extra
        if len(path_parts) >= 2:
            potential_sub_lower = path_parts[1].lower()
            
            # Check if it's a valid sub (compare lowercase)
            if potential_sub_lower in sections_structure[section]:
                sub = potential_sub_lower
                
                # 3rd part: extra (only if we have a valid sub)
                if len(path_parts) >= 3:
                    potential_extra_lower = path_parts[2].lower()
                    extras_list = sections_structure[section][sub]
                    if extras_list and potential_extra_lower in extras_list:
                        extra = potential_extra_lower
            
            # Check if 2nd part is an extra (Pattern 3: /Section/Extra/...)
            elif path_parts[1].lower() in extra_to_section_sub:
                mapped_section, mapped_sub = extra_to_section_sub[path_parts[1].lower()]
                # Only use this mapping if the section matches
                if mapped_section == section:
                    sub = mapped_sub
                    extra = path_parts[1].lower()
    
    # Check if 1st part (lowercased) is a sub category (reverse lookup)
    elif first_part_lower in sub_to_section:
        # Pattern 2: /Sub/Extra/... (e.g., /Assembling/tool.zip)
        sub = first_part_lower
        section = sub_to_section[sub]
        
        # 2nd part: extra (only if sub supports extras)
        if len(path_parts) >= 2:
            potential_extra_lower = path_parts[1].lower()
            extras_list = sections_structure[section][sub]
            if extras_list and potential_extra_lower in extras_list:
                extra = potential_extra_lower
    
    # Check if 1st part is an extra category (reverse lookup for extras at root level)
    elif path_parts[0].lower() in extra_to_section_sub:
        # Pattern 4: /Extra/... (e.g., /DLL/tool.zip where DLL is an extra)
        section, sub = extra_to_section_sub[path_parts[0].lower()]
        extra = path_parts[0].lower()
    
    return (section, sub, extra)

def create_item_from_missing_tool(tool, sections_structure, sub_to_section, extra_to_section_sub):
    """Create a new item entry from a missing tool"""
    # Determine type based on file extension
    item_type = "zip" if tool['name'].endswith('.zip') else "exe"
    
    # Build the path
    tool_path = f"{tool['path']}/{tool['name']}"
    
    # Parse path to set section, sub, extra
    section, sub, extra = parse_path_for_metadata(tool_path, sections_structure, sub_to_section, extra_to_section_sub)
    
    # Create the item with required properties in correct order
    new_item = {}
    for prop in PROPERTY_ORDER:
        if prop == "name":
            new_item[prop] = tool['name'].replace('.zip', '')
        elif prop == "desc":
            new_item[prop] = ""
        elif prop == "type":
            new_item[prop] = item_type
        elif prop == "path":
            new_item[prop] = tool_path
        elif prop == "section":
            new_item[prop] = section
        elif prop == "sub":
            new_item[prop] = sub
        elif prop == "extra":
            new_item[prop] = extra
        else:
            new_item[prop] = REQUIRED_PROPERTIES[prop]
    
    return new_item

def update_items():
    """Add missing items to items.json"""
    
    print(f"Base directory: {get_base_dir_for_scanning()}")
    print()
    
    # Load sections structure for path parsing
    sections_structure, sub_to_section, extra_to_section_sub = load_sections_structure()
    print(f"Loaded sections structure with {len(sections_structure)} sections")
    print()
    
    # Load items.json
    try:
        with open(ITEMS_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"ERROR: Could not find items.json at {ITEMS_JSON_PATH}")
        return False
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in items.json: {e}")
        return False
    
    items = data.get('items', [])
    
    if not items:
        print("ERROR: No items found in items.json")
        return False
    
    print(f"Current items in items.json: {len(items)}")
    print()
    
    # Find missing tools
    print("Scanning for missing tools...")
    print("-" * 80)
    missing_tools = find_missing_tools(items)
    
    if not missing_tools:
        print("✓ No missing tools found - items.json is up to date!")
        return True
    
    print(f"⚠ Found {len(missing_tools)} missing tools not in items.json")
    
    # Group by path for display
    by_path = {}
    for tool in missing_tools:
        if tool['path'] not in by_path:
            by_path[tool['path']] = []
        by_path[tool['path']].append(tool['name'])
    
    for path in sorted(by_path.keys()):
        print(f"\n{path}:")
        for name in sorted(by_path[path]):
            print(f"  - {name}")
    
    print("\n" + "-" * 80)
    
    # Create backup before modifying
    print(f"Creating backup at: {BACKUP_PATH}")
    with open(BACKUP_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"\nAdding {len(missing_tools)} missing tools to items.json...")
    print("-" * 80)
    
    # Add missing tools as new items
    added_count = 0
    for tool in missing_tools:
        new_item = create_item_from_missing_tool(tool, sections_structure, sub_to_section, extra_to_section_sub)
        items.append(new_item)
        added_count += 1
        
        metadata_info = f"section={new_item['section']}"
        if new_item['sub']:
            metadata_info += f", sub={new_item['sub']}"
        if new_item['extra']:
            metadata_info += f", extra={new_item['extra']}"
        print(f"✓ Added: {new_item['name']} ({metadata_info})")
    
    data['items'] = items
    
    # Save updated items.json
    print("-" * 80)
    print(f"Saving updated items.json...")
    
    with open(ITEMS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"✓ Successfully added {added_count} missing tools")
    print(f"✓ Total items in items.json: {len(items)}")
    print(f"✓ Original file backed up to: {BACKUP_PATH}")
    return True

def main():
    """Main function"""
    print("=" * 80)
    print("ADD MISSING ITEMS TO ITEMS.JSON")
    print("=" * 80)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Items JSON path: {ITEMS_JSON_PATH}")
    print()
    
    success = update_items()
    
    print("\n" + "=" * 80)
    if success:
        print("✓ Update completed successfully")
    else:
        print("✗ Update failed - see errors above")
    print("=" * 80)
    
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())
