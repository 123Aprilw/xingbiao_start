// 判断是否登录
export function isLogin() {
	const token = uni.getStorageSync('token')
	return !!token
}