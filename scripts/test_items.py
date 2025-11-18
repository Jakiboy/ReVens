#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script to validate items in items.json
Checks for:
- Missing properties
- Empty properties (except 'extra' which can be false or string)
- Invalid file paths

Usage:
    python test_items.py [--no-{property}] [--override] [--no-update]

Options:
    --no-version    Ignore warnings about version property
    --no-url        Ignore warnings about url property
    --no-download   Ignore warnings about download property
    --no-path       Ignore warnings about invalid file paths
    --override      Override (overwrite) the log file instead of appending
    --no-update     Skip checking for new tools not in items.json
"""

import json
import os
import sys
import io
import subprocess
from datetime import datetime

# Set UTF-8 encoding for stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Paths
ITEMS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'items.json')
SECTIONS_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'sections.json')
APP_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'config', 'app.json')
LOG_FILE = os.path.join(os.path.dirname(__file__), 'test.log')

# Base directory for path validation (default to Bin folder)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Bin'))

# Required properties for each item
REQUIRED_PROPERTIES = ["name", "desc", "type", "path", "section", "sub", "extra", "version", "url", "download", "script"]

# Global flags for ignoring specific warnings
IGNORE_VERSION_WARNINGS = False
IGNORE_URL_WARNINGS = False
IGNORE_DOWNLOAD_WARNINGS = False
IGNORE_PATH_WARNINGS = False
NO_UPDATE = False

def log_message(message, file_handle=None):
    """Print message to console and optionally write to log file"""
    print(message)
    if file_handle:
        file_handle.write(message + '\n')

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

def load_sections():
    """Load sections.json and build a lookup structure"""
    try:
        with open(SECTIONS_JSON_PATH, 'r', encoding='utf-8') as f:
            sections_data = json.load(f)
    except FileNotFoundError:
        print(f"⚠ Warning: Could not find sections.json at {SECTIONS_JSON_PATH}")
        return {}
    except json.JSONDecodeError as e:
        print(f"⚠ Warning: Invalid JSON in sections.json: {e}")
        return {}
    
    # Build lookup: section_name -> { subs: {sub_title -> [extra_values]} }
    sections_lookup = {}
    for section in sections_data.get('sections', []):
        section_name = section.get('name')
        if not section_name:
            continue
        
        subs_lookup = {}
        for sub in section.get('sub', []):
            sub_title = sub.get('title')
            if sub_title:
                # Store extra values if they exist, otherwise empty list
                subs_lookup[sub_title] = sub.get('extra', [])
        
        sections_lookup[section_name] = {
            'subs': subs_lookup
        }
    
    return sections_lookup

def validate_items():
    """Validate all items in items.json"""
    # Group warnings by type
    missing_properties = []
    empty_properties = []
    invalid_paths = []
    invalid_subs = []
    invalid_extras = []
    errors = []
    
    # Load sections.json for validation
    sections_lookup = load_sections()
    
    # Load items.json
    try:
        with open(ITEMS_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        return {"errors": [f"ERROR: Could not find items.json at {ITEMS_JSON_PATH}"]}, []
    except json.JSONDecodeError as e:
        return {"errors": [f"ERROR: Invalid JSON in items.json: {e}"]}, []
    
    items = data.get('items', [])
    
    if not items:
        return {"errors": ["ERROR: No items found in items.json"]}, []
    
    print(f"Validating {len(items)} items...")
    print("-" * 80)
    
    for idx, item in enumerate(items):
        item_num = idx + 1
        item_name = item.get('name', f'Item #{item_num}')
        
        # Check for missing properties
        missing_props = [prop for prop in REQUIRED_PROPERTIES if prop not in item]
        if missing_props:
            warning = f"⚠ Item #{item_num} ({item_name}): Missing properties: {', '.join(missing_props)}"
            missing_properties.append(warning)
        
        # Check for empty properties
        for prop in REQUIRED_PROPERTIES:
            if prop in item:
                value = item[prop]
                
                # Special handling for 'extra' - can be false or string
                if prop == 'extra':
                    if value is not False and (value == "" or value is None):
                        warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is empty (expected false or non-empty string)"
                        empty_properties.append(warning)
                # Special handling for 'url' - can be false or valid URL
                elif prop == 'url':
                    if not IGNORE_URL_WARNINGS:
                        if value is False:
                            # False is valid - no warning
                            pass
                        elif value == "":
                            warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is empty string (should be false or valid URL)"
                            empty_properties.append(warning)
                        elif value is None:
                            warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is None (should be false or valid URL)"
                            empty_properties.append(warning)
                # Special handling for 'download' - can be false, valid URL string, or non-empty array
                elif prop == 'download':
                    if not IGNORE_DOWNLOAD_WARNINGS:
                        if value is False:
                            # False is valid - no warning
                            pass
                        elif value == "":
                            warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is empty string (should be false, valid URL, or non-empty array)"
                            empty_properties.append(warning)
                        elif value is None:
                            warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is None (should be false, valid URL, or non-empty array)"
                            empty_properties.append(warning)
                        elif isinstance(value, list) and len(value) == 0:
                            warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is an empty array (should be false, valid URL, or non-empty array)"
                            empty_properties.append(warning)
                # Special handling for 'script' - can be false, string, or non-empty array
                elif prop == 'script':
                    if value is False:
                        # False is valid - no warning
                        pass
                    elif value == "":
                        warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is empty string (should be false, valid command string, or non-empty array)"
                        empty_properties.append(warning)
                    elif value is None:
                        warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is None (should be false, valid command string, or non-empty array)"
                        empty_properties.append(warning)
                    elif isinstance(value, list) and len(value) == 0:
                        warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is an empty array (should be false, valid command string, or non-empty array)"
                        empty_properties.append(warning)
                # Special handling for 'version' - warn only if empty or undefined (False is acceptable)
                elif prop == 'version':
                    if not IGNORE_VERSION_WARNINGS:
                        if value == "" or value is None:
                            warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is empty or undefined"
                            empty_properties.append(warning)
                # Other properties should not be empty
                else:
                    if value == "" or value is None:
                        warning = f"⚠ Item #{item_num} ({item_name}): Property '{prop}' is empty"
                        empty_properties.append(warning)
        
        # Check for invalid path
        if 'path' in item and item['path']:
            if not IGNORE_PATH_WARNINGS:
                item_path = item['path']
                # Convert forward slashes to backslashes for Windows
                item_path_normalized = item_path.replace('/', os.sep).lstrip(os.sep)
                full_path = os.path.join(BASE_DIR, item_path_normalized)
                
                if not os.path.exists(full_path):
                    warning = f"⚠ Item #{item_num} ({item_name}): Invalid path: {item_path} (resolved to: {full_path})"
                    invalid_paths.append(warning)
        
        # Validate section and sub against sections.json
        if sections_lookup and 'section' in item and 'sub' in item:
            section_name = item['section']
            sub_name = item['sub']
            
            if section_name in sections_lookup:
                section_data = sections_lookup[section_name]
                
                # Check if sub exists in parent section
                if sub_name not in section_data['subs']:
                    warning = f"⚠ Item #{item_num} ({item_name}): Sub '{sub_name}' does not exist in parent section '{section_name}'"
                    invalid_subs.append(warning)
                else:
                    # If sub is valid, check if extra matches
                    if 'extra' in item and item['extra'] and item['extra'] is not False:
                        extra_value = item['extra']
                        allowed_extras = section_data['subs'][sub_name]
                        
                        # Only validate if the sub has extra values defined
                        if allowed_extras and extra_value not in allowed_extras:
                            warning = f"⚠ Item #{item_num} ({item_name}): Extra '{extra_value}' does not match any allowed values for section '{section_name}' > sub '{sub_name}' (allowed: {', '.join(allowed_extras)})"
                            invalid_extras.append(warning)
            else:
                warning = f"⚠ Item #{item_num} ({item_name}): Section '{section_name}' does not exist in sections.json"
                invalid_subs.append(warning)
    
    # Return grouped warnings
    warnings = {
        "missing_properties": missing_properties,
        "empty_properties": empty_properties,
        "invalid_paths": invalid_paths,
        "invalid_subs": invalid_subs,
        "invalid_extras": invalid_extras
    }
    
    return warnings, errors

def main():
    """Main test function"""
    global BASE_DIR, IGNORE_VERSION_WARNINGS, IGNORE_URL_WARNINGS, IGNORE_DOWNLOAD_WARNINGS, IGNORE_PATH_WARNINGS, NO_UPDATE
    
    # Parse command line arguments
    if '--no-update' in sys.argv:
        NO_UPDATE = True
    
    override_log = '--override' in sys.argv
    
    if '--no-version' in sys.argv:
        IGNORE_VERSION_WARNINGS = True
    if '--no-url' in sys.argv:
        IGNORE_URL_WARNINGS = True
    if '--no-download' in sys.argv:
        IGNORE_DOWNLOAD_WARNINGS = True
    if '--no-path' in sys.argv:
        IGNORE_PATH_WARNINGS = True
    
    BASE_DIR = get_base_dir()
    
    print("=" * 80)
    print("ITEMS.JSON VALIDATION TEST")
    print("=" * 80)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Base directory: {BASE_DIR}")
    print(f"Items JSON path: {ITEMS_JSON_PATH}")
    if IGNORE_VERSION_WARNINGS or IGNORE_URL_WARNINGS or IGNORE_DOWNLOAD_WARNINGS or IGNORE_PATH_WARNINGS:
        options = []
        if IGNORE_VERSION_WARNINGS:
            options.append("--no-version")
        if IGNORE_URL_WARNINGS:
            options.append("--no-url")
        if IGNORE_DOWNLOAD_WARNINGS:
            options.append("--no-download")
        if IGNORE_PATH_WARNINGS:
            options.append("--no-path")
        print(f"Options: {' '.join(options)}")
    print()
    
    # Run validation
    warnings, errors = validate_items()
    
    # Prepare log content
    log_content = []
    log_content.append("=" * 80)
    log_content.append("ITEMS.JSON VALIDATION TEST REPORT")
    log_content.append("=" * 80)
    log_content.append(f"Test timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log_content.append(f"Base directory: {BASE_DIR}")
    log_content.append(f"Items JSON path: {ITEMS_JSON_PATH}")
    if IGNORE_VERSION_WARNINGS or IGNORE_URL_WARNINGS or IGNORE_DOWNLOAD_WARNINGS or IGNORE_PATH_WARNINGS:
        options = []
        if IGNORE_VERSION_WARNINGS:
            options.append("--no-version")
        if IGNORE_URL_WARNINGS:
            options.append("--no-url")
        if IGNORE_DOWNLOAD_WARNINGS:
            options.append("--no-download")
        if IGNORE_PATH_WARNINGS:
            options.append("--no-path")
        log_content.append(f"Options: {' '.join(options)}")
    log_content.append("")
    
    # Write results to console and log
    log_mode = 'w' if override_log else 'a'
    with open(LOG_FILE, log_mode, encoding='utf-8') as log_file:
        if errors:
            print("\n" + "=" * 80)
            print("ERRORS:")
            print("=" * 80)
            log_content.append("ERRORS:")
            log_content.append("-" * 80)
            for error in errors:
                print(error)
                log_content.append(error)
            log_content.append("")
        
        # Count total warnings
        total_warnings = sum(len(w) for w in warnings.values())
        
        if total_warnings > 0:
            print("\n" + "=" * 80)
            print(f"WARNINGS ({total_warnings} found):")
            print("=" * 80)
            log_content.append(f"WARNINGS ({total_warnings} found):")
            log_content.append("")
            
            # Display missing properties
            if warnings["missing_properties"]:
                section_header = f"Missing Properties ({len(warnings['missing_properties'])} items)"
                print("\n" + section_header)
                print("-" * 80)
                log_content.append(section_header)
                log_content.append("-" * 80)
                for warning in warnings["missing_properties"]:
                    print(warning)
                    log_content.append(warning)
                log_content.append("")
            
            # Display empty properties
            if warnings["empty_properties"]:
                section_header = f"Empty Properties ({len(warnings['empty_properties'])} items)"
                print("\n" + section_header)
                print("-" * 80)
                log_content.append(section_header)
                log_content.append("-" * 80)
                for warning in warnings["empty_properties"]:
                    print(warning)
                    log_content.append(warning)
                log_content.append("")
            
            # Display invalid paths
            if warnings["invalid_paths"]:
                section_header = f"Invalid Paths ({len(warnings['invalid_paths'])} items)"
                print("\n" + section_header)
                print("-" * 80)
                log_content.append(section_header)
                log_content.append("-" * 80)
                for warning in warnings["invalid_paths"]:
                    print(warning)
                    log_content.append(warning)
                log_content.append("")
            
            # Display invalid subs
            if warnings["invalid_subs"]:
                section_header = f"Invalid Subs ({len(warnings['invalid_subs'])} items)"
                print("\n" + section_header)
                print("-" * 80)
                log_content.append(section_header)
                log_content.append("-" * 80)
                for warning in warnings["invalid_subs"]:
                    print(warning)
                    log_content.append(warning)
                log_content.append("")
            
            # Display invalid extras
            if warnings["invalid_extras"]:
                section_header = f"Invalid Extras ({len(warnings['invalid_extras'])} items)"
                print("\n" + section_header)
                print("-" * 80)
                log_content.append(section_header)
                log_content.append("-" * 80)
                for warning in warnings["invalid_extras"]:
                    print(warning)
                    log_content.append(warning)
                log_content.append("")
        
        if not errors and total_warnings == 0:
            success_msg = "✓ All items validated successfully! No issues found."
            print("\n" + "=" * 80)
            print(success_msg)
            print("=" * 80)
            log_content.append(success_msg)
        else:
            summary = f"\nTest completed with {len(errors)} error(s) and {total_warnings} warning(s)"
            print("\n" + "=" * 80)
            print(summary)
            print("=" * 80)
            log_content.append(summary)
        
        # Write to log file
        log_file.write('\n'.join(log_content))
    
    print(f"\nLog file written to: {LOG_FILE}")
    
    # Check for new tools unless --no-update flag is set
    if not NO_UPDATE:
        print("\n" + "=" * 80)
        print("CHECKING FOR NEW TOOLS")
        print("=" * 80)
        
        lookup_script = os.path.join(os.path.dirname(__file__), 'lookup_items.py')
        if os.path.exists(lookup_script):
            try:
                result = subprocess.run([sys.executable, lookup_script], 
                                       capture_output=False, 
                                       text=True)
                if result.returncode != 0:
                    print("\n⚠ Warning: New tools found that are not in items.json")
            except Exception as e:
                print(f"\n⚠ Warning: Could not run lookup_items.py: {e}")
        else:
            print("\n⚠ Warning: lookup_items.py not found, skipping new tools check")
    else:
        print("\n" + "=" * 80)
        print("Skipping check for new tools (--no-update flag set)")
        print("=" * 80)
    
    # Return exit code
    return 1 if (errors or total_warnings > 0) else 0

if __name__ == '__main__':
    sys.exit(main())
