<script setup lang="ts">
	interface SwiperTs {
		url : string
		name : string
		audio ?: string
		treeTiger ?: string,
		Word ?: string,
		bottleArr ?: bottle[],
		chinese ?: string
		correctIndex ?: number
	}
	interface bottle {
		name : string
		chinese : string
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
		type : number // 学习类型：1=听，2=单词，3=读...
		sliderArr : SwiperTs[] // 该学习类型对应的所有内容
	}
	interface CourseItem {
		id : number
		title : string
		location : string
		type ?: number // 所属等级的type
		Swiper ?: StudyTypeItem[] // 该课程下的所有学习类型内容
	}

	// 导入你封装的TTS
	// import { textToSpeech, stopSpeak } from '@/utils/tts.ts'
	import { ref, watch, nextTick, computed } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
	import Recording from '@/components/Recording/Recording.vue'
	import Loading from '@/components/Status/Status.vue'

	const pageStatus = ref<'normal' | 'review' | 'redoing'>('normal')
	const wrongQuestions = ref<number[]>([])
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
	// TTS播放锁（防重复朗读）
	const isTTSSpeaking = ref(false)
	let isProps = ref({ show: false, status: 0, name: '' })
	let TextActive = ref<number>(null)
	let ListenType = ref<number>(0)
	let autoPlayEnabled = ref<boolean>(false)
	let autoPlayRunning = ref<boolean>(false)
	let SwiperArr = ref<StudyTypeItem | null>(null)
	let isAudioLoading = ref<boolean>(false)
	let lastAnswerCorrect = ref(false)
	// 切换翻译
	const toggleChinese = () => {
		showChinese.value = !showChinese.value
	}
	// 校验是否可提交
	const canCheck = computed(() => {
		return TextActive.value !== null
	})

	const FetchWiper = (id : number, type : number) => {
		const findArr = leverDetail.value.find(item => item.id === id)
		if (findArr && findArr.Swiper) {
			SwiperArr.value = findArr.Swiper.find(item => item.type === type)
		}
	}

	const isLastSlide = () => {
		if (!SwiperArr.value) return true
		return IndexCurrent.value === SwiperArr.value.sliderArr.length - 1
	}

	// 下一题逻辑（删除所有原生音频调用）
	const goNext = () => {
		if (!SwiperArr.value) return
		// 切换题目停止TTS，防止旁白残留
		stopSpeak()

		const total = SwiperArr.value.sliderArr.length
		if (pageStatus.value === 'normal') {
			if (IndexCurrent.value < total - 1) {
				IndexCurrent.value++
				TextActive.value = null
			} else {
				isFinished.value = true
				wrongQuestions.value.length > 0 ? (pageStatus.value = 'review') : uni.navigateTo({
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

	const startRedo = () => {
		pageStatus.value = 'redoing'
		redoIndex.value = 0
		IndexCurrent.value = wrongQuestions.value[0]
		TextActive.value = null
	}

	// 提交检查（弹框逻辑 完全不变）
	const PunctuatorClick = () => {
		if (!canCheck.value || !SwiperArr.value) return
		const currentItem = SwiperArr.value.sliderArr[IndexCurrent.value]
		if (!currentItem?.bottleArr) return

		// 1. 获取用户选中的选项
		const selectedOption = currentItem.bottleArr[TextActive.value]

		// 2. 判断用户选的这个选项是否正确（看 isTrue）
		const isCorrect = selectedOption.isTrue === true

		// 3. 找到真正正确的那个答案（用于答错时显示）
		const correctAnswer = currentItem.bottleArr.find(item => item.isTrue === true)

		lastAnswerCorrect.value = isCorrect

		// 错题收集
		if (!isCorrect && pageStatus.value === 'normal' && !wrongQuestions.value.includes(IndexCurrent.value)) {
			wrongQuestions.value.push(IndexCurrent.value)
		}

		// 给弹窗赋值
		isProps.value.show = true
		isProps.value.status = isCorrect ? 1 : 0
		isProps.value.name = isCorrect ? '' : (correctAnswer?.name || '未知答案')
	}

	const back = () => {
		// 仅停止TTS
		stopSpeak()
		uni.navigateBack()
	}

	// 点击选项播放TTS
	const UserText = async (selectedOption, index : number) => {
		// 防重复点击
		if (isTTSSpeaking.value) return
		// 选中选项
		TextActive.value = index
		try {
			isTTSSpeaking.value = true
			stopSpeak() // 先停掉之前的发音
			await textToSpeech(selectedOption.name, true) // 朗读选项
		} catch (err) {
			console.error('选项朗读失败', err)
		} finally {
			isTTSSpeaking.value = false
		}
	}

	// ✅ 新增：点击播放图标触发TTS朗读当前题目
	const audioClick = async () => {
		if (!SwiperArr.value) return
		const currentItem = SwiperArr.value.sliderArr[IndexCurrent.value]
		if (!currentItem) return

		try {
			isTTSSpeaking.value = true
			stopSpeak()
			// 朗读当前题目的name（或你想朗读的字段）
			await textToSpeech(currentItem.name, true)
		} catch (err) {
			console.error('TTS播放失败:', err)
		} finally {
			isTTSSpeaking.value = false
		}
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
	})
</script>

<template>
	<view class="listen">
		<view class=" " v-if="pageStatus === 'normal' || pageStatus==='redoing'">
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
					<progress :percent="((IndexCurrent + 1) / (SwiperArr?.sliderArr.length || 1)) * 100"
						stroke-width="22rpx" activeColor='rgba(250, 218, 64, 1)' style="width: 630rpx;" />
					<text>{{IndexCurrent+1}}/{{SwiperArr?.sliderArr?.length || 0}}</text>
				</view>
			</view>

			<view class="swiper">
				<view class="top">
					<!-- 点击播放图标 → 触发TTS朗读 -->
					<view class="top_imgs" @click="audioClick">
						<image src="/static/listning.png" mode="widthFix"></image>
					</view>
					<!-- ✅ 修复：用正确的 sliderArr 访问，并加可选链 -->
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
								<text v-if="showChinese">{{item.chinese}}</text>
							</view>
						</template>
					</view>
				</view>

				<!-- 检查按钮：选择完成后点击弹框 -->
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
					/* 禁止被压缩 */
					flex-grow: 0;

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
				height: 500rpx;
				border-radius: 25rpx;
				overflow: hidden;

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
			margin-top: 100rpx;
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