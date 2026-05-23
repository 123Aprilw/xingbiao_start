<script setup lang="ts">
	interface User {
		id : number,
		username : string,
		nickname : string,
		mobile : string,
		avatar : string,
		score : number,
		token : string,
		user_id : number,
		createtime : number,
		expiretime : number,
		expires_in : number,
		is_vip : number,
		vip_level_name : string,
		vip_expire_text : string
	}
	import UserList from '@/components/UserList/UserList.vue'
	import { PromentData } from '@/store/user.ts'
	import { ref, computed, onMounted, reactive } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import TabBar from '@/components/TabBar/TabBar.vue'
	import { LoginData } from '@/utils/api.ts'
	const phone = ref('')
	const img_Url = 'https://xingbiao.demo.zhongti-group.com'
	//用户数据
	let UserData = ref<User>()
	const isFetching = ref(false)
	// 跳转锁：防止重复跳转
	const isRedirecting = ref(false)

	const maskedPhone = computed(() => {
		const p = phone.value
		return p.slice(0, 3) + '****' + p.slice(-4)
	})

	//开通会员
	const Wall = () => {
		uni.navigateTo({
			url: `/pages/member/member?id=${UserData?.value.id}`
		})
	}

	//跳转逻辑
	const PromerTab = (type : number) => {
		console.log(type)
	}

	//渲染用户信息
	const FetcUser = async () => {
		// 有锁 或 正在请求 直接return
		if (isFetching.value || isRedirecting.value) return
		isFetching.value = true

		try {
			const res = await LoginData()
			UserData.value = res.data
			uni.setStorageSync('User_Vip', UserData.value.is_vip)
		} catch (err : any) {
			console.log("接口错误：", err)
			const isUnauthorized = err?.code === 401

			if (isUnauthorized && !isRedirecting.value) {
				handleRedirectToLogin()
			}
		} finally {
			isFetching.value = false
		}
	}

	// 统一跳转登录方法（全局只执行一次）
	const handleRedirectToLogin = () => {
		if (isRedirecting.value) return
		isRedirecting.value = true

		// ✅ 关键：跳转前清掉无效 token
		uni.removeStorageSync('token')

		uni.showToast({
			title: "请登录后操作",
			icon: 'none',
			duration: 1500
		})

		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/index/index'
			})
		}, 1500)
	}

	//跳转设置
	const setting = () => {
		uni.navigateTo({
			url: '/pages/TabBar/user/userDetail/Setting'
		})
	}

	onShow(() => {
		uni.hideTabBar({ animation: false })
		// ✅ 每次显示页面都检查token，无效就直接跳转
		const token = uni.getStorageSync('token')
		if (!token) {
			handleRedirectToLogin()
			return
		}
	})

	onMounted(() => {
		// 最优先判断：没有token直接跳转，不执行任何请求
		const token = uni.getStorageSync('token')
		if (!token) {
			handleRedirectToLogin()
			return
		}
		// 有token才请求用户信息
		FetcUser()
	})
</script>

<template>
	<view class="user_item">
		<view class="bg-item-1"></view>
		<view class="bg-item-2"></view>
		<view class="bg-item-3"></view>

		<view class="item_top">
			<view class="nox" @tap="setting()">
				<view class="setting">
					<image src="/static/setting.png" mode=""></image>
				</view>
			</view>
			<view class="user_data">
				<view class="user_icon">
					<image :src="`${img_Url}${UserData?.avatar}`" mode=""></image>
				</view>
				<view class="user_right">
					<view class="right_top">
						<view class="vip">
							<image :src="UserData?.is_vip===1?'/static/vipActive.png':'/static/vip.png'" mode="">
							</image>
						</view>
						<text class="user_name">{{UserData?.username}}</text>
						<view class="dit">
							<image src="/static/dit.png" mode=""></image>
						</view>
					</view>
					<view class="right_bottom">
						{{UserData?.nickname }}
					</view>
				</view>
			</view>
			<view class="Procurement">
				<view class="go_vip">
					<view class="BQ">
						{{UserData?.is_vip===1?'会员权益':'去开通VIP'}}
					</view>
					<view class="fast" @tap="Wall" v-if="UserData?.is_vip !==1 ">
						立即开通
					</view>
					<view class="fast" @tap="Wall" v-if="UserData?.is_vip===1"
						style="background: none;color: rgba(0, 0, 0, 1);">
						VIP至&nbsp;&nbsp;{{UserData?.vip_expire_text}}
					</view>
				</view>
				<view class="equity">
					<view class="equ_box" v-for="(item,index) in PromentData" :key="index">
						<view class="is">
							<image :src="item.url" mode=""></image>
						</view>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="user_vip">
			<UserList />
		</view>
	</view>
	<TabBar :current="2" />
</template>

<style lang="scss">
	/* 样式完全不变 */
	.user_item {
		position: relative;
		padding-bottom: calc(120rpx + 20rpx + env(safe-area-inset-bottom));
		min-height: 100vh;
		box-sizing: border-box;

		.bg-item-1 {
			position: absolute;
			width: 290px;
			height: 290px;
			left: -142px;
			top: -96px;
			background: rgba(255, 251, 203, 1);
			border-radius: 50%;
			filter: blur(100px);
			transform: rotate(-50deg);
			z-index: -1;
		}

		.bg-item-2 {
			position: absolute;
			width: 287px;
			height: 287px;
			right: -68px;
			top: -123px;
			background: rgba(255, 251, 203, 1);
			border-radius: 50%;
			filter: blur(100px);
			transform: rotate(17deg);
			z-index: -1;
		}

		.item_top {
			display: flex;
			flex-direction: column;
			padding: 20rpx;

			.nox {
				padding-top: 88rpx;
				display: flex;
				justify-content: flex-end;
				margin-bottom: 36rpx;

				.setting {
					width: 56rpx;
					height: 56rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.user_data {
				display: flex;
				gap: 20rpx;

				.user_icon {
					width: 130rpx;
					height: 130rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					background: #EFEFEF;
					z-index: 5555;

					image {
						width: 90%;
						height: 90%;
						border-radius: 50%;
					}
				}

				.user_right {
					display: flex;
					justify-content: center;
					flex-direction: column;

					.right_top {
						display: flex;
						align-items: center;
						gap: 10rpx;

						.vip {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 64rpx;
							height: 52rpx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.user_name {
							font-family: PingFang SC;
							font-weight: 500;
							font-style: Medium;
							font-size: 28rpx;
							color: rgba(0, 0, 0, 0.85);
							z-index: 5;
						}

						.dit {
							width: 32rpx;
							height: 32rpx;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								width: 100%;
								height: 100%;
							}
						}
					}

					.right_bottom {
						font-family: PingFang SC;
						font-weight: 400;
						font-style: Regular;
						font-size: 24rpx;
						color: rgba(169, 169, 169, 1);
						z-index: 5;
					}
				}
			}

			.Procurement {
				height: 500rpx;
				display: flex;
				flex-direction: column;
				gap: 5rpx;
				border-radius: 24rpx;
				margin-top: 40rpx;
				padding: 20rpx;
				border: 1px solid rgba(255, 255, 255, 1);
				background: linear-gradient(270deg, #FFD0A6 -19.86%, #FFDCB4 56.37%, #FEE9BE 129.72%);

				.go_vip {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.BQ {
						font-family: PingFang SC;
						font-weight: 600;
						font-style: Semibold;
						font-size: 32rpx;
						z-index: 55;
						color: rgba(177, 79, 0, 1);
					}

					.fast {
						z-index: 55;
						font-family: PingFang SC;
						font-weight: 500;
						font-style: Medium;
						font-size: 28rpx;
						padding: 5rpx 20rpx;
						color: rgba(255, 255, 255, 1);
						border-radius: 24rpx;
						background: linear-gradient(180deg, #FF9D00 0%, #FF8D00 49.52%, #FF8300 100%);
					}
				}

				.equity {
					display: flex;
					gap: 74rpx;

					.equ_box {
						display: flex;
						flex-direction: column;
						align-items: center;

						.is {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 78rpx;
							height: 74rpx;

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
							color: rgba(195, 142, 110, 1);
						}
					}

				}
			}
		}

		.user_vip {
			position: relative;
			z-index: 9999999;
			margin-top: -350rpx;
			z-index: 999;
			background: url('/static/bg.png');
			background-size: cover;
			background-repeat: no-repeat;
		}
	}
</style>