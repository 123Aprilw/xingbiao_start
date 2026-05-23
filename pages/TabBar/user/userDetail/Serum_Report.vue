<template>
	<view class="report-page">
		<!-- 自定义导航栏 -->
		<view class="navbar">
			<view class="navbar-back" @click="goBack">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="navbar-title">学情报告</view>
			<view class="navbar-placeholder"></view>
		</view>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 周报统计卡片 -->
			<view class="report-card">
				<view class="card-header">
					<view class="header-left">
						<view class="yellow-mark"></view>
						<text class="header-title">周报统计</text>
					</view>
					<text class="header-date">2026年5月04日-2026年5月10日</text>
				</view>

				<view class="stats-grid">
					<view class="stat-item">
						<view class="stat-number-row">
							<text class="stat-number">0</text>
							<text class="stat-label">本</text>
						</view>
						<text class="stat-desc">阅读完本</text>
					</view>
					<view class="stat-item">
						<view class="stat-number-row">
							<text class="stat-number">0</text>
							<text class="stat-label">本</text>
						</view>
						<text class="stat-desc">配音完成</text>
					</view>
					<view class="stat-item">
						<view class="stat-number-row">
							<text class="stat-number">0</text>
							<text class="stat-label">分</text>
						</view>
						<text class="stat-desc">配音平均分</text>
					</view>
					<view class="stat-item">
						<view class="stat-number-row">
							<text class="stat-number">0</text>
							<text class="stat-label">本</text>
						</view>
						<text class="stat-desc">收藏绘本</text>
					</view>
					<view class="stat-item">
						<view class="stat-number-row">
							<text class="stat-number">0</text>
							<text class="stat-label">道</text>
						</view>
						<text class="stat-desc">答题数</text>
					</view>
					<view class="stat-item">
						<view class="stat-number-row">
							<text class="stat-number">0</text>
							<text class="stat-label">%</text>
						</view>
						<text class="stat-desc">答题正确率</text>
					</view>
				</view>
			</view>

			<view class="tip-text">本周学习AA级，下周试试A级吧</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { StudyData } from '@/utils/api.ts'
	interface listTs {
		id : number,
		read_finish_num : number,
		dub_finish_num : number,
		dub_avg_score : number,
		collect_num : number,
		answer_num : number,
		answer_correct_rate : number,
		start_time : number,
		end_time : number,
		date_range : string
	}
	interface ApiTs {
		list : listTs[]
		last_id : number
	}
	//渲染
	const FethApply = async () => {
		try {
			const res = await StudyData('1')
			console.log(res)
		} catch (err) {
			console.log(err)
		}
	}
	onShow(() => {
		FethApply()
	})
	// 返回上一页逻辑
	const goBack = () => {
		uni.navigateBack({
			fail: () => {
				// 无历史页面时跳转到首页（根据你的项目路径修改）
				uni.switchTab({ url: '/pages/index/index' })
			}
		})
	}
</script>

<style lang="scss" scoped>
	.report-page {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;

		// 导航栏样式
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

		// 主体内容区域
		.content {
			flex: 1;
			padding: 32rpx;

			// 周报卡片
			.report-card {
				background-color: #fff;
				border-radius: 24rpx;
				padding: 32rpx;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
				position: relative;
				overflow: hidden;

				// 卡片淡金色装饰（和UI中的黄色圆点对应）
				&::before,
				&::after {
					content: '';
					position: absolute;
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					background: radial-gradient(544.93% 125.36% at 50.15% 70.76%, #FFFFFF 0%, #FADA40 100%)
						/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */
					;

					z-index: 0;
				}

				&::before {
					top: -50rpx;
					right: -50rpx;
				}

				&::after {
					bottom: -50rpx;
					left: -50rpx;
				}

				// 卡片头部
				.card-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 48rpx;
					position: relative;
					z-index: 1;

					.header-left {
						display: flex;
						align-items: center;

						.yellow-mark {
							width: 8rpx;
							height: 32rpx;
							background-color: #ffd33d;
							border-radius: 4rpx;
							margin-right: 16rpx;
						}

						.header-title {
							font-size: 32rpx;
							font-weight: 600;
							color: #333;
						}
					}

					.header-date {
						font-size: 26rpx;
						color: #999;
					}
				}

				// 统计数据网格
				.stats-grid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 40rpx 20rpx;
					position: relative;
					z-index: 1;

					.stat-item {
						display: flex;
						flex-direction: column;
						align-items: center;

						.stat-number-row {
							display: flex;
							align-items: baseline;
							margin-bottom: 8rpx;

							.stat-number {
								font-size: 48rpx;
								font-weight: 700;
								color: #333;
								line-height: 1;
							}

							.stat-label {
								font-size: 28rpx;
								color: #333;
								margin-left: 4rpx;
							}
						}

						.stat-desc {
							font-size: 26rpx;
							color: #666;
						}
					}
				}
			}

			// 底部提示文字
			.tip-text {
				margin-top: 32rpx;
				text-align: center;
				font-size: 28rpx;
				color: #666;
			}
		}
	}
</style>