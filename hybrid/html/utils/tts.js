// 引入你封装好的接口
import { XtfsTts } from './api.js'

// 全局音频实例（单例，避免多音频同时播放）
let audio = null
let isPlaying = false
let isLoading = false
let onPlayEndCallback = null

/**
 * 设置播放结束回调
 * @param {Function} callback 回调函数
 */
export function setTtsPlayEndCallback(callback) {
	onPlayEndCallback = callback
}

/**
 * 显示提示信息（H5版本）
 * @param {string} message 提示文本
 */
function showToast(message) {
	// 如果页面已有 toast 组件，可替换为实际实现
	console.warn('提示:', message)
	// 简单的 DOM toast 实现
	let toastEl = document.getElementById('tts-toast')
	if (!toastEl) {
		toastEl = document.createElement('div')
		toastEl.id = 'tts-toast'
		toastEl.style.cssText = `
			position: fixed;
			top: 20px;
			left: 50%;  
			transform: translateX(-50%);
			background: rgba(0, 0, 0, 0.75);
			color: #fff;
			padding: 10px 20px;
			border-radius: 4px;
			font-size: 14px;
			z-index: 99999;
			transition: opacity 0.3s;
		`
		document.body.appendChild(toastEl)
	}
	toastEl.textContent = message
	toastEl.style.opacity = '1'
	setTimeout(() => {
		toastEl.style.opacity = '0'
	}, 2000)
}

// 初始化音频实例
function initAudio() {
	if (!audio) {
		audio = new Audio()
		audio.preload = 'auto'

		// 播放自然结束
		audio.addEventListener('ended', () => {
			isPlaying = false
			if (onPlayEndCallback) {
				onPlayEndCallback()
			}
		})

		// 播放出错
		audio.addEventListener('error', (err) => {
			console.error('音频播放错误：', err)
			isPlaying = false
			isLoading = false
			if (onPlayEndCallback) {
				onPlayEndCallback()
			}
		})
	}
	return audio
}

/**
 * 播放 TTS 朗读语音
 * @param {string} text 朗读文本
 * @param {Object} options 配置项 lang 语言 / speed 语速 默认 1
 */
export async function playTTS(text, options = {}) {
	// 防重复 + 自动停止当前播放
	if (isLoading || isPlaying) {
		stopTTS()
	}

	isLoading = true

	try {
		// 调用你封装好的 XtfsTts 接口（参数完全对齐）
		const res = await XtfsTts(
			text,
			options.lang || 'zh',
			String(options.speed || 1)
		)

		// 获取音频地址（根据你的接口返回字段）
		const audioPath = res?.audio_path
		if (!audioPath) {
			throw new Error('接口未返回音频地址')
		}

		// 拼接完整音频 URL
		const baseUrl = 'https://xingbiao.demo.zhongti-group.com'
		const audioEl = initAudio()
		audioEl.src = baseUrl + audioPath

		// 开始播放
		await audioEl.play()
		isPlaying = true
	} catch (e) {
		console.error('TTS 播放失败：', e)
		showToast('语音播放失败')
	} finally {
		isLoading = false
	}
}

// 停止播放
export function stopTTS() {
	if (audio) {
		audio.pause()
		audio.currentTime = 0
		isPlaying = false
	}
}

// 暂停播放
export function pauseTTS() {
	if (audio && isPlaying) {
		audio.pause()
		isPlaying = false
	}
}

// 继续播放
export function resumeTTS() {
	if (audio && !isPlaying && audio.src) {
		audio.play()
		isPlaying = true
	}
}

// 销毁实例（页面卸载时调用）
export function destroyTTS() {
	if (audio) {
		audio.pause()
		audio.src = ''
		audio = null
	}
	isPlaying = false
	isLoading = false
	onPlayEndCallback = null
}

// 页面卸载时自动清理
if (typeof window !== 'undefined') {
	window.addEventListener('beforeunload', destroyTTS)
}
