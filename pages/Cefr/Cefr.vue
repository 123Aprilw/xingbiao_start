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
	import {
		ref, watch
	} from 'vue'
	import { onShow, onLoad } from '@dcloudio/uni-app'
	import { GetUserVip, LoginData, ModelMember } from '@/utils/api.ts'
	interface Shopping {
		id : number,
		package_name : string,
		sale_price : string,
		duration : number
	}
	//过滤后的数据
	let FilterPrice = ref({
		sale_price: '',
		duration: 0
	})
	const Price_Active = ref<number>(0)
	const img_Url = 'https://xingbiao.demo.zhongti-group.com'
	const ShoppingData = ref<Shopping[]>([])
	const UserObj = ref<User>()
	const Books_Id = ref<number>(0)
	const benefitList = ref([{
		name: '分级绘本',
		free: '限量10本',
		level: '配套级别',
		vip: '所有级别'
	},
	{
		name: '巩固练习',
		free: 'no',
		level: 'yes',
		vip: 'yes'
	},
	{
		name: '错题重练',
		free: 'yes',
		level: 'yes',
		vip: 'yes'
	},
	{
		name: '录音打分',
		free: 'no',
		level: '一个月',
		vip: 'yes'
	},
	{
		name: '电子资源下载',
		free: 'yes',
		level: 'yes',
		vip: 'yes'
	},
	{
		name: '学情报告',
		free: 'no',
		level: 'yes',
		vip: 'yes'
	},
	])

	const renderBenefit = (val) => {
		if (val === 'yes') {
			return '/static/duigou.png'
		} else if (val === 'no') {
			return '/static/emo.png'
		} else {
			return val
		}
	}
	//返回
	const BackClick = () => {
		uni.navigateBack()
	}
	//渲染用户
	const UserApply = async () => {
		try {
			const res = await LoginData()
			UserObj.value = res.data
		} catch (err) {
			console.log(err)
		}
	}
	//点击
	const PriceTap = (id : number, index : number) => {
		Price_Active.value = id
		FilterPrice.value.duration = ShoppingData.value[index].duration
		FilterPrice.value.sale_price = ShoppingData.value[index].sale_price
	}
	//渲染
	const FetchApply = async (id : string) => {
		try {
			const res = await GetUserVip(id)
			ShoppingData.value = res.data
		} catch (err) {
			console.log(err)
		}
	}
	//确认开通
	const Confirm = async () => {
		try {
			console.log(Books_Id.value)
			const res = await ModelMember(String(Price_Active.value), String(Books_Id.value))
			console.log(res)
		} catch (err) {
			console.log(err)
		}
	}
	onLoad((e) => {
		Books_Id.value = e.id
		FetchApply(e.id)
		UserApply()
		watch(ShoppingData, (newVal) => {
			if (newVal && newVal.length > 0) {
				Price_Active.value = newVal[0].id
				FilterPrice.value.duration = newVal[0].duration
				FilterPrice.value.sale_price = newVal[0].sale_price
			}
		}, {
			immediate: true
		})
	})
</script>
<template>
	<view class="member-page">
		<!-- 顶部用户信息卡片 -->
		<view class="member-top">
			<view class="member-back" @click="BackClick()">
				<image src="/static/white.png" mode=""></image>
			</view>
			<view class="member-open">
				开通会员
			</view>
			<view class="">

			</view>
		</view>
		<view class="user-card">
			<view class="avatar-wrap">
				<!-- 头像/图标预留位置 -->
				<image class="avatar" :src="`${img_Url}${UserObj?.avatar}`" mode="aspectFill" />
			</view>
			<view class="user-info">
				<view class="nickname">
					<!-- VIP皇冠图标预留位置 -->
					<image class="vip-icon" src="/static/vip.png" mode="aspectFit" />
					<text class="user-name">{{UserObj?.username}}</text>
				</view>
				<view class="phone">{{UserObj?.nickname}}</view>
			</view>
			<view class="open-btn">开通会员</view>
		</view>

		<!-- 会员套餐选择 -->
		<view class="package-section">
			<view class="section-title">选择会员套餐</view>
			<view class="package-list">
				<view class="package-item" v-for="(item,index) in ShoppingData" :key="item.id"
					@tap="PriceTap(item.id,index)"
					:style="{background:Price_Active === item.id ? 'linear-gradient(180deg, #FEE7C4 0%, #F7D899 100%)':'linear-gradient(180deg, #43485F 0%, #2F3449 100%)'}">
					<view class="title" style="color: rgba(249, 221, 166, 1);font-size: 28rpx;font-weight: 400;"
						:style="{color:Price_Active===item.id?'rgba(116, 84, 59, 1)':'rgba(249, 221, 166, 1)'}">
						{{item?.package_name}}
					</view>
					<view class="price">
						<text class="current" style="font-size: 48rpx;color: rgba(249, 221, 166, 1);"
							:style="{color:Price_Active===item.id?'rgba(82, 48, 26, 1)':'rgba(249, 221, 166, 1)'}"><text
								style="font-size: 30rpx;color: rgba(249, 221, 166, 1);">¥</text>{{item?.sale_price}}</text>
						<text class="original"
							:style="{color:Price_Active===item.id?'rgba(185, 154, 115, 1)':'rgba(149, 149, 149, 1)'}">¥{{item.duration}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 会员权益对照表 -->
		<view class="benefit-section">
			<view class="section-title">会员权益对照表</view>
			<view class="benefit-table">
				<view class="table-header">
					<view class="col">功能权限</view>
					<view class="col">免费用户</view>
					<view class="col">分级会员</view>
					<view class="col">会员</view>
				</view>
				<view class="table-row" v-for="(item, index) in benefitList" :key="index">
					<view class="col">{{ item.name }}</view>
					<view class="col">
						<image v-if="renderBenefit(item.free).includes('.png')" class="benefit-icon"
							:src="renderBenefit(item.free)" mode="" style="width: 44rpx;height: 44rpx;" />
						<text v-else>{{ renderBenefit(item.free) }}</text>
					</view>
					<view class="col">
						<image v-if="renderBenefit(item.level).includes('.png')" class="benefit-icon"
							:src="renderBenefit(item.level)" mode="" style="width: 44rpx;height: 44rpx;" />
						<text v-else>{{ renderBenefit(item.level) }}</text>
					</view>
					<view class="col">
						<image v-if="renderBenefit(item.vip).includes('.png')" class="benefit-icon"
							:src="renderBenefit(item.vip)" mode="" style="width: 44rpx;height: 44rpx;" />
						<text v-else>{{ renderBenefit(item.vip) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 提示信息 -->
		<view class="tips">
			<view class="tips-text">提示:</view>
			<view class="tips-content">数字商品，开通后无法退订，请您谨慎操作!</view>
		</view>

		<!-- 底部价格与按钮 -->
		<view class="bottom-bar">
			<view class="price-wrap">
				<text class="original-price">¥{{FilterPrice.duration}}</text>
				<text class="current-price">¥{{FilterPrice.sale_price}}</text>
			</view>
			<button class="confirm-btn" @tap="Confirm">确认开通</button>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.member-page {
		padding: 88rpx 20rpx 0;
		min-height: 100vh;
		background-color: #222636;
		color: #fff;
		font-size: 28rpx;
	}

	.member-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;

		.member-back {
			width: 32rpx;
			height: 32rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.member-open {
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 32rpx;
			color: rgba(254, 230, 195, 1);
		}
	}

	// 顶部用户卡片
	.user-card {
		background: linear-gradient(135deg, #3b4260 0%, #2b3048 100%);
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;

		.avatar-wrap {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 20rpx;
			background-color: rgba(255, 255, 255, 1);

			.avatar {
				width: 100%;
				height: 100%;
			}
		}

		.user-info {
			flex: 1;

			.nickname {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 10rpx;

				.vip-icon {
					width: 64rpx;
					height: 52rpx;
					margin-right: 10rpx;
				}

				.user-name {
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.85);
				}
			}

			.phone {
				color: #aaa;
				font-size: 26rpx;
			}
		}

		.open-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 182rpx;
			height: 56rpx;
			border-radius: 54rpx;
			background: linear-gradient(90deg, #FEE6C3 0%, #F9DBA2 100%);
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 28rpx;
			color: rgba(141, 99, 44, 1);
		}
	}

	// 套餐选择
	.package-section {
		margin-bottom: 20rpx;

		.section-title {
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 28rpx;
			color: rgba(253, 227, 186, 1);
			margin-bottom: 20rpx;
		}

		.package-list {
			display: flex;
			gap: 20rpx;
			overflow-x: auto;

			.package-item {
				width: 220rpx;
				background: linear-gradient(180deg, #43485F 0%, #2F3449 100%);
				border-radius: 20rpx;
				padding: 30rpx;
				text-align: center;

				&.active {
					width: 220rpx;
					background: linear-gradient(180deg, #FEE7C4 0%, #F7D899 100%);
					color: #333;
				}

				.title {
					font-family: PingFang SC;
					font-weight: 400;
					font-style: Regular;
					font-size: 28rpx;
					color: rgba(116, 84, 59, 1);
					margin-bottom: 10rpx;
				}

				.price {
					.current {
						font-size: 48rpx;
						font-weight: bold;
						display: block;
					}

					.current:nth-child(1) {
						font-size: 48rpx;
						font-weight: bold;
						display: block;
					}

					.original {
						font-size: 26rpx;
						color: #aaa;
						text-decoration: line-through;
						margin-top: 10rpx;
						display: block;
					}
				}
			}
		}
	}

	// 权益对照表
	.benefit-section {
		margin-bottom: 30rpx;

		.section-title {
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 28rpx;
			color: rgba(253, 227, 186, 1);
			margin-bottom: 20rpx;
		}

		.benefit-table {
			background: linear-gradient(180deg, #43485F 0%, #2F3449 100%);
			border-radius: 20rpx;
			padding: 20rpx;

			.table-header {
				display: flex;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #444;

				.col {
					flex: 1;
					text-align: center;
					font-weight: bold;
					color: rgba(252, 227, 183, 1);
				}
			}

			.table-row {
				display: flex;
				padding: 20rpx 0;
				align-items: center;

				.col {
					flex: 1;
					text-align: center;
					color: rgba(252, 227, 183, 1);
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 24rpx;
				}
			}
		}
	}

	// 提示文字
	.tips {
		font-family: PingFang SC;
		font-weight: 500;
		font-style: Medium;
		font-size: 24rpx;
		color: rgba(96, 96, 96, 1);
		margin-bottom: 72rpx;

		.tips-text {
			margin-bottom: 10rpx;
		}
	}

	// 底部栏
	.bottom-bar {
		background: #222636;
		padding: 20rpx 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1rpx solid #333;

		.price-wrap {
			.original-price {
				display: block;
				font-family: PingFang SC;
				font-weight: 400;
				font-style: Regular;
				font-size: 28rpx;
				color: rgba(185, 154, 115, 1);
				text-decoration: line-through;
				margin-bottom: 10rpx;
			}

			.current-price {
				font-family: DIN Alternate;
				font-weight: 700;
				font-style: Bold;
				font-size: 48rpx;
				color: rgba(249, 222, 171, 1);
			}
		}

		.confirm-btn {
			margin: 0 !important;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 256rpx;
			height: 68rpx;
			border-radius: 50rpx;
			box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
			background: linear-gradient(180deg, #FEE7C2 0%, #F7D99C 100%);
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 28rpx;
			color: rgba(82, 48, 26, 1);
		}
	}
</style>