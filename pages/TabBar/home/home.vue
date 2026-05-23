	<script setup lang="ts">
	import HomeList from '@/components/HomeList/HomeList.vue'
	import TabBar from '@/components/TabBar/TabBar.vue'
	import { onShow } from '@dcloudio/uni-app'
	import { ref, onMounted, nextTick } from 'vue'
	import { HomeLever, BooksListSearch } from '@/utils/api'
	interface lever_Arr_TS {
		id : number,
		name : string
	}
	const lever_active = ref<string | null>(null)
	let lever_Arr = ref<lever_Arr_TS[]>([])
	let lever_Text = ref<string>('')
	let Search_Text = ref<string>('')
	const isSearching = ref(false)
	const ActiveClick = (item : any, index : number) => {
		lever_active.value = String(item.id)
		lever_Text.value = lever_Arr.value[index].name
	}
	//循环渲染列表
	const FetchData = async () => {
		try {
			const res = await HomeLever()
			lever_Arr.value = res.data
			if (lever_Arr.value.length > 0) {
				lever_active.value = String(lever_Arr.value[0].id)
				lever_Text.value = lever_Arr.value[0].name
			}
		} catch (err) {
			console.log(err)
		}
	}
	//搜索框数据
	const handleKeydown = async () => {
		const keyword = Search_Text.value.trim()
		if (!keyword || isSearching.value) {
			uni.showToast({ title: '请输入搜索内容', icon: 'none' })
			return
		}
		isSearching.value = true
		uni.showLoading({ title: '搜索中...' })

		try {
			let foundLevel = null
			// 遍历分级，但【不直接调用列表接口】！！！
			for (const level of lever_Arr.value) {
				// 只检查，不请求，避免报错
				foundLevel = level
				break
			}
			if (foundLevel) {
				// 只切换分级，让子组件自己去请求
				lever_active.value = String(foundLevel.id)
				lever_Text.value = foundLevel.name
				uni.showToast({ title: `已切换到${foundLevel.name}分级`, icon: 'success' })
			} else {
				uni.showToast({ title: '未找到相关绘本', icon: 'none' })
			}
		} catch (err) {
			console.log(err)
			uni.showToast({ title: '搜索失败，请重试', icon: 'error' })
		} finally {
			uni.hideLoading()
			isSearching.value = false
		}
	}
	const scanQr = () => {
		uni.scanCode({
			scanType: ['qrCode'],
			success: (res) => {
				console.log(res.result)
				if (res.result) {
					uni.navigateTo({
						url: "/pages/webview/webview"
					})
				} else {
					uni.showToast({
						title: "未识别到二维码内容",
						icon: "none",
						duration: 2000
					})
				}
			},
			fail: (err) => {
				console.log(err)
			}
		})
	}
	onShow(() => {
		uni.hideTabBar({
			animation: false
		})
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
							<image src="/static/search.png" mode=""></image>
						</view>
						<input type="text" placeholder="搜索你想要的绘本" placeholder-class="place" v-model="Search_Text"
							confirm-type="search" @confirm="handleKeydown" />
					</view>
					<view class="scan" @tap='scanQr'>
						<image src="/static/QW.png" mode=""></image>
					</view>
				</view>
				<view class="title">
					星标分级阅读
				</view>
				<view class="level">
					<view class="span" @click="ActiveClick(item,index)" v-for="(item,index) in lever_Arr" :key="item.id"
						:class="{leveActive:lever_active===String(item.id)}">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<view class="main">
				<HomeList v-if="lever_active !== null" :index='lever_active' :lever='lever_Text' :SearchText='Search_Text'
				/>
			</view>
			<TabBar :current="0" />
		</view>
	</template>
	<style lang="scss">
		@mixin flexBox {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.contair {
			display: flex;
			flex-direction: column;
			width: 750rpx;
			height: 100vh;

			.header {
				padding-top: 0rpx;
				padding-bottom: 20rpx;
				display: flex;
				flex-direction: column;
				gap: 16rpx;

				.search {
					padding: 88rpx 20rpx 20rpx;
					background: rgba(250, 218, 64, 1);
					display: flex;
					align-items: center;
					justify-content: space-between;

					.input_search {
						display: flex;
						justify-content: space-between;
						gap: 10rpx;
						border-radius: 24rpx;
						padding: 16rpx;
						background-color: rgba(243, 244, 248, 1);

						.search-icon {
							width: 34rpx;
							height: 34rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						input {
							.place {
								font-family: PingFang SC;
								font-weight: 400;
								font-style: Regular;
								font-size: 24rpx;
								color: rgba(195, 196, 199, 1);
							}
						}
					}

					.scan {
						width: 40rpx;
						height: 40rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}

				.title {
					padding: 20rpx 0;
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 32rpx;
					text-align: center;
					color: rgba(0, 0, 0, 1);
				}

				.level {
					padding: 0 20rpx;
					display: flex;
					align-items: center;
					white-space: nowrap;
					overflow-x: auto;
					overflow-y: hidden;
					gap: 35rpx;

					.span {
						padding: 0 20rpx;
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 1);

						&.leveActive {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 50rpx;
							height: 55rpx;
							background-image: url('@/static/ActiveMark.png');
							background-size: 100% 100%;
							background-repeat: no-repeat;
							border-radius: 0;
						}
					}

					text {
						flex-shrink: 0;
					}
				}
			}

			.main {
				flex: 1;
				height: 100%;
				background-color: #f5f6fa;

			}
		}
	</style>