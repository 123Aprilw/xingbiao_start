<template>
	<view class="picture-book-collection-page">
		<!-- 自定义导航栏 -->
		<view class="navbar">
			<view class="navbar-back" @click="goBack">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="navbar-title">绘本收藏</view>
			<view class="navbar-placeholder"></view>
		</view>

		<!-- 主体内容 -->
		<scroll-view class="content" scroll-y @scrolltolower="loadMore" ref="scrollRef">
			<!-- 空状态：无收藏绘本时显示 -->
			<view class="empty-state" v-if="bookList.length === 0">
				<view class="empty-placeholder">
					<!-- 图片预留位置 -->
					<image class="empty-image" src="/static/xingxing.png" mode="aspectFit" />
				</view>
				<text class="empty-text">您还没有收藏绘本哦～</text>
			</view>

			<!-- 绘本卡片列表：有数据时显示 -->
			<view class="books-grid" v-else>
				<view class="book-card" v-for="(book) in bookList" :key="book.book_id" @click="handleCardClick(book)">
					<view class="cover-placeholder">
						<image class="cover-image" src="/static/study.png" mode="widthFix" lazy-load />
					</view>
					<view class="book-info">
						<view class="title-row">
							<text class="book-title">{{ book.title }}</text>
							<view class="free-tag">限免</view>
						</view>
						<text class="book-subtitle">{{ book.content }}</text>
					</view>
					<view class="action-bar">
						<view class="action-icons">
							<view class="icon-item"
								:style="{backgroundColor:book.is_look_word_done===false?'#f3f4f8':'rgba(254, 244, 193, 1)'}">
								<image
									:src="book.is_look_word_done===false?'/static/listen.png':'/static/listenActive.png'"
									mode=""></image>
							</view>
							<view class="icon-item"
								:style="{backgroundColor:book.is_look_word_done===false?'#f3f4f8':'rgba(254, 244, 193, 1)'}">
								<image
									:src="book.is_look_word_done===false?'/static/singing.png':'/static/singingActive.png'"
									mode=""></image>
							</view>
							<view class="icon-item"
								:style="{backgroundColor:book.is_look_word_done===false?'#f3f4f8':'rgba(254, 244, 193, 1)'}">
								<image :src="book.is_look_word_done===false?'/static/read.png':'/static/readActive.png'"
									mode=""></image>
							</view>
						</view>
						<view class="collect-btn" @tap.stop="Collect(book)">
							<image :src="book.is_collected === 1 ? '/static/shoucang.png' : '/static/start.png'"
								mode="">
							</image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	interface CollectTs {
		book_id : number,
		title : string,
		content : string,
		cover_image : string,
		is_vip : number,
		is_collected : number,
		is_listen_done : boolean,
		is_read_done : boolean,
		is_look_word_done : boolean
	}
	import { ref, onMounted } from 'vue'
	import { ConsifmStatus, postCollect } from '@/utils/api.ts'
	const last_id = ref<number>(0) // 第一页默认 0
	const loading = ref(false)
	const noMore = ref(false)
	const bookList = ref<CollectTs[]>([])
	//渲染数据
	const FetchCollection = async () => {
		if (loading.value || noMore.value) return
		loading.value = true
		try {
			const res = await ConsifmStatus(last_id.value)
			const list = res?.data?.list || []
			console.log(res.data)
			if (list.length === 0) {
				noMore.value = true
			} else {
				bookList.value.push(...list)
				last_id.value = list[list.length - 1].id
			}
		} catch (err) {
			console.log(err)
		}
	}
	//点击收藏
	const Collect = async (item : CollectTs) => {
		try {
			const targetStatus = item.is_collected === 1 ? 0 : 1
			const res = await postCollect(item.book_id.toString(), targetStatus.toString())
			console.log(res)
			item.is_collected = targetStatus
			// 直接切换本地状态
			if (targetStatus === 0) {
				bookList.value = bookList.value.filter(b => b.book_id !== item.book_id)
			}
			// 提示
			uni.showToast({
				title: targetStatus ? '收藏成功' : '取消收藏成功',
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
	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 卡片点击
	const handleCardClick = (book : any) => {
		console.log('点击了绘本卡片:', book)
	}

	// 图标点击
	const handleIconClick = (type : string, book : any) => {
		console.log(`点击了${type}按钮:`, book)
	}

	// 切换收藏
	const toggleCollect = (book : any) => {
		book.isCollected = !book.isCollected
	}
	const loadMore = () => {
		FetchCollection()
	}
	onMounted(() => {
		FetchCollection()
	})
</script>

<style lang="scss" scoped>
	.picture-book-collection-page {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;

		.navbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 88rpx;
			padding: 88rpx 32rpx 50rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #eee;
			flex-shrink: 0;

			.navbar-back {
				width: 30rpx;
				height: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.navbar-title {
				font-size: 34rpx;
				font-weight: 500;
				color: #333;
			}

			.navbar-placeholder {
				width: 48rpx;
			}
		}

		.content {
			flex: 1;
			padding: 32rpx;
			display: flex;
			flex-direction: column;

			// 空状态样式
			.empty-state {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				// 给一个最小高度，确保在不同设备上都能垂直居中
				min-height: calc(100vh - 300rpx);

				.empty-placeholder {
					margin-bottom: 32rpx;

					.empty-image {
						width: 400rpx;
						height: 400rpx;
					}
				}

				.empty-text {
					font-size: 28rpx;
					color: #999;
				}
			}

			// 书籍网格
			.books-grid {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				gap: 20rpx;
				width: 100%;

				.book-card {
					width: calc(50% - 10rpx);
					background-color: #fff;
					border-radius: 24rpx;
					overflow: hidden;
					box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
					display: flex;
					flex-direction: column;

					.cover-placeholder {
						width: 100%;
						height: 278rpx;
						aspect-ratio: 1;
						background-color: #fff3e0;
						display: flex;
						align-items: center;
						justify-content: center;

						.cover-image {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}

					.book-info {
						padding: 20rpx;

						.title-row {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 8rpx;

							.book-title {
								font-size: 30rpx;
								color: #333;
								font-weight: 500;
								line-height: 1.4;
							}

							.free-tag {
								background-color: #ffd33d;
								color: #333;
								font-size: 22rpx;
								padding: 6rpx 16rpx;
								border-radius: 20rpx;
								font-weight: 500;
							}
						}

						.book-subtitle {
							font-size: 26rpx;
							color: #999;
							line-height: 1.4;
						}
					}

					.action-bar {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0 20rpx 20rpx;

						.action-icons {
							display: flex;
							gap: 20rpx;

							.icon-item {
								width: 48rpx;
								height: 48rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								background: rgba(243, 244, 248, 1);
								border-radius: 12rpx;

								image {
									width: 70%;
									height: 70%;
								}
							}
						}

						.collect-btn {
							width: 48rpx;
							height: 48rpx;
							display: flex;
							align-items: center;
							justify-content: center;

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