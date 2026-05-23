<script setup lang="ts">
	import { watch, ref } from 'vue'
	const emit = defineEmits(['closeModel', 'confirmModel'])
	const sliderValue = ref<number>(0)
	const speedValue = ref<number>(0.5)
	const switchSwiper = ref<boolean>(false)
	const SizeLangese = ref<string>('小')
	const props = defineProps({
		autoPlay: {
			type: Boolean,
			default: false
		},
		fontSize: {
			type: String,
			default: '小'
		},
		speed: {
			type: Number,
			default: 0.5
		}
	})

	//自动翻页
	const switch2Change = (e) => {
		switchSwiper.value = e.detail.value
	}
	const LangeseChange = (e) => {
		console.log(e.detail.value)
	}
	//字体大小
	const sliderTextChange = (e) => {
		const val = e.detail.value
		if (val < 30) {
			sliderValue.value = 0
			SizeLangese.value = '小'
		} else if (val < 70) {
			sliderValue.value = 50
			SizeLangese.value = '中'
		} else {
			sliderValue.value = 100
			SizeLangese.value = '大'
		}
	}
	const sliderWpmChange = (e) => {
		const percent = e.detail.value // 0-100
		const displaySpeed = 0.5 + (percent / 100) * (2.0 - 0.5)
		speedValue.value = Number(displaySpeed.toFixed(1))
	}
	//关闭
	const closed = () => {
		emit('closeModel', false)
	}
	//确定
	const TureModel = () => {
		console.log(SizeLangese.value)
		emit('confirmModel', {
			show: switchSwiper.value,
			fontSize: SizeLangese.value,
			videoChange: speedValue.value
		})
	}
	watch(() => props.autoPlay, (val) => {
		switchSwiper.value = !!val
	}, { immediate: true })

	watch(() => props.fontSize, (val) => {
		if (!val) return
		SizeLangese.value = val
		if (val === '小') sliderValue.value = 0
		if (val === '中') sliderValue.value = 50
		if (val === '大') sliderValue.value = 100
	}, { immediate: true })

	watch(() => props.speed, (val) => {
		speedValue.value = val || 0.5
	}, { immediate: true })
</script>
<template>
	<view class="process">
		<view class="box">
			<view class="box-top">
				<text>听学设置</text>
				<view class="box-center">
					<text>字体大小</text>
					<slider :value="sliderValue" @changing="sliderTextChange" block-size='12' :step='50'
						block-color='rgba(250, 218, 64, 1)' activeColor='rgba(250, 218, 64, 1)'
						style="width: 344rpx;" />
					<text
						style="padding-left: 28rpx">{{ sliderValue === 0 ? '小' : sliderValue === 50 ? '中' : '大' }}</text>
				</view>
				<view class="box_bottom">
					<text>播放语速</text>
					<slider :value="(speedValue - 0.5) / (2.0 - 0.5) * 100" min="0" max="100"
						@changing="sliderWpmChange" block-size='12' :step='1' block-color='rgba(250, 218, 64, 1)'
						activeColor='rgba(250, 218, 64, 1)' style="width: 344rpx;position: relative;" />
					<text style="padding-left: 28rpx;">{{speedValue }}X</text>
				</view>
				<view class="swiper_sl">
					<text>自动翻页</text>
					<switch :checked="switchSwiper" @change="switch2Change" color="#FFCC33" style="width: ;" />
				</view>
				<view class="langese">
					<text>BCD级别播放中文语音</text>
					<switch @change="LangeseChange" color="#FFCC33" />
				</view>
			</view>
			<view class="box-bottom">
				<view class="close" @click="closed()">
					关闭
				</view>
				<view class="ensure" @click="TureModel()">
					确定
				</view>
			</view>
		</view>
	</view>
</template>
<style scoped lang="scss">
	@mixin FlexBox {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.process {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.25);

		.box {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 38rpx;

			.box-top {
				width: 590rpx;
				display: flex;
				flex-direction: column;
				gap: 20rpx;
				padding: 20rpx;
				border-radius: 24rpx;
				background-color: rgba(255, 255, 255, 1);

				text {
					text-wrap: nowrap;
					display: flex;
					align-items: center;
					justify-content: center;
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 32rpx;
					color: rgba(0, 0, 0, 1);
				}

				.box-center {
					display: flex;

					text {
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 1);
					}
				}

				.box_bottom {
					display: flex;

					text {
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 1);
					}
				}

				.swiper_sl {
					display: flex;
					justify-content: space-between;

					text {
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 1);
					}
				}

				.langese {
					display: flex;
					justify-content: space-between;

					text {
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 1);
					}
				}
			}

			.box-bottom {
				display: flex;
				gap: 50rpx;

				.close {
					padding: 16rpx 110rpx;
					background: rgba(242, 242, 242, 1);
					border-radius: 35rpx;
					box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 26rpx;
					leading-trim: NONE;
					line-height: 100%;
					letter-spacing: 0%;
					color: rgba(170, 170, 170, 1)
				}

				.ensure {
					@extend .close;
					background: rgba(250, 218, 64, 1);
					color: rgba(0, 0, 0, 1);
				}
			}
		}
	}

	::v-deep(.uni-slider) {
		margin-right: 0;
	}
</style>