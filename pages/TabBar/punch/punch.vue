<script setup lang="ts">
	import { onShow } from '@dcloudio/uni-app'
	import TabBar from '@/components/TabBar/TabBar.vue'
	import Data from '@/components/Data/Data.vue'
	import { GetCardData } from '@/utils/api.ts'
	import { ref, onMounted } from 'vue'
	const cardData = ref()
	const FetchApply = async () => {
		try {
			const res = await GetCardData()
			cardData.value = res.data
		} catch (err) {
			console.log(err)
		}
	}
	onMounted(() => {
		FetchApply()
	})
	onShow(() => {
		uni.hideTabBar({
			animation: false
		})
	})
</script>
<template>
	<view class="puch_contair">
		<view class="bg-item-1"></view>
		<view class="bg-item-2"></view>
		<view class="bg-item-3"></view>
		<view class="puch_top">
			<text>每日打卡</text>
			<view class="data">
				<view class="data_nums">
					<text>2</text>
					<text class="day">天打卡</text>
				</view>
				<view class="logo">
					<image src="/static/logonew.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="main">
			<Data :DateTitle='cardData?.month' :sign='cardData?.signRecord' />
		</view>
		<TabBar :current="1" />
	</view>
</template>
<style lang="scss">
	.main {
		width: 100%;
		height: 600rpx;
		position: relative;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(244, 234, 42, 1);
		border-radius: 24rpx;
	}

	.puch_contair {
		width: 750rpx;
		position: relative;

		/* -------------- 第一层：左上角黄色 ---------------- */
		.bg-item-1 {
			position: absolute;
			width: 290px;
			height: 290px;
			left: -142px;
			top: -96px;
			background: rgba(255, 239, 68, 1);
			border-radius: 50%;
			filter: blur(100px);
			transform: rotate(-50deg);
			z-index: 0;
		}

		.bg-item-2 {
			position: absolute;
			width: 287px;
			height: 287px;
			right: -68px;
			top: -123px;
			background: rgba(255, 239, 68, 1);
			border-radius: 50%;
			filter: blur(100px);
			transform: rotate(17deg);
			z-index: 0;
		}

		.puch_top {
			padding-top: 20rpx;
			display: flex;
			flex-direction: column;
			backdrop-filter: blur(0);

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				font-family: PingFang SC;
				font-weight: 500;
				font-style: Medium;
				font-size: 16px;
				leading-trim: NONE;
				line-height: 100%;
				letter-spacing: 0%;
				color: rgba(0, 0, 0, 1);
			}

			.data {
				.data_nums {
					margin-left: 50rpx;
					margin-top: 120rpx;
					float: left;
					display: flex;
					gap: 25rpx;
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 32rpx;
					color: rgba(0, 0, 0, 1);

					text {
						font-family: DIN Alternate;
						font-weight: 700;
						font-style: Bold;
						font-size: 136rpx;
						color: rgba(0, 0, 0, 1);
					}

					.day {
						display: flex;
						align-items: end;
						margin-bottom: 10rpx;
						font-family: PingFang SC;
						font-weight: 500;
						font-style: Medium;
						font-size: 32rpx;
						color: rgba(0, 0, 0, 1);
					}
				}

				.logo {
					float: right;
					width: 382rpx;
					height: 330rpx;
					transform: rotate(7deg);

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>