<template>
	<view class="level-table-page">
		<!-- 自定义导航栏 -->
		<view class="navbar">
			<view class="navbar-back" @click="goBack">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="navbar-title">等级对照表</view>
			<view class="navbar-placeholder"></view>
		</view>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 顶部标题卡片 -->
			<view class="header-card">
				<text class="header-title">等级对照表</text>
				<!-- ✅ 修改后的表头：完全还原图片结构 -->
				<view class="table-header">
					<!-- 左侧：跨行合并的“级别”列 -->
					<view class="left-col">
						<text>级别</text>
					</view>
					<!-- 右侧：两行结构 -->
					<view class="right-col">
						<view class="right-row1">
							<text>孩子在</text>
						</view>
						<view class="right-row2">
							<view class="right-col-item">
								<text>一年级开始学英语</text>
							</view>
							<view class="right-col-item">
								<text>三年级开始学英语</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 等级列表（保持不变） -->
			<view class="table-list">
				<view class="list-item" v-for="(item, index) in levelList" :key="index"
					:class="{ 'card-item': index % 2 === 0 }">
					<view class="col level-col">{{ item?.level }}</view>
					<view class="col">{{ item?.start_one }}</view>
					<view class="col">{{ item?.start_three }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { ConsifmLever } from '@/utils/api.ts'
	interface leverTs {
		level : string,
		start_one : string,
		start_three : string
	}
	// 示例等级数据（保持不变）
	const levelList = ref<leverTs[]>([])
	//渲染数据
	const fetchLever = async () => {
		try {
			const res = await ConsifmLever()
			levelList.value = res.data
		} catch (err) {
			console.log(err)
		}
	}
	// 返回上一页（保持不变）
	const goBack = () => {
		uni.navigateBack()
	}
	onShow(() => {
		fetchLever()
	})
</script>

<style lang="scss" scoped>
	.level-table-page {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;

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

		.content {
			flex: 1;
			padding: 32rpx;

			.header-card {
				padding-top: 20rpx;
				margin-bottom: 14rpx;
				width: 690rpx;
				height: 232rpx;
				border-radius: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 30rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);


				.header-title {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
				}
			}

			// ✅ 重写后的表头样式，1:1还原图片
			.table-header {
				width: 100%;
				display: flex;
				background-color: #fff9e6;
				border: 1rpx solid #ffd33d;
				border-bottom-left-radius: 24rpx;
				border-bottom-right-radius: 24rpx;
				overflow: hidden;
				height: 200rpx; // 表头整体高度，和图片比例一致

				// 左侧“级别”列（跨行合并）
				.left-col {
					width: 130rpx;
					height: 138rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-right: 1rpx solid #ffd33d;

					text {
						font-family: PingFang SC;
						font-weight: 500;
						font-style: Medium;
						font-size: 28rpx;
						leading-trim: NONE;
						line-height: 100%;
						letter-spacing: 0%;
						text-align: center;
						color: rgba(254, 179, 67, 1);
					}
				}

				// 右侧容器（两行结构）
				.right-col {
					flex: 2;
					display: flex;
					flex-direction: column;

					// 右侧第一行：孩子在
					.right-row1 {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: center;
						border-bottom: 1rpx solid #ffd33d;

						text {
							font-family: PingFang SC;
							font-weight: 500;
							font-style: Medium;
							font-size: 28rpx;
							leading-trim: NONE;
							line-height: 100%;
							letter-spacing: 0%;
							text-align: center;
							color: rgba(254, 179, 67, 1);
						}
					}

					// 右侧第二行：两个列
					.right-row2 {
						flex: 1;
						display: flex;

						.right-col-item {
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: center;
							border-right: 1rpx solid #ffd33d;

							&:last-child {
								border-right: none;
							}

							text {
								font-family: PingFang SC;
								font-weight: 600;
								font-style: Semibold;
								font-size: 28rpx;
								leading-trim: NONE;
								line-height: 100%;
								letter-spacing: 0%;
								text-align: center;
								color: rgba(254, 179, 67, 1);
							}
						}
					}
				}
			}

			.table-list {
				display: flex;
				flex-direction: column;
				gap: 12rpx;

				.list-item {
					display: flex;
					align-items: center;
					padding: 20rpx;

					&.card-item {
						background-color: #fff;
						border-radius: 16rpx;
						padding: 20rpx;
						box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
					}

					.col {
						flex: 1;
						text-align: center;
						font-size: 28rpx;
						color: #333;

						&.level-col {
							font-weight: 600;
						}
					}
				}
			}
		}
	}
</style>