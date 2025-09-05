# honkit-plugin-tbfed-pagefooter

English: See the English README — [README.en.md](README.en.md)

简体中文说明：这是一个用于 Honkit（或 GitBook 风格站点）的插件，负责在每个页面底部添加统一的页面注脚（Footer），支持自定义版权信息、最后修改时间显示、是否展示 "Powered by Honkit" 字段、悬停样式、字体大小与主题颜色映射。

基于 [gitbook-plugin-tbfed-pagefooter](https://github.com/zhj3618/gitbook-plugin-tbfed-pagefooter) 开发。可与 Honkit 默认主题配合使用，也支持通过配置适配自定义主题。

查看 npm 包： https://www.npmjs.com/package/honkit-plugin-tbfed-pagefooter

## 安装

通过 npm 安装该插件（与 Honkit 项目同一目录）：

```powershell
npm install --save-dev honkit-plugin-tbfed-pagefooter
```

在 `book.json`（或 `book.js`）中启用：

```json
{
  "plugins": [
    "tbfed-pagefooter"
  ]
}
```

## 插件配置

在 Honkit 的配置对象中添加 `tbfed-pagefooter` 配置项。下面给出一个常见的 `book.json` 示例：

```json
{
  "plugins": ["tbfed-pagefooter"],
  "tbfed-pagefooter": {
    "copyright": "&copy; Taobao FED Team",
    "show_modify_time": true,
    "font_size": "0.9rem",
    "modify_label": "该文件修订时间：",
    "modify_format": "YYYY-MM-DD HH:mm:ss",
    "show_power": true,
    "hover": true
  }
}
```

字段说明（默认值基于当前实现）：

- `copyright` (string): 要显示的版权信息，支持 HTML 片段，例如 `&copy;` 或带链接的 `<a>` 标签。
- `modify_label` (string): 最后修改时间的标签前缀，例如 `最后修改：`。支持 HTML。默认：`"该文件修订时间："`。
- `modify_format` (string): 时间格式，基于常见的 moment/日期格式，例如 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`。默认：`"YYYY-MM-DD HH:mm:ss"`。
- `show_power` (boolean): 是否在注脚显示 `powered by Honkit`。默认：`true`。
- `hover` (boolean): 是否开启悬停样式（hover）。默认：`true`。当设置为 `false` 时，插件会在生成的 `<footer>` 元素上添加 `.no-hover` 类以禁用悬停效果（样式在 `assets/footer.css` 内已支持）。
- `show_modify_time` (boolean): 是否显示最后修改时间。默认：`true`。
- `font_size` / `fontSize` (string|number): 可选，调整注脚整体字体大小。支持数字（视为 px）或带单位的字符串（例如 `"0.9rem"`）。示例：`"font_size": "0.9rem"` 或 `"fontSize": 14`。
- `theme_colors` (object): 可选，主题类到颜色的映射（详见下文）。示例：`{"color-theme-1":"#080000","color-theme-2":"#2b2b2b"}`。


## 主题与动态字体颜色

插件会在每个生成页面中注入一个短小的内联配置对象（`window.__tbfed_pagefooter_config`，仅包含数据）并加载外部逻辑脚本 `assets/footer-theme.js`，浏览器端脚本根据该配置动态切换注脚文字颜色。

行为说明：

- 构建阶段插件优先从 Honkit 上下文读取 `tbfed-pagefooter` 配置；若未提供，会尝试回退读取项目根目录下的 `book.json`（或 `book.js`）以取得 `tbfed-pagefooter.theme_colors`。
- 注入的内联配置会被客户端脚本读取；若页面没有提供配置，脚本会回退为内置默认映射（例如 `color-theme-1`/`color-theme-2`）。
- 客户端逻辑会遍历 `theme_colors` 的所有 key（例如 `color-theme-1`、`color-theme-2`），并按顺序检测：
  1. 根元素（`document.documentElement`）是否包含该类；
  2. `.book` 元素本身是否包含该类；
  3. `.book` 的子元素中是否存在该类。
  如果任一命中，脚本会把 CSS 变量 `--font-color` 设置为对应颜色。
- 如果全部 key 均未命中，脚本会把 `--font-color` 恢复为页面加载时的初始值（读取自 `:root` 或 `document.documentElement`）。
- 脚本在 `DOMContentLoaded` 时执行一次初始化，并注册 `MutationObserver`：优先监听 `.book` 的 class 变化（低开销），同时也在 `document.documentElement` 上注册较宽泛的观察器以捕获 `.book` 被替换或更高层级的类切换，从而支持运行时主题切换。
- 脚本支持调试输出：在 `book.json` 中把 `tbfed-pagefooter.debug` 设为 `true` 或在浏览器控制台执行 `localStorage.setItem('tbfed_pagefooter_debug','1')`，脚本会在控制台打印匹配过程与 mutation 事件，方便定位问题。

示例（`book.json` 配置）：

```json
"tbfed-pagefooter": {
  "theme_colors": {
    "color-theme-1": "#000000ff",
    "color-theme-2": "#d9d9d9ff"
  }
}
```

示例（`book.js` 配置）：

```javascript
module.exports = {
  plugins: [ 'tbfed-pagefooter' ],
  'tbfed-pagefooter': {
    theme_colors: {
      'color-theme-1': '#000000ff',
      'color-theme-2': '#d9d9d9ff'
    }
  }
};
```

优先级与扩展：

- 插件优先使用 `book.json` / `book.js` 中配置的 `theme_colors`，否则使用内置默认映射。
- 如果你的主题使用不同的类名或更多主题类型，可以在 `theme_colors` 中增加对应键，插件会根据配置自动匹配并设置颜色。

性能与安全提醒：

- 客户端脚本会注册 `MutationObserver` 来监听 DOM 变化，以便在运行时也能响应主题切换。如果你的站点 DOM 变动非常频繁，考虑限制观察范围或让插件只在页面含 `.book` 时注册观察器以降低性能影响。
- `theme_colors` 中的颜色应为合法的 CSS color 值（例如 `#rrggbb`、`#rrggbbaa`、`rgb()`、`rgba()`、或 CSS 变量）。插件不会对颜色字符串做严格校验。

## 注意

- 本插件会在页面 DOM 中追加注脚节点，确保你的站点主题没有与之冲突的同名样式或脚本。
- 当前实现将修改时间的渲染保留为 Honkit 模板表达式（例如 `{{file.mtime | date("YYYY-MM-DD")}}`），由 Honkit 在渲染时格式化。如果你希望插件在 JS 层直接格式化时间（不依赖模板过滤器），我可以改为直接使用 `moment` 输出字符串。
- `copyright` 与 `modify_label` 支持 HTML，请谨慎插入外部脚本或不受信任的内容以避免 XSS。

## 本地样式

本仓库包含一个示例样式文件 `assets/footer.css`，用于美化注脚。你可以按需替换或覆盖该样式。

## 贡献与许可证

欢迎提交 issue 与 PR。许可证请参见仓库根目录的 `LICENSE` 文件。

