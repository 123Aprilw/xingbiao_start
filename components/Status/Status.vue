<script setup lang="ts">
	import { watch, ref, computed, nextTick } from "vue";
	import { onUnload } from '@dcloudio/uni-app'
	const emit = defineEmits(["close"]);
	let Status = ref<number>(0);
	let name = ref<string>("");
	const props = defineProps({
		Status: Number,
		show: Boolean,
		name: String,
	});
	let animate = ref("");

	// ==========================================
	// 本地音频播放（你本地的正确/错误音效）
	// ==========================================
	let audio : UniApp.InnerAudioContext | null = null;
	let audioTimer : ReturnType<typeof setTimeout> | null = null;
	function playLocalAudio(url : string) {
		if (audioTimer) {
			clearTimeout(audioTimer); // 先清除定时器，避免它后续执行
			audioTimer = null;
		}
		if (audio) {
			audio.stop();
			audio.destroy();
		}
		audio = uni.createInnerAudioContext();
		audio.src = url;
		audio.play();
		audioTimer = setTimeout(() => {
			if (audio) {
				audio.destroy();
				audio = null;
			}
			audioTimer = null;
		}, 2000);
	}

	// 知道了
	const now = () => {
		animate.value = "";
		setTimeout(() => {
			emit("close", Status.value);
		}, 500);
	};

	watch(
		() => props.show,
		async (val) => {
			if (val) {
				// ========== 自动播放音效 ==========
				if (props.Status === 1) {
					playLocalAudio("/static/rading.mp3"); // 你的正确音频
				} else {
					playLocalAudio("/static/error.mp3"); // 你的错误音频
				}

				animate.value = "";
				await nextTick();
				setTimeout(() => {
					animate.value = "animate-in";
				}, 50);
			} else {
				animate.value = "";
			}
		},
		{
			immediate: true,
			flush: "post",
		}
	);

	watch(() => props.Status, (val) => (Status.value = val), { immediate: true });
	watch(() => props.name, (val) => (name.value = val), { immediate: true });
	onUnload(() => {
		if (audioTimer) {
			clearTimeout(audioTimer);
		}
		if (audio) {
			audio.destroy();
			audio = null;
		}
	});
</script>

<template>
	<view class="loading_bg" v-show="show" :class="animate">
		<view class="btn-true " :style="{background:Status===0?'rgba(255, 60, 60, 1)':'rgba(93, 223, 22, 1)'}">
			{{Status===0?'不正确':'正确'}}
		</view>
		<view class="Rewards">
			{{Status===0?'正确答案是:':'回答的很好'}}
		</view>
		<view class="Rewards_bottom">
			<text>{{Status===0?name:'你也太棒了!'}}</text>
			<view class="Rewards_btn" @click="now()">
				知道啦
			</view>
		</view>
	</view>
</template>
<style scoped lang="scss">
	.loading_bg {
		/* 关键：从屏幕最顶到最底强制占满 */
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* 强制宽高 */
		width: 100vw;
		height: 100vh;
		display: flex;
		/* 层级必须最高，盖住所有内容 */
		z-index: 9999;

		/* 背景图从底部往上铺，保证底部按钮被遮住 */
		background: url('/static/BGS.png') no-repeat center bottom;
		background-size: 100% auto;

		/* 适配底部安全区 */
		padding-bottom: env(safe-area-inset-bottom);
		transform: translateY(100%);
		opacity: 0;
		transition: all 0.7s cubic-bezier(0.2, 0.8, 0.25, 1);

		.btn-true {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			right: 7%;
			bottom: 500rpx;
			background: rgba(93, 223, 22, 1);
			width: 140rpx;
			height: 56rpx;
			border-radius: 46rpx;
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 28rpx;
			color: rgba(255, 255, 255, 1);
		}

		.Rewards {
			position: absolute;
			left: 5%;
			bottom: 400rpx;
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 32rpx;
			color: rgba(0, 0, 0, 1);
		}

		.Rewards_bottom {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 88rpx;
			width: 500rpx;
			height: 300rpx;
			position: absolute;
			left: 15%;
			bottom: 100rpx;

			text {
				font-family: PingFang SC;
				font-weight: 500;
				font-style: Medium;
				font-size: 35rpx;
				color: rgba(0, 0, 0, 1);
			}

			.Rewards_btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 444rpx;
				border-radius: 50rpx;
				height: 74rpx;
				background: rgba(250, 218, 64, 1);
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
			}
		}

	}

	.loading_bg.animate-in {
		transform: translateY(0);
		opacity: 1;
	}
</style>