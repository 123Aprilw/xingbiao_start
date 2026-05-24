<script setup lang="ts">
	import HomeList from '@/components/HomeList/HomeList.vue'
	import TabBar from '@/components/TabBar/TabBar.vue'
	import { onShow } from '@dcloudio/uni-app'
	import { ref, onMounted, nextTick } from 'vue'
	import { HomeLever, BooksListSearch } from '@/utils/api'

	interface lever_Arr_TS {
		id : number
		name : string
	}

	// 👇 必须用 scroll-view 才能横向滚动
	const levelScrollRef = ref<any>(null)
	const lever_active = ref<string | null>(null)
	const lever_Arr = ref<lever_Arr_TS[]>([])
	const lever_Text = ref<string>('')
	const Search_Text = ref<string>('')
	const isSearching = ref(false)

	// 底部指示器样式
	const indicatorStyle = ref({
		transform: 'translateX(0px)',
		width: '0px',
	})

	// 点击 tab → 滚动 + 指示器
	const ActiveClick = async (item : lever_Arr_TS, index : number) => {
		lever_active.value = String(item.id)
		lever_Text.value = item.name

		await nextTick()
		if (!levelScrollRef.value) return

		const query = uni.createSelectorQuery().in(levelScrollRef.value)
		query.select('.scroll-wrap').boundingClientRect()
		query.selectAll('.span').boundingClientRect()
		query.exec((res : any) => {
			const wrapRect = res[0]
			const tabRects = res[1]
			const tabRect = tabRects[index]
			if (!wrapRect || !tabRect) return

			// 指示器位置
			indicatorStyle.value = {
				transform: `translateX(${tabRect.left}px)`,
				width: `${tabRect.width}px`,
			}

			// 滚动让 tab 居中
			const windowWidth = uni.getSystemInfoSync().windowWidth
			const scrollLeft = tabRect.left - windowWidth / 2 + tabRect.width / 2
			levelScrollRef.value.scrollTo({
				left: Math.max(0, scrollLeft),
				animated: true,
			})
		})
	}

	// 获取列表
	const FetchData = async () => {
		try {
			const res = await HomeLever()
			lever_Arr.value = res.data
			if (lever_Arr.value.length) {
				lever_active.value = String(lever_Arr.value[0].id)
				lever_Text.value = lever_Arr.value[0].name
				nextTick(() => ActiveClick(lever_Arr.value[0], 0))
			}
		} catch (err) {
			console.log(err)
		}
	}

	// 搜索
	const handleKeydown = async () => {
		const keyword = Search_Text.value.trim()
		if (!keyword || isSearching.value) {
			uni.showToast({ title: '请输入搜索内容', icon: 'none' })
			return
		}
		isSearching.value = true
		uni.showLoading({ title: '搜索中...' })

		try {
			let foundLevel = lever_Arr.value[0]
			if (foundLevel) {
				lever_active.value = String(foundLevel.id)
				lever_Text.value = foundLevel.name
				nextTick(() => {
					const idx = lever_Arr.value.findIndex(i => i.id === foundLevel.id)
					ActiveClick(foundLevel, idx)
				})
				uni.showToast({ title: `已切换到${foundLevel.name}`, icon: 'success' })
			} else {
				uni.showToast({ title: '未找到', icon: 'none' })
			}
		} catch (err) {
			uni.showToast({ title: '搜索失败', icon: 'error' })
		} finally {
			uni.hideLoading()
			isSearching.value = false
		}
	}

	// 扫码
	const scanQr = () => {
		uni.scanCode({
			scanType: ['qrCode'],
			success: (res) => {
				if (res.result) uni.navigateTo({ url: '/pages/webview/webview' })
				else uni.showToast({ title: '未识别二维码', icon: 'none' })
			},
		})
	}

	onShow(() => {
		uni.hideTabBar({ animation: false })
	})

	onMounted(() => {
		FetchData()
	})
</script>

<template>
	<view class="contair">
		<view class="header">
			<view class="search">
				<view class="input_search">
					<view class="search-icon" @tap="handleKeydown">
						<image src="/static/search.png"></image>
					</view>
					<input type="text" placeholder="搜索你想要的绘本" placeholder-class="place" v-model="Search_Text"
						confirm-type="search" @confirm="handleKeydown" />
				</view>
				<view class="scan" @tap="scanQr">
					<image src="/static/QW.png"></image>
				</view>
			</view>

			<view class="title">星标分级阅读</view>

			<!-- 👇 真正的横向滚动 TAB（核心修复） -->
			<scroll-view ref="levelScrollRef" class="level-scroll" scroll-x :show-scrollbar="false">
				<view class="scroll-wrap">
					<!-- 指示器 -->
					<view class="indicator" :style="indicatorStyle"></view>

					<view class="span" v-for="(item, index) in lever_Arr" :key="item.id"
						:class="{ leveActive: lever_active === String(item.id) }" @click="ActiveClick(item, index)">
						<text>{{ item.name }}</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="main">
			<HomeList v-if="lever_active" :index="lever_active" :lever="lever_Text" :SearchText="Search_Text" />
		</view>

		<TabBar :current="0" />
	</view>
</template>
<style lang="scss">
	.contair {
		display: flex;
		flex-direction: column;
		width: 750rpx;
		height: 100vh;

		.header {
			padding-bottom: 20rpx;
			display: flex;
			flex-direction: column;
			gap: 16rpx;

			.search {
				padding: 88rpx 20rpx 20rpx;
				background: #fada40;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.input_search {
					flex: 1;
					display: flex;
					align-items: center;
					gap: 10rpx;
					border-radius: 24rpx;
					padding: 16rpx;
					background: #f3f4f8;

					.search-icon {
						width: 34rpx;
						height: 34rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					input {
						flex: 1;
						font-size: 24rpx;
					}

					.place {
						color: #c3c4c7;
					}
				}

				.scan {
					margin-left: 20rpx;
					width: 40rpx;
					height: 40rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.title {
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				padding: 20rpx 0;
			}

			/* 👇 滚动容器样式 */
			.level-scroll {
				width: 100%;

				::v-deep(.uni-scroll-view) {
					height: 80rpx;
				}
			}

			.scroll-wrap {
				position: relative;
				display: flex;
				align-items: center;
				height: 80rpx;
				padding: 0 20rpx;
				gap: 35rpx;

				/* 指示器 */
				.indicator {
					position: absolute;
					left: 0;
					bottom: 0;
					height: 6rpx;
					background-color: #fada40;
					border-radius: 3rpx;
					transition: transform 0.3s ease, width 0.3s ease;
					z-index: 10;
				}

				.span {
					flex-shrink: 0;
					padding: 0 20rpx;
					font-size: 28rpx;
					line-height: 60rpx;
					color: #000;
					white-space: nowrap;

					&.leveActive {
						background: url('@/static/ActiveMark.png') no-repeat center;
						background-size: 100% 100%;
					}
				}
			}
		}

		.main {
			flex: 1;
			background: #f5f6fa;
		}
	}
</style>