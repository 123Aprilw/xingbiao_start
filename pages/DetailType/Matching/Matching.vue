	<script setup lang="ts">
	interface SwiperTs {
		url : string
		name : string
		audio ?: string
		treeTiger ?: string,
		Word ?: string
		bottleArr ?: any[]
	}
	interface PropsTs {
		show : boolean,
		fontSize : string,
		videoChange : string
	}
	interface StudyListen {
		title : string,
		audio ?: string
		listenArr : ListenTs[]
	}
	interface ListenTs {
		name : string,
		url : string,
		key ?: string
	}
	interface ListTs {
		id : number,
		title : string,
		location : string,
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
	import { ref, watch, nextTick, computed } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
	import Recording from '@/components/Recording/Recording.vue'
	import Loading from '@/components/Status/Status.vue'
	// import { textToSpeech, stopSpeak, isPlaying } from '@/utils/tts.ts'

	const pageStatus = ref<'normal' | 'review' | 'redoing'>('normal')
	const wrongList = ref<number[]>([])
	const isFinished = ref(false)
	let Typeis = ref<number>(0)
	const wrongQuestions = ref<number[]>([])
	const redoIndex = ref(0)
	let isPressiom = ref<boolean>(false)
	let isProps = ref({
		show: false,
		status: 0,
		name: ''
	})
	let IndexCurrent = ref<number>(0)
	const pageSize = 1
	const totalPages = 2

	const totalQuestions = computed(() => {
		return SwiperArr.value?.listenIng?.length || 0
	})

	const currentPage = computed(() => {
		return IndexCurrent.value + 1
	})

	const progressPercent = computed(() => {
		return (currentPage.value / totalPages) * 100
	})

	const pageText = computed(() => {
		return `${currentPage.value}/${totalPages}`
	})

	let BonesId = ref<number>(0)
	let showBg = ref<boolean>(false)
	let autoPlayEnabled = ref<boolean>(false)
	let autoPlayRunning = ref<boolean>(false)
	let SwiperArr = ref<StudyTypeItem | null>(null)

	let showChinese = ref(false)
	let FontSize = ref<string>('')
	let speedValue = ref<number>(0.5)

	// 拆分英文/中文列表
	const currentBottleArr = computed(() => {
		if (!SwiperArr.value?.sliderArr?.[IndexCurrent.value]?.bottleArr) return []
		return SwiperArr.value.sliderArr[IndexCurrent.value].bottleArr
	})
	const englishList = computed(() => currentBottleArr.value.slice(0, 4))
	const chineseList = computed(() => currentBottleArr.value.slice(4, 8))

	// 选中下标
	let selectedEnglish = ref<number | null>(null)
	let selectedChinese = ref<number | null>(null)

	// 最终锁定配对（变灰）
	const matchedPairs = ref<{ eng : number, chn : number }[]>([])
	// 临时正确绿色、临时错误红色
	const tempGreenEng = ref<number | null>(null)
	const tempGreenChn = ref<number | null>(null)
	const tempRedEng = ref<number | null>(null)
	const tempRedChn = ref<number | null>(null)

	// 全部配对完成
	const allMatched = computed(() => matchedPairs.value.length === 4)

	// 是否最终锁定
	const isEngLocked = (idx : number) => matchedPairs.value.some(i => i.eng === idx)
	const isChnLocked = (idx : number) => matchedPairs.value.some(i => i.chn === idx)

	// 选英文
	const selectEnglish = (idx : number) => {
		// 已经锁定的不能再点
		if (isEngLocked(idx)) return
		// 清空临时状态（如果有之前的临时状态）
		clearTempStatus()
		selectedEnglish.value = idx
		if (selectedChinese.value !== null) {
			autoCheckMatch()
		}
	}

	// 选中文
	const selectChinese = (idx : number) => {
		if (isChnLocked(idx)) return
		clearTempStatus()
		selectedChinese.value = idx
		if (selectedEnglish.value !== null) {
			autoCheckMatch()
		}
	}

	// 清空所有临时颜色
	const clearTempStatus = () => {
		tempGreenEng.value = null
		tempGreenChn.value = null
		tempRedEng.value = null
		tempRedChn.value = null
	}

	// 校验配对
	const autoCheckMatch = () => {
		if (selectedEnglish.value === null || selectedChinese.value === null) return

		const eng = selectedEnglish.value
		const chn = selectedChinese.value
		const engItem = englishList.value[eng]
		const chnItem = chineseList.value[chn]

		// 1. 找到这个英文选项对应的【真正正确的中文】
		// 用英文name匹配中文的name，然后取它的typeName
		const correctChnItem = chineseList.value.find(item => item.name === engItem.name)

		// 2. 配对判断：用户选的中文name === 英文name（和正确答案比对）
		const isRight = chnItem.name === engItem.name

		if (isRight) {
			tempGreenEng.value = eng
			tempGreenChn.value = chn

			setTimeout(() => {
				matchedPairs.value.push({ eng, chn })
				clearTempStatus()
			}, 800)
		} else {
			tempRedEng.value = eng
			tempRedChn.value = chn

			if (!wrongQuestions.value.includes(IndexCurrent.value)) {
				wrongQuestions.value.push(IndexCurrent.value)
			}
			// 3. 弹窗文案：英文name → 正确的中文typeName
			isProps.value.name = `${engItem.name} → ${correctChnItem?.typeName || '未知'}`
			isProps.value.show = true
			isProps.value.status = 0
		}

		selectedEnglish.value = null
		selectedChinese.value = null
	}

	// 点击“知道啦”关闭弹窗，此时才把错误按钮变回白色
	const onClose = () => {
		isProps.value.show = false
		clearTempStatus()
		if (isProps.value.status === 1) {
			// 判断是不是最后一页
			const isLastPage = IndexCurrent.value === totalPages - 1

			if (isLastPage) {
				// 最后一页：直接跳彩蛋
				uni.navigateTo({
					url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}`
				})
			} else {
				// 不是最后一页：正常下一题
				nextQuestion()
			}
		}
	}

	// 检查下一页
	const PunctuatorClick = () => {
		if (!allMatched.value) return
		isProps.value.show = true
		isProps.value.status = 1
		isProps.value.name = "全部配对正确！"
	}

	const FetchWiper = (id : number, type : number) => {
		const findArr = leverDetail.value.find(item => item.id === id)
		SwiperArr.value = findArr?.Swiper?.find(item => item.type === type) || null
	}

	const audioClick = async () => {
		if (!SwiperArr.value) return
		const currentText = SwiperArr.value.sliderArr[IndexCurrent.value].name
		if (!currentText) return
		await textToSpeech(currentText, true, 1.0)
	}

	const toggleChinese = () => {
		showChinese.value = !showChinese.value
	}
	const showModel = () => {
		showBg.value = !showBg.value
	}
	const closeValue = (val : boolean) => {
		showBg.value = val
	}
	const confirm = (val : PropsTs) => {
		if (SwiperArr.value?.type !== 2) {
			FontSize.value = val.fontSize
			autoPlayEnabled.value = val.show
			let s = Number(val.videoChange)
			s = Math.max(0.5, Math.min(1.5, s))
			speedValue.value = s
		}
		showBg.value = false
		saveSettings()
	}
	const saveSettings = () => {
		if (SwiperArr.value?.type === 2) return
		uni.setStorageSync('listenSettings', {
			autoPlayEnabled: autoPlayEnabled.value,
			FontSize: FontSize.value,
			speedValue: speedValue.value
		})
	}
	const back = () => {
		stopSpeak()
		uni.navigateBack()
	}

	// 下一题重置所有状态
	const nextQuestion = () => {
		stopSpeak()
		selectedEnglish.value = null
		selectedChinese.value = null
		matchedPairs.value = []
		clearTempStatus()
		if (pageStatus.value === 'normal') {
			// 判断：是不是最后一页
			const isLastPage = IndexCurrent.value === totalPages - 1

			if (!isLastPage) {
				// 不是最后一页 → 正常下一题
				IndexCurrent.value++
			} else {
				// 是最后一页 + 全部正确 → 跳彩蛋页面
				uni.navigateTo({
					url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}`
				})
			}
			return
		}
		if (pageStatus.value === 'redoing') {
			redoIndex.value++
			if (redoIndex.value < wrongQuestions.value.length) {
				IndexCurrent.value = wrongQuestions.value[redoIndex.value]
			} else {
				uni.navigateTo({
					url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}`
				})
			}
		}
	}

	const getGo = () => {
		pageStatus.value = 'redoing'
		redoIndex.value = 0
		IndexCurrent.value = wrongQuestions.value[0]
		selectedEnglish.value = null
		selectedChinese.value = null
		matchedPairs.value = []
		clearTempStatus()
	}

	onLoad((e) => {
		BonesId.value = Number(e.id)
		Typeis.value = Number(e.type)
		FetchWiper(Number(e.id), Number(e.type))
		if (SwiperArr.value?.type !== 2) {
			const data = uni.getStorageSync('listenSettings')
			if (data) {
				autoPlayEnabled.value = data.autoPlayEnabled
				FontSize.value = data.FontSize
				speedValue.value = data.speedValue
			}
		}
	})

	onUnload(() => {
		stopSpeak()
	})
	</script>

	<template>
		<view class="listen">
			<view class="back_top">
				<view class="p1">
					<view class="text_back" @click="back()">
						<image src="/static/left.png" mode=""></image>
					</view>
					<text>中英文配对</text>
					<view class="" @click="showModel">
					</view>
				</view>
				<view class="proess">
					<progress :percent="progressPercent" stroke-width="22rpx" border-radius='20rpx'
						activeColor='rgba(250, 218, 64, 1)' style="width: 630rpx;" />
					<text>{{pageText}}</text>
				</view>
			</view>

			<view class="list_top" v-if="pageStatus === 'normal' || pageStatus==='redoing'">
				<view class="matching-container">
					<!-- 英文 -->
					<view class="column">
						<view class="center_box" @tap="selectEnglish(index)" :class="{ 
								// 选中黄色
								isBg: selectedEnglish === index && !isEngLocked(index),
								// 临时绿色
								tempGreen: tempGreenEng === index,
								// 临时红色
								tempRed: tempRedEng === index,
								// 最终锁定灰色
								locked: isEngLocked(index)
							}" v-for="(item,index) in englishList" :key="'eng-' + index">
							<view class="box_bottom">
								{{item.name}}
							</view>
						</view>
					</view>

					<!-- 中文 -->
					<view class="column">
						<view class="center_box" @tap="selectChinese(index)" :class="{ 
								isBg: selectedChinese === index && !isChnLocked(index),
								tempGreen: tempGreenChn === index,
								tempRed: tempRedChn === index,
								locked: isChnLocked(index)
							}" v-for="(item,index) in chineseList" :key="'chn-' + index">
							<view class="box_bottom">
								{{item.typeName || item.name}}
							</view>
						</view>
					</view>
				</view>

				<view class="Punctuator" @click="PunctuatorClick" :class="{Punctuator_active: allMatched}"
					:style="{ opacity: allMatched ? 1 : 0.6, pointerEvents: allMatched ? 'auto' : 'none' }">
					检查
				</view>
			</view>

			<Loading v-show="isProps.show" :show="isProps.show" @close="onClose " :Status='isProps.status'
				:name='isProps.name' />
			<ProgressBar v-show="showBg" @closeModel='closeValue' @confirmModel='confirm' :autoPlay="autoPlayEnabled"
				:font-size="FontSize" :speed="speedValue" />
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
					align-items: center;

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
					align-items: center;
				}
			}

			.list_top {
				flex: 1;
				background-color: rgba(245, 246, 250, 1);
				display: flex;
				flex-direction: column;
				gap: 52rpx;
				padding: 25rpx 24rpx;

				.matching-container {
					display: flex;
					justify-content: space-between;
					gap: 20rpx;
					width: 100%;
				}

				.column {
					flex: 1;
					display: flex;
					flex-direction: column;
					gap: 20rpx;
				}

				.center_box {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 344rpx;
					height: 120rpx;
					border-radius: 24rpx;
					box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
					background: rgba(255, 255, 255, 0.6);
					transition: all 0.3s ease;

					.box_bottom {
						font-size: 28rpx;
						text-align: center;
					}
				}

				// 选中黄色
				.isBg {
					background: rgba(250, 218, 64, 0.2);
					border: 1px solid rgba(250, 218, 64, 1);
					box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
				}

				// 临时正确绿色
				.tempGreen {
					background: #e6f7e6 !important;
					border: 2rpx solid #4cd964;

					.box_bottom {
						color: #4cd964;
						font-weight: bold;
					}
				}

				// 临时错误红色
				.tempRed {
					background: rgba(255, 60, 60, 1);
					box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);

					.box_bottom {
						font-family: PingFang SC;
						font-weight: 500;
						font-style: Medium;
						font-size: 32rpx;
						color: rgba(255, 255, 255, 1);
					}
				}

				// 最终配对完成 变灰锁定
				.locked {
					background: #f5f5f5 !important;
					opacity: 0.65;
					border: 2rpx solid #eee;
					pointer-events: none;

					.box_bottom {
						color: #999;
					}
				}

				.Punctuator {
					margin-top: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50rpx;
					width: 694rpx;
					height: 120rpx;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
					font-size: 32rpx;
					color: rgba(0, 0, 0, 1);
					transition: all 0.28s ease-out;
				}

				.Punctuator_active {
					background: rgba(250, 218, 64, 1) !important;
				}

				.Punctuator:active {
					transform: scale(0.96);
					opacity: 0.92;
				}
			}

			.error_box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				flex: 1;

				.error_egg {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					text {
						font-size: 36rpx;
						color: #000;
						margin-top: 20rpx;
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
					margin-top: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50rpx;
					width: 694rpx;
					height: 120rpx;
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