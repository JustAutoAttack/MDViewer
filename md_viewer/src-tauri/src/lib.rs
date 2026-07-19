use std::sync::Mutex;

use comrak::plugins::syntect::SyntectAdapter;
use comrak::{markdown_to_html_with_plugins, Options, Plugins};
use tauri::{Emitter, Manager, State};

struct StartupFile(Mutex<Option<String>>);

#[tauri::command]
fn startup_file(state: State<StartupFile>) -> Option<String> {
    state.0.lock().unwrap().take()
}

#[tauri::command]
fn parse_markdown(markdown: String) -> String {
    let mut options = Options::default();

    options.extension.strikethrough = true;
    options.extension.table = true;
    options.extension.tasklist = true;
    options.extension.autolink = true;
    options.extension.footnotes = true;
    options.extension.superscript = true;
    options.extension.header_ids = Some(String::new());

    options.render.unsafe_ = true;

    let adapter = SyntectAdapter::new(Some("base16-ocean.dark"));

    let mut plugins = Plugins::default();
    plugins.render.codefence_syntax_highlighter = Some(&adapter);

    markdown_to_html_with_plugins(&markdown, &options, &plugins)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let startup = std::env::args().nth(1);

    tauri::Builder::default()
        .manage(StartupFile(Mutex::new(startup)))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                for path in argv.iter().skip(1) {
                    let _ = window.emit("open-file-path", path);
                }

                let _ = window.set_focus();
            }
        }))
        .invoke_handler(tauri::generate_handler![parse_markdown, startup_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
