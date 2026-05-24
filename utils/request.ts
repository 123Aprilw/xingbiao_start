// utils/request.js
import config from "../config.js";
const BASE_URL = config.BASE_API
const TIMEOUT = 10000

const request = (options) => {
	return new Promise((resolve, reject) => {
		// 1. 初始化请求头，先处理 Content-Type
		const header = {}
		if (options.formData) {
			header['Content-Type'] = 'application/x-www-form-urlencoded'
		} else {
			header['Content-Type'] = 'application/json'
		}

		// 2. 再处理外部传入的 header，避免被覆盖
		Object.assign(header, options.header)

		// 3. 最后才加上 token，确保不会被覆盖
		const token = uni.getStorageSync('token')
		if (token) {
			header.token = token
			console.log('携带token:', token) // 加一行日志，方便你调试
		}

		// 4. 加载提示
		if (options.loading !== false) {
			// uni.showLoading({
			// 	title: '加载中...',
			// 	mask: true
			// })
		}

		// 5. 发起请求
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header,
			timeout: TIMEOUT,

			success: (res) => {
				uni.hideLoading()
				const { data } = res
				if (data.code === 1 || data.code === 200) {
					resolve(data)
				} else {
					if (data.code === 401) {
						uni.removeStorageSync('token') // 删掉无效token
						uni.showToast({
							title: "请登录后操作",
							icon: 'none',
							duration: 1500
						})
						setTimeout(() => {
							uni.reLaunch({ url: '/pages/index/index' })
						}, 1500)
					}
					reject(data)
				}
			},

			fail: (err) => {
				uni.hideLoading()
				uni.showToast({
					title: '网络异常，请重试',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

// 快捷方法
export const get = (url, data = {}, options = {}) => {
	return request({ url, method: 'GET', data, ...options })
}

export const post = (url, data = {}, options = {}) => {
	return request({ url, method: 'POST', data, ...options })
}

export default request