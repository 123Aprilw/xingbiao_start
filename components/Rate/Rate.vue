<script setup lang="ts">
	import { ref, onBeforeUnmount, watch } from 'vue'
	import Echarts from '@/components/Echarts/Echarts.vue'
	import { PostReadBookData } from '@/utils/api.ts'

	interface PropsTs {
		listen_id : number
		user_id : number
		audio_url : string
		total_score : number
		accuracy : number
		fluency : number
		integrity : number
		detail_json : any
		update_time : number
	}
	interface PropsDetail {
		content : string
		total_score : number
	}

	const Detail_Arr = ref<PropsDetail[]>([])
	const props = defineProps({
		Data: {
			type: Object,
			default: () => ({})
		}
	})

	const emit = defineEmits(['back'])
	const chartVisible = ref(true)
	const rateData = ref<PropsTs>()

	// ==============================================
	// 🔥 核心：判断是否是 VIP
	// ==============================================
	const isVip = ref(uni.getStorageSync('User_Vip') === 1)

	const MemberClick = () => {
		uni.navigateTo({ url: '/pages/member/member' })
	}

	const white_back = () => {
		emit('back', rateData.value?.total_score || 0)
	}

	onBeforeUnmount(() => {
		chartVisible.value = false
	})

	watch(props.Data, (newVal) => {
		if (!newVal) return
		rateData.value = newVal

		// ==============================================
		// 🔥 只有 VIP 才解析分数！非VIP不显示真实分数
		// ==============================================
		if (isVip.value) {
			try {
				Detail_Arr.value = JSON.parse(newVal.detail_json || '[]')
			} catch (e) {
				Detail_Arr.value = []
			}
		} else {
			// 非VIP 清空分数，不展示
			Detail_Arr.value = []
		}
	}, { immediate: true })
</script>

<template>
	<view class="page-wrap">
		<view class="Rate_box">
			<!-- 返回按钮 -->
			<view class="hedaer" @click="white_back">
				<image src="/static/white.png" mode=""></image>
			</view>

			<view class="top">
				<!-- ==============================================
				🔥 只有 VIP 才显示图表！
				=============================================== -->
				<view class="echarts" v-if="isVip">
					<Echarts v-if="chartVisible" :Accuracy='rateData.accuracy' :Fluency='rateData.fluency'
						:Integrity='rateData.integrity' :TotalScore='rateData.total_score' />
				</view>

				<!-- ==============================================
				🔥 非 VIP 显示：请开通会员（不显示图表）
				=============================================== -->
				<view class="no-vip" v-else>
					<text class="tip">开通会员即可查看完整测评报告</text>
					<button class="open-vip" @click="MemberClick">立即开通</button>
				</view>

				<!-- 分数区域 -->
				<view class="ping">
					<text>会员录音后自动打分</text>

					<!-- ==============================================
					🔥 VIP 显示真实分数
					=============================================== -->
					<view class="fraction" v-if="isVip">
						<view class="ction-bottom">
							<text class="all">完整度</text>
							<view class="Big">
								{{ rateData.integrity || 0 }} <text>分</text>
							</view>
						</view>
						<view class="ction-bottom">
							<text class="all">流利度</text>
							<view class="Big">
								{{ rateData.fluency || 0 }} <text>分</text>
							</view>
						</view>
						<view class="ction-bottom">
							<text class="all">准确度</text>
							<view class="Big">
								{{ rateData.accuracy || 0 }} <text>分</text>
							</view>
						</view>
					</view>

					<!-- 单词详情 -->
					<view class="fraction_bottom" v-if="isVip">
						<view class="main_text" v-for="(item,index) in Detail_Arr" :key="index">
							<text>{{ item.content }}</text>
							<text>{{ item.total_score }}</text>
						</view>
					</view>
				</view>

				<!-- 底部按钮 -->
				<view class="list_size" :class="{MemberData:isVip}">
					<view class="out" @click="white_back">取消</view>
					<view class="Member" @click="MemberClick" v-if="!isVip">
						开通会员
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	page {
		margin: 0 !important;
		padding: 0 !important;
		background-color: transparent;
	}

	.page-wrap {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}

	.Rate_box {
		width: 100vw;
		margin: 0;
		position: relative;
	}

	.hedaer {
		position: absolute;
		top: 88rpx;
		left: 20rpx;
		z-index: 10;
		width: 32rpx;
		height: 32rpx;

		image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}

	.top {
		width: 100vw;
		height: 694rpx;
		margin: 0;
		padding: 0rpx 20rpx 0;
		background: linear-gradient(170.8deg, #06B2B5 8.48%, #03C3A3 63.3%, #F5F6FA 93.05%);
		position: absolute;
		top: 0;
		left: 0;
	}

	.echarts {
		width: 550rpx !important;
		height: 550rpx !important;
		margin: 0 auto;
	}

	/* 非VIP提示样式 */
	.no-vip {
		width: 100%;
		height: 550rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 30rpx;
	}

	.tip {
		margin-bottom: 30rpx;
	}

	.open-vip {
		background: #ffd100;
		color: #333;
		border-radius: 50rpx;
		padding: 16rpx 40rpx;
		border: none;
		font-size: 28rpx;
	}

	.ping {
		display: flex;
		flex-direction: column;
		padding-top: 20rpx;
		gap: 20rpx;
		position: absolute;
		bottom: -270rpx;
		left: 20rpx;
		right: 20rpx;
		width: auto;
		height: 514rpx;
		border-radius: 24rpx;
		background-color: rgba(255, 255, 255, 1);

		text {
			display: flex;
			justify-content: center;
			align-items: center;
			font-family: PingFang SC;
			font-weight: 500;
			font-size: 32rpx;
			color: #000;
		}
	}

	.fraction {
		display: flex;
		justify-content: space-between;
		padding: 0 40rpx;
	}

	.ction-bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.all {
		font-size: 24rpx;
		color: #8d8d8d;
	}

	.Big {
		font-size: 48rpx;
		font-weight: bold;
		color: #000;
	}

	.fraction_bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 24rpx;
		padding: 20rpx 24rpx;
		background: rgba(250, 218, 64, 0.15);
		border-radius: 24rpx;
	}

	.main_text {
		width: calc(100% / 7 - 10rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;

		text:nth-child(1) {
			font-size: 12px;
			color: #ff4848;
		}

		text:nth-child(2) {
			font-size: 20rpx;
			color: #000;
		}
	}

	.list_size {
		width: 700rpx;
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: -300rpx;
	}

	.out {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 298rpx;
		height: 100rpx;
		border-radius: 50rpx;
		border: 1px solid rgba(250, 218, 64, 1);
		color: #fada40;
	}

	.Member {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 298rpx;
		height: 100rpx;
		border-radius: 50rpx;
		background: #fada40;
		color: #333;
	}

	.MemberData {
		justify-content: center !important;
	}
</style>