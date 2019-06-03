;(function (global, fn, plugin) {
  global[plugin] = fn.call(plugin);
})(window, function () {
  var _callback,
      _type = ['before', 'after', 'appendChild'],
      _isContinue,
      _CORE = {
        bindDrop: function(elem) {
          var list = [].slice.call(document.querySelectorAll(elem));
          list.forEach(function (l, index) {
            l.setAttribute('draggable', true);
            // 如果没有加入唯一ID，就
            if (l.id === '' || l.id === null) {
              l.id = 'udrop-' + index;
            }
            l.addEventListener('dragstart', _CORE.drag); // 拖拽开始
            l.addEventListener('dragover', _CORE.dropOver); // 拖动
            l.addEventListener('drop', _CORE.drop); // 放入
            l.parentNode.addEventListener('drop', _CORE.dropParent); // 放入到父级
            l.parentNode.addEventListener('dragover', _CORE.dropOver); // 拖动到父级
          });
        },
        drag: function(e) {
          e.dataTransfer.setData("Text", e.target.id);
        },
        drop: function(e) {
          e.preventDefault();
          e.stopPropagation();
          var l = e.dataTransfer.getData('Text');
          var moveY = e.pageY; // 放入时的位置
          var elemY = e.target.getBoundingClientRect().top; // 放入到元素的位置
          var elemYCenter = e.target.getBoundingClientRect().height; // 放入到元素的Y轴中心点
          var parentElem = e.target.parentNode; // 父元素
          var index = _CORE.getIndex(parentElem, e.target); // 获取元素下标
          // 判断放入位置，是在放入元素中心考上，还是靠下，进行区分放入到前面还是后面
          if (moveY < elemY + elemYCenter / 2) { // 加入到上方
            _callback(document.getElementById(l), e.target, _type[0]);
            if (!_isContinue) {
              return false;
            }
            parentElem.insertBefore(document.getElementById(l), parentElem.childNodes[index]);
          } else { // 加入到下方
            _callback(document.getElementById(l), e.target, _type[1]);
            if (!_isContinue) {
              return false;
            }
            parentElem.insertBefore(document.getElementById(l), parentElem.childNodes[index + 1]);
          }
        },
        dropParent: function (e) {
          e.preventDefault();
          var l = e.dataTransfer.getData('Text'); // 获取拖动的元素id
          _callback(document.getElementById(l), e.target, _type[2]);
          if (!_isContinue) {
            return false;
          }
          e.target.appendChild(document.getElementById(l));
        },
        dropOver: function (e) {
          e.preventDefault();
        },
         // 获取相对于父元素的下标
        getIndex: function (parent, child) {
          var index;
          for (var x = 0; x < parent.childNodes.length; x++) {
            if (parent.childNodes[x].id === child.id) {
              index = x;
              break;
            }
          }
          return index;
        }
      };

  return {
    init: function (elem, callback, isContinue) {
      _callback = callback;
      _isContinue = isContinue === undefined ? true : isContinue;
      _CORE.bindDrop(elem);
    }
  };
}, 'udrag');
