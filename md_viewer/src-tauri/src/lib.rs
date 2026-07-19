use comrak::plugins::syntect::SyntectAdapter;
use comrak::{markdown_to_html_with_plugins, Options, Plugins};

#[tauri::command]
fn parse_markdown(markdown: String) -> String {
    // GFM + extras
    let mut options = Options::default();
    options.extension.strikethrough = true;
    options.extension.table = true;
    options.extension.tasklist = true;
    options.extension.autolink = true;
    options.extension.footnotes = true;
    options.extension.superscript = true;
    options.extension.header_ids = Some(String::new());

    // Allow raw HTML passthrough (local files, trusted content)
    options.render.unsafe_ = true;

    // Syntax highlighting for fenced code blocks
    let adapter = SyntectAdapter::new(Some("base16-ocean.dark"));
    let mut plugins = Plugins::default();
    plugins.render.codefence_syntax_highlighter = Some(&adapter);

    markdown_to_html_with_plugins(&markdown, &options, &plugins)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![parse_markdown])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
