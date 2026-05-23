<script setup lang="ts">
	import { ref, onUnmounted, watch } from 'vue'
	import { PostReadBookData, UploadAudio } from '@/utils/api.ts'
	import Rate from '@/components/Rate/Rate.vue'
	interface RadioTs {
		listen_id : number,
		user_id : number,
		audio_url : string,
		total_score : number,
		accuracy : number,
		fluency : number,
		integrity : number,
		detail_json : string,
		update_time : number
	}

	// 控制组件显隐 true=录音页 false=测评结果页
	const showRecordPage = ref(true)

	const props = defineProps({
		text: String,
		currentId: [String, Number],
		bookId: [String, Number]
	})

	watch(props, (newVal) => {
		console.log('props:', newVal)
	}, {
		immediate: true,
		deep: true
	})

	const status = ref({
		isPlaying: false,
		recordSrc: ''
	})
	const isRecording = ref(false)
	const isUploading = ref(false)
	let PropsData = ref<RadioTs>()
	let AllNums = ref<number>(0)
	const recorder = uni.getRecorderManager()
	const player = uni.createInnerAudioContext()
	const showRate = ref(false)
	// 录音结束回调
	recorder.onStop((res) => {
		if (!res.tempFilePath) {
			uni.showToast({ title: '录音无效', icon: 'none' })
			isRecording.value = false
			return
		}
		status.value.recordSrc = res.tempFilePath
		uni.showToast({ title: '录音完成，开始测评', icon: 'success' })
		uploadRecord()
	})

	recorder.onError(() => {
		isRecording.value = false
		uni.showToast({ title: '录音失败', icon: 'none' })
	})

	player.onEnded(() => {
		status.value.isPlaying = false
	})

	// 开始录音
	function startRecord() {
		if (isRecording.value) return
		isRecording.value = true
		status.value.recordSrc = ''
		recorder.start({
			sampleRate: 16000,
			format: 'mp3',
			numberOfChannels: 1,
			encodeBitRate: 32000
		})
		uni.showToast({ title: '开始录音', icon: 'none' })
	}

	// 停止录音
	function stopRecord() {
		if (!isRecording.value) return
		isRecording.value = false
		recorder.stop()
	}

	// 切换录音状态
	function onRecordClick() {
		isRecording.value ? stopRecord() : startRecord()
	}

	// 播放音频
	function togglePlay() {
		if (!status.value.recordSrc) {
			uni.showToast({ title: '请先录音', icon: 'none' })
			return
		}
		if (status.value.isPlaying) {
			player.stop()
			status.value.isPlaying = false
		} else {
			player.src = status.value.recordSrc
			player.play()
			status.value.isPlaying = true
		}
	}

	// 上传+测评
	async function uploadRecord() {
		if (!status.value.recordSrc) {
			uni.showToast({ title: '暂无录音文件', icon: 'none' })
			return
		}
		if (isUploading.value) {
			uni.showToast({ title: '请勿重复提交', icon: 'none' })
			return
		}

		isUploading.value = true
		uni.showLoading({ title: '上传音频中' })

		try {
			const uploadRes = await UploadAudio(status.value.recordSrc)
			const audioUrl = uploadRes.data.url

			uni.showLoading({ title: '测评打分中' })
			const res = await PostReadBookData(
				String(props.bookId),
				String(props.currentId),
				audioUrl,
				'app'
			)
			PropsData.value = res.data
			console.log(PropsData.value)
			uni.hideLoading()
			uni.showToast({ title: '测评打分成功', icon: 'success' })
			// 切换页面显示，隐藏录音页，展示测评组件
			showRecordPage.value = false
		} catch (err) {
			uni.hideLoading()
			uni.showToast({ title: '测评打分失败', icon: 'error' })
			console.error('测评报错：', err)
		} finally {
			isUploading.value = false
		}
	}

	// 返回录音页
	function backToRecord() {
		showRecordPage.value = true
	}
	// 接收子组件回传的分数
	function handleBack(rateData) {
		console.log('子组件传回来的总分：', rateData.total_score)
		console.log('子组件传回来的全部数据：', rateData)

		// 回到录音页面
		showRecordPage.value = true
		AllNums.value = rateData
	}
	// 销毁释放资源
	onUnmounted(() => {
		player.destroy()
		recorder.stop()
	})
</script>




<template>
	<!-- 根容器占满全屏，作为定位基准 -->
	<view>
		<!-- 录音区域，正常流式布局 -->
		<view class="contair_ui" v-if="showRecordPage">
			<view class="ui_img" @tap="togglePlay">
				<view class="imags">
					<image :src="status.isPlaying ? '/static/bofangactive.png' : '/static/bo.png'" />
				</view>
				<text>播放录音</text>
			</view>
			<view class="ui_img" @tap="onRecordClick">
				<view class="imags">
					<image :src="isRecording ? '/static/tingzhiactive.png' : '/static/lu.png'" />
				</view>
				<text>{{ isRecording ? '录音中...' : '点击录音' }}</text>
			</view>
			<view class="ui_img" @tap="uploadRecord">
				<view class="imags" v-if="AllNums <= 0 || uni.getStorageSync('User_Vip') !== 1">
					<image src="/static/ce.png" />
				</view>
				<view class="imags"  v-else>
					<text style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;background-color: rgba(132, 134, 248, 1);color: background: rgba(255, 255, 255, 1);
;font-size: 28rpx;border-radius: 50%;color: rgba(255, 255, 255, 1);">{{ AllNums }}</text>
				</view>
				<text>测评打分</text>
			</view>
		</view>

		<!-- 测评组件层级置顶，独占全屏，不挤压原有布局 -->
		<view v-else style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:998;background:#fff;">
			<Rate :Data="PropsData" @back="handleBack" />
		</view>
	</view>
</template>

<style lang="scss">
	.contair_ui {
		display: flex;
		gap: 28rpx;
		padding: 30rpx;
		box-sizing: border-box;

		.ui_img {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10rpx;

			.imags {
				width: 54rpx;
				height: 54rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		text {
			font-size: 24rpx;
			color: #000;
		}
	}
</style>