<template>
	<view class="error-practice-page">
		<!-- 自定义导航栏（和之前页面完全复用） -->
		<view class="navbar">
			<view class="navbar-back" @click="goBack">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="navbar-title">错题重练</view>
			<view class="navbar-placeholder"></view>
		</view>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 空状态：无错题时显示（图片已预留位置） -->
			<view class="empty-state" v-if="errorList.length === 0">
				<view class="empty-placeholder">
					<image class="empty-image" src="/static/xingxing.png" mode="aspectFit" />
				</view>
				<text class="empty-text">您还没有错题哦～</text>
			</view>

			<!-- 错题列表：有数据时显示 -->
			<view class="error-list" v-else>
				<view class="error-item" v-for="(item, index) in errorList" :key="index">
					<view class="top">
						<view class="top_left">
							<view class="imgs">
								<image src="/static/cuoti.png" mode=""></image>
							</view>
							<view class="world">
								<text class="world_top">{{item.type}}</text>
								<text>{{item.bookName}}</text>
							</view>
						</view>
						<view class="top_right">
							错题重练
						</view>
					</view>
					<view class="bottom">
						<view class="bottom_left">{{item.desc}}</view>
						<view class="bottom_right">
							<text>展开</text>
							<view class="imgs_select">
								<image src="/static/bottom.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	// 错题列表数据（初始为空数组，测试空状态时无需修改）
	const errorList = ref([
		// 示例数据，测试列表时打开，空状态时注释掉
		{
			icon: '/static/word-icon.png', // 图标预留地址
			type: 'Word/看词',
			bookName: 'AT the Lake',
			desc: 'This dock.'
		}
	])

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 展开按钮点击事件（预留业务逻辑）
	const handleExpand = (item : any) => {
		console.log('展开错题详情:', item)
	}
</script>

<style lang="scss" scoped>
	.error-practice-page {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;

		// 导航栏（和绘本收藏/阅读记录页完全一致）
		.navbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 88rpx;
			padding: 88rpx 32rpx 50rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #eee;
			flex-shrink: 0;

			.navbar-back {
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

			.navbar-title {
				font-size: 34rpx;
				font-weight: 500;
				color: #333;
			}

			.navbar-placeholder {
				width: 48rpx;
			}
		}

		// 主体内容区域（默认正常流，不影响列表）
		.content {
			margin-top: 28rpx;
			display: flex;
			justify-content: center;
			flex: 1;
			position: relative; // 给空状态定位用
		}

		// ✅ 空状态：绝对定位居中，和绘本收藏页保持一致
		.empty-state {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;

			.empty-placeholder {
				margin-bottom: 32rpx;

				.empty-image {
					width: 300rpx;
					height: 300rpx;
				}
			}

			.empty-text {
				font-size: 28rpx;
				color: #999;
			}
		}

		// 错题列表
		.error-list {
			display: flex;
			flex-direction: column;
			gap: 20rpx;

			// 错题项卡片（和绘本卡片风格统一）
			.error-item {
				width: 710rpx;
				height: 180rpx;
				border-radius: 24rpx;
				padding: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				background: rgba(255, 255, 255, 1);
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);


				.top {
					width: 100%;
					display: flex;
					justify-content: space-between;

					.top_left {
						display: flex;
						align-items: center;
						gap: 20rpx;

						.imgs {
							width: 88rpx;
							height: 88rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.world {
							display: flex;
							flex-direction: column;

							.world_top {
								font-family: PingFang SC;
								font-weight: 500;
								font-style: Medium;
								font-size: 32rpx;
								color: rgba(0, 0, 0, 1);
							}

							text {
								font-family: PingFang SC;
								font-weight: 400;
								font-style: Regular;
								font-size: 24rpx;
								color: rgba(0, 0, 0, 0.85);
							}
						}
					}

					.top_right {
						font-family: PingFang SC;
						font-weight: 500;
						font-style: Medium;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 1);
					}
				}

				.bottom {
					width: 100%;
					display: flex;
					justify-content: space-between;

					.bottom_left {
						display: flex;
						align-items: center;
						justify-content: center;
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 24rpx;
						color: rgba(0, 0, 0, 0.5);
					}

					.bottom_right {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 8rpx;

						.imgs_select {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 20rpx;
							height: 20rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						text {
							font-family: PingFang SC;
							font-weight: 400;
							font-style: Regular;
							font-size: 20rpx;
							color: rgba(0, 0, 0, 0.45);
						}
					}
				}
			}
		}
	}
</style>