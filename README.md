# udrag
HTML5 drag and drop
对HTML5 拖放（Drag 和 Drop）进行了封装

## 使用方式

udrag.init(elements, callback, isContinue);

- elements 拖动元素

- callback 回调

``` bash

callback(dragElement, dropToElement, insertType) { // dragElement 拖动元素 dropToElement 拖动到对应的元素 insertType 拖动后的插入类型

}

```

- isContinue 是否继续执行拖动换位
## 示例

[示例](https://jsbin.com/hetijat/edit?html,css,js,output)
