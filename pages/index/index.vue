<script setup lang="ts">
	import { ref, computed, onUnmounted } from 'vue'
	import { isLogin } from '@/utils/auth'
	//接口调用
	import { login, LoginCode } from '@/utils/api.ts'
	import { onShow } from '@dcloudio/uni-app'
	// 表单数据
	const phone = ref<string>('')
	const code = ref<string>('')
	const agreed = ref(false)
	const countdown = ref(0)
	let timer : ReturnType<typeof setInterval> | null = null

	// 正则校验
	const phoneReg = /^1[3-9]\d{9}$/ // 11位手机号
	const codeReg = /^\d{4}$/ // 4位纯数字验证码

	// 校验状态
	const isPhoneValid = computed(() => phoneReg.test(phone.value))
	const isCodeValid = computed(() => codeReg.test(code.value))

	// 是否可以登录（手机号+验证码+协议都满足）
	const canLogin = computed(() => {
		return isPhoneValid.value && isCodeValid.value && agreed.value
	})
	//
	onShow(() => {
		if (isLogin()) {
			// 已经登录 → 直接跳个人中心
			uni.switchTab({
				url: "/pages/TabBar/user/user"
			})
		}
	})
	// 获取验证码
	const getCode = async () => {
		// 倒计时中或手机号不合法时禁止点击
		if (countdown.value > 0 || !isPhoneValid.value) return
		try {
			const res = await LoginCode(phone.value)
			code.value = res.data.code
		} catch (error) {
			console.log(error)
		}
		// 开启倒计时
		countdown.value = 60
		timer = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0 && timer) {
				clearInterval(timer)
				timer = null
			}
		}, 1000)
	}

	// 登录逻辑
	const handleLogin = async () => {
		if (!canLogin.value) return
		try {
			const res = await login(phone.value, code.value)
			if (res.code === 1) {
				console.log(res)
				uni.setStorageSync('token', res.data.userinfo.token)
				uni.showToast({ title: '登录成功', icon: 'success' })
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/TabBar/user/user'
					})
				}, 2000)
			} else {
				uni.showToast({
					title: '登录失败', icon: 'success'
				})
			}
		} catch (err) {
			console.log(err)
		}
	}

	// 组件销毁清除定时器
	onUnmounted(() => {
		if (timer) clearInterval(timer)
	})
</script>

<template>
	<view class="login-page">
		<!-- 头部区域 -->
		<view class="header">
			<view class="title-group">
				<text class="main-title">登录</text>
				<text class="sub-title">体验更多精彩</text>
			</view>
			<!-- 图片预留位置，替换成你的图片地址即可 -->
			<image class="header-img" src="/static/logonew.png" mode="aspectFit" />
		</view>

		<!-- 表单区域 -->
		<view class="form">
			<!-- 手机号输入框 -->
			<view class="input-group">
				<text class="label">手机号</text>
				<input class="input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号"
					placeholder-style="color: #999" />
			</view>

			<!-- 验证码输入框 -->
			<view class="input-group code-group">
				<text class="label">验证码</text>
				<input class="input code-input" v-model="code" type="number" maxlength="4" placeholder="请输入验证码"
					placeholder-style="color: #999" />
				<!-- 分隔线 -->
				<view class="divider"></view>
				<!-- 验证码按钮 -->
				<view class="code-btn" :class="{ disabled: countdown > 0 || !isPhoneValid }" @click="getCode">
					{{ countdown > 0 ? `${countdown}S` : '验证码' }}
				</view>
			</view>
		</view>

		<!-- 协议勾选 -->
		<view class="agreement">
			<view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
				<text v-if="agreed" class="icon">✓</text>
			</view>
			<text class="agreement-text">
				登录即代表您同意《用户协议》和《隐私政策》，未注册绑定的手机号验证成功后将自动注册
			</text>
		</view>

		<!-- 登录按钮 -->
		<button class="login-btn" :class="{ active: canLogin }" :disabled="!canLogin" @click="handleLogin">
			登录
		</button>
	</view>
</template>

<style lang="scss" scoped>
	.login-page {
		min-height: 100vh;
		background-color: #f7f8fc;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	/* 头部样式 */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 80rpx 0 0;

		.title-group {
			display: flex;
			flex-direction: column;
			gap: 16rpx;

			.main-title {
				font-family: PingFang SC;
				font-weight: 500;
				font-style: Medium;
				font-size: 56rpx;
				leading-trim: NONE;
				line-height: 100%;
				letter-spacing: 0%;
				color: rgba(0, 0, 0, 1);
			}

			.sub-title {
				font-family: PingFang SC;
				font-weight: 500;
				font-style: Medium;
				font-size: 50rpx;
				leading-trim: NONE;
				line-height: 100%;
				letter-spacing: 0%;
				color: rgba(0, 0, 0, 1);
			}
		}

		.header-img {
			width: 382rpx;
			height: 382rpx;
			transform: rotate(372deg);
		}
	}

	/* 表单样式 */
	.form {
		display: flex;
		flex-direction: column;
		gap: 32rpx;
		margin-bottom: 60rpx;

		.input-group {
			display: flex;
			flex-direction: column;
			gap: 16rpx;

			.label {
				font-family: PingFang SC;
				font-weight: 500;
				font-style: Medium;
				font-size: 32rpx;
				color: rgba(0, 0, 0, 1);
			}

			.input {
				width: 100%;
				height: 88rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
				border-radius: 24rpx;
				padding: 0 24rpx;
				font-size: 30rpx;
				color: #1a1a1a;
				box-sizing: border-box;
			}
		}

		.code-group {
			position: relative;

			.code-input {
				padding-right: 180rpx;
			}

			/* 分隔线 */
			.divider {
				position: absolute;
				right: 140rpx;
				top: 70%;
				transform: translateY(-50%);
				width: 1rpx;
				height: 40rpx;
				background-color: #e5e5e5;
			}

			.code-btn {
				position: absolute;
				right: 24rpx;
				top: 70%;
				transform: translateY(-50%);
				font-size: 28rpx;
				color: #ffd33d;
				transition: color 0.3s;

				&.disabled {
					color: #999999;
				}
			}
		}
	}

	/* 协议勾选 */
	.agreement {
		display: flex;
		align-items: flex-start;
		gap: 16rpx;
		margin-bottom: 80rpx;

		.checkbox {
			width: 32rpx;
			height: 32rpx;
			border: 2rpx solid #cccccc;
			border-radius: 50%;
			margin-top: 4rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			transition: all 0.3s;

			&.checked {
				background-color: #ffd33d;
				border-color: #ffd33d;

				.icon {
					color: #ffffff;
					font-size: 20rpx;
					font-weight: bold;
				}
			}
		}

		.agreement-text {
			font-size: 24rpx;
			color: #333333;
			line-height: 1.6;
			text-align: left;
		}
	}

	/* 登录按钮 */
	.login-btn {
		width: 100%;
		height: 88rpx;
		border-radius: 16rpx;
		font-size: 32rpx;
		font-weight: 500;
		border: none;
		background-color: #f0f0f0;
		color: #1a1a1a;
		transition: all 0.3s ease;

		&.active {
			background-color: #ffd33d;
			color: #1a1a1a;
		}

		&:disabled {
			opacity: 1;
		}
	}
</style>