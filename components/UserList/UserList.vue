<script setup lang="ts">
	import { UserList } from '../../store/user';
	//跳转
	const toDetail = (type : number) => {
		if (type === 1) {
			uni.navigateTo({
				url: '/pages/TabBar/user/userDetail/Serum_Report'
			})
		} else if (type === 2) {
			uni.navigateTo({
				url: '/pages/TabBar/user/userDetail/Reading_Record'
			})
		} else if (type === 3) {
			uni.navigateTo({
				url: '/pages/TabBar/user/userDetail/Picture_collection'
			})
		} else if (type === 4) {
			uni.navigateTo({
				url: '/pages/TabBar/user/userDetail/RazBook'
			})
		} else if (type === 5) {
			uni.navigateTo({
				url: '/pages/TabBar/user/userDetail/LevelTable'
			})
		} else if (type === 7) {
			uni.navigateTo({
				url: '/pages/TabBar/user/userDetail/WeChart'
			})
		} else if (type === 9) {
			uni.navigateTo({
				url: '/pages/TabBar/user/userDetail/MemberRedemption'
			})
		}
	}
</script>
<template>
	<view class="List" v-for="(item,index) in UserList" :key="index">
		<text>{{item.title}}</text>
		<view class="List_box" v-for="(card,i) in item.Data_Arr" :key="i" @tap="toDetail(card.type)">
			<view class="left_box">
				<view class="book_imgs">
					<image :src="card.url" mode=""></image>
				</view>
				<text class="name_text">{{card.name}}</text>
			</view>
			<view class="right_box">
				<image src="/static/right.png" mode=""></image>
			</view>
		</view>
	</view>
</template>
<style lang="less">
	.List {
		padding: 50rpx 20rpx;

		text {
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 32rpx;
			leading-trim: NONE;
			color: rgba(0, 0, 0, 1);
		}

		.List_box {
			padding: 28rpx;
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			margin-top: 20rpx;
			justify-content: space-between;
			border-radius: 24rpx;
			background-color: rgba(255, 255, 255, 1);

			.left_box {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.book_imgs {
					width: 48rpx;
					height: 48rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.name_text {
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

			.right_box {
				width: 32rpx;
				height: 32rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

	}
</style>