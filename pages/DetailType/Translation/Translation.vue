<script setup lang="ts">
	interface bottle {
		key : string
		value : string
	}
	interface SwiperTs {
		english : string
		answer : string
		options : bottle[]
	}
	interface StudyTypeItem {
		type : number
		sliderArr : SwiperTs[]
	}

	import {
		ref, computed, onUnmounted
	} from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import Loading from '@/components/Status/Status.vue'
	import { LookWorldPoplur, PostWorldPoplur } from '@/utils/api.ts'
	import { playTTS, stopTTS, destroyTTS } from '@/utils/tts.ts'

	const pageStatus = ref<'normal' | 'review' | 'redoing'>('normal')
	const wrongQuestions = ref<number[]>([])
	const redoIndex = ref(0)
	const originalTotal = ref(0)
	const quizToken = ref('')

	let IndexCurrent = ref<number>(0)
	let BonesId = ref<number>(0)
	let Typeis = ref<number>(0)
	let SwiperArr = ref<StudyTypeItem | null>(null)

	let isProps = ref({ show: false, status: 0, name: '' })
	let TextActive = ref<number | null>(null)

	// 检查按钮状态：选中选项才高亮
	const canCheck = computed(() => TextActive.value !== null)

	const progressText = computed(() => {
		if (pageStatus.value === 'normal') {
			return `${IndexCurrent.value + 1}/${originalTotal.value}`
		}
		const base = originalTotal.value
		const allTotal = base + wrongQuestions.value.length
		let current = 0
		if (pageStatus.value === 'review') current = base
		if (pageStatus.value === 'redoing') current = base + redoIndex.value + 1
		return `${current}/${allTotal}`
	})

	const progressPercent = computed(() => {
		if (pageStatus.value === 'normal') {
			return ((IndexCurrent.value + 1) / originalTotal.value) * 100
		}
		const base = originalTotal.value
		const allTotal = base + wrongQuestions.value.length
		let current = 0
		if (pageStatus.value === 'review') current = base
		if (pageStatus.value === 'redoing') current = base + redoIndex.value + 1
		return allTotal ? (current / allTotal) * 100 : 0
	})

	const FetchWiper = async (id : number) => {
		try {
			const res = await LookWorldPoplur(String(id), 'app')
			SwiperArr.value = {
				type: 7,
				sliderArr: res.data.list
			}
			originalTotal.value = res.data.count
			quizToken.value = res.data.quiz_token
		} catch (err) {
			console.error('获取题目失败', err)
		}
	}

	const submitResult = async () => {
		if (!quizToken.value) return
		try {
			await PostWorldPoplur(
				quizToken.value,
				BonesId.value.toString(),
				wrongQuestions.value,
				'app'
			)
		} catch (err) {
			console.error('提交失败', err)
		}
	}

	const goNext = async () => {
		TextActive.value = null
		const total = SwiperArr.value?.sliderArr.length || 0
		if (pageStatus.value === 'normal') {
			if (total === 0) return
			if (IndexCurrent.value < total - 1) {
				IndexCurrent.value++
			} else {
				wrongQuestions.value.length > 0
					? (pageStatus.value = 'review')
					: (await submitResult(), uni.navigateTo({
						url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}`
					}))
			}
			return
		}
		if (pageStatus.value === 'redoing') {
			const redoTotal = wrongQuestions.value.length
			if (redoIndex.value < redoTotal - 1) {
				redoIndex.value++
				IndexCurrent.value = wrongQuestions.value[redoIndex.value]
			} else {
				await submitResult()
				uni.navigateTo({
					url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}`
				})
			}
		}
	}

	const startRedo = () => {
		if (wrongQuestions.value.length === 0) {
			submitResult()
			uni.navigateTo({ url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}` })
			return
		}
		pageStatus.value = 'redoing'
		redoIndex.value = 0
		IndexCurrent.value = wrongQuestions.value[0]
		TextActive.value = null
	}

	const PunctuatorClick = () => {
		if (!canCheck.value || !SwiperArr.value) return
		const item = SwiperArr.value.sliderArr[IndexCurrent.value]
		const selected = item.options[TextActive.value!]
		const correct = selected.key === item.answer

		if (!correct && pageStatus.value === 'normal') {
			if (!wrongQuestions.value.includes(IndexCurrent.value)) {
				wrongQuestions.value.push(IndexCurrent.value)
			}
		}

		isProps.value = {
			show: true,
			status: correct ? 1 : 0,
			name: correct ? '' : item.options.find(o => o.key === item.answer)?.value || ''
		}
	}

	const onClose = () => {
		isProps.value.show = false
		goNext()
	}

	// 点击选项：选中高亮 + 朗读
	const UserText = (idx : number) => {
		TextActive.value = idx
		const txt = SwiperArr.value!.sliderArr[IndexCurrent.value].options[idx].value
		playTTS(txt, { lang: 'zh', speed: 50 })
	}

	// 播放按钮朗读英文
	const audioClick = () => {
		const txt = SwiperArr.value!.sliderArr[IndexCurrent.value].english
		playTTS(txt, { lang: 'en', speed: 50 })
	}

	const back = () => uni.navigateBack()

	onLoad(async (e) => {
		BonesId.value = Number(e.id)
		Typeis.value = Number(e.type)
		await FetchWiper(Number(e.id))
	})

	onUnmounted(() => {
		stopTTS()
		destroyTTS()
	})
</script>

<template>
	<view class="listen">
		<!-- 顶部导航栏（所有状态都显示） -->
		<view class="header">
			<view class="back-btn" @click="back">
				<image src="/static/left.png" mode="aspectFit" />
			</view>
			<text class="title">看词翻译</text>
			<view></view>
		</view>

		<!-- 进度条：提到最外层，normal/review/redoing 都显示 -->
		<view class="progress-container">
			<progress class="progress-bar" :percent="progressPercent" stroke-width="8" activeColor="#ffcc00" />
			<text class="progress-text">{{ progressText }}</text>
		</view>

		<!-- 1. 正常做题 / 错题重做（互斥） -->
		<view v-if="pageStatus === 'normal' || pageStatus === 'redoing'" class="main-content">
			<!-- 题目区域 -->
			<view class="question-area">
				<view class="audio-btn" @click="audioClick">
					<image src="/static/listning.png" mode="aspectFit" />
				</view>
				<text class="question-text">{{ SwiperArr?.sliderArr[IndexCurrent]?.english }}</text>
			</view>

			<!-- 选项列表 -->
			<view class="options-container">
				<view class="option-item" v-for="(item, idx) in SwiperArr?.sliderArr[IndexCurrent]?.options" :key="idx"
					:class="{ selected: TextActive === idx }" @click="UserText(idx)">
					{{ item.value }}
				</view>
			</view>

			<!-- 检查按钮 -->
			<view class="check-btn" :class="{ active: canCheck }" @click="PunctuatorClick">
				检查
			</view>
		</view>

		<!-- 2. 错题重刷提示页（和上面互斥） -->
		<view v-if="pageStatus === 'review'" class="review-page">
			<view class="review-content">
				<image src="/static/logonew.png" mode="aspectFit" />
				<text>再刷一遍先前失手的项目吧!</text>
			</view>
			<view class="check-btn active" @click="startRedo">继续</view>
		</view>

		<Loading v-show="isProps.show" :show="isProps.show" @close="onClose" :Status="isProps.status"
			:name="isProps.name" />
	</view>
</template>

<style lang="scss" scoped>
	.listen {
		width: 750rpx;
		height: 100vh;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		padding-top: 40rpx;
	}

	/* 顶部导航 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		margin-bottom: 30rpx;

		.back-btn {
			width: 32rpx;
			height: 32rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 32rpx;
			font-weight: 500;
		}
	}

	/* 进度条 */
	.progress-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		margin-bottom: 60rpx;

		.progress-bar {
			flex: 1;
			height: 16rpx;
			margin-right: 20rpx;
		}

		.progress-text {
			font-size: 28rpx;
			color: #333;
		}
	}

	/* 主内容区（做题/重做） */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	/* 题目区域 */
	.question-area {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		margin-bottom: 60rpx;

		.audio-btn {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.question-text {
			font-size: 32rpx;
			font-weight: 500;
		}
	}

	/* 选项列表 */
	.options-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		padding: 0 30rpx;
		margin-bottom: 60rpx;

		.option-item {
			width: 100%;
			height: 120rpx;
			background-color: #f5f5f5;
			border-radius: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #333;

			&.selected {
				background-color: #ffcc00;
				color: #000;
			}
		}
	}

	/* 检查按钮 */
	.check-btn {
		width: 690rpx;
		height: 100rpx;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		margin: 0 auto;
		background-color: #ddd;
		color: #999;

		&.active {
			background-color: #ffcc00;
			color: #000;
		}
	}

	/* 错题重刷页 */
	.review-page {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.review-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 100rpx;

			image {
				width: 200rpx;
				height: 200rpx;
				margin-bottom: 30rpx;
			}

			text {
				font-size: 32rpx;
				color: #333;
			}
		}
	}
</style>