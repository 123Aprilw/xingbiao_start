// 引入你封装好的接口
import { XtfsTts } from './api'

// 全局音频实例（单例，避免多音频同时播放）
let audio : UniApp.InnerAudioContext | null = null
let isPlaying = false
let isLoading = false
let onPlayEndCallback : (() => void) | null = null
export function setTtsPlayEndCallback(callback : () => void) {
	onPlayEndCallback = callback
}
// 初始化音频上下文
function initAudio() {
	if (!audio) {
		audio = uni.createInnerAudioContext()

		// 播放自然结束
		audio.onEnded(() => {
			isPlaying = false
			if (onPlayEndCallback) {
				onPlayEndCallback()
			}
		})

		// 播放出错
		audio.onError((err) => {
			console.error('音频播放错误：', err)
			isPlaying = false
			isLoading = false
			if (onPlayEndCallback) {
				onPlayEndCallback() // 
			}
		})
	}
}

/**
 * 播放 TTS 朗读语音
 * @param text 朗读文本
 * @param options 配置项 lang 语言 / speed 语速 默认 1
 */
export async function playTTS(
	text : string,
	options : { lang ?: string; speed ?: string | number } = {}
) {
	// 防重复 + 自动停止当前播放
	if (isLoading || isPlaying) {
		stopTTS()
	}

	isLoading = true
	initAudio()

	try {
		// 调用你封装好的 XtfsTts 接口（参数完全对齐）
		const res = await XtfsTts(
			text,
			options.lang || 'zh',
			String(options.speed || 1)
		)

		// 获取音频地址（根据你的接口返回字段）
		const audioPath = res.data?.audio_path
		if (!audioPath) {
			throw new Error('接口未返回音频地址')
		}

		// 拼接完整音频 URL
		const baseUrl = 'https://xingbiao.demo.zhongti-group.com'
		audio!.src = baseUrl + audioPath

		// 开始播放
		await audio!.play()
		isPlaying = true
	} catch (e) {
		console.error('TTS 播放失败：', e)
		uni.showToast({
			title: '语音播放失败',
			icon: 'none'
		})
	} finally {
		isLoading = false
	}
}

// 停止播放
export function stopTTS() {
	if (audio && isPlaying) {
		audio.stop()
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

// 销毁实例（页面卸载时调用）
export function destroyTTS() {
	if (audio) {
		audio.destroy()
		audio = null
	}
	isPlaying = false
	isLoading = false
}