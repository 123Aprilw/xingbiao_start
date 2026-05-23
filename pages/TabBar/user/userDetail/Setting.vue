<template>
	<view class="container">
		<!-- 导航栏 -->
		<view class="nav-bar">
			<view class="back-icon" @click="goBack()">
				<image src="/static/left.png" mode=""></image>
			</view>
			<view class="title">设置</view>
		</view>

		<!-- 头像区域 -->
		<view class="avatar-section">
			<view class="avatar-wrap" @click="chooseAvatar">
				<image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
				<view class="avatar-edit">
					<image src="/static/camera.png" style="width: 52rpx;height: 52rpx;"></image>
				</view>
			</view>
		</view>

		<!-- 表单 -->
		<view class="form-section">
			<view class="form-item">
				<text class="label">昵称</text>
				<input class="input" placeholder="请输入昵称" placeholder-class="placeholder-style" v-model="nickname" />
			</view>
		</view>

		<!-- 按钮 -->
		<view class="btn-section">
			<button class="btn save-btn" hover-class="save-hover" @tap="SubmitSetting">保存</button>
			<button class="btn logout-btn" hover-class="logout-hover" @tap="goOut">退出登录</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { PostAvatorUpload, PutUserAvator, PutUserName, GoOutLogin, LoginData } from '@/utils/api';

	const nickname = ref('')
	const avatarUrl = ref('')
	// 改成响应式变量，避免赋值不生效
	const selectImgPath = ref('')
	const changeAvatar = ref(false)
	const img_Url = 'https://xingbiao.demo.zhongti-group.com'
	onMounted(() => {
		getUserInfo()
	})

	const getUserInfo = async () => {
		try {
			const res = await LoginData()
			if (res.data) {
				nickname.value = res.data.nickname || ''
				avatarUrl.value = img_Url + res.data.avatar
			}
		} catch (err) {
			console.log('获取用户信息失败', err)
		}
	}

	const chooseAvatar = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				// 赋值给响应式变量
				selectImgPath.value = res.tempFilePaths[0]
				avatarUrl.value = selectImgPath.value
				changeAvatar.value = true
				console.log('✅ 头像选择成功:', selectImgPath.value)
			},
			fail: (err) => {
				console.error('❌ 选择头像失败:', err)
			}
		})
	}

	const SubmitSetting = async () => {
		// 获取原始用户信息（用于比对）
		const originalNickname = nickname.value  // 注意：onMounted 时已赋值
		const originalAvatar = avatarUrl.value    // 原始头像 URL（从后端获取的）

		// 1. 收集需要执行的任务
		const tasks : Promise<any>[] = []
		const errors : string[] = []

		// 2. 检查昵称是否真的修改了
		const newNickname = nickname.value.trim()
		if (newNickname === '') {
			uni.showToast({ title: '昵称不能为空', icon: 'none' })
			return
		}
		if (newNickname !== originalNickname) {
			tasks.push(
				PutUserName(newNickname).catch(err => {
					errors.push('昵称修改失败：' + (err.message || err))
					return Promise.reject(err)
				})
			)
		}

		// 3. 检查头像是否修改了
		if (changeAvatar.value && selectImgPath.value) {
			tasks.push(
				(async () => {
					const uploadRes = await PostAvatorUpload(selectImgPath.value)
					const imageUrl = uploadRes.data?.url || uploadRes.data
					await PutUserAvator(imageUrl)
				})().catch(err => {
					errors.push('头像修改失败：' + (err.message || err))
					return Promise.reject(err)
				})
			)
		}

		// 4. 如果没有任务，提示无修改
		if (tasks.length === 0) {
			uni.showToast({ title: '未做任何修改', icon: 'none' })
			return
		}

		// 5. 执行所有任务
		uni.showLoading({ title: '保存中' })
		try {
			await Promise.all(tasks)
			uni.hideLoading()
			uni.showToast({ title: '保存成功', icon: 'success' })
			setTimeout(() => uni.navigateBack(), 1000)
		} catch (err) {
			uni.hideLoading()
			// 汇总所有错误
			const errorMsg = errors.join('；')
			uni.showToast({ title: errorMsg || '修改失败', icon: 'none' })
			console.error('部分操作失败：', errors)
		}
	}

	const goOut = async () => {
		try {
			await GoOutLogin()
		} catch (err) { }
		uni.clearStorageSync()
		uni.reLaunch({ url: '/pages/index/index' })
	}

	const goBack = () => {
		uni.navigateBack()
	}
</script>

<style scoped>
	.container {
		width: 100%;
		min-height: 100vh;
		background: linear-gradient(to bottom, #fff9e6, #fff9d9);
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.nav-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 88rpx;
		position: relative;
		padding: 0 32rpx;
		margin-top: 88rpx;
	}

	.back-icon {
		position: absolute;
		left: 32rpx;
		width: 32rpx;
		height: 32rpx;
	}

	.back-icon image {
		width: 100%;
		height: 100%;
	}

	.title {
		font-size: 34rpx;
		font-weight: 500;
		color: #333;
	}

	.avatar-section {
		display: flex;
		justify-content: center;
		margin: 40rpx 0;
	}

	.avatar-wrap {
		position: relative;
	}

	.avatar {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		background-color: #fff;
	}

	.avatar-edit {
		position: absolute;
		right: -10rpx;
		bottom: 0rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.form-section {
		padding: 0 48rpx;
	}

	.form-item {
		margin-bottom: 48rpx;
	}

	.label {
		display: block;
		font-size: 32rpx;
		color: #333;
		margin-bottom: 16rpx;
		font-weight: 500;
	}

	.input {
		width: 100%;
		height: 104rpx;
		background-color: #fff;
		border-radius: 24rpx;
		padding: 0 32rpx;
		font-size: 32rpx;
		box-sizing: border-box;
	}

	.placeholder-style {
		color: #999;
	}

	.btn-section {
		padding: 0 48rpx;
		margin-top: auto;
		margin-bottom: 80rpx;
	}

	.btn {
		width: 100%;
		height: 104rpx;
		border-radius: 24rpx;
		font-size: 32rpx;
		border: none;
		margin-bottom: 32rpx;
	}

	.save-btn {
		background-color: #ffddb3;
		color: #333;
	}

	.save-hover {
		background-color: #ffcc99 !important;
	}

	.logout-btn {
		background-color: #f5f5f7;
		color: #333;
	}

	.logout-hover {
		background-color: #e5e5ea !important;
	}
</style>