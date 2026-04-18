// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct AppInfo {
    name: String,
    icon: String,
    path: String,
}

#[tauri::command]
fn get_apps() -> Vec<AppInfo> {
    vec![
        AppInfo {
            name: "Browser".to_string(),
            icon: "globe".to_string(),
            path: "browser".to_string(),
        },
        AppInfo {
            name: "Terminal".to_string(),
            icon: "terminal".to_string(),
            path: "terminal".to_string(),
        },
        AppInfo {
            name: "File Explorer".to_string(),
            icon: "folder".to_string(),
            path: "explorer".to_string(),
        },
        AppInfo {
            name: "Settings".to_string(),
            icon: "settings".to_string(),
            path: "settings".to_string(),
        },
    ]
}

#[tauri::command]
fn launch_app(app_name: String) -> String {
    format!("Launched application: {}", app_name)
}

#[tauri::command]
fn media_control(action: String) -> String {
    format!("Media action performed: {}", action)
}

#[tauri::command]
fn tile_windows() -> String {
    "Windows have been tiled".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_apps,
            launch_app,
            media_control,
            tile_windows
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
