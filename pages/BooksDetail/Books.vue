<script setup lang="ts">
	import { BoxContent } from '@/store/lever.ts'
	interface finishTs {
		is_finish_listen : number,
		is_finish_look_img : number,
		is_finish_look_word : number,
		is_finish_match : number,
		is_finish_read : number,
		is_finish_test : number,
		is_finish_translate : number,
		is_finish_word : number
	}
	interface ListTs {
		id : number | string,
		cate_id : number,
		content : string,
		cover_image : string,
		is_collected : number,
		is_listen : number,
		is_look_img : number,
		is_look_word : number,
		is_match : number,
		is_read : number,
		is_test : number,
		is_translate : number,
		is_vip : number,
		is_vip_read : boolean,
		is_word : number,
		title : string,
		user_finish : finishTs
	}
	import { computed, ref, onMounted, nextTick } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { ElSelect } from 'element-ui/types/select'
	import { GoDetailData, postCollect, GetListenData } from '@/utils/api.ts'
	//等级
	let leverList = ref<string>('')
	let Data = ref<ListTs | null>(null)
	let BooksId = ref<number>(0)
	const loading = ref(false)
	//去学习
	const taskFinishStatus = ref<Record<number, boolean>>({})
	const FetchApply = async (id : number) => {
		try {
			const res = await GoDetailData(String(id), 'app')
			Data.value = res.data
		} catch (err) {
			console.log(err)
		}
	}
	const Mark = async () => {
		// 防止重复点击
		if (loading.value) return
		loading.value = true
		try {
			// 核心：当前是收藏状态 → 就取消；当前没收藏 → 就收藏
			const willCollect = !Data.value.is_collected
			await postCollect(Data.value.id.toString(), willCollect ? '1' : '0')
			// 直接切换本地状态
			Data.value.is_collected = willCollect
			// 提示
			uni.showToast({
				title: willCollect ? '收藏成功' : '取消收藏成功',
				icon: 'success'
			})
		} catch (err) {
			uni.showToast({
				title: '操作失败',
				icon: 'error'
			})
		} finally {
			loading.value = false
		}
	}
	const back = () => {
		uni.switchTab({
			url: '/pages/TabBar/home/home'
		})
	}
	const goListen = async (item) => {
		try {
			if (item.id === 1) {
				uni.navigateTo({
					url: `/pages/DetailType/Listen/Listen?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			} else if (item.id === 2) {
				uni.navigateTo({
					url: `/pages/DetailType/Listen/Listen?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			} else if (item.id === 3) {
				uni.navigateTo({
					url: `/pages/DetailType/Listen/Listen?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			} else if (item.id === 4) {
				uni.navigateTo({
					url: `/pages/DetailType/lock/lock?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			} else if (item.id === 5) {
				uni.navigateTo({
					url: `/pages/DetailType/ThougthPicture/ThougthPicture?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			} else if (item.id === 6) {
				uni.navigateTo({
					url: `/pages/DetailType/Translation/Translation?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			} else if (item.id === 7) {
				uni.navigateTo({
					url: `/pages/DetailType/Matching/Matching?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			} else if (item.id === 8) {
				uni.navigateTo({
					url: `/pages/DetailType/Test/Test?id=${Data.value.id}&type=${item.type}&lever=${leverList.value}`
				})
			}
		} catch (err) {
			console.log(err)
		}
	}

	// 读取所有任务独立完成状态
	const loadTaskFinishStatus = () => {
		if (!Data.value) return
		const bookId = Data.value.id
		const keyMap : Record<number, string> = {
			1: `listen_finished_${bookId}`,
			2: `word_finished_${bookId}`,
			3: `book_listen_finished_${bookId}`,
			4: `look_word_finished_${bookId}`,
			5: `look_img_finished_${bookId}`,
			6: `translate_finished_${bookId}`,
			7: `match_finished_${bookId}`,
			8: `quiz_finished_${bookId}`
		}

		BoxContent.value.forEach(section => {
			console.log(section)
			section.Card_Arr.forEach(item => {
				const key = keyMap[item.id]
				if (key) {
					const stored = uni.getStorageSync(key)
					const isFinished = typeof stored === 'object' && stored?.type === 'boolean'
						? stored.data
						: !!stored
					taskFinishStatus.value[item.id] = isFinished
				} else {
					taskFinishStatus.value[item.id] = false
				}
			})
		})
	}
	onLoad((e) => {
		console.log(e)
		leverList.value = e.lever
		BooksId.value = Number(e.id)
		FetchApply(e.id).then(() => {
			loadTaskFinishStatus()

		})
	})
	onShow(() => {
		loadTaskFinishStatus()
	})
</script>
<template>
	<view class="detail">
		<view class="header">
			<view class="back" @click="back()">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="title_text">
				<text>{{Data?.id}}.{{Data?.title}}</text>
			</view>
			<view class="">

			</view>
		</view>
		<view class="body">
			<view class="bg">
				<image src="/static/666.png" mode="widthFix"></image>
			</view>
			<view class="grade">
				<view class="left">
					<text>等级:&nbsp;&nbsp;{{leverList}}</text>
				</view>
				<view class="collect" @click="Mark">
					收藏:&nbsp;&nbsp;<image :src="Data?.is_collected ? '/static/shoucang.png' : '/static/start.png'"
						mode="">
					</image>
				</view>
			</view>
			<view class="box_content" v-for="item in BoxContent" :key="item.id">
				<text>{{item.title}}</text>
				<view class="main_box">
					<!-- //v-if="!(card.id === 8 && leverList === 'aa')" -->
					<template v-for="card in item.Card_Arr" :key="card.id">
						<view class="small_box" @click="goListen(card)">
							<view class="small_left">
								<view class="small_image" :style="{background:card.bgColor}">
									<image :src="card.url" mode=""></image>
								</view>
								<text>{{card.text}}</text>
							</view>
							<view class="small_right"
								:style="{backgroundColor:taskFinishStatus[card.id]===true?'rgba(250, 218, 64, 1)':''}">
								<view class="small_img" v-if="taskFinishStatus[card.id]===true">
									<image src="/static/dui.png" mode="widthFix"></image>
								</view>
								<text>{{taskFinishStatus[card.id]===true?'已完成':'去学习'}}</text>
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>
<style lang="scss" scoped>
	.detail {
		width: 750rpx;
		min-height: 100vh;

		.header {
			display: flex;
			justify-content: space-between;
			padding-top: 88rpx;
			padding-left: 20rpx;
			padding-bottom: 20rpx;
			background: rgba(250, 218, 64, 1);

			.back {
				width: 32rpx;
				height: 32rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.title_text {
				font-family: PingFang SC;
				font-weight: 500;
				font-style: Medium;
				font-size: 32rpx;
				color: rgba(0, 0, 0, 1);
			}
		}

		.body {
			display: flex;
			flex-direction: column;
			padding: 20rpx;
			background-color: rgba(245, 246, 250, 1);

			.bg {
				width: 710rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}

			.grade {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					text {
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 28rpx;
						leading-trim: NONE;
						line-height: 100%;
						letter-spacing: 0%;
						text-align: center;
						color: rgba(0, 0, 0, 1);
					}
				}

				.collect {
					display: flex;
					align-items: center;
					justify-content: center;
					font-family: PingFang SC;
					font-weight: 400;
					font-style: Regular;
					font-size: 28rpx;
					text-align: center;
					color: rgba(0, 0, 0, 1);

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

			.top {
				margin-top: 20rpx;
				margin-bottom: 20rpx;
				padding: 0 18rpx;
				font-family: PingFang SC;
				font-weight: 500;
				font-style: Medium;
				font-size: 32rpx;
				leading-trim: NONE;
				line-height: 100%;
				letter-spacing: 0%;
				color: rgba(0, 0, 0, 1);
			}

			.box_content {
				margin-top: 20rpx;
				display: flex;
				flex-direction: column;
				gap: 20rpx;

				text {
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 32rpx;
					color: rgba(0, 0, 0, 1);
				}

				.main_box {
					display: flex;
					flex-direction: column;
					gap: 20rpx;
					padding: 20rpx;
					border-radius: 24rpx;
					background-color: rgba(255, 255, 255, 1);

					.small_box {
						padding: 14rpx;
						border-radius: 114rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						background-color: rgba(255, 251, 246, 1);

						.small_left {
							display: flex;
							align-items: center;
							gap: 22rpx;

							.small_image {
								display: flex;
								align-items: center;
								justify-content: center;
								width: 78rpx;
								height: 78rpx;
								border-radius: 50%;

								image {
									padding-top: 5rpx;
									width: 70%;
									height: 70%;
								}
							}

							text {
								font-family: PingFang SC;
								font-weight: 500;
								font-style: Medium;
								font-size: 28rpx;
								text-align: center;
								color: rgba(0, 0, 0, 1);
							}
						}

						.small_right {
							width: 156rpx;
							height: 58rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							gap: 5rpx;
							font-family: PingFang SC;
							font-weight: 400;
							font-style: Regular;
							font-size: 28rpx;
							text-align: center;
							color: rgba(0, 0, 0, 0.85);
							border-radius: 98rpx;

							.small_img {
								display: flex;
								align-items: center;
								justify-content: center;
								width: 34rpx;
								height: 20rpx;

								image {
									width: 100%;
									height: 100%;
								}
							}

							text {
								font-family: PingFang SC;
								font-weight: 400;
								font-style: Regular;
								font-size: 28rpx;
								leading-trim: NONE;
								line-height: 100%;
								letter-spacing: 0%;
								text-align: center;
								color: rgba(0, 0, 0, 0.85);
							}
						}
					}
				}
			}
		}
	}

	.body {
		width: 100vw;
		height: 100vh;
		background-color: aqua;
	}
</style>