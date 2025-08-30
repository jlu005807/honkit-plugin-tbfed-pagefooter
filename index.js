var moment = require('moment');
module.exports = {
  book: {
    assets: './assets',
    css: [
      'footer.css'
    ],
  },
  hooks: {
    'page:before': function (page) {
      var _label = 'File Modify: ',
        _format = 'YYYY-MM-DD HH:mm:ss',
        _powerText = ',powered by Honkit',
        _copy = '';

      // 读取配置（防护 this.options 为空）
      var cfg = this && this.options && this.options.pluginsConfig && this.options.pluginsConfig['tbfed-pagefooter'];
      var showPower = true;
      var hoverEnable = true;
      var showModifyTime = true;

      if (cfg) {
        _label = cfg['modify_label'] || _label;
        _format = cfg['modify_format'] || _format;
        var _c = cfg['copyright'];
        showPower = (cfg.show_power !== false);
        hoverEnable = (cfg.hover !== false);
        showModifyTime = (cfg.show_modify_time !== false);

        if (_c) {
          _copy = _c + ' all right reserved';
          if (showPower) _copy += _powerText;
        } else {
          _copy = showPower ? _powerText : '';
        }
      } else {
        // 默认显示 powered 文本
        _copy = _powerText;
      }

      // 通过在 footer 上添加 .no-hover 类来禁用悬停效果（更可维护）
      var _copyHtml = '<span class="copyright">' + _copy + '</span>';
      // 支持通过配置调整字体大小（font_size 或 fontSize）
      var footerStyleAttr = '';
      if (cfg) {
        var fs = cfg.font_size || cfg.fontSize;
        if (fs !== undefined && fs !== null && fs !== '') {
          if (typeof fs === 'number') {
            footerStyleAttr = ' style="font-size:' + fs + 'px;"';
          } else if (typeof fs === 'string') {
            if (/^[\d.]+$/.test(fs)) {
              footerStyleAttr = ' style="font-size:' + fs + 'px;"';
            } else {
              footerStyleAttr = ' style="font-size:' + fs + ';"';
            }
          }
        }
      }
      var _modifyHtml = '';
      if (showModifyTime) {
        _modifyHtml = '<span class="footer-modification">' + _label + '\n{{file.mtime | date("' + _format + '")}}\n</span>';
      }

      var footerClass = hoverEnable ? 'page-footer' : 'page-footer no-hover';
      // 插入脚本：根据页面是否存在特定类组合来切换 --font-color 变量（支持动态主题切换）
      // 获取配置并序列化为客户端可用的 JSON（避免浏览器端 themeColors 未定义）
      var themeColors = (cfg && cfg.theme_colors) ? cfg.theme_colors : { 'color-theme-1': '#080000', 'color-theme-2': '#ffffffff' };
      var themeColorsJson = JSON.stringify(themeColors);

      var colorScript = ''
        + '<script>(function(){try{'
        + '  var themeColors = ' + themeColorsJson + ';'
        + '  var defaultColor = (function(){try{ return (getComputedStyle(document.documentElement).getPropertyValue("--font-color") || "#080000").trim(); }catch(e){return "#080000";}})();'
        + '  function updateFontColor(){try{'
        + '    var root = document.documentElement; var found = false;'
        + '    for(var k in themeColors){ if(!themeColors.hasOwnProperty(k)) continue;'
        + '      try{ if(document.querySelector(".book.font-size-2.font-family-1."+k)){ root.style.setProperty("--font-color", themeColors[k]); found = true; break; } }catch(e){}'
        + '    }'
        + '    if(!found){ root.style.setProperty("--font-color", defaultColor); }'
        + '  }catch(e){} }'
        + '  document.addEventListener("DOMContentLoaded", updateFontColor);'
        + '  updateFontColor();'
        + '  var mo = new MutationObserver(function(){ try{ updateFontColor(); }catch(e){} });'
        + '  mo.observe(document.documentElement, { attributes: true, childList: true, subtree: true });'
        + '}catch(e){} })();</' + 'script>';

      var str = ' \n\n<footer class="' + footerClass + '"' + footerStyleAttr + '>' + _copyHtml + _modifyHtml + '</footer>' + colorScript;

      page.content = page.content + str;
      return page;
    }
  },
  filters: {
    date: function (d, format) {
      return moment(d).format(format)
    }
  }
};