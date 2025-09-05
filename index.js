const moment = require('moment');
const fs = require('fs');
const path = require('path');

const DEFAULT_THEME_COLORS = { 'color-theme-1': '#000000ff', 'color-theme-2': '#d9d9d9ff' };
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function safeGetPluginConfig(ctx) {
  var cfg = (ctx && ctx.options && ctx.options.pluginsConfig && ctx.options.pluginsConfig['tbfed-pagefooter']) || null;
  if (cfg) return cfg;
  // 回退：尝试从当前工作目录读取 book.json 或 book.js
  try {
    var bookJsonPath = path.resolve(process.cwd(), 'book.json');
    if (fs.existsSync(bookJsonPath)) {
      var txt = fs.readFileSync(bookJsonPath, 'utf8');
      var bj = JSON.parse(txt);
      return bj && bj['tbfed-pagefooter'] ? bj['tbfed-pagefooter'] : null;
    }
    var bookJsPath = path.resolve(process.cwd(), 'book.js');
    if (fs.existsSync(bookJsPath)) {
      // require 相对于 process.cwd()
      try { var bj = require(bookJsPath); return bj && bj['tbfed-pagefooter'] ? bj['tbfed-pagefooter'] : null; }catch(e){}
    }
  } catch (e) {}
  return null;
}

// 不再写入构建时数据文件；改为在页面中注入短小的配置对象脚本（数据而非逻辑）

module.exports = {
  book: {
    assets: './assets',
    css: ['footer.css']
  },
  hooks: {
    'page:before': function (page) {
      const cfg = safeGetPluginConfig(this);
      const modifyLabel = (cfg && cfg.modify_label) || 'File Modify: ';
      const modifyFormat = (cfg && cfg.modify_format) || DEFAULT_FORMAT;
      const showPower = !(cfg && cfg.show_power === false);
      const hoverEnable = !(cfg && cfg.hover === false);
      const showModifyTime = !(cfg && cfg.show_modify_time === false);

      // copyright
      let copyText = '';
      if (cfg && cfg.copyright) {
        copyText = cfg.copyright + ' all right reserved';
        if (showPower) copyText += ',powered by Honkit';
      } else {
        copyText = showPower ? ',powered by Honkit' : '';
      }

      // font size handling
      let footerStyleAttr = '';
      if (cfg) {
        const fsCfg = cfg.font_size || cfg.fontSize;
        if (fsCfg !== undefined && fsCfg !== null && fsCfg !== '') {
          if (typeof fsCfg === 'number') footerStyleAttr = ` style="font-size:${fsCfg}px;"`;
          else if (typeof fsCfg === 'string') {
            footerStyleAttr = /^[\d.]+$/.test(fsCfg) ? ` style="font-size:${fsCfg}px;"` : ` style="font-size:${fsCfg};"`;
          }
        }
      }

      const copyHtml = `<span class="copyright">${copyText}</span>`;
      const modifyHtml = showModifyTime ? `<span class="footer-modification">${modifyLabel}\n{{file.mtime | date("${modifyFormat}")}}\n</span>` : '';

      const footerClass = hoverEnable ? 'page-footer' : 'page-footer no-hover';

  const themeColors = (cfg && cfg.theme_colors) ? cfg.theme_colors : DEFAULT_THEME_COLORS;

  // 注入短小的内联配置脚本（仅包含数据），供浏览器端逻辑脚本读取；随后加载逻辑脚本
  const inlineConfig = `<script>window.__tbfed_pagefooter_config = ${JSON.stringify({ theme_colors: themeColors })};</` + `script>`;
  const colorScript = inlineConfig + '<script src="./gitbook/honkit-plugin-tbfed-pagefooter/footer-theme.js"></' + 'script>';

      const footerHtml = `\n\n<footer class="${footerClass}"${footerStyleAttr}>${copyHtml}${modifyHtml}</footer>`;
      page.content = page.content + footerHtml + colorScript;
      return page;
    }
  },
  filters: {
    date: function (d, format) { return moment(d).format(format); }
  }
};