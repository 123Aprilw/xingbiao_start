# kux-mlkit-scancode
#### `kux-mlkit-scancode` 是一个基于 [谷歌条形码扫描](https://developers.google.cn/ml-kit/vision/barcode-scanning?hl=zh-cn) 实现的支持多种条形码和二维码格式的扫码插件，基于大模型的能力可以做到完全离线扫描识别二维码，支持批量扫码和连续扫码，支持从相册读取识别等等丰富的功能。
> ***注意：***<br/>
> 由于 `uts` 为强类型语言，所以涉及自定义传参的都要手动指定类型，所有参数类型都已经导出，开发者直接根据提示直接导入使用即可。

### 插件开源地址：[https://gitcode.com/kviewui/kux-mlkit-scancode](https://gitcode.com/kviewui/kux-mlkit-scancode)
### 内置aar模块项目开源地址：[https://gitcode.com/kviewui/TestScaning](https://gitcode.com/kviewui/TestScaning)


## 插件特色
+ 支持多种格式的一维码，二维码和国际通用的条形码
+ 基于谷歌机器学习套件能够完全离线使用
+ 支持批量扫码和连续扫码
+ 支持相机扫描和相册读取图片识别
+ 支持解析如文本、URL、WIFI、电话信息、短信信息等多种国际通用的内容识别类型
+ 提供了自定义界面的API方法
+ 支持开发者直接使用原生xml布局自己的界面
+ 为开发者提供了 `40+` 自定义配置信息
+ 支持各种自定义回调监听
+ 不需要 `GMS` 强绑定
+ 支持多种使用方式

## 目录结构
<li><a href="#guide">基础</a>
	<ol>
		<li><a href="#guide_installation">安装配置</a></li>
		<li><a href="#guide_guide">入门使用</a></li>
		<li><a href="#guide_use">多种使用方式</a></li>
	</ol>
</li>
<li><a href="#advanced">进阶</a>
	<ol>
		<li><a href="#advanced_qrcodeData">解析不同类型的数据</a></li>
		<li><a href="#advanced_config">配置</a>
			<ol>
				<li><a href="#advanced_config_title">title</a></li>
				<li><a href="#advanced_config_tip">tip</a></li>
				<li><a href="#advanced_config_showTip">showTip</a></li>
				<li><a href="#advanced_config_successTip">successTip</a></li>
				<li><a href="#advanced_config_failureTip">failureTip</a></li>
				<li><a href="#advanced_config_exitText">exitText</a></li>
				<li><a href="#advanced_config_cancelText">cancelText</a></li>
				<li><a href="#advanced_config_showFlash">showFlash</a></li>
				<li><a href="#advanced_config_flashOnText">flashOnText</a></li>
				<li><a href="#advanced_config_flashOffText">flashOffText</a></li>
				<li><a href="#advanced_config_flashOnColor">flashOnColor</a></li>
				<li><a href="#advanced_config_flashOffColor">flashOffColor</a></li>
				<li><a href="#advanced_config_flashOnTip">flashOnTip</a></li>
				<li><a href="#advanced_config_flashOnTextColor">flashOnTextColor</a></li>
				<li><a href="#advanced_config_flashOffTip">flashOffTip</a></li>
				<li><a href="#advanced_config_flashOffTextColor">flashOffTextColor</a></li>
				<li><a href="#advanced_config_showAlbum">showAlbum</a></li>
				<li><a href="#advanced_config_showBack">showBack</a></li>
				<li><a href="#advanced_config_showLine">showLine</a></li>
				<li><a href="#advanced_config_lineDuration">lineDuration</a></li>
				<li><a href="#advanced_config_vibrate">vibrate</a></li>
				<li><a href="#advanced_config_initZoomRatio">initZoomRatio</a></li>
				<li><a href="#advanced_config_maxZoomRatio">maxZoomRatio</a></li>
				<li><a href="#advanced_config_autoFullScreen">autoFullScreen</a></li>
				<li><a href="#advanced_config_touchZoom">touchZoom</a></li>
				<li><a href="#advanced_config_doubleTapZoom">doubleTapZoom</a></li>
				<li><a href="#advanced_config_continuousScanning">continuousScanning</a></li>
				<li><a href="#advanced_config_batchScanning">batchScanning</a></li>
				<li><a href="#advanced_config_markCircleRadius">markCircleRadius</a></li>
				<li><a href="#advanced_config_markCircleColor">markCircleColor</a></li>
				<li><a href="#advanced_config_markCircleStrokeColor">markCircleStrokeColor</a></li>
				<li><a href="#advanced_config_markCircleStrokeWidth">markCircleStrokeWidth</a></li>
				<li><a href="#advanced_config_markCircleAnimate">markCircleAnimate</a></li>
				<li><a href="#advanced_config_centerBarcode">centerBarcode</a></li>
				<li><a href="#advanced_config_backFinish">backFinish</a></li>
				<li><a href="#advanced_config_cancelFinish">cancelFinish</a></li>
				<li><a href="#advanced_config_showMask">showMask</a></li>
				<li><a href="#advanced_config_maskColor">maskColor</a></li>
				<li><a href="#advanced_config_maskAlpha">maskAlpha</a></li>
				<li><a href="#advanced_config_maskDuration">maskDuration</a></li>
				<li><a href="#advanced_config_successFinish">successFinish</a></li>
				<li><a href="#advanced_config_beforeSuccess">beforeSuccess</a></li>
				<li><a href="#advanced_config_success">success</a></li>
				<li><a href="#advanced_config_fail">fail</a></li>
				<li><a href="#advanced_config_complete">complete</a></li>
				<li><a href="#advanced_config_beforeCancel">beforeCancel</a></li>
				<li><a href="#advanced_config_onCancel">onCancel</a></li>
				<li><a href="#advanced_config_onBack">onBack</a></li>
				<li><a href="#advanced_config_onAlbum">onAlbum</a></li>
				<li><a href="#advanced_config_onFlashOn">onFlashOn</a></li>
				<li><a href="#advanced_config_onFlashOff">onFlashOff</a></li>
				<li><a href="#advanced_config_onZoom">onZoom</a></li>
				<li><a href="#advanced_config_onDoubleTap">onDoubleTap</a></li>
				<li><a href="#advanced_config_onContinuous">onContinuous</a></li>
				<li><a href="#advanced_config_onBarcode">onBarcode</a></li>
				<li><a href="#advanced_config_onCameraPermissionDenied">onCameraPermissionDenied</a></li>
				<li><a href="#advanced_config_onAlbumPermissionDenied">onAlbumPermissionDenied</a></li>
			</ol>
		</li>
		<li><a href="#advanced_api">API</a>
			<ol>
				<li><a href="#advanced_api_getInstance">getInstance</a></li>
				<li><a href="#advanced_api_scanCode">scanCode</a></li>
				<li><a href="#advanced_api_selfRequestCameraPermission">selfRequestCameraPermission</a></li>
				<li><a href="#advanced_api_selfRequestReadMediaImagesPermission">selfRequestReadMediaImagesPermission</a></li>
				<li><a href="#advanced_api_openAlbum">openAlbum</a></li>
				<li><a href="#advanced_api_restartScan">restartScan</a></li>
				<li><a href="#advanced_api_close">close</a></li>
				<li><a href="#advanced_api_config">config</a></li>
				<li><a href="#advanced_api_turnOnFlashlight">turnOnFlashlight</a></li>
				<li><a href="#advanced_api_turnOffFlashlight">turnOffFlashlight</a></li>
			</ol>
		</li>
		<li><a href="#advanced_android">自定义安卓原生界面</a>
			<ol>
				<li><a href="#advanced_android_drawable">drawable</a></li>
				<li><a href="#advanced_android_layout">layout</a></li>
				<li><a href="#advanced_android_values">values</a></li>
			</ol>
		</li>
		<li><a href="#advanced_interface">类型</a>
			<ol>
				<li><a href="#advanced_interface_CommonResultCallback">CommonResultCallback</a></li>
				<li><a href="#advanced_interface_QRCodeType">QRCodeType</a></li>
				<li><a href="#advanced_interface_TypeText">TypeText</a></li>
				<li><a href="#advanced_interface_TypeURL">TypeURL</a></li>
				<li><a href="#advanced_interface_TypeWIFI">TypeWIFI</a></li>
				<li><a href="#advanced_interface_TypePhone">TypePhone</a></li>
				<li><a href="#advanced_interface_TypeSms">TypeSms</a></li>
				<li><a href="#advanced_interface_TypeEmail">TypeEmail</a></li>
				<li><a href="#advanced_interface_TypeContact">TypeContact</a></li>
				<li><a href="#advanced_interface_TypeGeo">TypeGeo</a></li>
				<li><a href="#advanced_interface_TypeCalendar">TypeCalendar</a></li>
				<li><a href="#advanced_interface_TypeDriverLicense">TypeDriverLicense</a></li>
				<li><a href="#advanced_interface_SingleQRCodeData">SingleQRCodeData</a></li>
				<li><a href="#advanced_interface_SuccessCallback">SuccessCallback</a></li>
				<li><a href="#advanced_interface_OnBarcodeCallback">OnBarcodeCallback</a></li>
				<li><a href="#advanced_interface_ScanCodeConfig">ScanCodeConfig</a></li>
				<li><a href="#advanced_interface_ScanCodeManager">ScanCodeManager</a></li>
			</ol>
		</li>
	</ol>
</li>

<a id="guide"></a>
## 基础

<a id="guide_installation"></a>
### 安装配置
本插件为完全的 `uni_modules` 插件，所以直接在 [插件市场](https://ext.dcloud.net.cn) 搜索 `kux-mlkit-scancode` 安装即可。
> ***注意：***<br/>
> 
> + 由于该插件需要修改原生配置，所以该插件需要在自定义基座中方可正常运行。
> + 由于该插件需要使用相机，闪光灯，读取相册敏感权限，所以需要基座声明具体的权限方可正常使用，具体如下：

+ 项目根目录定义 `AndroidManifest.xml` 文件用来声明相关权限，下面的作为参考：<br/>

	```xml
	<?xml version="1.0" encoding="utf-8"?>
	<manifest xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools" 
	  package="cn.kviewui.kuxMlKitScancode">
	  
	  <!--权限声明 start-->
	  <uses-feature android:name="android.hardware.camera" android:required="false" />
	  
	  <uses-permission android:name="android.permission.CAMERA" />
	  <uses-permission android:name="android.permission.FLASHLIGHT" />
	  <!--权限声明 end-->
	  	<!--由于插件依赖我开发的原生aar，所以需要声明activity-->
	    <application
			android:allowBackup="true"
			android:theme="@style/Theme.AppCompat.NoActionBar"
			android:supportsRtl="true"
	>
			<activity android:name="cn.kviewui.scancode.BarcodeScanningActivity"
				android:launchMode="singleTask"
				android:exported="true">
				<intent-filter>
					<action android:name="cn.kviewui.scancode.BarcodeScanningActivity" />
					<category android:name="android.intent.category.DEFAULT" />
				</intent-filter>
			</activity>
	    </application>
	</manifest>
	```
	> ***注意：***<br/>
	>
	> + 上面文件中的注释是为了方便阅读，开发者们可以根据编译情况选择删除注释内容。
	> + 上面文件中的 `package` 是应用包名，开发者要替换为自己的包名，打包基座时需要开发者填写包名，建议是和上面的 `package` 包名保		持一致。
	> + 上面的 `application` 的 `android:theme` 为插件需要的主题，不能修改为其他内容，否则无法打包！！！
	> + 上面的 `activity` 为插件必须项，不能修改或删除，否则无法打包！！！
	> + `HbuilderX` 版本为 `4.02` 及以上时请删除上面的 `package` 字段，不然云打包会失败！！！
	> + `插件版本 v1.0.5` 及以上不需要该步骤，因为插件已经自动添加了相关配置。

<a id="guide_guide"></a>
### 入门使用
```uts
import { scanCode } from '@/uni_modules/kux-mlkit-scancode';
import { ScanCodeConfig } from '@/uni_modules/kux-mlkit-scancode/utssdk/interface';

scanCode({
	success(res) {
		console.log(res, '识别成功数据');
	}
} as ScanCodeConfig)
```

<a id="guide_use"></a>
### 多种使用方式
插件支持 `scanCode` 直接使用和 `useScanCode` 创建实例模式使用，这样设计的目的是插件的使用灵活性，因为该插件会提供单独的API方法来控制比如 `闪光灯`、`震动`、`重新扫描`、`发起相机/相册权限` 等各种灵活自定义场景。所以提供了前面说的两种方式，如果需要使用单独的API场景时应该使用 `useScanCode` ，否则应该使用 `scanCode`

<a id="advanced"></a>
## 进阶

<a id="advanced_qrcodeData"></a>
### 解析不同类型的数据

```uts
import { useScanCode } from '@/uni_modules/kux-mlkit-scancode';
import { ScanCodeConfig, TypeURL, TypeWIFI, ScanCodeManager } from '@/uni_modules/kux-mlkit-scancode/utssdk/interface';

const scanCodeManager = useScanCode({
	title: '扫描',
	tip: '在扫描中了',
	showTip: true,
	successTip: '识别成功',
	showLine: this.findItem('hideLine') === null,
	showAlbum: this.findItem('hideAlbum') === null,
	markCircleAnimate: this.findItem('markCircleAnimate') !== null,
	markCircleColor: this.findItem('markCircleColor') != null ? '#3491FA' : '',
	doubleTapZoom: this.findItem('doubleTapZoom') != null,
	flashOffColor: this.findItem('flashOffColor') != null ? '#3491FA' : '',
	autoFullScreen: this.findItem('autoFullScreen') != null,
	success(res) {
		console.log(res, '识别成功数据');
		// console.log((res.data[0].data as TypeURL).url);
		res.data.forEach(item => {
			if (item.type === 'url') {
				console.log(item.data, 'url数据');
				// 这里可以根据数据类型转换为具体的类型结构数据
				const data = item.data as TypeURL;
				console.log(data.url, 'url地址');
			}
		})
	}
} as ScanCodeConfig) as ScanCodeManager;
scanCodeManager.scanCode();
```
> **注意**<br/>
> 为了演示多种使用方式，这里的使用方式为 `useScanCode`，`scanCode` 方式请参考[入门使用](#guide_guide)

<a id="advanced_config"></a>
### 配置
插件给开发者们提供了大量的自定义配置，提供如下配置可以实现轻量级的自定义界面。

<a id="advanced_config_title"></a>
#### title
+ 描述：扫一扫界面的标题
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'扫一扫'`

<a id="advanced_config_tip"></a>
#### tip
+ 描述：扫一扫界面的提示文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'正在扫描，请稍候'`

<a id="advanced_config_showTip"></a>
#### showTip
+ 描述：是否弹出扫码阶段提示语，如“扫码完成”，“识别结果：XXX”
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_successTip"></a>
#### successTip
+ 描述：扫码成功提示文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'扫码完成'`

<a id="advanced_config_failureTip"></a>
#### failureTip
+ 描述：扫码失败提示文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'扫码失败，请重试'`

<a id="advanced_config_exitText"></a>
#### exitText
+ 描述：扫一扫界面的关闭按钮文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`''`
+ 备注：设置该参数后，将替换原来默认界面的关闭按钮

<a id="advanced_config_cancelText"></a>
#### cancelText
+ 描述：扫一扫界面的取消按钮文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`''`

<a id="advanced_config_showFlash"></a>
#### showFlash
+ 描述：是否显示闪光灯按钮
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_flashOnText"></a>
#### flashOnText
+ 描述：打开闪光灯时按钮的文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'轻触关闭'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_flashOffText"></a>
#### flashOffText
+ 描述：关闭闪光灯时按钮的文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'轻触照亮'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_flashOnColor"></a>
#### flashOnColor
+ 描述：打开闪光灯时按钮的背景色
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'#00BC79'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_flashOffColor"></a>
#### flashOffColor
+ 描述：关闭闪光灯时按钮的背景色
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'#FFFFFF'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_flashOnTip"></a>
#### flashOnTip
+ 描述：打开闪光灯时的提示文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'闪光灯已打开'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_flashOnTextColor"></a>
#### flashOnTextColor
+ 描述：打开闪光灯时的文字颜色
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'#00BC79'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_flashOffTip"></a>
#### flashOffTip
+ 描述：关闭闪光灯时的提示文字
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'闪光灯已关闭'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_flashOffTextColor"></a>
#### flashOffTextColor
+ 描述：关闭闪光灯时的文字颜色
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'#FFFFFF'`
+ 备注：`showFlash` 为 `true` 时生效

<a id="advanced_config_showAlbum"></a>
#### showAlbum
+ 描述：是否显示相册按钮
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`false`

<a id="advanced_config_showBack"></a>
#### showBack
+ 描述：是否显示返回按钮
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`
+ 备注：建议开启

<a id="advanced_config_showLine"></a>
#### showLine
+ 描述：是否显示扫描线
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_lineDuration"></a>
#### lineDuration
+ 描述：扫描线动画时长，单位毫秒
+ 类型：`number`
+ 是否必选：`否`
+ 默认值：`3000`

<a id="advanced_config_vibrate"></a>
#### vibrate
+ 描述：扫描成功后是否震动
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_initZoomRatio"></a>
#### initZoomRatio
+ 描述：初始化调焦大小
+ 类型：`number`
+ 是否必选：`否`
+ 默认值：`1.0`

<a id="advanced_config_maxZoomRatio"></a>
#### maxZoomRatio
+ 描述：允许最大调焦大小
+ 类型：`number`
+ 是否必选：`否`
+ 默认值：`5.0`
+ 备注：
	+ 自动缩放焦距时有效，不过测试了谷歌的自动调焦功能时灵时不灵，所以目前这个参数可以忽略

<a id="advanced_config_autoFullScreen"></a>
#### autoFullScreen
+ 描述：是否自动全屏
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_touchZoom"></a>
#### touchZoom
+ 描述：是否启用手势缩放
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_doubleTapZoom"></a>
#### doubleTapZoom
+ 描述：是否启用双击缩放
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_continuousScanning"></a>
#### continuousScanning
+ 描述：是否开启连续扫码
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`false`

<a id="advanced_config_batchScanning"></a>
#### batchScanning
+ 描述：是否开启批量扫码
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_markCircleRadius"></a>
#### markCircleRadius
+ 描述：二维码识别圆圈半径大小
+ 类型：`number`
+ 是否必选：`否`
+ 默认值：`50`

<a id="advanced_config_markCircleColor"></a>
#### markCircleColor
+ 描述：二维码识别圆圈颜色
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`#00BC79`

<a id="advanced_config_markCircleStrokeColor"></a>
#### markCircleStrokeColor
+ 描述：二维码识别圆圈边框颜色
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'#FFFFFF'`

<a id="advanced_config_markCircleStrokeWidth"></a>
#### markCircleStrokeWidth
+ 描述：二维码识别圆圈边框宽度
+ 类型：`number`
+ 是否必选：`否`
+ 默认值：`3`

<a id="advanced_config_markCircleAnimate"></a>
#### markCircleAnimate
+ 描述：二维码识别圆圈是否开启动画
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_centerBarcode"></a>
#### centerBarcode
+ 描述：是否开启二维码只在屏幕中心识别
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`false`
+ 备注：暂时不支持

<a id="advanced_config_backFinish"></a>
#### backFinish
+ 描述：点击返回按钮是否关闭扫一扫界面
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_cancelFinish"></a>
#### cancelFinish
+ 描述：点击取消按钮是否关闭扫一扫界面
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`false`

<a id="advanced_config_showMask"></a>
#### showMask
+ 描述：识别到二维码时是否显示蒙层，建议开启，这样能突出显示二维码上面的圆圈标记
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`true`

<a id="advanced_config_maskColor"></a>
#### maskColor
+ 描述：识别到二维码时蒙层颜色
+ 类型：`string`
+ 是否必选：`否`
+ 默认值：`'#80000000'`
+ 备注：`showMask` 为 `true` 时生效

<a id="advanced_config_maskAlpha"></a>
#### maskAlpha
+ 描述：识别到二维码时蒙层透明度
+ 类型：`number`
+ 是否必选：`否`
+ 默认值：`0.5`
+ 备注：`showMask` 为 `true` 时生效

<a id="advanced_config_maskDuration"></a>
#### maskDuration
+ 描述：识别到二维码时显示蒙层的过渡动画时长，单位毫秒
+ 类型：`number`
+ 是否必选：`否`
+ 默认值：`300`
+ 备注：`showMask` 为 `true` 时生效

<a id="advanced_config_successFinish"></a>
#### successFinish
+ 描述：识别二维码成功后是否自动关闭扫一扫界面
+ 类型：`boolean`
+ 是否必选：`否`
+ 默认值：`false`
+ 备注：`v1.0.2` 及以上版本支持

<a id="advanced_config_beforeSuccess"></a>
#### beforeSuccess
+ 描述：识别到二维码后成功回调前的自定义处理
+ 类型：`beforeSuccess?: (callback: CommonResultCallback) => void`
+ 是否必选：`否`

<a id="advanced_config_success"></a>
#### success
+ 描述：识别到二维码后成功回调
+ 类型：`success?: (callback: SuccessCallback) => void`
+ 是否必选：`否`

<a id="advanced_config_fail"></a>
#### fail
+ 描述：识别到二维码后失败回调
+ 类型：`fail?: (callback: CommonResultCallback) => void`
+ 是否必须：`否`

<a id="advanced_config_complete"></a>
#### complete
+ 描述：识别到二维码后完成回调
+ 类型：`complete?: (callback: CommonResultCallback) => void`
+ 是否必须：`否`

<a id="advanced_config_beforeCancel"></a>
#### beforeCancel
+ 描述：识别到二维码后执行取消回调前的自定义处理
+ 类型：`beforeCancel?: () => boolean`
+ 是否必选：`否`
+ 备注：暂不支持

<a id="advanced_config_onCancel"></a>
#### onCancel
+ 描述：识别到二维码后点击取消回调
+ 类型：`onCancel?: () => void`
+ 是否必选：`否`

<a id="advanced_config_onBack"></a>
#### onBack
+ 描述：识别到二维码后点击返回回调
+ 类型：`onBack?: () => void`
+ 是否必选：`否`

<a id="advanced_config_onAlbum"></a>
#### onAlbum
+ 描述：识别到二维码后点击相册回调
+ 类型：`onAlbum?: () => void`
+ 是否必选：`否`

<a id="advanced_config_onFlashOn"></a>
#### onFlashOn
+ 描述：识别到二维码后打开闪光灯回调
+ 类型：`onFlashOn?: () => void`
+ 是否必选：`否`

<a id="advanced_config_onFlashOff"></a>
#### onFlashOff
+ 描述：识别到二维码后关闭闪光灯回调
+ 类型：`onFlashOff?: () => void`
+ 是否必选：`否`

<a id="advanced_config_onZoom"></a>
#### onZoom
+ 描述：识别到二维码后手势缩放回调
+ 类型：`onZoom?: (currentZoomRatio: number) => void`
+ 是否必选：`否`

<a id="advanced_config_onDoubleTap"></a>
#### onDoubleTap
+ 描述：识别到二维码后执行双击缩放回调
+ 类型：`onDoubleTap?: (currentZoomRatio: number) => void`
+ 是否必选：`否`

<a id="advanced_config_onContinuous"></a>
#### onContinuous
+ 描述：识别到二维码后连续扫码回调
+ 类型：`onContinuous?: (callback: SuccessCallback) => void`
+ 是否必选：`否`

<a id="advanced_config_onBarcode"></a>
#### onBarcode
+ 描述：点击单个二维码的回调
+ 类型：`onBarcode?: (callback: OnBarcodeCallback) => void`
+ 是否必选：`否`

<a id="advanced_config_onCameraPermissionDenied"></a>
#### onCameraPermissionDenied
+ 描述：用户拒绝相机权限时的回调
+ 类型：`onCameraPermissionDenied?: () => void`
+ 是否必选：`否`

<a id="advanced_config_onAlbumPermissionDenied"></a>
#### onAlbumPermissionDenied
+ 描述：用户拒绝相册权限时的回调
+ 类型：`onAlbumPermissionDenied?: () => void`
+ 是否必选：`否`

<a id="advanced_api"></a>
### API
这里的API指的是 `useScanCode` 实例模式下的开放API方法。

<a id="advanced_api_getInstance"></a>
#### getInstance
+ 描述：获取插件实例
+ 参数：`无`
+ 返回值：`BarcodeScanningActivity`
+ 备注：这个是获取的 `uts` 转换后的原生 `aar` 插件实例，如果开发者有原生开发定制能力的话可以使用该实例完成定制开发

<a id="advanced_api_scanCode"></a>
#### scanCode
+ 描述：打开扫描界面扫码
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_api_selfRequestCameraPermission"></a>
#### selfRequestCameraPermission
+ 描述：手动发起相机权限请求
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_api_selfRequestReadMediaImagesPermission"></a>
#### selfRequestReadMediaImagesPermission
+ 描述：手动发起读取相册权限请求
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_api_openAlbum"></a>
#### openAlbum
+ 描述：打开相册
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_api_restartScan"></a>
#### restartScan
+ 描述：重新发起扫描
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_api_close"></a>
#### close
+ 描述：关闭扫一扫界面
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_api_config"></a>
#### config
+ 描述：设置扫码界面配置内容
+ 参数：`config: ScanCodeConfig`
+ 返回值：`无`
+ 备注：如果不传任何参数时将会恢复插件默认的配置，相当于是配置初始化

<a id="advanced_api_turnOnFlashlight"></a>
#### turnOnFlashlight
+ 描述：打开闪光灯
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_api_turnOffFlashlight"></a>
#### turnOffFlashlight
+ 描述：关闭闪光灯
+ 参数：`无`
+ 返回值：`无`

<a id="advanced_android"></a>
### 自定义安卓原生界面
由于插件是基于原生安卓aar实现的，所以把 `res` 资源也给开发者开放了出来，只要开发者按照同名去创建资源文件即可覆盖插件默认的资源完全使用自己的自定义资源实现完全自定义界面的场景。

<a id="advanced_android_drawable"></a>
#### drawable
`drawable` 是原生安卓的 `res` 资源中的一项，主要是定义图片资源，这里是插件界面的图片和图标资源。

##### button_ground
+ 描述：二维码圆圈标记背景
+ 类型： `xml`
+ 源码：<br/>

	```xml
	<?xml version="1.0" encoding="utf-8"?>
	<shape xmlns:android="http://schemas.android.com/apk/res/android">
	    <solid android:color="#5000BC79"/>
	    <corners android:radius="999dp"/>
	</shape>
	```

##### icon_album
+ 描述：相册图标
+ 类型：`png`

##### icon_exit
+ 描述：关闭界面图标
+ 类型：`xml`
+ 源码：<br/>

	```xml
	<vector xmlns:android="http://schemas.android.com/apk/res/android"
	    android:width="48dp"
	    android:height="48dp"
	    android:viewportWidth="960"
	    android:viewportHeight="960"
	    android:tint="?attr/colorControlNormal"
	    android:autoMirrored="true">
	  <path
	      android:fillColor="@android:color/white"
	      android:pathData="M400,880L0,480L400,80L456,137L113,480L456,823L400,880Z"/>
	</vector>
	```
	
##### icon_flashlight_off
+ 描述：关闭闪光灯按钮图标
+ 类型：`xml`
+ 源码：<br/>

	```xml
	<vector xmlns:android="http://schemas.android.com/apk/res/android"
	    android:width="48dp"
	    android:height="48dp"
	    android:viewportWidth="960"
	    android:viewportHeight="960"
	    android:tint="?attr/colorControlNormal">
	  <path
	      android:fillColor="@android:color/white"
	      android:pathData="M341,880L341,397L67,123L110,80L859,830L817,873L641,697L641,880L341,880ZM251,136L251,80L731,80L731,196L311,196L311,196L251,136ZM641,527L371,256L731,256L731,305L641,437L641,527Z"/>
	</vector>
	```
	
##### icon_flashlight_on
+ 描述：打开闪光灯按钮图标
+ 类型：`xml`
+ 源码：<br/>

	```xml
	<vector xmlns:android="http://schemas.android.com/apk/res/android"
	    android:width="48dp"
	    android:height="48dp"
	    android:viewportWidth="960"
	    android:viewportHeight="960"
	    android:tint="?attr/colorControlNormal">
	  <path
	      android:fillColor="@android:color/white"
	      android:pathData="M240,196L240,80L720,80L720,196L240,196ZM479.82,634Q501,634 516,619.18Q531,604.35 531,583.18Q531,562 516.18,547Q501.35,532 480.18,532Q459,532 444,546.82Q429,561.65 429,582.82Q429,604 443.82,619Q458.65,634 479.82,634ZM330,880L330,437L240,305L240,256L720,256L720,305L630,437L630,880L330,880Z"/>
	</vector>
	```
	
##### icon_scan_line
+ 描述：扫描线图片
+ 类型：`png`

##### scan_default_result_point_arrow
+ 描述：二维码标记圆圈中间的指示箭头图标
+ 类型：`png`

<a id="advanced_android_layout"></a>
#### layout
`layout ` 是原生安卓的 `res` 资源中的一项，主要是定义界面布局资源，这里是插件界面的界面布局。

##### activity_barcode_scanning
+ 描述：扫一扫主界面
+ 类型：`xml`
+ 源码：<br/>

	```xml
	<?xml version="1.0" encoding="utf-8"?>
	<cn.kviewui.scancode.CustomConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
	    xmlns:tools="http://schemas.android.com/tools"
	    android:layout_width="match_parent"
	    android:layout_height="match_parent"
	    xmlns:app="http://schemas.android.com/apk/res-auto"
	    tools:context="cn.kviewui.scancode.BarcodeScanningActivity">
	    
	    <!--相机预览-->
	    <androidx.camera.view.PreviewView
	        android:id="@+id/previewView"
	        android:layout_width="match_parent"
	        android:layout_height="match_parent"
	        android:alpha="1"
	        android:background="@color/colorBlack"/>
	
		<!--识别到二维码时加的蒙层，用来突出显示圆圈标记-->
	    <View
	        android:id="@+id/view_mask"
	        android:layout_width="match_parent"
	        android:layout_height="match_parent"
	        android:background="@color/colorViewMask"
	        android:visibility="gone"/>
	
		<!--标题-->
	    <TextView
	        android:id="@+id/tv_title"
	        android:layout_width="match_parent"
	        android:layout_height="wrap_content"
	        android:paddingTop="48dp"
	        android:gravity="center"
	        android:textColor="@color/colorWhite"
	        android:text="@string/scan_title"
	        android:textSize="18sp"
	        tools:ignore="MissingConstraints" />
	
	    <androidx.constraintlayout.widget.ConstraintLayout
	        android:layout_width="match_parent"
	        android:layout_height="wrap_content"
	        android:gravity="center_vertical"
	        android:paddingTop="50dp"
	        android:orientation="horizontal">
	        
	        <!--退出图标-->
	        <ImageView
	            android:id="@+id/iv_exit"
	            android:layout_width="20dp"
	            android:layout_height="20dp"
	            android:src="@drawable/icon_exit"
	            android:contentDescription="@string/icon_close"
	            android:layout_marginStart="30dp"
	            app:layout_constraintStart_toStartOf="parent"
	            app:layout_constraintTop_toTopOf="parent"
	            app:tint="@color/colorWhite"/>
	
		<!--退出文字-->
	        <TextView
	            android:id="@+id/tv_exit"
	            android:layout_width="match_parent"
	            android:layout_height="match_parent"
	            app:layout_constraintStart_toStartOf="parent"
	            app:layout_constraintTop_toTopOf="parent"
	            android:layout_marginStart="30dp"
	            android:textColor="@color/colorWhite"
	            android:text="@string/icon_close"
	            android:textSize="18sp"
	            android:visibility="gone"/>
	
		<!--取消文字，识别到二维码后显示-->
	        <TextView
	            android:id="@+id/tv_cancel"
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content"
	            app:layout_constraintStart_toStartOf="parent"
	            app:layout_constraintTop_toTopOf="parent"
	            android:layout_marginStart="30dp"
	            android:textColor="@color/colorWhite"
	            android:text="@string/cancel_scan_result"
	            android:textSize="18sp"
	            android:visibility="gone"/>
	
		<!--相册图标-->
	        <ImageView
	            android:id="@+id/iv_photo"
	            android:layout_width="26dp"
	            android:layout_height="26dp"
	            app:layout_constraintTop_toTopOf="parent"
	            app:layout_constraintEnd_toEndOf="parent"
	            android:src="@drawable/icon_album"
	            android:layout_marginEnd="30dp"
	            android:contentDescription="@string/icon_photo" />
	    </androidx.constraintlayout.widget.ConstraintLayout>
	
		<!--底部提示语-->
	    <TextView
	        android:id="@+id/tv_tips"
	        android:layout_width="match_parent"
	        android:layout_height="wrap_content"
	        app:layout_constraintBottom_toBottomOf="parent"
	        android:layout_marginBottom="100dp"
	        android:textColor="@color/colorWhite"
	        android:gravity="center"
	        android:text="@string/scanning_text"
	        android:textSize="16sp" />
	
	    <LinearLayout
	        android:orientation="vertical"
	        android:layout_width="match_parent"
	        android:layout_height="wrap_content"
	        app:layout_constraintBottom_toBottomOf="parent"
	        android:layout_marginBottom="20dp"
	        android:paddingTop="0dp"
	        android:gravity="center_horizontal">
	        <LinearLayout
	            android:id="@+id/ll_flashlight"
	            android:orientation="vertical"
	            android:gravity="center_vertical"
	            android:layout_width="wrap_content"
	            android:layout_height="wrap_content">
	            
	            <!--打开闪光灯按钮-->
	            <ImageView
	                android:id="@+id/iv_flashlight_on"
	                android:layout_width="36dp"
	                android:layout_height="36dp"
	                android:layout_gravity="center_horizontal"
	                android:src="@drawable/icon_flashlight_on"
	                android:visibility="visible"
	                android:contentDescription="@string/open_flashlight" />
	                
	                <!--关闭闪光灯按钮-->
	            <ImageView
	                android:id="@+id/iv_flashlight_off"
	                android:layout_width="36dp"
	                android:layout_height="36dp"
	                android:layout_gravity="center_horizontal"
	                android:src="@drawable/icon_flashlight_off"
	                android:visibility="gone"
	                android:contentDescription="@string/close_flashlight" />
	
			<!--闪光灯操作提示-->
	            <TextView
	                android:id="@+id/tv_flashlight"
	                android:layout_width="wrap_content"
	                android:layout_height="wrap_content"
	                android:text="@string/open_flashlight"
	                android:textSize="12sp"
	                android:gravity="center"
	                android:textColor="@color/colorWhite"
	                android:layout_gravity="center"/>
	        </LinearLayout>
	    </LinearLayout>
	
		<!--自定义相册选择图片的预览界面-->
	    <cn.kviewui.scancode.CustomImageView
	        android:id="@+id/iv_photo_preview"
	        android:layout_width="match_parent"
	        android:layout_height="match_parent"
	        android:visibility="gone"
	        android:background="@color/colorBlack"
	        android:scaleType="fitCenter"
	        android:contentDescription="@string/photo_preview" />
	
		<!--自定义相机扫描识别到二维码后的预览界面，用来绘制圆圈标记和扫描线-->
	    <cn.kviewui.scancode.ScanOverlay
	        android:id="@+id/overlay"
	        android:layout_width="match_parent"
	        android:layout_height="match_parent"
	        app:layout_constraintTop_toBottomOf="@id/iv_exit"
	        app:layout_constraintTop_toTopOf="@id/tv_tips"
	        android:layout_marginBottom="0dp"
	        android:layout_marginTop="0dp"
	        android:paddingTop="20dp"
	        android:paddingBottom="20dp"
	        android:alpha="1"
	        android:background="@color/colorTransparent"/>
	
	</cn.kviewui.scancode.CustomConstraintLayout>
	```
	> **提示**<br/>
	> 开发者在自定义布局的时候要使用上面布局元素的 `id` 值，不然插件无法监听点击和配置！！！
	
<a id="advanced_android_values"></a>
#### values
`values ` 是原生安卓的 `res` 资源中的一项，主要是定义常量和颜色值等资源，这里是插件界面的常量值和颜色值。

##### colors
+ 描述：定义默认的颜色值
+ 类型：`xml`
+ 源码：<br/>

	```xml
	<?xml version="1.0" encoding="utf-8"?>
	<resources>
	    <color name="colorPrimary">#00BC79</color>
	    <color name="colorPrimaryDark">#004D3C</color>
	    <color name="colorAccent">#03DAC5</color>
	    <color name="colorWhite">#FFFFFF</color>
	    <color name="colorBlack">#000000</color>
	    <color name="colorGray">#999999</color>
	    <color name="colorGrayLight">#F5F5F5</color>
	    <color name="colorTransparent">#00FFFFFF</color>
	    <color name="colorViewMask">#80000000</color>
	</resources>
	```
	
##### strings
+ 描述：定义界面布局需要的默认描述语
+ 类型：`xml`
+ 源码：<br/>

	```xml
	<?xml version="1.0" encoding="utf-8"?>
	<resources>
	    <string name="scan_line">ScanLine</string>
	    <string name="icon_photo">IconPhoto</string>
	    <string name="icon_close">关闭</string>
	    <string name="scanning_text">正在扫描，请稍候</string>
	    <string name="scanning_failed">扫描失败，请重试</string>
	    <string name="scanning_succeeded_multi">扫描到多个二维码，请选择一个打开</string>
	    <string name="scanning_succeeded_single">扫描成功</string>
	    <string name="cancel_scan_result">取消</string>
	    <string name="scan_title">扫一扫</string>
	    <string name="open_flashlight">轻触照亮</string>
	    <string name="close_flashlight">轻触关闭</string>
	    <string name="flash_on_tip">闪光灯已打开</string>
	    <string name="flash_off_tip">闪光灯已关闭</string>
	    <string name="photo_preview">相册预览</string>
	</resources>
	```
	
<a id="advanced_interface"></a>
### 类型
由于 `uts` 强类型语言，所以插件给开发者们提供了类型导出，方便开发者们显示声明类型。

<a id="advanced_interface_CommonResultCallback"></a>
#### CommonResultCallback
```uts
/**
 * 回调定义
 */
export type CommonResultCallback = {
	statusCode: number;
	message: string;
	data: any;
};
```

<a id="advanced_interface_QRCodeType"></a>
#### QRCodeType
```uts
/**
 * 二维码解析数据类型
 */
export type QRCodeType = 'text'
| 'url'
| 'wifi'
| 'phone'
| 'sms'
| 'email'
| 'contact'
| 'geo'
| 'calendar'
| 'driverLicense'
```

<a id="advanced_interface_TypeText"></a>
#### TypeText
```uts
/**
 * 文本数据类型结构
 */
export type TypeText = {
	text: string;
};
```

<a id="advanced_interface_TypeURL"></a>
#### TypeURL
```uts
/**
 * URL数据类型结构
 */
export type TypeURL = {
	url: string;
};
```

<a id="advanced_interface_TypeWIFI"></a>
#### TypeWIFI
```uts
/**
 * WIFI数据类型结构
 */
export type TypeWIFI = {
	ssid: string;
	password: string;
	type: string;
};
```

<a id="advanced_interface_TypePhone"></a>
#### TypePhone
```uts
/**
 * Phone数据类型结构
 */
export type TypePhone = {
	number: string;
};
```

<a id="advanced_interface_TypeSms"></a>
#### TypeSms
```uts
/**
 * Sms数据类型结构
 */
export type TypeSms = {
	number: string;
	message: string;
};
```

<a id="advanced_interface_TypeEmail"></a>
#### TypeEmail
```uts
/**
 * Email数据类型结构
 */
export type TypeEmail = {
	address: string;
	subject: string;
	body: string;
};
```

<a id="advanced_interface_TypeContact"></a>
#### TypeContact
```uts
/**
 * 联系人信息数据类型结构
 */
export type TypeContact = {
	name: string;
	address: string;
	phone: string;
	email: string;
};
```

<a id="advanced_interface_TypeGeo"></a>
#### TypeGeo
```uts
/**
 * 地理位置信息数据类型结构
 */
export type TypeGeo = {
	latitude: string;
	longitude: string;
};
```

<a id="advanced_interface_TypeCalendar"></a>
#### TypeCalendar
```uts
/**
 * 日历事件数据类型结构
 */
export type TypeCalendar = {
	summary: string;
	location: string;
	description: string;
	start: string;
	end: string;
};
```

<a id="advanced_interface_TypeDriverLicense"></a>
#### TypeDriverLicense
```uts
/**
 * 驾驶证数据类型结构
 */
export type TypeDriverLicense = {
	firstName: string;
	lastName: string;
	middleName: string;
	addressState: string;
	addressCity: string;
	addressStreet: string;
	addressZip: string;
	birthDate: string;
	documentType: string;
	expiryDate: string;
	gender: string;
	issueDate: string;
	licenseNumber: string;
	issuingCountry: string;
};
```

<a id="advanced_interface_SingleQRCodeData"></a>
#### SingleQRCodeData
```uts
/**
 * 单个二维码数据结构定义
 */
export type SingleQRCodeData = {
	type: QRCodeType;
	data: any;
};
```

<a id="advanced_interface_SuccessCallback"></a>
#### SuccessCallback
```uts
/**
 * 识别二维码成功回调定义
 */
export type SuccessCallback = {
	statusCode: number;
	message: string;
	data: SingleQRCodeData[];
};
```

<a id="advanced_interface_OnBarcodeCallback"></a>
#### OnBarcodeCallback
```uts
/**
 * 点击单个二维码成功回调定义
 */
export type OnBarcodeCallback = {
	statusCode: number;
	message: string;
	data: SingleQRCodeData;
};
```

<a id="advanced_interface_ScanCodeConfig"></a>
#### ScanCodeConfig
```uts
/**
 * 扫码前的配置
 */
export type ScanCodeConfig = {
	/**
	 * 扫一扫界面的标题
	 */
	title?: string;
	/**
	 * 扫一扫界面的提示文字
	 */
	tip?: string;
	/**
	 * 是否弹出扫码阶段提示语，如“扫码完成”，“识别结果：XXX”
	 * + 默认为 `true`
	 */
	showTip?: boolean;
	/**
	 * 扫码成功提示文字
	 */
	successTip?: string;
	/**
	 * 扫码失败提示文字
	 */
	failureTip?: string;
	/**
	 * 扫一扫界面的关闭按钮文字
	 * + 设置该参数后，将替换原来默认界面的关闭按钮
	 */
	exitText?: string;
	/**
	 * 扫一扫界面的取消按钮文字
	 */
	cancelText?: string;
	/**
	 * 是否显示闪光灯按钮
	 * + 默认为 `true`
	 */
	showFlash?: boolean;
	/**
	 * 打开闪光灯时按钮的文字
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOnText?: string;
	/**
	 * 关闭闪光灯时按钮的文字
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOffText?: string;
	/**
	 * 打开闪光灯时按钮的背景色
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOnColor?: string;
	/**
	 * 关闭闪光灯时按钮的背景色
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOffColor?: string;
	/**
	 * 打开闪光灯时的提示文字
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOnTip?: string;
	/**
	 * 打开闪光灯时的文字颜色
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOnTextColor?: string;
	/**
	 * 关闭闪光灯时的提示文字
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOffTip?: string;
	/**
	 * 关闭闪光灯时的文字颜色
	 * + `showFlash` 为 `true` 时生效
	 */
	flashOffTextColor?: string;
	/**
	 * 是否显示相册按钮
	 * + 默认为 `false`
	 */
	showAlbum?: boolean;
	/**
	 * 是否显示返回按钮
	 * + 默认为 `true`
	 * + 建议开启
	 */
	showBack?: boolean;
	/**
	 * 是否显示扫描线
	 * + 默认为 `true`
	 */
	showLine?: boolean;
	/**
	 * 扫描线动画时长，单位毫秒
	 * + 默认值为 `3000`
	 */
	lineDuration?: number;
	// /**
	//  * 扫描线起始位置
	//  * + 不建议自定义，除非不使用默认的界面
	//  */
	// lineStartY?: number;
	// /**
	//  * 扫描线结束位置
	//  */
	// lineEndY?: (floatYFraction: number) => number;
	/**
	 * 扫描成功后是否震动
	 * + 默认为 `true`
	 */
	vibrate?: boolean;
	/**
	 * 初始化调焦大小
	 * + 默认为 `1.0`
	 */
	initZoomRatio?: number;
	/**
	 * 允许最大调焦大小
	 * + 默认为 `1.0`
	 */
	maxZoomRatio?: number;
	/**
	 * 是否自动全屏
	 * + 默认为 `true`
	 */
	autoFullScreen?: boolean;
	/**
	 * 是否启用手势缩放
	 * + 默认为 `true`
	 */
	touchZoom?: boolean;
	/**
	 * 是否启用双击缩放
	 * + 默认为 `true`
	 */
	doubleTapZoom?: boolean;
	/**
	 * 是否开启连续扫码
	 * + 默认为 `false`
	 */
	continuousScanning?: boolean;
	/**
	 * 是否开启批量扫码
	 * + 默认为 `true`
	 */
	batchScanning?: boolean;
	/**
	 * 二维码识别圆圈半径大小
	 * + 默认为 `50`
	 */
	markCircleRadius?: number;
	/**
	 * 二维码识别圆圈颜色
	 * + 默认为 `#00BC79`
	 */
	markCircleColor?: string;
	/**
	 * 二维码识别圆圈边框颜色
	 * + 默认为 `#FFFFFF`
	 */
	markCircleStrokeColor?: string;
	/**
	 * 二维码识别圆圈边框宽度
	 * + 默认为 `3`
	 */
	markCircleStrokeWidth?: number;
	/**
	 * 二维码识别圆圈是否开启动画
	 * + 默认为 `true`
	 */
	markCircleAnimate?: boolean;
	/**
	 * 是否开启二维码只在屏幕中心识别
	 * + 暂时不支持
	 */
	centerBarcode?: boolean;
	/**
	 * 点击返回按钮是否关闭扫一扫界面
	 * + 默认为 `true`
	 */
	backFinish?: boolean;
	/**
	 * 点击取消按钮是否关闭扫一扫界面
	 * + 默认为 `false`
	 */
	cancelFinish?: boolean;
	/**
	 * 识别到二维码时是否显示蒙层，建议开启，这样能突出显示二维码上面的圆圈标记
	 * + 默认为 `true`
	 */
	showMask?: boolean;
	/**
	 * 识别到二维码时蒙层颜色
	 * + `showMask` 为 `true` 时生效
	 * + 默认为 `#80000000`
	 */
	maskColor?: string;
	/**
	 * 识别到二维码时蒙层透明度
	 * + `showMask` 为 `true` 时生效
	 * + 默认为 `0.5`
	 */
	maskAlpha?: number;
	/**
	 * 识别到二维码时显示蒙层的过渡动画时长，单位毫秒
	 * + `showMask` 为 `true` 时生效
	 * + 默认为 `300`
	 */
	maskDuration?: number;
	/**
	 * 识别二维码成功后是否自动关闭扫一扫界面
	 * + 默认为 `false`
	 * + `v1.0.2` 及以上版本支持
	 */
	successFinish?: boolean;
	/**
	 * 识别到二维码后成功回调前的自定义处理
	 */
	beforeSuccess?: (callback: CommonResultCallback) => void;
	/**
	 * 识别到二维码后成功回调
	 */
	success?: (callback: SuccessCallback) => void;
	/**
	 * 识别到二维码后失败回调
	 */
	fail?: (callback: CommonResultCallback) => void;
	/**
	 * 识别到二维码后完成回调
	 */
	complete?: (callback: CommonResultCallback) => void;
	/**
	 * 识别到二维码后执行取消回调前的自定义处理
	 * + 暂不支持
	 */
	beforeCancel?: () => boolean;
	/**
	 * 识别到二维码后点击取消回调
	 */
	onCancel?: () => void;
	/**
	 * 识别到二维码后点击返回回调
	 */
	onBack?: () => void;
	/**
	 * 识别到二维码后点击相册回调
	 */
	onAlbum?: () => void;
	/**
	 * 识别到二维码后打开闪光灯回调
	 */
	onFlashOn?: () => void;
	/**
	 * 识别到二维码后关闭闪光灯回调
	 */
	onFlashOff?: () => void;
	/**
	 * 识别到二维码后手势缩放回调
	 * @param {number} currentZoomRatio 当前焦距
	 */
	onZoom?: (currentZoomRatio: number) => void;
	/**
	 * 识别到二维码后执行双击缩放回调
	 * @param {number} currentZoomRatio 当前焦距
	 */
	onDoubleTap?: (currentZoomRatio: number) => void;
	/**
	 * 识别到二维码后连续扫码回调
	 */
	onContinuous?: (callback: SuccessCallback) => void;
	/**
	 * 点击单个二维码的回调
	 */
	onBarcode?: (callback: OnBarcodeCallback) => void;
	/**
	 * 用户拒绝相机权限时的回调
	 */
	onCameraPermissionDenied?: () => void;
	/**
	 * 用户拒绝相册权限时的回调
	 */
	onAlbumPermissionDenied?: () => void;
};
```

<a id="advanced_interface_ScanCodeManager"></a>
#### ScanCodeManager
这个类型其实还是 `useScanCode` 的返回类型，因为目前 `uts` 写法限制，所以目前只能是整个class的导出了。

___
### 友情推荐
+ [GVIM即时通讯模版](https://ext.dcloud.net.cn/plugin?id=16419)：GVIM即时通讯模版，基于uni-app x开发的一款即时通讯模版
+ [t-uvue-ui](https://ext.dcloud.net.cn/plugin?id=15571)：T-UVUE-UI是基于UNI-APP X开发的前端UI框架
+ [UxFrame 低代码高性能UI框架](https://ext.dcloud.net.cn/plugin?id=16148)：【F2图表、双滑块slider、炫酷效果tabbar、拖拽排序、日历拖拽选择、签名...】UniAppX 高质量UI库
+ [wx-ui 基于uni-app x开发的高性能混合UI库](https://ext.dcloud.net.cn/plugin?id=15579)：基于uni-app x开发的高性能混合UI库，集成 uts api 和 uts component，提供了一套完整、高效且易于使用的UI组件和API，让您以更少的时间成本，轻松完成高性能应用开发。
+ [firstui-uvue](https://ext.dcloud.net.cn/plugin?id=16294)：FirstUI（unix）组件库，一款适配 uni-app x 的轻量、简洁、高效、全面的移动端组件库。
+ [easyXUI 不仅仅是UI 更是为UniApp X设计的电商模板库](https://ext.dcloud.net.cn/plugin?id=15602)：easyX 不仅仅是UI库，更是一个轻量、可定制的UniAPP X电商业务模板库，可作为官方组件库的补充,始终坚持简单好用、易上手

## 结语
`kux` 不生产代码，只做代码的搬运工，致力于提供 `uts` 的 js 生态轮子实现，欢迎各位开发者在插件市场搜索使用 kux 生态插件：[https://ext.dcloud.net.cn/search?q=kux](https://ext.dcloud.net.cn/search?q=kux)。在此非常感谢官方的协助以及及时解决了我们在群里提的问题，也感谢群里各位伙伴的友好帮助。由于该插件的完成时间是即将除夕了，所以在此恭祝各位开发者新年快乐，龙年行大运。