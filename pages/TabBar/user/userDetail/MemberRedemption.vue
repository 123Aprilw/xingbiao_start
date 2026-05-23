<template>
	<view class="exchange-page">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="nav-title">会员兑换</view>
			<view class="">
				
			</view>
		</view>

		<!-- 兑换码输入框 -->
		<view class="input-section">
			<input class="exchange-input" placeholder="请输入兑换码" v-model="exchangeCode" confirm-type="done" />
		</view>

		<!-- 权益说明卡片 -->
		<view class="info-card">
			<view class="card-title">兑换分级会员权益：</view>
			<view class="card-content" style="margin-bottom: 20rpx;">
				<text class="content-item">1.录音打分功能，免费体验一个月。</text>
				<text class="content-item">2.听读练习功能，永久免费使用。</text>
			</view>
			<!-- 激活方式卡片 -->
			<view class="info-card" style="margin: 0;padding: 0;">
				<view class="card-title">激活方式：</view>
				<view class="card-content">
					<text class="content-item">收货后，自行登录APP，在APP右下角点击我的-会员兑换-复制购物平台绘本对应的订单编号可激活使用。绘本激活的是对应级别的资源</text>
					<text class="content-item">《我的》页面会员部分显示不会有变化以具体使用权益为准。</text>
				</view>
			</view>
			
		</view>
		<!-- 激活问题卡片 -->
		<view class="info-card">
			<view class="card-title">激活问题：</view>
			<view class="card-content">
				<text class="content-item">1.兑换时提示订单号不存在？请确认平台订单是否包含APP资源的规格</text>
				<text class="content-item">2.如果还是不存在，请点击右下角客服图标联系APP客服提供信息激活。</text>
			</view>
		</view>

		<!-- 底部兑换按钮 -->
		<view class="btn-container">
			<button class="exchange-btn" @click="handleExchange">兑换</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	// 兑换码绑定
	const exchangeCode = ref('')

	// 返回上一页
	const goBack = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	// 兑换按钮逻辑
	const handleExchange = () => {
		if (!exchangeCode.value.trim()) {
			uni.showToast({
				title: '请输入兑换码',
				icon: 'none'
			})
			return
		}
		// 这里可以写你的兑换接口逻辑
		uni.showToast({
			title: '兑换请求已提交',
			icon: 'loading'
		})
	}
</script>

<style lang="scss" scoped>
	.exchange-page {
		min-height: 100vh;
		background-color: #f8f9fa;
		// 适配底部安全区，避免按钮被遮挡
		padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);

		// 导航栏样式
		.nav-bar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 88rpx;
			background-color: #ffffff;
			padding: 88rpx 30rpx 50rpx;
			position: relative;
			.back-btn {
				width: 30rpx;
				height: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.nav-title {
				position: absolute;
				left: 50%;
				top: 65%;
				transform: translate(-50%, -50%);
				font-size: 34rpx;
				font-weight: 500;
				color: #333333;
			}
		}

		// 输入框区域
		.input-section {
			padding: 30rpx;

			.exchange-input {
				width: 100%;
				height: 88rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 24rpx;
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
				border-radius: 16rpx;
				padding: 0 30rpx;
				font-size: 28rpx;
				color: #333333;

				&::placeholder {
					color: #999999;
				}
			}
		}

		// 信息卡片通用样式
		.info-card {
			margin: 0 30rpx 20rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 30rpx;

			.card-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #1a1a1a;
				margin-bottom: 20rpx;
			}

			.card-content {
				font-size: 28rpx;
				color: #666666;
				line-height: 1.6;

				.content-item {
					display: block;
					margin-bottom: 12rpx;

					&:last-child {
						margin-bottom: 0;
					}
				}
			}
		}

		// 底部按钮容器
		.btn-container {
			position: fixed;
			bottom: calc(env(safe-area-inset-bottom) + 40rpx);
			left: 30rpx;
			right: 30rpx;

			.exchange-btn {
				width: 100%;
				height: 88rpx;
				background-color: #ffd100;
				border: none;
				border-radius: 16rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>