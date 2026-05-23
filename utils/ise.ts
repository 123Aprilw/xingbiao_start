import CryptoJS from 'crypto-js'

const APPID = '3f61cb6b'
const API_KEY = 'eb05d65a5885462ee1118728a60b5732'
const API_SECRET = 'NjQ0NjgwNTA3Y2UzYWVhYjMyZmY5Yzcy'

export function getIseAuthUrl() {
	const host = 'ise-api.xfyun.cn'
	// 🔥 修复1：使用新版接口地址 /v2/open-ise
	const path = '/v2/open-ise'
	const date = new Date().toUTCString()

	const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
	const signature = CryptoJS.enc.Base64.stringify(
		CryptoJS.HmacSHA256(signatureOrigin, API_SECRET)
	)
	const authorization = CryptoJS.enc.Base64.stringify(
		CryptoJS.enc.Utf8.parse(`api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`)
	)

	return `wss://${host}${path}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}&appid=${APPID}&scene=ise`
}

export { APPID }