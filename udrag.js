;(function (global, fn, plugin) {
    global[plugin] = fn.call(plugin);
})(window, function () {
    var _callback,
        _type = ['before', 'after', 'appendChild'],
        _isContinue,
        _CORE = {
            bindDrop: function(elem) {
                var parentElem = [].slice.call(document.querySelectorAll(elem));
                parentElem.forEach(function (p, index) {
                    var childElem = [].slice.call(p.children);
                    childElem.forEach(function (l, index1) {
                        l.setAttribute('draggable', true);
                        // 如果没有加入唯一udropId，就新增
                        l.dataset.udropId = 'udrop-' + index + '-' + index1;
                        l.addEventListener('dragstart', _CORE.drag); // 拖拽开始
                        l.addEventListener('dragover', _CORE.dropOver); // 拖动
                        l.addEventListener('drop', _CORE.drop); // 放入
                    })
                    p.addEventListener('drop', _CORE.dropParent); // 放入到父级
                    p.addEventListener('dragover', _CORE.dropOver); // 拖动到父级
                });
            },
            drag: function(e) {
                e.dataTransfer.setData("Text", e.target.dataset.udropId);
            },
            drop: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var l = e.dataTransfer.getData('Text');

                var dragElem = document.querySelector('[data-udrop-id="'+ l +'"]'); // 拖动的元素
                var dropElem = _CORE.getDropElem(e.target); // 拖入的元素
                var parentElem = dropElem.parentNode; // 父元素
                var dragIndex; // 获取元素下标

                // 判断是否有相同的父级元素
                var bool = true; // 是否跳出判断
                var copyDragElem = dragElem;
                var copyDropElem = dropElem;
                var copyParentElem = parentElem;
                for (;copyParentElem.parentNode;) {
                    for (;copyDragElem.parentNode.parentNode;) {
                        if (copyParentElem.parentNode.isEqualNode(copyDragElem.parentNode.parentNode)) {
                            dragIndex = _CORE.getIndex(parentElem, dropElem);
                            bool = false;
                            break;
                        } else {
                            copyDragElem = copyDragElem.parentNode;
                        }
                    }
                    if (!bool) {
                        break;
                    }
                    copyDropElem = copyParentElem;
                    copyParentElem = copyParentElem.parentNode;
                    copyDragElem = dragElem;
                }
                var moveY = e.pageY; // 放入时的位置
                var elemY = dropElem.getBoundingClientRect().top; // 放入到元素的位置
                var elemYCenter = dropElem.getBoundingClientRect().height; // 放入到元素的Y轴中心点
                // 判断放入位置，是在放入元素中心靠上，还是靠下，进行区分放入到前面还是后面
                if (moveY < elemY + elemYCenter / 2) { // 加入到上方
                    _callback(dragElem, dropElem, _type[0]);
                    if (!_isContinue) {
                        return false;
                    }
                    parentElem.insertBefore(dragElem, parentElem.childNodes[dragIndex]);
                } else { // 加入到下方
                    _callback(dragElem, dropElem, _type[1]);
                    if (!_isContinue) {
                        return false;
                    }
                    parentElem.insertBefore(dragElem, parentElem.childNodes[dragIndex + 1]);
                }
            },
            dropParent: function (e) {
                e.preventDefault();
                var l = e.dataTransfer.getData('Text'); // 获取拖动的元素id
                var dropElem = document.querySelector('[data-udrop-id="'+ l +'"]');
                _callback(dropElem, e.target, _type[2]);
                if (!_isContinue) {
                    return false;
                }
                e.target.appendChild(dropElem);
            },
            dropOver: function (e) {
                e.preventDefault();
            },
            // 获取相对于父级元素的位置
            getIndex: function (parent, child) {
                var index;
                for (var x = 0; x < parent.childNodes.length; x++) {
                    if (parent.childNodes[x].dataset) {
                        if (parent.childNodes[x].dataset.udropId === child.dataset.udropId) {
                            index = x;
                            break;
                        }
                    }
                }
                return index;
            },
            getDropElem: function (elem) {
                while (elem) {
                    if (elem.dataset.udropId) {
                        return elem;
                    } else {
                        elem = elem.parentNode;
                    }
                }
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
