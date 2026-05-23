<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	let Id = ref<number>(null)
	let isType = ref<number>(null)
	let leverList = ref()
	const goDetail = () => {
		uni.navigateTo({
			url: `/pages/BooksDetail/Books?id=${Number(Id.value)}&lever=${leverList.value}`
		})
	}
	onLoad((e) => {
		console.log(e.lever)
		leverList.value = e.lever
		Id.value = e.id
		isType.value = Number(e.type)
	})
	onMounted(() => {
		// 页面加载后自动触发所有CSS动画
	})
</script>

<template>
	<view class="Bones-contair">
		<!-- 顶部动画区域 -->
		<view class="top-area">
			<!-- 左侧2个装饰元素 -->
			<view class="decoration left-item-1"></view>
			<view class="decoration left-item-2">
				<image src="/static/lettop.png" mode="aspectFit" />
			</view>

			<!-- 中间奖杯 -->
			<view class="trophy">
				<image src="/static/cap.png" mode="aspectFit" />
			</view>

			<!-- 右侧3个装饰元素 -->
			<view class="decoration right-item-1">
				<image src="/static/righttop.png" mode="aspectFit" />
			</view>
			<view class="decoration right-item-2">
				<image src="/static/rightcenter.png" mode="aspectFit" />
			</view>
			<view class="decoration right-item-3">
				<image src="/static/rightbottom.png" mode="aspectFit" />
			</view>

			<!-- 文字 -->
			<view class="text">
				恭喜您完成{{isType===1?'学习听':isType===2?'学习单词':isType===3?'学习读':isType===4?'看词识图':isType===5?'看图识词':isType===6?'看词翻译':'中英语匹配'}}学习
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="btn" @click="goDetail">
			返回继续学习
		</view>
	</view>
</template>

<style scoped lang="scss">
	.Bones-contair {
		margin-top: 300rpx;
		width: 750rpx;
		min-height: 100vh;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		/* 给底部按钮留出空间 */

		.left-Bones {
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			width: 32rpx;
			height: 32rpx;
			z-index: 10;

			image {
				width: 100%;
				height: 100%;
			}
		}

		/* 顶部动画区域 */
		.top-area {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 100rpx;
			/* 从顶部开始布局 */
			position: relative;
		}

		/* 装饰元素基础样式 */
		.decoration {
			position: absolute;
			opacity: 0;

			image {
				width: 100%;
				height: 100%;
			}
		}

		/* -------------------------- */
		/* 左侧两个元素，位置适配顶部区域 */
		/* -------------------------- */
		.left-item-1 {
			width: 310rpx;
			height: 68rpx;
			border-radius: 100rpx;
			top: 420rpx;
			/* 上移到顶部区域 */
			left: -250rpx;
			transform: rotate(160deg);
			background: linear-gradient(90deg, #FA6300 0%, #FA505F 100%);
			animation: slideInLeft1 1s ease-out forwards;
			animation-delay: 0.1s;
		}

		.left-item-2 {
			width: 54rpx;
			height: 54rpx;
			border-radius: 50%;
			background: rgba(58, 232, 244, 1);
			top: 150rpx;
			/* 上移到顶部区域 */
			left: -80rpx;
			animation: slideInLeft2 1s ease-out forwards;
			animation-delay: 0.3s;
		}

		/* -------------------------- */
		/* 右侧三个元素，位置适配顶部区域 */
		/* -------------------------- */
		.right-item-1 {
			width: 240rpx;
			height: 80rpx;
			top: 50rpx;
			/* 上移到顶部区域 */
			right: -240rpx;
			animation: slideInRight1 1s ease-out forwards;
			animation-delay: 0.2s;
		}

		.right-item-2 {
			width: 310rpx;
			height: 68rpx;
			top: 240rpx;
			/* 上移到顶部区域 */
			right: -300rpx;
			transform: rotate(160deg);
			border-radius: 100rpx;
			background: linear-gradient(90deg, #3AE3F2 0%, #33E4F2 100%);
			animation: slideInRight2 1s ease-out forwards;
			animation-delay: 0.4s;
		}

		.right-item-3 {
			width: 54rpx;
			height: 54rpx;
			border-radius: 50%;
			background: linear-gradient(180deg, #3AE8F4 0%, #74FEC6 100%);
			top: 400rpx;
			/* 上移到顶部区域 */
			right: -120rpx;
			animation: slideInRight3 1s ease-out forwards;
			animation-delay: 0.5s;
		}

		/* 中间奖杯：上移到顶部区域 */
		.trophy {
			width: 316rpx;
			height: 356rpx;
			opacity: 0;
			animation: trophyAppear 1.2s ease-out forwards;
			animation-delay: 0.6s;
			margin-top: 40rpx;
			/* 上移 */

			image {
				width: 100%;
				height: 100%;
			}
		}

		/* 文字：上移到奖杯下方 */
		.text {
			margin-top: 40rpx;
			font-size: 48rpx;
			background: linear-gradient(89.11deg, #FD51FF 0%, #949AF2 38.34%, #24EFE0 64.93%, #39F6B1 83.33%, #DFF561 106.34%);
			font-weight: 600;
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			opacity: 0;
			animation: fadeIn 1.2s ease-out forwards;
			animation-delay: 0.8s;
		}

		/* 底部按钮：固定在页面底部 */
		.btn {
			position: fixed;
			bottom: 250rpx;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			justify-content: center;
			align-items: center;
			width: 528rpx;
			height: 100rpx;
			box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 28rpx;
			color: rgba(0, 0, 0, 1);
			border-radius: 50rpx;
			background: rgba(250, 218, 64, 1);
			z-index: 10;
		}

		/* -------------------------- */
		/* 关键帧动画定义 */
		/* -------------------------- */
		@keyframes slideInLeft1 {
			from {
				left: -240rpx;
				opacity: 0;
			}

			to {
				left: -120rpx;
				opacity: 1;
			}
		}

		@keyframes slideInLeft2 {
			from {
				left: -80rpx;
				opacity: 0;
			}

			to {
				left: 80rpx;
				opacity: 1;
			}
		}

		@keyframes slideInRight1 {
			from {
				right: -240rpx;
				opacity: 0;
			}

			to {
				right: 120rpx;
				opacity: 1;
			}
		}

		@keyframes slideInRight2 {
			from {
				right: -300rpx;
				opacity: 0;
			}

			to {
				right: -100rpx;
				opacity: 1;
			}
		}

		@keyframes slideInRight3 {
			from {
				right: -200rpx;
				opacity: 0;
			}

			to {
				right: 120rpx;
				opacity: 1;
			}
		}

		@keyframes trophyAppear {
			from {
				opacity: 0;
				transform: scale(0.5) rotate(-10deg);
			}

			to {
				opacity: 1;
				transform: scale(1) rotate(0deg);
			}
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
			}

			to {
				opacity: 1;
			}
		}
	}
</style>