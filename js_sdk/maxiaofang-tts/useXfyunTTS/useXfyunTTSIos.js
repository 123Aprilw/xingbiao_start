import CryptoJS from 'crypto-js'
import { ref } from 'vue'

let audioPlayer = null
let socketTask = null
let timeoutTimer = null

function base64Encode(str) {
	return CryptoJS.enc.Utf8.parse(str).toString(CryptoJS.enc.Base64)
}

function getRFC1123Date() {
	const now = new Date()
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	return `${days[now.getUTCDay()]}, ${String(now.getUTCDate()).padStart(2, '0')} ${months[now.getUTCMonth()]} ${now.getUTCFullYear()} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} GMT`
}

function getWebSocketUrl(apiKey, apiSecret) {
	const url = "wss://tts-api.xfyun.cn/v2/tts"
	const host = "tts-api.xfyun.cn"
	const date = getRFC1123Date()
	const algorithm = "hmac-sha256"
	const headers = "host date request-line"
	
	const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
	const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
	const signature = CryptoJS.enc.Base64.stringify(signatureSha)
	const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
	const authorization = base64Encode(authorizationOrigin)
	
	return `${url}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`
}

function clearTimeoutTimer() {
	if (timeoutTimer) {
		clearTimeout(timeoutTimer)
		timeoutTimer = null
	}
}

function cleanup() {
	clearTimeoutTimer()
	if (audioPlayer) {
		try {
			audioPlayer.stop()
		} catch (e) {
			console.warn('停止audioPlayer异常:', e)
		}
		audioPlayer = null
	}
	if (socketTask) {
		try {
			socketTask.close()
		} catch (e) {
			console.warn('关闭socket异常:', e)
		}
		socketTask = null
	}
}

export const useXfyunTTSIos = () => {
	const isPlaying = ref(false)
	const isConnected = ref(false)
	const error = ref(null)

	const resetState = () => {
		isPlaying.value = false
		isConnected.value = false
		error.value = null
	}

	const synthesize = async (options) => {
		const { appId, apiKey, apiSecret, text, voice = 'xiaoyan', speed = 50, volume = 50, pitch = 50, onStart, onEnd, onError, onProgress } = options

		console.log('=== synthesize 被调用 ===')
		
		cleanup()
		resetState()
		
		const audioChunks = []

		try {
			const wsUrl = getWebSocketUrl(apiKey, apiSecret)
			console.log('WebSocket URL:', wsUrl)

			timeoutTimer = setTimeout(() => {
				console.error('❌ TTS请求超时')
				error.value = '请求超时'
				resetState()
				onError && onError('请求超时')
				cleanup()
			}, 30000)

			socketTask = uni.connectSocket({
				url: wsUrl,
				success: () => console.log('✅ uni.connectSocket success'),
				fail: (err) => {
					console.error('❌ WebSocket连接失败:', err)
					error.value = 'WebSocket 连接失败'
					resetState()
					onError && onError('WebSocket 连接失败')
					cleanup()
				}
			})

			socketTask.onOpen(() => {
				console.log('✅ WebSocket OPEN')
				clearTimeoutTimer()
				isConnected.value = true
				onStart && onStart()

				socketTask.send({
					data: JSON.stringify({
						common: { app_id: appId },
						business: { aue: 'lame', sfl: 1, vcn: voice, speed, volume, pitch, bgs: 0, tte: 'UTF8' },
						data: { status: 2, text: base64Encode(text) }
					}),
					success: () => console.log('✅ 请求已发送'),
					fail: (err) => {
						console.error('❌ 发送请求失败:', err)
						error.value = '发送请求失败'
						resetState()
						onError && onError('发送请求失败')
						cleanup()
					}
				})
			})

			socketTask.onMessage((res) => {
				try {
					const data = JSON.parse(res.data)
					if (data.code !== 0) {
						console.error('❌ 合成失败:', data.message)
						error.value = `合成失败: ${data.message} (code: ${data.code})`
						resetState()
						onError && onError(error.value)
						cleanup()
						return
					}
					if (data.data?.audio) {
						audioChunks.push(data.data.audio)
						onProgress && onProgress({ status: data.data.status, audioSize: audioChunks.join('').length })
					}
					if (data.data?.status === 2) {
						socketTask.close()
						isConnected.value = false
						playAudio(audioChunks, text, onEnd, onError)
					}
				} catch (e) {
					console.error('❌ 解析消息失败:', e)
					error.value = '解析消息失败'
					resetState()
					onError && onError('解析消息失败')
					cleanup()
				}
			})

			socketTask.onError((e) => {
				console.error('❌ WebSocket连接错误:', e)
				error.value = 'WebSocket连接错误'
				resetState()
				onError && onError('WebSocket连接错误')
				cleanup()
			})

			socketTask.onClose(() => {
				console.log('🔌 WebSocket连接关闭')
				isConnected.value = false
				clearTimeoutTimer()
			})

		} catch (e) {
			console.error('❌ synthesize异常:', e)
			error.value = e.message
			resetState()
			onError && onError(e.message)
			cleanup()
		}
	}

	const playAudio = (base64Chunks, text, onEnd, onError) => {
		if (!base64Chunks?.length) {
			console.error('❌ 没有音频数据')
			error.value = '没有音频数据'
			onError && onError('没有音频数据')
			return
		}

		try {
			const NSData = plus.ios.importClass('NSData')
			const NSMutableData = plus.ios.importClass('NSMutableData')
			const NSFileManager = plus.ios.importClass('NSFileManager')
			const NSSearchPathForDirectoriesInDomains = plus.ios.importClass('NSSearchPathForDirectoriesInDomains')
			const AVAudioPlayer = plus.ios.importClass('AVAudioPlayer')
			const NSURL = plus.ios.importClass('NSURL')
			const NSNotificationCenter = plus.ios.importClass('NSNotificationCenter')
			
			const mergedData = NSMutableData.alloc().init()
			for (const chunk of base64Chunks) {
				const data = NSData.alloc().initWithBase64EncodedStringoptions(chunk, 0)
				mergedData.appendData(data)
			}
			
			const paths = NSSearchPathForDirectoriesInDomains(9, 1, 1)
			const documentsPath = paths.objectAtIndex(0)
			const fileName = CryptoJS.MD5(text).toString() + '.mp3'
			const filePath = documentsPath.plus('stringByAppendingPathComponent:', fileName)
			console.log('📂 文件路径:', filePath)
			
			const fileManager = NSFileManager.defaultManager()
			fileManager.createFileAtPathcontentsattributes(filePath, mergedData, null)
			console.log('✅ 文件写入成功')
			
			if (audioPlayer) {
				try { audioPlayer.stop() } catch (e) {}
				audioPlayer = null
			}
			
			const url = NSURL.fileURLWithPath(filePath)
			audioPlayer = AVAudioPlayer.alloc().initWithContentsOfURLerror(url, null)
			audioPlayer.prepareToPlay()
			audioPlayer.setVolume(volume / 100)
			audioPlayer.play()
			isPlaying.value = true
			console.log('✅ 开始播放')
			
			const defaultCenter = NSNotificationCenter.defaultCenter()
			
			const delegate = plus.ios.implements('NSObject', {
				'audioPlayerDidFinishPlaying:successfully:': (player, flag) => {
					console.log('✅ 播放结束')
					try {
						defaultCenter.removeObservernameobject(delegate, 'AVAudioPlayerDidFinishPlayingNotification', audioPlayer)
					} catch (e) {}
					isPlaying.value = false
					audioPlayer = null
					onEnd && onEnd()
				}
			})
			
			defaultCenter.addObserverselectornameobject(delegate, 'audioPlayerDidFinishPlaying:successfully:', 'AVAudioPlayerDidFinishPlayingNotification', audioPlayer)

		} catch (e) {
			console.error('❌ playAudio异常:', e)
			isPlaying.value = false
			error.value = e.message || '播放失败'
			onError && onError(e.message || '播放失败')
			cleanup()
		}
	}

	const stop = () => {
		console.log('⏹️ 停止播放')
		cleanup()
		resetState()
	}

	return { isPlaying, isConnected, error, synthesize, stop }
}