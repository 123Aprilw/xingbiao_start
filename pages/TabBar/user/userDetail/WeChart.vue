<template>
	<view class="page-container">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-back" @click="handleBack">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="navbar-title">微信客服</view>
			<view class="navbar-placeholder"></view>
		</view>

		<!-- 主体内容区域 -->
		<view class="main-content">
			<!-- 客服卡片 -->
			<view class="service-card">
				<!-- 头像区域（带黄色背景突出效果） -->
				<view class="avatar-wrapper">
					<view class="avatar-border">
						<!-- 头像图片位置，替换为你的头像 -->
						<image src="/static/customer-avatar.png" class="avatar-img" mode="aspectFill" />
					</view>
				</view>

				<!-- 提示文字 -->
				<view class="card-text">有任何问题请联系我们</view>

				<!-- 虚线分割线 -->
				<view class="divider-line"></view>

				<!-- 二维码区域 -->
				<view class="qrcode-wrapper">
					<view class="qrcode-box">
						<!-- 二维码图片位置，替换为你的微信二维码 -->
						<image src="/static/wechat-qrcode.png" class="qrcode-img" mode="aspectFit" />
						<!-- 中间微信图标占位（可选，可删除） -->
						<view class="wechat-icon">
							<text>💬</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 下载按钮 -->
			<view class="download-btn" @click="handleDownload">
				下载二维码
			</view>
		</view>
	</view>
</template>

<script setup>
	// 返回上一页
	const handleBack = () => {
		uni.navigateBack();
	};

	// 下载二维码（示例逻辑，可根据需求实现）
	const handleDownload = () => {
		uni.showToast({
			title: '下载功能待实现',
			icon: 'none'
		});
	};
</script>

<style lang="scss" scoped>
	// 全局变量（可根据截图调整颜色）
	$primary-yellow: #ffd100;
	$card-white: #ffffff;
	$text-color: #333333;
	$border-color: #eeeeee;

	.page-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
	}

	// 导航栏样式
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 44px;
		padding:88rpx 15px 50rpx;
		border-bottom: 1px solid $border-color;
		background-color: #ffd100;

		.back-icon {
			font-size: 18px;
			color: $text-color;
			font-weight: bold;
		}

		.navbar-title {
			font-size: 17px;
			font-weight: 500;
			color: $text-color;
		}

		.navbar-placeholder {
			width: 30px;
		}

		.navbar-back {
			width: 32rpx;
			height: 32rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	// 主体内容
	.main-content {
		flex: 1;
		background-color: $primary-yellow;
		padding: 40px 30px 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	// 客服卡片
	.service-card {
		width: 100%;
		background-color: $card-white;
		border-radius: 16px;
		padding: 40px 20px 30px;
		box-sizing: border-box;
		position: relative;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

		// 卡片左右缺口（黄色背景填充）
		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 20px;
			height: 20px;
			background-color: $primary-yellow;
			border-radius: 50%;
			top: 120px; // 根据卡片高度调整位置
		}

		&::before {
			left: -10px;
		}

		&::after {
			right: -10px;
		}

		// 头像区域
		.avatar-wrapper {
			position: absolute;
			top: -40px;
			left: 50%;
			transform: translateX(-50%);
			width: 80px;
			height: 80px;
			background-color: #fff9cc; // 头像外框黄色背景
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.avatar-border {
				width: 70px;
				height: 70px;
				border-radius: 50%;
				overflow: hidden;
				border: 2px solid $card-white;

				.avatar-img {
					width: 100%;
					height: 100%;
				}
			}
		}

		// 提示文字
		.card-text {
			text-align: center;
			font-size: 17px;
			color: $text-color;
			margin-top: 20px;
			font-weight: 500;
		}

		// 虚线分割线
		.divider-line {
			width: 100%;
			height: 1px;
			background: repeating-linear-gradient(90deg,
					$border-color,
					$border-color 4px,
					transparent 4px,
					transparent 8px);
			margin: 20px 0;
		}

		// 二维码区域
		.qrcode-wrapper {
			display: flex;
			justify-content: center;

			.qrcode-box {
				width: 240px;
				height: 240px;
				background-color: $card-white;
				border-radius: 12px;
				padding: 10px;
				box-sizing: border-box;
				position: relative;
				overflow: hidden;

				.qrcode-img {
					width: 100%;
					height: 100%;
				}

				// 中间微信图标（可选，可删除）
				.wechat-icon {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 60px;
					height: 60px;
					background-color: #000000;
					border-radius: 8px;
					display: flex;
					align-items: center;
					justify-content: center;

					text {
						color: #ffffff;
						font-size: 30px;
					}
				}
			}
		}
	}

	// 下载按钮
	.download-btn {
		margin-top: 30px;
		width: 100%;
		height: 50px;
		background-color: $card-white;
		border-radius: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: $text-color;
		font-weight: 500;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}
</style>