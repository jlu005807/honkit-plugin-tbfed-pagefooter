# honkit-plugin-tbfed-pagefooter

Chinese: See the Chinese README — [README.md](README.md)

English documentation: this Honkit plugin appends a small page footer (copyright / modification time / powered-by) to each page.

It supports:
- Custom copyright HTML
- Optional display of last modification time
- Optional "powered by Honkit" text
- Hover style control
- Footer font-size configuration
- Theme color mapping to adapt to Honkit theme variants

## Install

Install in your Honkit project directory:

```bash
npm install --save-dev honkit-plugin-tbfed-pagefooter
```

Enable the plugin in `book.json` or `book.js`.

## Configuration

Add `tbfed-pagefooter` to your Honkit config. Example `book.json`:

```json
{
  "plugins": ["tbfed-pagefooter"],
  "tbfed-pagefooter": {
    "copyright": "&copy; Taobao FED Team",
    "show_modify_time": true,
    "font_size": "0.9rem",
    "modify_label": "Last modified:",
    "modify_format": "YYYY-MM-DD HH:mm:ss",
    "show_power": true,
    "hover": true
  }
}
```

Fields (defaults shown or described):

- `copyright` (string): HTML/text for copyright. Example: `"&copy; Example"`.
- `modify_label` (string): Label printed before modification time. Default: `"Last modified:"`.
- `modify_format` (string): Time format (uses moment-style format). Default: `"YYYY-MM-DD HH:mm:ss"`.
- `show_power` (boolean): Show "powered by Honkit" text. Default: `true`.
- `hover` (boolean): Enable hover visual effect. Default: `true`. When false, plugin adds `.no-hover` on footer to disable hover CSS.
- `show_modify_time` (boolean): Whether to show the file modification time. Default: `true`.
- `font_size` / `fontSize` (string|number): Optional font size for the footer. Number is treated as px. Example: `"0.9rem"` or `14`.
- `theme_colors` (object): Optional mapping from theme class name to CSS color value. See below.

## Theme colors and dynamic font color

The plugin injects a small inline configuration object (`window.__tbfed_pagefooter_config`) into each page (data-only) and loads an external logic script `assets/footer-theme.js`. The client script reads the config and sets `--font-color` based on the active theme class. Behavior:

- At build time the plugin prefers Honkit-provided plugin config; if absent it will try to read `book.json` (or `book.js`) from the project root to obtain `tbfed-pagefooter.theme_colors`.
- The inline config is read by the client script; if no config is provided, the script falls back to a built-in mapping (e.g. `color-theme-1` / `color-theme-2`).
- The client iterates all keys in `theme_colors` and checks, in order:
  1. whether `document.documentElement` has the theme class;
  2. whether the `.book` element has the theme class;
  3. whether any descendant of `.book` has the theme class.
  When a key matches, the script sets `--font-color` to the corresponding color value.
- If none match, the script restores the `--font-color` value captured at page load.
- The script runs once on `DOMContentLoaded` and registers `MutationObserver`s: it listens for `.book` class changes (low overhead), and also registers a broader observer on `document.documentElement` to catch `.book` replacements or higher-level class switches so runtime theme switching is supported.
- Debugging: set `tbfed-pagefooter.debug` to `true` in `book.json` or run `localStorage.setItem('tbfed_pagefooter_debug','1')` in the console to enable console logs for matching and mutation events.

Example `book.json`:

```json
"tbfed-pagefooter": {
  "theme_colors": {
    "color-theme-1": "#000000ff",
    "color-theme-2": "#d9d9d9ff"
  }
}
```

If you use JS configuration (`book.js`) you can supply the same mapping:

```javascript
module.exports = {
  plugins: ['tbfed-pagefooter'],
  'tbfed-pagefooter': {
    theme_colors: {
      'color-theme-1': '#000000ff',
      'color-theme-2': '#d9d9d9ff'
    }
  }
};
```

### Notes and guidance

- The plugin prefers `book.json` / `book.js` `theme_colors` mapping if present; otherwise it falls back to the built-in mapping.
- Make sure your theme's class names match the keys you put into `theme_colors`.
- The plugin does not strictly validate color values; provide valid CSS color strings (hex, rgba, color names, or CSS variables).
- The MutationObserver helps when the site switches theme at runtime, but if your site mutates the DOM very frequently consider limiting observation to reduce overhead.

## Security and behavior

- The plugin appends footer HTML to each page. Avoid inserting untrusted script tags via `copyright` or `modify_label`.
- The modification time rendering currently uses Honkit template expression `{{file.mtime | date("...")}}`; if you want JS-side formatting using `moment`, ask and it can be changed.

## Styling

There is an example stylesheet `assets/footer.css` that styles the footer; you can override it in your theme if needed.

## Contributing

Issues and PRs are welcome. See `LICENSE` for licensing details.
