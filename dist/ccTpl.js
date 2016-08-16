;(function (global, factory) {
  if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory();
    });
  } else if (typeof define === 'function' && define.cmd) {
    define(function (require, exports, module) {
      module.exports = factory();
    });
  } else {
    global.ccTpl = factory();
  }
})(this, function() {

  /**
   * @param {String} str
   * @return {Function}
   */
  function ccTpl(str) {
    var strRegexpLogic = ccTpl.regexpHead + '( )' + '([\\s\\S]*?)' + ccTpl.regexpTail;

    var regexpLogic = new RegExp(strRegexpLogic, 'g');

    var strRegexpInterpolate = ccTpl.regexpHead + '([-=])' + '([\\s\\S]*?)' + ccTpl.regexpTail;

    var regexpInterpolate = new RegExp(strRegexpInterpolate, 'g');

    var lastIndex = 0;

    var ret = '';

    ret += 'var out = "";';

    str.replace(regexpLogic, function(capture, sign, target, index, input) {
      ret += handleLine(str, lastIndex, index);

      lastIndex = index + capture.length;

      ret += target.trim();
    });

    ret += handleLine(str, lastIndex);

    ret = ret.replace(regexpInterpolate, function(capture, sign, target, index, input) {
      return sign === '=' ? '" + (' + target + ' + "")' + replaceString + ' + "' : sign === '-' ? '" +' + target + '+ "' : capture;
    });

    ret += 'return out;';

    return new Function('it', ret);
  }

  ccTpl.regexpHead = '{{';

  ccTpl.regexpTail = '}}';

  ccTpl.escape = function(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\'/g, "&#39;")
      .replace(/"/g, "&#34;");
  };

  function handleLine(str, lastIndex, index) {
    index = index || str.length;
    var ret = '';
    var arr = str.slice(lastIndex, index).split('\n');
    var i = -1;
    var l = arr.length;
    var str;
    while (++i < l) {
      str = arr[i].trim();
      if (!str.length) continue;
      ret += 'out += "' + str + '";';
    }

    return ret;
  }

  var replaceString = '.replace(/&/g, "&amp;")' + '.replace(/</g, "&lt;")' + '.replace(/>/g, "&gt;")' + '.replace(/\'/g, "&#39;")' + '.replace(/"/g, "&#34;")';

  return ccTpl;
});
