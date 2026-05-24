<script setup lang="ts">
	interface SwiperTs {
		url ?: string
		name : string // question
		audio ?: string
		treeTiger ?: string,
		Word ?: string,
		bottleArr ?: bottle[],
		chinese ?: string // question_cn
		correctIndex ?: number
	}
	interface bottle {
		name : string // option.value
		chinese ?: string
		isTrue ?: boolean
		key ?: string // option.key
		image ?: string
	}
	interface PropsTs {
		show : boolean,
		fontSize : string,
		videoChange : string
	}
	interface SwiperGTs {
		url : string
		name : string,
		audio : string,
	}
	interface ListTs {
		id : number,
		title : string,
		location : string,
		type : number
		Swiper : SwiperGTs[]
	}
	interface StudyTypeItem {
		type : number
		sliderArr : SwiperTs[]
	}
	interface CourseItem {
		id : number
		title : string
		location : string
		type ?: number
		Swiper ?: StudyTypeItem[]
	}

	import { ref, watch, nextTick, computed } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
	import Recording from '@/components/Recording/Recording.vue'
	import Loading from '@/components/Status/Status.vue'
	import { PostTestPoplur, GetTestData } from '@/utils/api.ts'

	// 这里使用你项目里的TTS
	import { playTTS as textToSpeech, stopTTS as stopSpeak, setTtsPlayEndCallback } from '@/utils/tts.ts'
	const pageStatus = ref<'normal' | 'review' | 'redoing'>('normal')
	const wrongQuestions = ref<number[]>([]) // 错题ID数组
	const redoIndex = ref(0)
	const isFinished = ref(false)
	let isPressiom = ref<boolean>(false)
	let Typeis = ref<number>(0)
	let isActive = ref<boolean>(false)
	let IndexCurrent = ref<number>(0)
	let BonesId = ref<number>(0)
	let showBg = ref<boolean>(false)
	let BonesType = ref<number>(null)
	let SwiperData = ref({ interval: 0, duration: 500 })
	let showChinese = ref(false)
	const isTTSSpeaking = ref(false)
	let isProps = ref({ show: false, status: 0, name: '' })
	let TextActive = ref<number>(null)
	let ListenType = ref<number>(0)
	let autoPlayEnabled = ref<boolean>(false)
	let autoPlayRunning = ref<boolean>(false)
	let SwiperArr = ref<StudyTypeItem | null>(null)
	let isAudioLoading = ref<boolean>(false)
	let lastAnswerCorrect = ref(false)

	let quizToken = ref('') // 提交token

	const toggleChinese = () => {
		showChinese.value = !showChinese.value
	}

	const canCheck = computed(() => {
		return TextActive.value !== null
	})

	// 获取题目
	const FetchWiper = async (id : number, type : number) => {
		try {
			const res = await GetTestData(String(id), 'app')
			console.log('接口返回数据：', res)
			if (res.code === 1 && res.data?.list) {
				quizToken.value = res.data.quiz_token || ''
				const sliderArr : SwiperTs[] = res.data.list.map((item : any) => {
					const bottleArr : bottle[] = item.options.map((opt : any) => ({
						name: opt.value,
						key: opt.key,
						image: opt.image,
						isTrue: opt.key === item.answer
					}))
					return {
						name: item.question,
						chinese: item.question_cn,
						bottleArr,
						correctIndex: item.options.findIndex((opt : any) => opt.key === item.answer)
					}
				})
				SwiperArr.value = { type: 1, sliderArr }
			}
		} catch (err) {
			console.log('获取题目失败：', err)
		}
	}

	const isLastSlide = () => {
		if (!SwiperArr.value) return true
		return IndexCurrent.value === SwiperArr.value.sliderArr.length - 1
	}

	// ==========================
	// ✅ 进度条（和参考完全一致）
	// ==========================
	const progressText = computed(() => {
		if (!SwiperArr.value) return '0/0'
		const originalTotal = SwiperArr.value.sliderArr.length
		if (pageStatus.value === 'normal') {
			return `${IndexCurrent.value + 1}/${originalTotal}`
		}
		const allTotal = originalTotal + wrongQuestions.value.length
		let current = 0
		if (pageStatus.value === 'review') current = originalTotal
		if (pageStatus.value === 'redoing') current = originalTotal + redoIndex.value + 1
		return `${current}/${allTotal}`
	})

	const progressPercent = computed(() => {
		if (!SwiperArr.value) return 0
		const originalTotal = SwiperArr.value.sliderArr.length
		if (pageStatus.value === 'normal') {
			return ((IndexCurrent.value + 1) / originalTotal) * 100
		}
		const allTotal = originalTotal + wrongQuestions.value.length
		let current = 0
		if (pageStatus.value === 'review') current = originalTotal
		if (pageStatus.value === 'redoing') current = originalTotal + redoIndex.value + 1
		return allTotal ? (current / allTotal) * 100 : 0
	})

	const goNext = () => {
		if (!SwiperArr.value) return
		stopSpeak()
		isTTSSpeaking.value = false

		const total = SwiperArr.value.sliderArr.length
		if (pageStatus.value === 'normal') {
			if (IndexCurrent.value < total - 1) {
				IndexCurrent.value++
				TextActive.value = null
			} else {
				isFinished.value = true
				submitAnswers() // 提交错题
				wrongQuestions.value.length > 0
					? (pageStatus.value = 'review')
					: uni.navigateTo({
						url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}`
					})
			}
			return
		}
		if (pageStatus.value === 'redoing') {
			redoIndex.value++
			redoIndex.value < wrongQuestions.value.length ? (
				IndexCurrent.value = wrongQuestions.value[redoIndex.value],
				TextActive.value = null
			) : uni.navigateTo({ url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}` })
		}
	}

	// ==============================================
	// 🔥 ✅ 修复：提交 错题 ID 数组给后端（完全对齐参考）
	// ==============================================
	const submitAnswers = async () => {
		try {
			// 后端需要的是：做错的题目 ID 数组
			const wrongIds = wrongQuestions.value.map(id => id + 1) // 题号+1（和参考一致）

			const res = await PostTestPoplur(
				quizToken.value,
				String(BonesId.value),
				wrongIds,
				'app'
			)
			console.log('✅ 错题提交成功：', res)
		} catch (err) {
			console.log('❌ 提交失败：', err)
		}
	}

	const startRedo = () => {
		pageStatus.value = 'redoing'
		redoIndex.value = 0
		IndexCurrent.value = wrongQuestions.value[0]
		TextActive.value = null
	}

	// ==========================
	// ✅ 检查题目 + 记录错题
	// ==========================
	const PunctuatorClick = () => {
		if (!canCheck.value || !SwiperArr.value) return
		const currentItem = SwiperArr.value.sliderArr[IndexCurrent.value]
		if (!currentItem?.bottleArr) return

		const selectedOption = currentItem.bottleArr[TextActive.value]
		const isCorrect = selectedOption.isTrue === true
		const correctAnswer = currentItem.bottleArr.find(item => item.isTrue === true)

		lastAnswerCorrect.value = isCorrect

		// 🔥 核心：答错才加入错题集
		if (!isCorrect && pageStatus.value === 'normal') {
			if (!wrongQuestions.value.includes(IndexCurrent.value)) {
				wrongQuestions.value.push(IndexCurrent.value)
			}
		}

		isProps.value.show = true
		isProps.value.status = isCorrect ? 1 : 0
		isProps.value.name = isCorrect ? '' : (correctAnswer?.name || '未知答案')
	}

	const back = () => {
		stopSpeak()
		isTTSSpeaking.value = false
		uni.navigateBack()
	}

	// 播放英文+中文
	const UserText = (selectedOption : any, index : number) => {
		TextActive.value = index
		if (isTTSSpeaking.value) return
		stopSpeak()
		isTTSSpeaking.value = true
		textToSpeech(selectedOption.name, { speed: 50 })
		setTtsPlayEndCallback(() => {
			if (showChinese.value && selectedOption.chinese) {
				textToSpeech(selectedOption.chinese, { speed: 50 })
				setTtsPlayEndCallback(() => {
					isTTSSpeaking.value = false
				})
			} else {
				isTTSSpeaking.value = false
			}
		})
	}

	const audioClick = () => {
		if (!SwiperArr.value) return
		const currentItem = SwiperArr.value.sliderArr[IndexCurrent.value]
		stopSpeak()
		isTTSSpeaking.value = true
		textToSpeech(currentItem.name, { speed: 50 })
		setTtsPlayEndCallback(() => {
			if (showChinese.value && currentItem.chinese) {
				textToSpeech(currentItem.chinese, { speed: 50 })
				setTtsPlayEndCallback(() => {
					isTTSSpeaking.value = false
				})
			} else {
				isTTSSpeaking.value = false
			}
		})
	}

	const onClose = () => {
		isProps.value.show = false
		stopSpeak()
		isTTSSpeaking.value = false
		nextTick(() => goNext())
		lastAnswerCorrect.value = false
	}

	onLoad((e) => {
		BonesId.value = Number(e.id)
		BonesType.value = Number(e.type)
		Typeis.value = Number(e.type)
		FetchWiper(Number(e.id), Number(e.type))
		try {
			const saved = uni.getStorageSync('listening_settings')
			if (saved) autoPlayEnabled.value = saved.autoPlay || false
		} catch (e) {
			console.error('读取设置失败', e)
		}
	})

	onUnload(() => {
		stopSpeak()
		isTTSSpeaking.value = false
	})
</script>

<template>
	<view class="listen">
		<view class="back_top">
			<view class="p1">
				<view class="text_back" @click="back()">
					<image src="/static/left.png" mode=""></image>
				</view>
				<view class="" style="margin-right: 30rpx;">Quiz/测验</view>
				<view class="imge">
					<view class="cinese" @click="toggleChinese">
						<image :src="showChinese===true?'/static/YELLOW.png':'/static/english.png'" mode=""></image>
					</view>
				</view>
			</view>
			<view class="proess">
				<progress :percent="progressPercent" stroke-width="22rpx" activeColor='rgba(250, 218, 64, 1)'
					style="width: 630rpx;" />
				<text>{{ progressText }}</text>
			</view>
		</view>

		<view class=" " v-if="pageStatus === 'normal' || pageStatus==='redoing'">
			<view class="swiper">
				<view class="top">
					<view class="top_imgs" @click="audioClick">
						<image src="/static/listning.png" mode="widthFix"></image>
					</view>
					<view class="chinese" style="display: flex;flex-direction: column;">
						<text class="englist">{{SwiperArr?.sliderArr[IndexCurrent]?.name}}</text>
						<text v-show="showChinese">{{SwiperArr?.sliderArr[IndexCurrent]?.chinese}}</text>
					</view>
				</view>
				<view class="swiper_box">
					<view class="imgs_bottom">
						<template v-if="SwiperArr?.sliderArr[IndexCurrent]?.bottleArr">
							<view class="images_main" v-for="(item, idx) in SwiperArr.sliderArr[IndexCurrent].bottleArr"
								:key="idx"
								:style="{background:TextActive===idx?'rgba(250, 218, 64, 1)':'rgba(255, 255, 255, 0.6)'}"
								@click="UserText(item, idx)">
								<text>{{item.name}}</text>
								<text v-if="showChinese" style="font-size: 28rpx; color: #666;">{{item.chinese}}</text>
							</view>
						</template>
					</view>
				</view>

				<view class="Punctuator" @click="PunctuatorClick" :class="{Punctuator_active:canCheck}">
					检查
				</view>
			</view>
		</view>

		<view class="error_box" v-if="pageStatus === 'review'">
			<view class="error_egg">
				<view class="egg_imgs">
					<image src="/static/logonew.png" mode=""></image>
				</view>
				<text>再刷一遍先前失手的项目吧!</text>
			</view>
			<view class="Punctuator" @click="startRedo">继续</view>
		</view>

		<ProgressBar v-if="showBg" :autoPlay="autoPlayEnabled" />
		<Loading v-show="isProps.show" :show="isProps.show" @close="onClose " :Status='isProps.status'
			:name='isProps.name' />
	</view>
</template>

<style lang="scss">
	.listen {
		padding-top: 88rpx;
		width: 750rpx;
		height: 100vh;
		display: flex;
		flex-direction: column;

		.back_top {
			display: flex;
			flex-direction: column;
			gap: 36rpx;
			padding: 20rpx;

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

				.imge {
					display: flex;
					align-items: center;
					gap: 38rpx;

					.cinese {
						width: 44rpx;
						height: 44rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			.proess {
				display: flex;
				justify-content: space-between;

				text {
					font-family: PingFang SC;
					font-weight: 400;
					font-style: Regular;
					font-size: 28rpx;
					text-align: center;
					color: rgba(0, 0, 0, 1);
				}
			}

		}

		.swiper {
			flex: 1;
			display: flex;
			flex-direction: column;

			.top {
				display: flex;
				align-items: center;
				gap: 40rpx;
				padding: 0 20rpx 40rpx;

				.top_imgs {
					width: 100rpx;
					height: 90rpx;
					flex-shrink: 0;

					image {
						width: 100%;
						height: 100%;
						object-fit: contain;
					}
				}

				.chinese {
					.englist {
						font-family: PingFang SC;
						font-weight: 500;
						font-style: Medium;
						font-size: 40rpx;
						color: rgba(0, 0, 0, 1);
					}

					text {
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 36rpx;
						color: rgba(0, 0, 0, 1);
					}
				}
			}

			.swiper_box {
				width: 750rpx;
				border-radius: 25rpx;
				overflow: hidden;
				margin-bottom: 50rpx;

				.imgs_bottom {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: 28rpx;

					.images_main {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						width: 710rpx;
						height: 120rpx;
						border-radius: 24rpx;
						background: rgba(255, 255, 255, 0.6);
						box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
						font-size: 32rpx;
						color: #000;
					}
				}
			}

			.Punctuator {
				pointer-events: auto !important;
				margin: 0rpx 28rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50rpx;
				height: 120rpx;
				background: rgba(250, 218, 64, 1);
				font-size: 32rpx;
				color: #000;
			}

			.Punctuator_active {
				background: rgba(250, 218, 64, 1);
			}
		}

		.error_box {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.error_egg {
				display: flex;
				flex-direction: column;
				align-items: center;

				text {
					font-size: 36rpx;
					color: #000;
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
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 500rpx;
				width: 694rpx;
				height: 120rpx;
				border-radius: 50rpx;
				background: rgba(250, 218, 64, 1);
				font-size: 32rpx;
				color: #000;
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