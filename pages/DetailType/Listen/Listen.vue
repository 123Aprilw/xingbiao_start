<script setup lang="ts">
	interface listTs {
		id : number,
		title : string,
		cover_image : string,
		content : string,
		word ?: string,
		phonetic ?: string,
		explain_cn ?: string,
		word_image ?: string
	}
	interface SwiperTs {
		count : number
		list : listTs[]
		listen_token : string
		word_token ?: string
		book_listen_token ?: string
		work_listen_token ?: string
	}
	interface PropsTs {
		show : boolean,
		fontSize : string,
		videoChange : number
	}
	import { ref, watch, nextTick, computed } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
	import { GetListenData, PostListenData, GetWorldData, PostWorldData, GetReadData, PostReadData } from '@/utils/api'
	import { playTTS, stopTTS, destroyTTS, setTtsPlayEndCallback } from '@/utils/tts.ts'
	let BackId = ref<number | string>(0)
	//控制type显示隐藏
	let readId = ref<number>(0)
	let BonesId = ref<number>(0)
	let isActive = ref<boolean>(false)
	let playing = ref<boolean>(false)
	let IndexCurrent = ref<number>(0)
	let showBg = ref<boolean>(false)
	let BonesType = ref<number>(null)
	let SwiperData = ref({ interval: 2000, duration: 500 })
	let autoPlayEnabled = ref<boolean>(false)
	let SwiperArr = ref<any>(null)
	let speedValue = ref<number>(0.5)
	let ApiData = ref<SwiperTs>()
	let FontSize = ref<string>('')
	let showChinese = ref(false)
	let lever_List = ref<string>('')
	const listenedIds = ref<number[]>([])
	const currentBookItemId = ref<number | null>(null)
	const convertSpeed = (uiSpeed : number) : number => {
		return 20 + ((uiSpeed - 0.5) / 1.5) * 60
	}
	//原有听
	const FetchWiper = async (id : string) => {
		try {
			const res = await GetListenData(id, 'app')
			SwiperArr.value = res.data.list
			ApiData.value = res.data
			console.log(ApiData.value)
		} catch (error) {
			console.log(error)
		}
	}
	//单词
	const FetchWorld = async (id : string) => {
		try {
			const res = await GetWorldData(id, 'app')
			SwiperArr.value = res.data.list
			ApiData.value = res.data
		} catch (err) {
			console.log(err)
		}
	}
	//新增绘本听
	const FetchBookListen = async (id : string) => {
		try {
			const res = await GetReadData(id, 'app')
			SwiperArr.value = res.data.list
			ApiData.value = res.data
			if (SwiperArr.value?.length > 0) {
				const firstItem = SwiperArr.value[0]
				currentBookItemId.value = firstItem.id
				console.log('✅ 初始化绘本项ID：', currentBookItemId.value)
			}
		} catch (err) {
			console.log(err)
		}
	}
	const ttsSpeak = (text : string, isEnglish : boolean, customSpeed ?: number) => {
		const voice = isEnglish ? 'catherine' : 'x4_yezi'
		const ttsSpeed = customSpeed ?? convertSpeed(speedValue.value)
		console.log(`ttsSpeed: ${ttsSpeed}`)
	}

	const playCurrent = () => {
		if (!SwiperArr.value || !SwiperArr.value[IndexCurrent.value]) return

		const item = SwiperArr.value[IndexCurrent.value]
		const englishText = item.title || item.word
		const chineseText = item.content
		const curId = item.id

		if (!listenedIds.value.includes(curId)) {
			listenedIds.value.push(curId)
		}

		playing.value = true

		let speed = 80
		if (BonesId.value !== 2) {
			speed = convertSpeed(speedValue.value)
		}

		playTTS(englishText, { speed, lang: 'en' })

		setTtsPlayEndCallback(async () => {
			if (BonesId.value === 2) {
				playing.value = false
				const isLast = IndexCurrent.value === SwiperArr.value.length - 1
				if (isLast) {
					uni.setStorageSync(`word_finished_${BackId.value}`, true)
					await submitListenProgress()
					setTimeout(() => {
						stopTTS()
						uni.navigateTo({
							url: `/pages/Bones/Bones?id=${BackId.value}&lever=${lever_List.value}`
						})
					}, 500)
					return
				}
				if (autoPlayEnabled.value && BonesId.value !== 3) {
					setTimeout(() => {
						IndexCurrent.value += 1
						playCurrent()
					}, 300)
				}
				return
			}

			if (showChinese.value && chineseText) {
				stopTTS()
				playTTS(chineseText, { speed, lang: 'zh' })
				setTtsPlayEndCallback(async () => {
					playing.value = false
					const isLast = IndexCurrent.value === SwiperArr.value.length - 1
					if (isLast) {
						if (BonesId.value === 1) {
							uni.setStorageSync(`listen_finished_${BackId.value}`, true)
						} else if (BonesId.value === 3) {
							uni.setStorageSync(`book_listen_finished_${BackId.value}`, true)
						}
						await submitListenProgress()
						setTimeout(() => {
							stopTTS()
							uni.navigateTo({
								url: `/pages/Bones/Bones?id=${BackId.value}&lever=${lever_List.value}`
							})
						}, 500)
						return
					}
					if (autoPlayEnabled.value && BonesId.value !== 3) {
						setTimeout(() => {
							IndexCurrent.value += 1
							playCurrent()
						}, 300)
					}
				})
			} else {
				playing.value = false
				const isLast = IndexCurrent.value === SwiperArr.value.length - 1
				if (isLast) {
					if (BonesId.value === 1) {
						uni.setStorageSync(`listen_finished_${BackId.value}`, true)
					} else if (BonesId.value === 3) {
						uni.setStorageSync(`book_listen_finished_${BackId.value}`, true)
					}
					uni.setStorageSync(`read_finished_${BackId.value}`, true)
					await submitListenProgress()
					setTimeout(() => {
						stopTTS()
						uni.navigateTo({
							url: `/pages/Bones/Bones?id=${BackId.value}&lever=${lever_List.value}`
						})
					}, 500)
					return
				}
				if (autoPlayEnabled.value && BonesId.value !== 3 && IndexCurrent.value < SwiperArr.value.length - 1) {
					setTimeout(() => {
						IndexCurrent.value += 1
						playCurrent()
					}, 300)
				}
			}
		})
	}
	//提交 自动区分 听/单词/绘本听
	const submitListenProgress = async () => {
		let token = ''
		if (BonesId.value === 2) {
			token = ApiData.value?.word_token || ''
		} else if (BonesId.value === 1) {
			token = ApiData.value?.listen_token || ''
		} else if (BonesId.value === 3) {
			console.log(ApiData.value)
			token = ApiData.value?.work_listen_token || ''
			uni.setStorageSync(`book_listen_finished_${BackId.value}`, true)
		}
		if (!token) {
			console.log('暂无 token，不提交')
			return
		}
		if (listenedIds.value.length === 0) {
			console.log('没有收听ID，不提交')
			return
		}
		const pureNumberIds = [...listenedIds.value]
		console.log('✅ 最终提交的真实ID数组：', pureNumberIds)
		try {
			let res
			if (BonesId.value === 2) {
				res = await PostWorldData(
					ApiData.value.word_token,
					String(BackId.value),
					listenedIds.value,
					'app'
				)
				console.log('✅ 单词进度提交成功', res)
			} else if (BonesId.value === 1) {
				res = await PostListenData(
					ApiData.value.listen_token,
					String(BackId.value),
					listenedIds.value,
					'app'
				)
				console.log('✅ 句子进度提交成功', res)
			} else if (BonesId.value === 3) {
				res = await PostReadData(
					token,
					String(BackId.value),
					listenedIds.value,
					'app'
				)
				console.log('✅ 绘本听提交成功', res)
			}
		} catch (err) {
			console.error('提交失败', err)
		}
	}
	// 播放按钮
	const start = () => {
		console.log(SwiperArr.value[IndexCurrent.value])
		if (playing.value) {
			stop()
		} else {
			playCurrent()
		}
	}
	const stop = () => {
		stopTTS()
		playing.value = false
	}
	const toggleChinese = () => {
		showChinese.value = !showChinese.value
	}
	const onSwiperChange = (e) => {
		const newIndex = e.detail.current
		const isUserSwiped = !autoPlayEnabled.value

		if (isUserSwiped) {
			stop()
		}

		IndexCurrent.value = newIndex
		console.log('📌 当前 swiper 索引更新为：', IndexCurrent.value)
		if (BonesId.value === 3) {
			const currentItem = SwiperArr.value?.[newIndex]
			if (currentItem) {
				currentBookItemId.value = currentItem.id
				console.log('✅ 当前绘本项真实ID：', currentBookItemId.value)
			}
		}
		if (autoPlayEnabled.value && !playing.value) {
			setTimeout(() => {
				playCurrent()
			}, 100)
		}
	}
	const back = () => {
		stop()
		uni.navigateTo({
			url: `/pages/BooksDetail/Books?id=${BackId.value}&lever=${lever_List.value}`
		})
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
			speedValue.value = val.videoChange
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
	const slowPlay = async () => {
		if (playing.value) return
		if (!SwiperArr.value || !SwiperArr.value[IndexCurrent.value]) return
		const item = SwiperArr.value[IndexCurrent.value]
		const englishText = item.title || item.word
		if (!englishText || englishText.trim() === '') return
		try {
			stopTTS()
			playing.value = true
			playTTS(englishText, { speed: 20, lang: 'en' })
			setTtsPlayEndCallback(() => {
				playing.value = false
			})
		} catch (err) {
			console.error('慢速播放失败：', err)
			playing.value = false
		}
	}

	// ✅ 修复1：currentText 正确读取 SwiperArr.value
	const currentText = computed(() => {
		if (!SwiperArr.value?.length) return ''
		const item = SwiperArr.value[IndexCurrent.value]
		return item?.title || item?.word || ''
	})

	// ✅ 修复2：监听 IndexCurrent 变化，打印调试日志
	watch(IndexCurrent, (newVal) => {
		console.log('📌 IndexCurrent 变化：', newVal)
		console.log('📌 当前项数据：', SwiperArr.value?.[newVal])
		console.log('📌 currentText：', currentText.value)

	})

	onLoad(async (e) => {
		lever_List.value = e.lever
		BonesId.value = Number(e.type)
		BackId.value = String(e.id)
		//1=普通听 2=单词 3=绘本听
		if (BonesId.value === 1 || BonesId.value === 3) {
			console.log(e)
			if (BonesId.value === 1) {
				await FetchWiper(String(e.id))
			} else {
				await FetchBookListen(String(e.id))
			}
		}
		if (BonesId.value === 2) {
			await FetchWorld(String(e.id))
		}
		if (BonesId.value !== 2) {
			const data = uni.getStorageSync('listenSettings')
			if (data) {
				autoPlayEnabled.value = data.autoPlayEnabled
				FontSize.value = data.FontSize
				speedValue.value = data.speedValue
			}
		}
	})

	onUnload(async () => {
		destroyTTS()
		await submitListenProgress()
	})
</script>

<template>
	<view class="listen">
		<view class="back_top">
			<view class="p1">
				<view class="text_back" @click="back()">
					<image src="/static/left.png" mode=""></image>
				</view>
				<view class="imge" v-if="BonesId===1 || BonesId===3">
					<view class="cinese" @click="toggleChinese">
						<image :src="showChinese===true?'/static/YELLOW.png':'/static/english.png'" mode=""></image>
					</view>
					<view class="seting" @click="showModel()">
						<image src="/static/setting.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="proess">
				<progress :percent="((IndexCurrent + 1) / (SwiperArr?.length || 1)) * 100" stroke-width="22rpx"
					border-radius='20rpx' activeColor='rgba(250, 218, 64, 1)' style="width: 630rpx;" />
				<text>{{IndexCurrent+1}}/{{SwiperArr?.length}}</text>
			</view>
		</view>
		<view class="swiper">
			<view class="swiper_box" :class="{SwiperBox:BonesId===2}">
				<swiper class="swiper" :current="IndexCurrent" circular :indicator-dots="false"
					:interval="SwiperData.interval" @change="onSwiperChange" :duration="SwiperData.duration">
					<swiper-item v-for="(item) in SwiperArr" :key="item.id">
						<view class="swiper-item">
							<view class="imgs_text">
								<image src="/static/666.png" mode="">
								</image>
							</view>
							<view class="text_area">
								<text :style="{
						  fontSize: BonesId === 2 
						    ? '30rpx' 
						    : (FontSize==='中'?'30rpx':FontSize==='大'?'50rpx':'15rpx')
						}">
									{{item.title || item.word}}
								</text>
								<text v-if="BonesId===2">/{{item.phonetic}}/</text>
								<text :style="{
						    fontSize: BonesId === 2 
						      ? '30rpx' 
						      : (FontSize==='中'?'30rpx':FontSize==='大'?'50rpx':'15rpx')
						  }" v-show="showChinese">
									{{item.content}}
								</text>
								<view class="wold_chinese" v-if="BonesId===2">
									<view class="main_world">{{item.explain_cn}}</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<text></text>
		</view>
		<view class="radio" :class="{acvive:BonesId===3}">
			<view class="start" @click="start">
				<image :src="playing ? '/static/end.png' : '/static/ready.png'" mode=""></image>
			</view>
			<!-- 慢速教学按钮，添加点击事件 -->
			<view class="work" v-if="BonesId===2" @click="slowPlay">
				<view class="lneg">
					<image src="/static/bofang.png" mode=""></image>
				</view>
				<text>慢速教学</text>
			</view>
			<Recording v-if='BonesId===3' :text='currentText' :bookId="BackId" :currentId="currentBookItemId" />
		</view>
		<ProgressBar v-show="showBg" @closeModel='closeValue' @confirmModel='confirm' :autoPlay="autoPlayEnabled"
			:font-size="FontSize" :speed="speedValue" />
	</view>
</template>
<style lang="scss">
	.listen {
		width: 750rpx;
		height: 100vh;
		display: flex;
		flex-direction: column;

		.back_top {
			margin-top: 88rpx;
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

					.seting {
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
			}
		}

		.swiper {
			flex: 1;

			.swiper_box {
				width: 750rpx;
				height: auto !important;
				border-radius: 25rpx;
				min-height: 600rpx !important;

				.swiper {
					width: 100%;
					height: 700rpx;

					.swiper-item {
						width: 750rpx;
						height: auto;
						display: flex;
						flex-direction: column;
						align-items: center;
						padding: 20rpx;
						box-sizing: border-box;
						gap: 30rpx;

						.imgs_text {
							width: 700rpx;
							height: 400rpx !important;
							/* 🔥 强制固定高度 */
							flex-shrink: 0;
							/* 🔥 禁止被挤压 */
							position: relative;
							overflow: hidden;
							border-radius: 20rpx;

							image {
								width: 100% !important;
								height: 100% !important;
								border-radius: 20rpx;
								object-fit: cover;
							}
						}

						.text_area {
							width: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							gap: 10rpx;
							padding-top: 20rpx;

							text {
								font-family: PingFang SC;
								font-weight: 400;
								font-style: Regular;
								font-size: 36rpx;
								color: rgba(0, 0, 0, 1);
							}

							.wold_chinese {
								padding: 22rpx 54rpx 18rpx 52rpx;
								box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
								background: rgba(255, 255, 255, 0.6);
								border-radius: 24rpx;

								.main_world {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 230rpx;
									height: 80rpx;
									font-family: PingFang SC;
									font-weight: 400;
									font-style: Regular;
									font-size: 28rpx;
									color: rgba(0, 0, 0, 1);
								}
							}
						}
					}
				}
			}
		}

		.swiper_box.SwiperBox {
			height: 700rpx !important;
		}

		.radio {
			display: flex;
			align-items: center;
			gap: 40rpx;
			position: fixed;
			left: 300rpx;
			right: 0;
			bottom: 74rpx;

			.start {
				width: 136rpx;
				height: 136rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.work {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 10rpx;
				width: 216rpx;
				height: 72rpx;
				border-radius: 24rpx;
				background-color: rgba(250, 218, 64, 1);
				box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);

				.lneg {
					width: 40rpx;
					height: 40rpx;

					image {
						width: 100%;
						height: 100%
					}
				}

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

		.acvive {
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 74rpx;
		}
	}

	::v-deep(.uni-progress-bar) {
		border-radius: 52rpx !important;
	}

	::v-deep(.uni-progress-inner-bar) {
		border-radius: 52rpx !important;
	}
</style>