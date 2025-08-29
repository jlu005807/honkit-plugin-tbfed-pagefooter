# honkit-plugin-tbfed-pagefooter

简体中文说明：这是一个用于 Honkit（或 GitBook 风格站点）的插件，负责在每个页面底部添加统一的页面注脚（Footer），支持自定义版权信息、最后修改时间显示、是否展示 "Powered by Honkit" 字段以及悬停样式。

基于[gitbook-plugin-tbfed-pagefooter](https://github.com/zhj3618/gitbook-plugin-tbfed-pagefooter)开发，更加个性化。
可以根据自己的需求选择是否显示相关内容

在npm官方查看此插件[honkit-plugin-tbfed-pagefooter](https://www.npmjs.com/package/honkit-plugin-tbfed-pagefooter)


## 安装

通过 npm 安装该插件（与 Honkit 项目同一目录）：(注意如果Honkit是全局安装，插件也需要全局安装)

```powershell
npm install --save-dev honkit-plugin-tbfed-pagefooter
```

在 `book.json`（或 Honkit 的配置文件）中启用：

```json
{
  "plugins": [
    "tbfed-pagefooter"
  ]
}
```

## 插件配置

在 Honkit 的配置对象中添加 `tbfed-pagefooter` 配置项：
示例（完整的 `book.json` 部分）：

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
- `copyright` (string): 要显示的版权信息，支持 HTML 片段，例如 `&copy;` 或带链接的 `<a>` 标签
- `modify_label` (string): 最后修改时间的标签前缀，例如 `最后修改：`。支持 HTML。默认：`"该文件修订时间："`。
- `modify_format` (string): 时间格式，基于常见的 moment/日期格式，例如 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`。默认：`"YYYY-MM-DD HH:mm:ss"`。
- `show_power` (boolean): 是否在注脚显示 `powered by Honkit`。默认：`true`。
- `hover` (boolean): 是否开启悬停样式（hover）。默认：`true`。当设置为 `false` 时，插件会向页面注入一段覆盖样式以禁用 hover 效果。
- `show_modify_time` (boolean): 是否显示最后修改时间。默认：`true`。
- `font_size` / `fontSize` (string|number): 可选，调整注脚整体字体大小。支持数字（视为 px）或带单位的字符串（例如 `"0.9rem"`）。示例：`"font_size": "0.9rem"` 或 `"fontSize": 14`。



## 注意

- 本插件会在页面 DOM 中追加注脚节点，确保你的站点主题没有与之冲突的同名样式或脚本。
- 当前实现将修改时间的渲染保留为 Honkit 模板表达式（例如 `{{file.mtime | date("YYYY-MM-DD")}}`），由 Honkit 在渲染时格式化。如果你希望插件在 JS 层直接格式化时间（不依赖模板过滤器），可以提出，我会帮你改为直接使用 `moment` 输出字符串。
- 当 `hover` 设置为 `false` 时，插件会向页面注入一段覆盖样式（内联 `<style>`）来禁用 hover；若你更倾向于通过类名（例如 `.no-hover`）配合 CSS 控制，我也可以修改插件实现。
- `copyright` 与 `modify_label` 支持 HTML，请谨慎插入外部脚本或不受信任的内容以避免 XSS。

## 本地样式

本仓库包含一个示例样式文件 `assets/footer.css`，用于美化注脚。你可以按需替换或覆盖该样式。

## 贡献与许可证

欢迎提交 issue 与 PR。许可证请参见仓库根目录的 `LICENSE` 文件。

