直接导出psd 的整个图片

```
// 获取当前文档
var doc = app.activeDocument;

// 获取文档路径和文件名
var docPath = doc.path;
var docName = doc.name.replace(/\.[^\.]+$/, ''); // 去掉扩展名

// 设置导出文件路径
var exportFile = new File(docPath + "/" + docName + "_export.png");

// 设置 PNG 保存选项
var pngOptions = new PNGSaveOptions();
pngOptions.compression = 9;
pngOptions.interlaced = false;

// 执行保存
doc.saveAs(exportFile, pngOptions, true, Extension.LOWERCASE);

alert("导出完成: " + exportFile.fsName);
```
