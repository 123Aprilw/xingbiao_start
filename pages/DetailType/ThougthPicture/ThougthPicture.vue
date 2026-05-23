<script setup lang="ts">
	import { ref, computed, toRaw } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	import { LookPicture, PostLookPicture } from '@/utils/api.ts'
	import { playTTS } from '@/utils/tts.ts'
	import Loading from '@/components/Status/Status.vue'

	interface Question {
		id : number
		title_image : string
		answer : string
		options : Array<{ value : string, key : string }>
	}

	interface ApiResponse {
		count : number
		list : Question[]
		quiz_token : string
	}
	const lever_list = ref()
	const BooksId = ref<number>(0)
	const originalTotal = ref(0)
	const wrongIds = ref<number[]>([])
	const pageStatus = ref<'normal' | 'review' | 'redoing'>('normal')
	const currentIndex = ref(0)
	const wrongCurrentIndex = ref(0)
	const correctInRedo = ref(0)
	const BASE_URL = 'https://xingbiao.demo.zhongti-group.com'
	let isProps = ref({ show: false, status: 0, name: '' })
	let selectedIndex = ref<number>(-1)
	let SwiperData = ref<ApiResponse>({ count: 0, list: [], quiz_token: '' })

	// ✅ 修复：重刷模式下，只渲染错题列表
	const redoQuestions = computed(() => {
		return SwiperData.value.list.filter(item => wrongIds.value.includes(item.id))
	})

	const currentQuestion = computed(() => {
		if (pageStatus.value === 'redoing') {
			return redoQuestions.value[wrongCurrentIndex.value] || null
		}
		return SwiperData.value?.list?.[currentIndex.value] || null
	})

	// ✅ 修复：重刷模式进度计算，避免空值
	const progressText = computed(() => {
		// 正常做题
		if (pageStatus.value === 'normal') {
			return `${currentIndex.value + 1}/${originalTotal.value}`
		}

		const total = originalTotal.value + wrongIds.value.length // 分母永远不变
		let current = 0

		// 错题提示页
		if (pageStatus.value === 'review') {
			current = originalTotal.value
		}

		// 重刷页：核心！切题就动！和对错无关！
		if (pageStatus.value === 'redoing') {
			current = originalTotal.value + wrongCurrentIndex.value + 1
		}

		return `${current}/${total}`
	})
	const progressPercent = computed(() => {
		// 正常做题
		if (pageStatus.value === 'normal') {
			return ((currentIndex.value + 1) / originalTotal.value) * 100
		}

		const total = originalTotal.value + wrongIds.value.length
		let current = 0

		if (pageStatus.value === 'review') {
			current = originalTotal.value
		}

		if (pageStatus.value === 'redoing') {
			current = originalTotal.value + wrongCurrentIndex.value + 1
		}

		return total ? (current / total) * 100 : 0
	})
	const canCheck = computed(() => selectedIndex.value !== -1)

	const playWord = (text : string) => {
		if (!text) return
		playTTS(text, { speed: 50, lang: 'en' })
	}

	const selectOption = (index : number, option : { value : string }) => {
		selectedIndex.value = index
		playWord(option.value)
	}

	const FetchWiper = async (id : number) => {
		try {
			const res = await LookPicture(String(id), 'app')
			SwiperData.value = res.data
			originalTotal.value = res.data.list.length
		} catch (err) {
			console.error('获取题目失败', err)
		}
	}

	// ✅ 修复：错题记录逻辑，去掉不必要的 pageStatus 判断
	const checkAnswer = () => {
		if (!canCheck.value) return
		const q = currentQuestion.value
		const selectedOption = q?.options[selectedIndex.value]
		const isCorrect = selectedOption.key === q?.answer
		// 去掉 pageStatus 判断，确保正常模式下的错题能被记录
		if (pageStatus.value === 'normal' && !isCorrect && !wrongIds.value.includes(q.id)) {
			wrongIds.value.push(q.id)
		}
		if (pageStatus.value === 'redoing' && isCorrect) {
			correctInRedo.value++
		}
		isProps.value.show = true
		isProps.value.status = isCorrect ? 1 : 0
		isProps.value.name = isCorrect ? '' : q.options.find(o => o.key === q.answer)?.value
	}

	const goNext = async () => {
		selectedIndex.value = -1
		const total = SwiperData.value.list.length

		if (pageStatus.value === 'normal') {
			if (total === 0) return
			if (currentIndex.value < total - 1) {
				currentIndex.value++
			} else {
				if (wrongIds.value.length > 0) {
					pageStatus.value = 'review'
				} else {
					// 全对 → 直接提交并跳转
					await submitResult()
					uni.navigateTo({ url: `/pages/Bones/Bones?id=${BooksId.value}` })
				}
			}
			return
		}

		if (pageStatus.value === 'redoing') {
			if (wrongCurrentIndex.value < redoQuestions.value.length - 1) {
				wrongCurrentIndex.value++
			} else {
				await submitResult()
				uni.navigateTo({ url: `/pages/Bones/Bones?id=${BooksId.value}&lever=${lever_list.value}` })
			}
		}
	}

	const submitResult = async () => {
		try {
			const pureErrorIds = toRaw(wrongIds.value)
			console.log(pureErrorIds)
			const res = await PostLookPicture(
				SwiperData.value.quiz_token,
				BooksId.value.toString(),
				pureErrorIds,
				'app'
			)
			console.log(res)
		} catch (err) {
			console.error('提交失败', err)
			uni.showToast({ title: '提交失败，请重试', icon: 'none' })
		}
	}

	// ✅ 修复：startRedo 里强制处理错题列表，避免空数组
	const startRedo = () => {
		// 如果没有错题，直接跳转到提交页
		if (wrongIds.value.length === 0) {
			submitResult()
			uni.navigateTo({ url: `/pages/Bones/Bones?id=${BooksId.value}&lever=${lever_list.value}` })
			return
		}
		pageStatus.value = 'redoing'
		wrongCurrentIndex.value = 0
		correctInRedo.value = 0
		selectedIndex.value = -1
	}

	const onClose = () => {
		isProps.value.show = false
		goNext()
	}

	const back = () => {
		uni.navigateBack()
	}

	onLoad(async (e) => {
		lever_list.value = e.lever
		console.log(e.type)
		BooksId.value = Number(e.id)
		await FetchWiper(Number(e.id))
	})
</script>

<template>
	<view class="listen">
		<!-- 顶部栏：永远渲染，进度条只在 review 状态隐藏 -->
		<view class="back_top">
			<view class="p1">
				<view class="text_back" @click="back()">
					<image src="/static/left.png" mode=""></image>
				</view>
				<view style="margin-right: 30rpx;">看图识词</view>
				<view></view>
			</view>
			<!-- 进度条：只有 review 状态隐藏，normal/redoing 都显示 -->
			<view class="proess">
				<progress :percent="progressPercent" stroke-width="22rpx" border-radius='20rpx'
					activeColor='rgba(250, 218, 64, 1)' style="width: 630rpx;" />
				<text>{{ progressText }}</text>
			</view>
		</view>

		<!-- 正常/重刷模式：swiper 区域 -->
		<view class="swiper" v-if="pageStatus === 'normal' || pageStatus === 'redoing'">
			<view class="swiper_box">
				<swiper class="swiper" :current="pageStatus === 'redoing' ? wrongCurrentIndex : currentIndex"
					:indicator-dots="false" :duration="500" touchable="false">
					<swiper-item v-for="(item, index) in pageStatus === 'redoing' ? redoQuestions : SwiperData.list"
						:key="item.id">
						<view class="swiper-item">
							<view class="imgs_text">
								<image :src="BASE_URL + item.title_image" mode="widthFix"></image>
							</view>
							<view class="imgs_bottom">
								<view class="imags_main" v-for="(option, optIndex) in item.options" :key="optIndex"
									:style="{background: selectedIndex === optIndex ? 'rgba(250, 218, 64, 1)' : 'rgba(255, 255, 255, 0.6)'}"
									@click="selectOption(optIndex, option)">
									{{ option.value }}
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<view class="Punctuator" @click="checkAnswer" :class="{Punctuator_active: canCheck}">
				检查
			</view>
		</view>

		<!-- review模式（错题提示页） -->
		<view class="error_box" v-if="pageStatus === 'review'">
			<view class="error_egg">
				<view class="egg_imgs">
					<image src="/static/logonew.png" mode=""></image>
				</view>
				<text>再刷一遍先前失手的题目吧!</text>
			</view>
			<view class="Punctuator" @click="startRedo">继续</view>
		</view>

		<Loading v-show="isProps.show" :show="isProps.show" @close="onClose" :Status='isProps.status'
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
			}

			.proess {
				display: flex;
				justify-content: space-between;
			}
		}

		.swiper {
			flex: 1;
			display: flex;
			flex-direction: column;

			.swiper_box {
				width: 750rpx;
				height: 950rpx;
				border-radius: 25rpx;
				overflow: hidden;

				.swiper {
					width: 100%;
					height: 100%;
					pointer-events: none;

					.swiper-item {
						width: 750rpx;
						height: 100%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;
						padding: 20rpx;
						box-sizing: border-box;
						gap: 30rpx;

						.imgs_text {
							width: 700rpx;
							height: 700rpx;

							image {
								width: 100% !important;
								height: 100% !important;
								border-radius: 20rpx;
							}
						}

						.imgs_bottom {
							pointer-events: auto;
							display: flex;
							flex-direction: column;
							align-items: center;
							gap: 28rpx;

							.imags_main {
								display: flex;
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
				background: #fff;
				border: 1px solid #ddd;
				font-size: 32rpx;
				color: #000;
				transition: all 0.3s ease;
			}

			.Punctuator_active {
				background: rgba(250, 218, 64, 1);
				border: none;
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