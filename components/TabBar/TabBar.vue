<template>
	<view class="tab-bar">
		<view v-for="(item, index) in tabList" :key="index" class="tab-item" :class="{ active: current === index }"
			@tap="switchTab(index)">
			<image :src="current === index ? item.selectedIcon : item.icon" class="tab-icon" />
			<text class="tab-text" :class="{ActiveText:current===index}">{{ item.text }}</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const props = defineProps({
		current: {
			type: Number,
			default: 0
		}
	})

	const emit = defineEmits(['change'])
	const tabList = ref([{
			pagePath: '/pages/TabBar/home/home',
			text: '首页',
			icon: '/static/homemo.png',
			selectedIcon: '/static/home.png'
		},
		{
			pagePath: '/pages/TabBar/punch/punch',
			text: '打卡',
			icon: '/static/card.png',
			selectedIcon: '/static/ActiveCard.png'
		},
		{
			pagePath: '/pages/TabBar/user/user',
			text: '我的',
			icon: '/static/main.png',
			selectedIcon: '/static/main_active.png'
		}
	])

	const switchTab = (index) => {
		emit('change', index)
		uni.switchTab({
			url: tabList.value[index].pagePath
		})
	}
</script>

<style scoped lang="scss">
	.tab-bar {
		margin: 0 20rpx;
		padding: 0 15rpx;
		position: fixed;
		bottom: 20rpx;
		left: 0;
		right: 0;
		height: 120rpx;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(10px);
		box-shadow: 0 -2px 14px 0 rgba(120, 120, 120, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 999;
		box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
		border-radius: 50rpx;
	}

	.tab-item {
		width: 150rpx;
		padding: 15rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
	}

	.tab-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.tab-text {
		font-family: PingFang SC;
		font-weight: 500;
		font-style: Regular;
		font-size: 20rpx;
		leading-trim: NONE;
		line-height: 100%;
		letter-spacing: 0%;
		text-align: center;
		color: rgba(0, 0, 0, 1);
	}

	.tab-item.active {
		background-color: rgba(255, 255, 255, 0.6);
		box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
		border-radius: 50rpx;
	}

	.tab-item.active .tab-text {
		font-family: PingFang SC;
		font-weight: 500;
		font-style: Medium;
		font-size: 20rpx;
		color: rgba(0, 0, 0, 1);
	}
</style>