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
  var str = ' \n\n<footer class="' + footerClass + '"' + footerStyleAttr + '>' + _copyHtml + _modifyHtml + '</footer>';

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