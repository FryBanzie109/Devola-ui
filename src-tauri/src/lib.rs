// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use enigo::KeyboardControllable;

#[derive(Serialize, Deserialize, Clone)]
pub struct AppInfo {
    name: String,
    icon: String,
    path: String,
}

#[cfg(target_os = "windows")]
use directories::BaseDirs;
#[cfg(target_os = "windows")]
use walkdir::WalkDir;
#[cfg(target_os = "windows")]
use windows::Win32::Foundation::{BOOL, HWND, LPARAM, RECT};
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::{
    EnumWindows, GetWindowLongW, GetWindowRect, IsWindowVisible, MoveWindow, GWL_STYLE, WS_MINIMIZE,
};

#[tauri::command]
fn get_apps() -> Vec<AppInfo> {
    let mut apps = Vec::new();

    #[cfg(target_os = "windows")]
    {
        if let Some(base_dirs) = BaseDirs::new() {
            let start_menu_path = base_dirs.data_dir().join("Microsoft/Windows/Start Menu/Programs");
            if start_menu_path.exists() {
                for entry in WalkDir::new(start_menu_path).into_iter().filter_map(|e| e.ok()) {
                    let path = entry.path();
                    if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("lnk") {
                        if let Some(name) = path.file_stem().and_then(|s| s.to_str()) {
                            apps.push(AppInfo {
                                name: name.to_string(),
                                icon: "application".to_string(),
                                path: path.to_string_lossy().to_string(),
                            });
                        }
                    }
                }
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        apps.push(AppInfo {
            name: "Terminal".to_string(),
            icon: "terminal".to_string(),
            path: "x-terminal-emulator".to_string(),
        });
        apps.push(AppInfo {
            name: "File Explorer".to_string(),
            icon: "folder".to_string(),
            path: "xdg-open".to_string(),
        });
    }

    apps
}

#[tauri::command]
fn launch_app(app_path: String) -> String {
    match open::that(app_path.clone()) {
        Ok(_) => format!("Launched application: {}", app_path),
        Err(e) => format!("Failed to launch {}: {}", app_path, e),
    }
}

#[tauri::command]
fn media_control(action: String) -> String {
    let mut enigo = enigo::Enigo::new();
    match action.as_str() {
        "play_pause" => {
            enigo.key_click(enigo::Key::MediaPlayPause);
            "Toggled play/pause".to_string()
        }
        "next" => {
            enigo.key_click(enigo::Key::MediaNextTrack);
            "Next track".to_string()
        }
        "prev" => {
            enigo.key_click(enigo::Key::MediaPrevTrack);
            "Previous track".to_string()
        }
        _ => "Unknown media action".to_string(),
    }
}

#[tauri::command]
fn quit_app() {
    std::process::exit(0);
}

#[cfg(target_os = "windows")]
unsafe extern "system" fn enum_windows_proc(hwnd: HWND, lparam: LPARAM) -> BOOL {
    if IsWindowVisible(hwnd).as_bool() {
        let style = GetWindowLongW(hwnd, GWL_STYLE) as u32;
        if (style & WS_MINIMIZE.0) == 0 {
            let mut rect = RECT::default();
            let _ = GetWindowRect(hwnd, &mut rect);
            if rect.right - rect.left > 0 && rect.bottom - rect.top > 0 {
                let windows = &mut *(lparam.0 as *mut Vec<HWND>);
                windows.push(hwnd);
            }
        }
    }
    BOOL(1)
}

#[tauri::command]
fn tile_windows() -> String {
    #[cfg(target_os = "windows")]
    {
        unsafe {
            let mut windows: Vec<HWND> = Vec::new();
            let lparam = LPARAM(&mut windows as *mut _ as isize);
            let _ = EnumWindows(Some(enum_windows_proc), lparam);

            if windows.is_empty() {
                return "No visible windows to tile".to_string();
            }

            // A very simple vertical tiling layout
            let screen_width = 1920; // Hardcoded for example, should query actual screen size
            let screen_height = 1080;
            let width = screen_width / windows.len() as i32;

            for (i, &hwnd) in windows.iter().enumerate() {
                let _ = MoveWindow(
                    hwnd,
                    (i as i32) * width,
                    0,
                    width,
                    screen_height,
                    true,
                );
            }
        }
        "Windows have been tiled".to_string()
    }

    #[cfg(not(target_os = "windows"))]
    {
        "Tiling is only implemented for Windows in this version.".to_string()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_apps,
            launch_app,
            media_control,
            tile_windows,
            quit_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
