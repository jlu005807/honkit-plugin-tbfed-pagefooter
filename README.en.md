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

The plugin injects a small client-side script that sets the CSS variable `--font-color` based on the current Honkit theme class on the page. Behavior:

- The script reads `tbfed-pagefooter.theme_colors` from your config if provided; otherwise it uses a built-in mapping:
  - `color-theme-1` -> `#000000ff`
  - `color-theme-2` -> `#ffffffff`
- The script checks for element(s) matching `.book.font-size-2.font-family-1.<theme-class>` and sets `--font-color` to the mapped color when found.
- If no mapping matches, the script restores the original `--font-color` value read at page load.
- The script runs on `DOMContentLoaded` and uses a `MutationObserver` to react to runtime theme changes.

Example `book.json`:

```json
"tbfed-pagefooter": {
  "theme_colors": {
    "color-theme-1": "#000000ff",
    "color-theme-2": "#ffffffff"
  }
}
```

If you use JS configuration (`book.js`) you can supply the same mapping:

```javascript
module.exports = {
  plugins: ['tbfed-pagefooter'],
  'tbfed-pagefooter': {
    theme_colors: {
      'color-theme-1': '#080000',
      'color-theme-2': '#2b2b2b'
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
