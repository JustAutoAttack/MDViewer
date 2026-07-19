# MD Viewer

This project is a high-performance, lightweight Markdown IDE built with a focus
on speed, security, and developer-friendly extensibility. By leveraging a **Rust
backend** coupled with a **React frontend**, the application achieves a seamless
balance between heavy-duty computation and a responsive, modern user interface.

## The Tech Stack

| Layer                     | Technology   | Role                                                         |
| :------------------------ | :----------- | :----------------------------------------------------------- |
| **Language (Backend)**    | Rust         | System operations, file I/O, security, and heavy processing. |
| **Parser (Backend)**      | Comrak       | High-performance CommonMark/GFM parsing.                     |
| **Highlighter (Backend)** | Syntect      | Server-side syntax highlighting using TextMate themes.       |
| **Language (Frontend)**   | TypeScript   | Type-safe UI logic and state management.                     |
| **Framework (Frontend)**  | React        | Declarative UI and component lifecycle management.           |
| **Styling**               | Tailwind CSS | Atomic CSS for fast, consistent UI theming.                  |
| **Communication**         | Tauri IPC    | Bridging Rust commands and frontend actions.                 |

## Why This Stack?

The architecture is designed to offload "heavy lifting" to the system level
while keeping the UI flexible and themeable.

- **Tauri:** Provides a lightweight, secure framework by leveraging the
  operating system’s native webview, resulting in significantly smaller binaries
  and lower memory usage compared to Electron.
- **Rust:** Handles system-level operations and intensive parsing with memory
  safety, ensuring the application remains stable even when processing large
  documents.
- **Comrak:** A fast, GFM-compliant parser that provides the speed and
  flexibility required to support complex features like tables and task lists.
- **Syntect:** A highly optimized library that uses Sublime Text syntax
  definitions. By performing syntax highlighting on the backend, we ensure code
  blocks are rendered with rich, accurate color-coding instantly without taxing
  the frontend.
- **React & TypeScript:** Provides a component-driven environment with type
  safety, preventing bugs and improving maintainability as the IDE features
  grow.
- **Tailwind CSS:** Enables rapid UI development and a flexible theme system
  through the use of CSS variables.

## The Philosophy: Two-Layer Theming

A core feature of this IDE is its dual-layer theme architecture:

1.  **Backend (Syntax Layer):** Syntect processes code blocks using
    TextMate-compatible themes, ensuring code is color-coded before it ever hits
    the screen.
2.  **Frontend (UI Layer):** React and Tailwind handle the application’s overall
    aesthetics—fonts, layout, and background colors—allowing for real-time
    visual customization without requiring a backend re-parse.
