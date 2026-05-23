<script setup lang="ts">
	interface SwiperTs {
		url : string
		name : string
		audio ?: string
		treeTiger ?: string,
		Word ?: string
	}
	interface PropsTs {
		show : boolean,
		fontSize : string,
		videoChange : string
	}
	interface StudyListen {
		title : string
		audio ?: string
		listenArr : ListenTs[]
	}
	interface ListenTs {
		name : string
		url : string
		key ?: string
	}
	interface ListTs {
		id : number
		title : string
		location : string
		type : number
	}
	interface StudyTypeItem {
		type : number
		sliderArr ?: SwiperTs[]
		listenIng ?: StudyListen[]
	}
	interface CourseItem {
		id : number
		title : string
		location : string
		type ?: number
		Swiper ?: StudyTypeItem[]
		listenIng ?: StudyListen[]
	}
	interface overArr {
		image : string
		key : string
		value : string
	}
	interface SwiperTsString {
		answer : string
		id : number
		options : overArr[]
		word : string
	}
	interface ApiTs {
		count : number
		list : SwiperTsString[]
		quiz_token : string
	}
	import { ref, watch, nextTick, computed, toRaw } from 'vue'
	import { onLoad, onUnload, onShow } from '@dcloudio/uni-app'
	import Recording from '@/components/Recording/Recording.vue'
	import Loading from '@/components/Status/Status.vue'
	import { LookWorld, PostLookWorld } from '@/utils/api.ts'
	import { playTTS, stopTTS, destroyTTS } from '@/utils/tts.ts'
	//
	const BooksId = ref<number>(0)
	// 核心进度逻辑
	const originalTotal = ref(0)
	const wrongIds = ref<number[]>([])
	const pageStatus = ref<'normal' | 'review' | 'redoing'>('normal')
	const currentIndex = ref(0)
	const wrongCurrentIndex = ref(0)
	const correctInRedo = ref(0)
	const BonesId = ref<string>('')
	const BASE_URL = 'https://xingbiao.demo.zhongti-group.com'
	let isProps = ref({ show: false, status: 0, name: '' })
	let selectedIndex = ref<number>(-1)
	let SwiperData = ref<ApiTs>({ count: 0, list: [], quiz_token: '' })
	const playing = ref(false)

	// 当前题目
	const currentQuestion = computed(() => {
		if (pageStatus.value === 'redoing') {
			const id = wrongIds.value[wrongCurrentIndex.value]
			return SwiperData.value.list.find(item => item.id === id) || null
		}
		return SwiperData.value?.list?.[currentIndex.value] || null
	})

	// 进度文字
	const progressText = computed(() => {
		if (pageStatus.value === 'normal') {
			return `${currentIndex.value + 1}/${originalTotal.value}`
		}
		const top = originalTotal.value + correctInRedo.value
		const bottom = originalTotal.value + wrongIds.value.length
		return `${top}/${bottom}`
	})

	// 进度条百分比
	const progressPercent = computed(() => {
		if (pageStatus.value === 'normal') {
			return ((currentIndex.value + 1) / originalTotal.value) * 100
		}
		const top = originalTotal.value + correctInRedo.value
		const bottom = originalTotal.value + wrongIds.value.length
		return bottom === 0 ? 0 : (top / bottom) * 100
	})

	const canCheck = computed(() => selectedIndex.value !== -1)

	// 音频
	const playWord = (text : string) => {
		if (!text) return
		stopTTS()
		playTTS(text, { speed: 50, lang: 'en' })
	}
	const audioClick = () => {
		if (!currentQuestion.value?.word) return
		playWord(currentQuestion.value.word)
	}
	const selectOption = (index : number, item : any) => {
		selectedIndex.value = index
		playWord(item.value)
	}

	// 检查答案
	const checkAnswer = () => {
		if (!canCheck.value) return
		const q = currentQuestion.value
		const userOption = q?.options[selectedIndex.value]
		const isCorrect = userOption?.key === q?.answer

		if (!isCorrect && !wrongIds.value.includes(q.id)) {
			wrongIds.value.push(q.id)
		}

		if (isCorrect && pageStatus.value === 'redoing') {
			correctInRedo.value++
		}

		isProps.value.show = true
		isProps.value.status = isCorrect ? 1 : 0
		isProps.value.name = isCorrect
			? q.word
			: q?.options.find(o => o.key === q.answer)?.value || ''
	}

	// ======================
	// ✅ 跳转菜单页面（最终版！）
	// ======================
	const nextQuestion = () => {
		selectedIndex.value = -1

		// 正常答题
		if (pageStatus.value === 'normal') {
			if (currentIndex.value < SwiperData.value.list.length - 1) {
				currentIndex.value++
			} else {
				// 第一次全部正确 → 直接跳菜单
				if (wrongIds.value.length === 0) {
					submitResult()
					uni.navigateTo({
						url: `/pages/Bones/Bones?id=${BooksId.value}` // 你的菜单页面路径
					})
				} else {
					pageStatus.value = 'review'
				}
			}
			return
		}

		// 错题重刷
		if (pageStatus.value === 'redoing') {
			// 1. 先判断是不是已经是最后一题
			if (wrongCurrentIndex.value >= wrongIds.value.length - 1) {
				// 所有错题都刷完了 → 直接跳菜单
				submitResult()
				uni.navigateTo({ url: `/pages/Bones/Bones?id=${BooksId.value}` })
			} else {
				// 还有下一题 → 继续
				wrongCurrentIndex.value++
			}
		}
	}

	// 进入重刷
	const getGo = () => {
		pageStatus.value = 'redoing'
		wrongCurrentIndex.value = 0
		correctInRedo.value = 0
		selectedIndex.value = -1
	}

	// 请求数据
	const FetchWiper = async (id : number, type : number) => {
		try {
			const res = await LookWorld(String(id), 'app')
			SwiperData.value = res.data
			originalTotal.value = res.data.list.length
			currentIndex.value = 0
			wrongIds.value = []
			correctInRedo.value = 0
			selectedIndex.value = -1

		} catch (err) {
			console.log(err)
		}
	}

	const back = () => uni.navigateBack()
	const onClose = () => {
		isProps.value.show = false
		nextQuestion()
	}
	// 提交接口的统一方法
	const submitResult = async () => {
		try {
			// 接口参数
			const pureErrorIds = toRaw(wrongIds.value)
			const params = {
				quizToken: SwiperData.value.quiz_token,
				bookId: BooksId.value.toString(),
				errorIds: pureErrorIds,
				Source: 'app'
			}
			console.log(params)
			const res = await PostLookWorld(params.quizToken, params.bookId, params.errorIds, params.Source)
			console.log('提交成功',res)
			// 提交成功后跳转菜单页面
			uni.navigateTo({ url: "/pages/menu/menu" })
		} catch (err) {
			console.error('提交失败', err)
			uni.showToast({ title: '提交失败，请重试', icon: 'none' })
		}
	}
	onLoad((e) => {
		BooksId.value = e.id
		console.log(BooksId.value)
		FetchWiper(Number(e.id), Number(e.type))
	})

	onUnload(() => {
		stopTTS()
		destroyTTS()
	})
</script>

<template>
	<view class="listen">
		<view class="back_top">
			<view class="p1">
				<view class="text_back" @click="back()">
					<image src="/static/left.png" mode=""></image>
				</view>
				<text>看词</text>
				<view class=""></view>
			</view>
			<view class="proess">
				<progress :percent="progressPercent" stroke-width="22rpx" border-radius='20rpx'
					activeColor='rgba(250,218,64,1)' style="width: 630rpx;" />
				<text>{{ progressText }}</text>
			</view>
		</view>

		<view class="list_top" v-if="(pageStatus === 'normal' || pageStatus === 'redoing') && currentQuestion">
			<view class="top">
				<view class="top_imgs" @click="audioClick">
					<image src="/static/listning.png" mode=""></image>
				</view>
				<text>{{currentQuestion.word}}</text>
			</view>

			<view class="center">
				<view class="center_box" @tap="selectOption(index, item)" :class="{ isBg: selectedIndex === index }"
					v-for="(item, index) in currentQuestion.options" :key="index">
					<view class="box_top">
						<image :src="BASE_URL+item.image" mode=""></image>
					</view>
					<view class="box_bottom">
						{{item.value}}
					</view>
				</view>
			</view>

			<view class="Punctuator" @click="checkAnswer" :class="{Punctuator_active:canCheck}">
				检查
			</view>
		</view>

		<view class="error_box" v-if="pageStatus === 'review'">
			<view class="error_egg">
				<view class="egg_imgs">
					<image src="/static/logonew.png" mode=""></image>
				</view>
				<text>再刷一遍先前失手的题目吧!</text>
			</view>
			<view class="Punctuator" @click="getGo" :class="{Punctuator_active:true}">
				继续
			</view>
		</view>

		<Loading v-show="isProps.show" :show="isProps.show" @close="onClose" :Status='isProps.status'
			:name='isProps.name' />
	</view>
</template>

<style lang="scss">
	.listen {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		height: 100vh;

		.back_top {
			display: flex;
			flex-direction: column;
			gap: 36rpx;
			padding: 88rpx 20rpx 20rpx;
			flex-shrink: 0;

			.p1 {
				display: flex;
				justify-content: space-between;

				.text_back {
					width: 32rpx;
					height: 32rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.proess {
				display: flex;
				justify-content: space-between;
			}
		}

		.list_top {
			flex: 1;
			background-color: rgba(245, 246, 250, 1);
			display: flex;
			flex-direction: column;
			gap: 52rpx;
			padding: 25rpx 24rpx;

			.top {
				display: flex;
				align-items: center;
				gap: 40rpx;

				.top_imgs {
					width: 88rpx;
					height: 88rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.center {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				gap: 20rpx;
				width: 710rpx;

				.center_box {
					border: none;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 344rpx;
					height: 350rpx;
					border-radius: 24rpx;
					transition: all 0.25s ease;
					outline: none;

					.box_top {
						padding: 2rpx;
						width: 344rpx;
						height: 200rpx;

						image {
							border-top-left-radius: 25rpx;
							border-bottom-right-radius: 25rpx;
							width: 100%;
							height: 100%;
						}
					}

					.box_bottom {
						outline: none;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 340rpx;
						height: 142rpx;
						background: rgba(255, 255, 255, 1);
						box-shadow: 0px 4px 12px 0px rgba(240, 244, 245, 1);
						transition: all 0.25s ease;
						border-bottom-right-radius: 25rpx;
						border-bottom-left-radius: 25rpx;
					}
				}

				.isBg {
					background: rgba(255, 231, 116, 1);
					box-shadow: 0px 4px 12px 0px rgba(240, 244, 245, 1);

					.box_bottom {
						background: rgba(255, 231, 116, 1);
						border-bottom-right-radius: 25rpx;
						border-bottom-left-radius: 25rpx;
						box-shadow: none;
					}
				}
			}

			.Punctuator {
				margin-top: 50rpx;
				background-color: rgba(245, 246, 250, 1);
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50rpx;
				width: 694rpx;
				height: 120rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
				font-family: PingFang SC;
				font-weight: 400;
				font-style: Regular;
				font-size: 32rpx;
				color: rgba(0, 0, 0, 1);
				transition: all 0.28s ease-out;
			}

			.Punctuator_active {
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
				background: rgba(250, 218, 64, 1);
			}

			.Punctuator:active {
				transform: scale(0.96);
				opacity: 0.92;
				transition: transform 0.1s ease;
			}
		}

		.error_box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.error_egg {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				text {
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 36rpx;
					color: rgba(0, 0, 0, 1);
				}

				.egg_imgs {
					width: 256rpx;
					height: 256rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.Punctuator {
				margin-top: 500rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50rpx;
				width: 694rpx;
				height: 120rpx;
				background: rgba(250, 218, 64, 1);
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
				font-family: PingFang SC;
				font-weight: 400;
				font-style: Regular;
				font-size: 32rpx;
				color: rgba(0, 0, 0, 1);
				transition: all 0.28s ease-out;
			}
		}
	}

	::v-deep(.uni-progress-bar) {
		border-radius: 52rpx !important;
	}

	::v-deep(.uni-progress-inner-bar) {
		border-radius: 52rpx !important;
	}
</style>