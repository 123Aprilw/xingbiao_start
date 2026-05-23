<script setup lang="ts">
	interface dataTS {
		list : BooksTs[]
		has_more : boolean
	}
	interface BooksTs {
		id : number,
		title : string,
		content : string,
		cover_image : string,
		is_vip : number,
		is_listen : number,
		is_read : number,
		is_look_word : number,
		is_collected : number
	}
	import { watch, computed, ref } from 'vue'
	import { BooksListSearch, GetBooksNums, postCollect } from '@/utils/api.ts'
	const props = defineProps<{
		index : string | number,
		lever : string | null,
		SearchText : string | number
	}>()
	const bookList = ref<BooksTs[]>([])
	const page = ref<string>('1')
	const BooksNum = ref<number>(0)
	const loading = ref(false)       // 正在加载中
	const noMore = ref(false)       // 没有更多数据了
	const getBookStatus = (bookId : number, type : 'listen' | 'read' | 'word') => {
		const keyMap = {
			listen: `listen_finished_${bookId}`,
			read: `read_finished_${bookId}`,
			word: `word_finished_${bookId}`
		}
		const stored = uni.getStorageSync(keyMap[type])
		// 兼容你现有的 boolean 格式
		return stored?.data === true ? 1 : 0
	}

	// 统一设置绘本状态并同步到本地存储
	const setBookStatus = (bookId : number, type : 'listen' | 'read' | 'word', status : number) => {
		const keyMap = {
			listen: `listen_finished_${bookId}`,
			read: `read_finished_${bookId}`,
			word: `word_finished_${bookId}`
		}
		uni.setStorageSync(keyMap[type], {
			type: "boolean",
			data: status === 1
		})
	}
	//渲染绘本数量
	const fetchBooksNums = async () => {
		if (!props.index || props.index === 'null') return
		try {
			const res = await GetBooksNums(String(props.index), String(props.SearchText))
			BooksNum.value = res.data.count
		} catch (error) {
			//TODO handle the exception
			console.log(error)
		}
	}
	//渲染列表
	const fetchBooks = async (isRefresh = false) => {
		if (loading.value || (noMore.value && !isRefresh)) return

		loading.value = true
		try {
			const res = await BooksListSearch(
				String(props.index),
				String(props.SearchText),
				page.value
			)
			const newList = res.data?.list || []
			console.log(newList)
			if (isRefresh) {
				// 刷新：直接替换列表
				bookList.value = newList
			} else {
				// 加载更多：追加列表
				bookList.value.push(...newList)
			}

			// 没有更多数据的判断
			if (newList.length === 0) {
				noMore.value = true
			} else {
				noMore.value = false
			}
		} catch (error) {
			console.log(error)
		} finally {
			loading.value = false
		}
	}
	// 下拉刷新
	const onRefresh = async () => {
		page.value = '1'
		noMore.value = false
		await fetchBooks(true)
	}
	// 上拉加载更多
	const onLoadMore = async () => {
		if (loading.value || noMore.value) return
		page.value = String(Number(page.value) + 1)
		await fetchBooks()
	}
	//点击收藏
	const Collect = async (item : BooksTs) => {

		// 防止重复点击
		if (loading.value) return
		loading.value = true
		try {
			// 核心：当前是收藏状态 → 就取消；当前没收藏 → 就收藏
			const willCollect = !item.is_collected
			const res = await postCollect(item.id.toString(), willCollect ? '1' : '0')
			// 直接切换本地状态
			item.is_collected = willCollect
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
	//去详情页面
	const goDetail = (item : any) => {
		const User_Vip = uni.getStorageSync('User_Vip')
		if (item.is_vip === 1 && User_Vip !== 1) {
			uni.showModal({
				title: "VIP专属内容",
				content: "该内容仅VIP用户可查看，是否前往开通VIP？",
				success: (res) => {
					if (res.confirm) {
						// 跳转到你的VIP购买页面
						uni.navigateTo({
							url: `/pages/Cefr/Cefr?id=${props.index}&type=${props.lever}` // 这里改成你真实的VIP页面路径
						});
					}
				}
			});
			return; // 阻止进入详情
		}
		// 不是VIP → 正常跳转
		uni.navigateTo({
			url: `/pages/BooksDetail/Books?id=${item.id}&lever=${props.lever}`
		});
	}
	// 监听分级切换，刷新列表
	watch(() => [props.index, props.SearchText], async () => {
		if (!props.index || props.index === 'null') return
		page.value = '1'
		noMore.value = false
		bookList.value = []
		await fetchBooks(true)
		fetchBooksNums()
	}, { immediate: true })
</script>
<template>
	<view class="Home">
		<text>{{props.lever}}级别:{{BooksNum}}本</text>
		<scroll-view class="scroll-view" scroll-y refresher-enabled :refresher-triggered="false"
			@refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
			<view class="books">
				<view class="list" v-for="item in bookList" :key="item.id" @click="goDetail(item)">
					<view class="imgs">
						<image src="/static/study.png" mode=""></image>
					</view>
					<view class="list_bottom">
						<view class="list_top">
							<text>{{item.id}}.{{item.title}}</text>
							<view class="type-btn"
								:style="{backgroundColor: item.is_vip === 0 ? 'rgba(254, 241, 100, 1)' : 'rgba(5, 5, 4, 1)' , color: item.is_vip===0?'rgba(0, 0, 0, 1)':'rgba(254, 241, 100, 1)'}">
								{{item.is_vip===0?'限免':'VIP'}}
							</view>
						</view>
						<view class="center">
							<text>{{item.content}}</text>
						</view>
						<view class="bottom_icons">
							<view class="icons_left">
								<view class="listen"
									:style="{backgroundColor:uni.getStorageSync('listen_finished_'+item.id)?'rgba(254, 244, 193, 1)':'rgba(243, 244, 248, 1)'}">
									<image
										:src="uni.getStorageSync('listen_finished_'+item.id) ?'/static/listenActive.png':'/static/listen.png'"
										mode=""></image>
								</view>
								<view class="listen"
									:style="{backgroundColor:uni.getStorageSync('book_listen_finished_'+item.id)?'rgba(254, 244, 193, 1)':'rgba(243, 244, 248, 1)'}">
									<image
										:src="uni.getStorageSync('book_listen_finished_'+item.id)?'/static/singActive.png':'/static/singing.png'"
										mode=""></image>
								</view>
								<view class="listen">
									<image src="/static/read.png" mode=""></image>
								</view>
							</view>
							<view class="iconst_right" @tap.stop="Collect(item)">
								<image :src="item.is_collected ? '/static/shoucang.png' : '/static/start.png'" mode="">
								</image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<style lang="scss" scoped>
	@mixin FlexBox {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.Home {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		padding: 10rpx 28rpx;
		background-color: rgba(245, 246, 250, 1);

		.scroll-view {
			flex: 1;
			height: calc(100vh - 200rpx);
		}

		text {
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 28rpx;
			color: rgba(195, 196, 199, 1);
		}

		.books {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.list {
				display: flex;
				flex-direction: column;

				.imgs {
					width: 342rpx;
					height: 278rpx;

					image {
						width: 100%;
						height: 100%;
						border-top-right-radius: 24rpx;
						border-top-left-radius: 24rpx;
					}
				}

				.list_bottom {
					background-color: rgba(255, 255, 255, 1);
					padding: 20rpx;
					display: flex;
					flex-direction: column;
					border-bottom-left-radius: 24rpx;
					border-bottom-right-radius: 24rpx;

					.list_top {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;

						text {
							font-family: PingFang SC;
							font-weight: 400;
							font-style: Regular;
							font-size: 28rpx;
							color: rgba(0, 0, 0, 1);
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: 220rpx;
						}

						.type-btn {
							@include FlexBox();
							font-family: PingFang SC;
							font-weight: 400;
							font-style: Regular;
							font-size: 20rpx;
							padding: 5rpx 20rpx;
							color: rgba(0, 0, 0, 1);
							border-radius: 22rpx;
							background-color: rgba(254, 241, 100, 1);
						}
					}

					.center {
						display: flex;
						align-items: center;

						text {
							font-family: PingFang SC;
							font-weight: 400;
							font-style: Regular;
							font-size: 20rpx;
							color: rgba(153, 153, 153, 0.85);
						}
					}

					.bottom_icons {
						margin-top: 20rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.icons_left {
							display: flex;
							gap: 6rpx;

							.listen {
								@include FlexBox();
								width: 40rpx;
								height: 40rpx;
								border-radius: 12rpx;
								background-color: rgba(243, 244, 248, 1);

								image {
									width: 70%;
									height: 70%;
								}
							}
						}

						.iconst_right {
							@include FlexBox();
							width: 50rpx;
							height: 50rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
			}
		}
	}
</style>