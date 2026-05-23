## 1.0.7（2025-06-10）
+ 【重要】优化 `onBarcode` 回调内容结构，删除多余的一层 `data`，代码改造示例：
	
	```ts
	// 升级前代码
	onBarcode(res) {
		console.log(res, '点击回调');
		if (res.data.type == 'url') {
			const res = (res.data.data as SingleQRCodeData).data as TypeURL;
			console.log(res.url);
		}
	}
	// 升级后代码
	onBarcode(res) {
		console.log(res, '点击回调');
		if (res.data.type == 'url') {
			const res = res.data.data as TypeURL;
			console.log(res.url);
		}
	}
	```
## 1.0.6（2024-11-05）
+ 修复因 `activity` 未初始化完成手动退出导致的控制台报错问题。

## 1.0.5（2024-07-11）
+ 优化内部逻辑，不需要在项目根目录创建xml文件

## 1.0.4（2024-03-31）
+ 修复扫描一维码成功回调 `data` 为空的问题
+ 修复扫描一维码点击回调插件闪退问题

## 1.0.3（2024-03-11）
+ 修复 `successFinish` 设置null时空异常问题

## 1.0.2（2024-02-21）
+ 修复插件方法手动调用异常问题
+ 修复 `fail` `complete` 回调异常问题
+ 新增 `successFinish?: boolean` 识别二维码成功后是否自动关闭扫一扫界面参数

## 1.0.1（2024-02-18）
修复新的项目无法打包问题

## 1.0.0（2024-02-08）
初始发布
