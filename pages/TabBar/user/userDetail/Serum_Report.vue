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
			<!-- 周报统计卡片列表（虚拟列表） -->
			<view class="report-list">
				<view class="report-card" v-for="(item, index) in reportList" :key="index">
					<view class="card-header">
						<view class="header-left">
							<view class="yellow-mark"></view>
							<text class="header-title">周报统计</text>
						</view>
						<text class="header-date">{{ item.date_range }}</text>
					</view>

					<view class="stats-grid">
						<view class="stat-item">
							<view class="stat-number-row">
								<text class="stat-number">{{ item.read_finish_num }}</text>
								<text class="stat-label">本</text>
							</view>
							<text class="stat-desc">阅读完本</text>
						</view>
						<view class="stat-item">
							<view class="stat-number-row">
								<text class="stat-number">{{ item.dub_finish_num }}</text>
								<text class="stat-label">本</text>
							</view>
							<text class="stat-desc">配音完成</text>
						</view>
						<view class="stat-item">
							<view class="stat-number-row">
								<text class="stat-number">{{ item.dub_avg_score }}</text>
								<text class="stat-label">分</text>
							</view>
							<text class="stat-desc">配音平均分</text>
						</view>
						<view class="stat-item">
							<view class="stat-number-row">
								<text class="stat-number">{{ item.collect_num }}</text>
								<text class="stat-label">本</text>
							</view>
							<text class="stat-desc">收藏绘本</text>
						</view>
						<view class="stat-item">
							<view class="stat-number-row">
								<text class="stat-number">{{ item.answer_num }}</text>
								<text class="stat-label">道</text>
							</view>
							<text class="stat-desc">答题数</text>
						</view>
						<view class="stat-item">
							<view class="stat-number-row">
								<text class="stat-number">{{ item.answer_correct_rate }}</text>
								<text class="stat-label">%</text>
							</view>
							<text class="stat-desc">答题正确率</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多提示 -->
			<view class="loading-tip" v-if="isLoading">加载中...</view>
			<view class="loading-tip" v-if="noMore">没有更多数据了</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { StudyData } from '@/utils/api.ts'
	import { onShow, onReachBottom } from '@dcloudio/uni-app'
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

	// 数据列表
	const reportList = ref<listTs[]>([])
	// 分页参数
	const lastId = ref<string>('0')
	// 加载状态
	const isLoading = ref(false)
	const noMore = ref(false)

	// 加载数据（根据 last_id 分页）
	const FethApply = async () => {
		if (isLoading.value || noMore.value) return
		isLoading.value = true

		try {
			// ✅ 这里必须加 .data！！！
			const res = await StudyData(lastId.value)
			const data = res.data // 👈 关键修复

			if (data?.list && data.list.length > 0) {
				reportList.value.push(...data.list)
				lastId.value = String(data.last_id)
			} else {
				noMore.value = true
			}
		} catch (err) {
			console.error('获取数据失败：', err)
		} finally {
			isLoading.value = false
		}
	}

	// 下拉刷新（可选）
	const refresh = async () => {
		reportList.value = []
		lastId.value = '0'
		noMore.value = false
		await FethApply()
	}

	onShow(() => {
		refresh()
	})

	// 触底加载更多
	onReachBottom(() => {
		FethApply()
	})

	// 返回上一页逻辑
	const goBack = () => {
		uni.navigateBack({
			fail: () => {
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

			.report-list {
				display: flex;
				flex-direction: column;
				gap: 24rpx;
			}

			// 周报卡片
			.report-card {
				background-color: #fff;
				border-radius: 24rpx;
				padding: 32rpx;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
				position: relative;
				overflow: hidden;

				&::before,
				&::after {
					content: '';
					position: absolute;
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					background: radial-gradient(544.93% 125.36% at 50.15% 70.76%, #FFFFFF 0%, #FADA40 100%);
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

			.tip-text {
				margin-top: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-family: PingFang SC;
				font-weight: 400;
				font-style: Regular;
				font-size: 24rpx;
				leading-trim: NONE;
				line-height: 100%;
				letter-spacing: 0%;
				text-align: center;
				color: rgba(0, 0, 0, 0.65);
			}

			.loading-tip {
				text-align: center;
				font-size: 28rpx;
				color: #999;
				margin-top: 32rpx;
			}
		}
	}
</style>