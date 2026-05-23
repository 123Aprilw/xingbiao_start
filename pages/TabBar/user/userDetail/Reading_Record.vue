<template>
	<view class="reading-record-page">
		<!-- 自定义导航栏（和上一页面保持完全一致） -->
		<view class="navbar">
			<view class="navbar-back" @click="goBack">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="navbar-title">阅读记录</view>
			<view class="navbar-placeholder"></view>
		</view>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 按日期分组渲染 -->
			<view class="date-group" v-for="(group, groupIndex) in dateGroups" :key="groupIndex">
				<!-- 日期标签 -->
				<view class="date-tag">
					{{ group?.date }}
				</view>

				<!-- 书籍卡片列表（两列自适应布局） -->
				<view class="books-grid">
					<view class="book-card" v-for="(book, bookIndex) in group?.books" :key="bookIndex"
						@click="handleBookClick(book)">
						<!-- 图片预留位置（可直接替换src） -->
						<view class="cover-placeholder">

							<!-- 方式2：用image标签（后续替换实际图片地址即可） -->
							<image class="cover-image" src="/static/study.png" mode="widthFix" lazy-load />
						</view>

						<!-- 书籍文字信息 -->
						<view class="book-info">
							<text class="book-title">{{ book.title }}</text>
							<text class="book-subtitle">{{ book.subtitle }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	interface BooksTs {
		book_id : number,
		title : string,
		content : string,
		cover_image : string
	}
	interface listTs {
		date : string,
		books : BooksTs[]
	}
	interface list {
		has_more : boolean,
		last_id : number | null,
		list : listTs[]
	}
	import { ref, onMounted } from 'vue'
	import { ReadData } from '@/utils/api.ts'
	// 分页游标
	let lastId = 0
	// 示例数据（后续可替换为接口返回的真实数据）
	const dateGroups = ref<list[]>([])
	// 返回上一页逻辑
	const goBack = () => {
		uni.navigateBack()
	}

	// 书籍卡片点击事件
	const handleBookClick = (book : any) => {
		console.log('点击了书籍:', book)
	}
	//渲染数据
	const FetchData = async () => {
		try {
			const res = await ReadData(lastId)
			dateGroups.value = res.data.list
		} catch (error) {
			//TODO handle the exception
			console.log(error)
		}
	}
	onMounted(() => {
		FetchData()
	})
</script>

<style lang="scss" scoped>
	.reading-record-page {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;

		// 导航栏（和上一页面完全复用，保证风格统一）
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

		// 主体内容区域
		.content {
			flex: 1;
			padding: 32rpx;

			// 日期分组容器
			.date-group {
				margin-bottom: 40rpx;

				// 日期标签
				.date-tag {
					display: flex;
					align-items: center;
					padding-left: 20rpx;
					width: 710rpx;
					height: 88rpx;
					background: linear-gradient(90deg, #FFFFFF 0%, #FFFDF1 100%);
					box-shadow: 0px -2px 14px 0px rgba(120, 120, 120, 0.1);
					font-family: PingFang SC;
					font-weight: 500;
					font-style: Medium;
					font-size: 28rpx;
					border-radius: 24rpx;
					color: rgba(0, 0, 0, 1);
					margin-bottom: 24rpx;
				}

				// 书籍卡片网格（两列自适应）
				.books-grid {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					gap: 20rpx; // 卡片之间的间距

					// 书籍卡片
					.book-card {
						width: calc(50% - 10rpx); // 两列布局，减去一半间距
						background-color: #fff;
						border-radius: 24rpx;
						overflow: hidden;
						box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
						display: flex;
						flex-direction: column;

						// 图片占位区域
						.cover-placeholder {
							width: 100%;
							height: 278rpx;
							background-color: #fff3e0; // 浅橙色背景，和截图风格匹配
							display: flex;
							align-items: center;
							justify-content: center;

							.cover-image {
								width: 100%;
								height: 100%;
								object-fit: cover;
								border-top-left-radius: 24rpx;
								border-top-right-radius: 24rpx;
							}
						}

						// 书籍文字信息
						.book-info {
							padding: 20rpx;
							display: flex;
							flex-direction: column;
							gap: 8rpx;

							.book-title {
								font-size: 30rpx;
								color: #333;
								font-weight: 500;
								line-height: 1.4;
							}

							.book-subtitle {
								font-size: 26rpx;
								color: #999;
								line-height: 1.4;
							}
						}
					}
				}
			}
		}
	}
</style>