# udrag
HTML5 drag and drop
对HTML5 拖放（Drag 和 Drop）进行了封装

## 使用方式

udrag.init(elements, callback, isContinue);

- elements 拖动元素

- callback 回调

``` bash

callback(dragElement, dropToElement, insertType) { // dragElement 拖动元素 dropToElement 拖动到对应的元素上 insertType 拖动后的插入类型

}

```

- isContinue 拖动结束后是否继续执行把元素放入，默认true。设置false后，虽然有拖动，但是没有放入。
## 示例

[示例](https://jsbin.com/hetijat/edit?html,css,js,output)
