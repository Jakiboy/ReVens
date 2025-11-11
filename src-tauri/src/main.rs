// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::path::Path;
use tauri::{Manager, State, WindowEvent, TrayIconEvent};
use tauri_plugin_shell::ShellExt;

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn open_item(path: String, base_dir: Option<String>, player_path: Option<String>) -> Result<String, String> {
    let item_path = if let Some(base) = base_dir {
        format!("{}{}", base, path)
    } else {
        path.clone()
    };

    let path_obj = Path::new(&item_path);
    let ext = path_obj.extension()
        .and_then(|s| s.to_str())
        .unwrap_or("");

    // Handle special extensions
    if ext == "xm" {
        if let Some(player) = player_path {
            let player_full = if let Some(base) = base_dir {
                format!("{}{}", base, player)
            } else {
                player
            };
            
            #[cfg(target_os = "windows")]
            {
                Command::new(player_full)
                    .arg(&item_path)
                    .spawn()
                    .map_err(|e| e.to_string())?;
            }
            
            return Ok(format!("Opened {} with custom player", item_path));
        }
    }

    // Default open behavior
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/c", "start", "", &item_path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&item_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&item_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(format!("Opened: {}", item_path))
}

#[tauri::command]
fn open_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/c", "start", &url])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&url)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&url)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn reload_window(window: tauri::Window) -> Result<(), String> {
    window.eval("location.reload()").map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .setup(|app| {
            // Get splash window and main window
            let splash = app.get_webview_window("splash").unwrap();
            let main = app.get_webview_window("main").unwrap();

            // Setup tray icon
            let tray = app.tray_by_id("main-tray").unwrap();
            
            tray.on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click { .. } = event {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                        let _ = window.unminimize();
                    }
                }
            });

            // Listen to main window minimize event
            main.on_window_event(move |event| {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    // Hide window instead of closing on minimize
                    api.prevent_close();
                    if let Some(window) = event.window().app_handle().get_webview_window("main") {
                        let _ = window.hide();
                    }
                }
            });

            // Show main window after splash delay
            let main_clone = main.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_secs(3));
                let _ = splash.close();
                let _ = main_clone.show();
                let _ = main_clone.set_focus();
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_item,
            open_url,
            reload_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
