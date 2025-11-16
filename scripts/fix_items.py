#!/usr/bin/env python3
"""
Script to fix items.json
"""

import json
import os
import sys
from datetime import datetime

# Paths
ITEMS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'items.json')
SECTIONS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'sections.json')
BACKUP_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'items.backup.json')

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
    "download": False
}

# Property order for reordering items
PROPERTY_ORDER = ["name", "desc", "type", "path", "section", "sub", "extra", "version", "url", "download"]

# Type order for sorting
TYPE_ORDER = ["exe", "cli", "zip"]

def load_section_order():
    """Load section order from sections.json (excluding AI)"""
    try:
        with open(SECTIONS_JSON_PATH, 'r', encoding='utf-8') as f:
            sections_data = json.load(f)
        
        sections = sections_data.get('sections', [])
        # Get section names in order, excluding "AI"
        section_order = [s['name'] for s in sections if s['name'] != 'AI']
        return section_order
    except Exception as e:
        print(f"Warning: Could not load sections.json: {e}")
        return []

def get_sort_key(item, section_order):
    """Generate a sort key for an item"""
    # Get section index (default to large number if not found)
    section = item.get('section', '')
    try:
        section_idx = section_order.index(section)
    except ValueError:
        section_idx = 9999
    
    # Get sub value (convert to string for sorting, false becomes empty string)
    sub = item.get('sub', '')
    if sub is False:
        sub = ''
    sub_lower = str(sub).lower()
    
    # Get extra value (convert to string for sorting, false becomes empty string)
    extra = item.get('extra', '')
    if extra is False:
        extra = ''
    extra_lower = str(extra).lower()
    
    # Get type value and its order index
    item_type = item.get('type', '')
    try:
        type_idx = TYPE_ORDER.index(item_type)
    except ValueError:
        type_idx = 9999
    
    # Return tuple for sorting: (section_order, sub_asc, extra_asc, type_order)
    return (section_idx, sub_lower, extra_lower, type_idx, item_type)


def fix_items():
    """Fix all items by adding missing properties and reordering them"""
    
    # Load section order
    section_order = load_section_order()
    print(f"Loaded section order: {', '.join(section_order)}")
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
    
    # Create backup
    print(f"Creating backup at: {BACKUP_PATH}")
    with open(BACKUP_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"\nProcessing {len(items)} items...")
    print("-" * 80)
    
    fixed_count = 0
    reordered_count = 0
    
    for idx, item in enumerate(items):
        item_num = idx + 1
        item_name = item.get('name', f'Item #{item_num}')
        missing_props = []
        
        # Check and add missing properties
        for prop, default_value in REQUIRED_PROPERTIES.items():
            if prop not in item:
                item[prop] = default_value
                missing_props.append(prop)
        
        # Reorder properties
        reordered_item = {}
        for prop in PROPERTY_ORDER:
            if prop in item:
                reordered_item[prop] = item[prop]
        
        # Replace the item with reordered version
        items[idx] = reordered_item
        reordered_count += 1
        
        if missing_props:
            fixed_count += 1
            print(f"✓ Fixed Item #{item_num} ({item_name}): Added {', '.join(missing_props)}")
    
    # Sort items
    print("\n" + "-" * 80)
    print("Sorting items by: section (from sections.json), sub (ASC), extra (ASC), type (exe, cli, zip...)")
    items.sort(key=lambda item: get_sort_key(item, section_order))
    data['items'] = items
    
    # Save fixed items.json
    print("-" * 80)
    print(f"Saving fixed items.json...")
    
    with open(ITEMS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"✓ Successfully sorted and reordered {reordered_count} items")
    if fixed_count > 0:
        print(f"✓ Added missing properties to {fixed_count} items")
    print(f"✓ Original file backed up to: {BACKUP_PATH}")
    return True

def main():
    """Main function"""
    print("=" * 80)
    print("ITEMS.JSON FIX SCRIPT")
    print("=" * 80)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Items JSON path: {ITEMS_JSON_PATH}")
    print()
    
    success = fix_items()
    
    print("\n" + "=" * 80)
    if success:
        print("✓ Fix completed successfully")
    else:
        print("✗ Fix failed - see errors above")
    print("=" * 80)
    
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())
