<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { onLoad, onUnload } from '@dcloudio/uni-app'
	import Loading from '@/components/Status/Status.vue'
	import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
	import { playTTS, stopTTS } from '@/utils/tts.ts'
	import { ChineseEnglishPoplur, PostChineseEnglishPoplur } from '@/utils/api'

	// ====================== 状态 ======================
	const pageStatus = ref<'normal' | 'redoing'>('normal')
	const IndexCurrent = ref(0)
	const BonesId = ref(0)
	const Typeis = ref(0)
	const matchToken = ref('')

	// ====================== 题目数据 ======================
	const allQuestions = ref<any[]>([])
	const totalPages = computed(() => allQuestions.value.length || 1)
	const progressPercent = computed(() => {
		return ((IndexCurrent.value + 1) / totalPages.value) * 100
	})
	const pageText = computed(() => `${IndexCurrent.value + 1}/${totalPages.value}`)

	const currentQues = computed(() => {
		return allQuestions.value[IndexCurrent.value] || []
	})

	const englishList = computed(() => [...currentQues.value].sort(() => Math.random() - 0.5))
	const chineseList = computed(() => [...currentQues.value].sort(() => Math.random() - 0.5))

	// ====================== 答题记录 ======================
	const userAnswerRecords = ref<any[]>([])
	const wrongQuestionIds = ref<number[]>([])
	const LEARN_STATUS_KEY = 'LEARN_STATUS_FINISHED'
	// ====================== 交互状态 ======================
	const selectedEnglish = ref<number | null>(null)
	const selectedChinese = ref<number | null>(null)
	const matchedPairs = ref<any[]>([])
	const tempGreenEng = ref<number | null>(null)
	const tempGreenChn = ref<number | null>(null)
	const tempRedEng = ref<number | null>(null)
	const tempRedChn = ref<number | null>(null)

	// ✅ 修复：和当前题目数量严格对应
	const allDone = computed(() => {
		return matchedPairs.value.length === currentQues.value.length
	})
	const isEngLocked = (idx : number) => matchedPairs.value.some(i => i.eng === idx)
	const isChnLocked = (idx : number) => matchedPairs.value.some(i => i.chn === idx)
	let lever_title = ref<string>('')
	// ====================== 弹窗 ======================
	const isProps = ref({
		show: false,
		status: 0,
		name: ''
	})
	const allowNext = ref(false)

	// ====================== 工具 ======================
	function clearTemp() {
		tempGreenEng.value = null
		tempGreenChn.value = null
		tempRedEng.value = null
		tempRedChn.value = null
	}

	// 选择
	function selectEng(idx : number) {
		if (isEngLocked(idx)) return
		clearTemp()
		selectedEnglish.value = idx
		if (selectedChinese.value !== null) checkMatch()
	}
	function selectChn(idx : number) {
		if (isChnLocked(idx)) return
		clearTemp()
		selectedChinese.value = idx
		if (selectedEnglish.value !== null) checkMatch()
	}
	const saveLearnFinished = () => {
		try {
			// 只要调用一次，就把统一Key设为true
			uni.setStorageSync(LEARN_STATUS_KEY, true)
			console.log('✅ 学习状态已更新为已完成', LEARN_STATUS_KEY)
		} catch (e) {
			console.error('存储失败', e)
		}
	}
	// 校验
	function checkMatch() {
		const e = selectedEnglish.value!
		const c = selectedChinese.value!
		const eItem = englishList.value[e]
		const cItem = chineseList.value[c]
		const ok = eItem.id === cItem.id

		if (ok) {
			tempGreenEng.value = e
			tempGreenChn.value = c

			isProps.value = {
				show: true,
				status: 1,
				name: '配对正确！'
			}

			setTimeout(() => {
				matchedPairs.value.push({ eng: e, chn: c })
				clearTemp()
			}, 700)
		} else {
			tempRedEng.value = e
			tempRedChn.value = c

			if (!wrongQuestionIds.value.includes(eItem.id)) {
				wrongQuestionIds.value.push(eItem.id)
			}

			isProps.value = {
				show: true,
				status: 0,
				name: `${eItem.word} → ${eItem.translate}`
			}
		}
		selectedEnglish.value = null
		selectedChinese.value = null
	}

	// ✅ 检查按钮：只有点这里，才能进入下一题
	function handleCheck() {
		if (!allDone.value) {
			console.log('❌ 还没配对完')
			return
		}

		// 🔥 只有点击检查，才允许跳题
		allowNext.value = true

		isProps.value = {
			show: true,
			status: 1,
			name: '全部配对正确！'
		}
	}

	// 关闭弹窗
	const onClosePopup = async () => {
		isProps.value.show = false
		clearTemp()

		// 🔥 必须满足：全部完成 + 点击过检查
		if (allDone.value && allowNext.value) {
			// 记录答案
			const correctIds = matchedPairs.value.map(pair => englishList.value[pair.eng].id)
			userAnswerRecords.value.push(...correctIds)
			// 重置
			matchedPairs.value = []
			wrongQuestionIds.value = []
			allowNext.value = false // 关闭开关

			// 最后一题
			if (IndexCurrent.value >= totalPages.value - 1) {
				saveLearnFinished()
				try {
					const res = await PostChineseEnglishPoplur(matchToken.value, String(BonesId.value), userAnswerRecords.value, 'app')
					console.log(res)
				} catch (err) {
					console.log(err)
				}
				uni.navigateTo({ url: `/pages/Bones/Bones?id=${BonesId.value}&type=${Typeis.value}&lever=${lever_title.value}` })
				return
			}

			// 下一题
			IndexCurrent.value++
		}
	}
	// 接口
	async function loadData(id : number) {
		const res = await ChineseEnglishPoplur(String(id), 'app')

		allQuestions.value = res.data.list
		matchToken.value = res.data.match_token
	}

	onLoad((e) => {
		lever_title.value = e.lever
		BonesId.value = +e.id
		Typeis.value = +e.type
		loadData(+e.id)
	})

	onUnload(() => stopTTS())
</script>

<template>
	<view class="page">
		<!-- 顶部 -->
		<view class="header">
			<view class="bar">
				<view class="back" @click="uni.navigateBack">
					<image src="/static/left.png" mode="aspectFit"></image>
				</view>
				<text>中英文配对</text>
				<view></view>
			</view>
			<view class="progress">
				<progress :percent="progressPercent" stroke-width="22rpx" activeColor="#FADA40" style="width: 630rpx;"
					border-radius='20rpx' />
				<text>{{ pageText }}</text>
			</view>
		</view>

		<!-- 题目 -->
		<view class="quiz" v-if="currentQues.length">
			<view class="pair-box">
				<view class="col">
					<view v-for="(item, idx) in englishList" :key="idx" class="item" :class="{
              selected: selectedEnglish === idx && !isEngLocked(idx),
              right: tempGreenEng === idx,
              wrong: tempRedEng === idx,
              lock: isEngLocked(idx)
            }" @tap="selectEng(idx)">
						{{ item.word }}
					</view>
				</view>

				<view class="col">
					<view v-for="(item, idx) in chineseList" :key="idx" class="item" :class="{
              selected: selectedChinese === idx && !isChnLocked(idx),
              right: tempGreenChn === idx,
              wrong: tempRedChn === idx,
              lock: isChnLocked(idx)
            }" @tap="selectChn(idx)">
						{{ item.translate }}
					</view>
				</view>
			</view>

			<view class="check-btn" :class="{ active: allDone }"
				:style="{ opacity: allDone ? 1 : 0.5, pointerEvents: allDone ? 'auto' : 'none' }" @click="handleCheck">
				检查
			</view>
		</view>

		<!-- 弹窗 -->
		<Loading :show="isProps.show" :Status="isProps.status" :name="isProps.name" @close="onClosePopup" />

		<ProgressBar v-show="false" />
	</view>
</template>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		background: #f5f6fa;
	}

	.header {
		padding: 88rpx 30rpx 20rpx;
	}

	.bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.back {
		width: 40rpx;
		height: 40rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.progress {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.quiz {
		padding: 30rpx;
		flex: 1;
	}

	.pair-box {
		display: flex;
		gap: 20rpx;
		margin-bottom: 60rpx;
	}

	.col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.item {
		height: 120rpx;
		border-radius: 24rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		box-shadow: 0 4rpx 12rpx #00000010;
	}

	.selected {
		background: #fff5cc;
		border: 2rpx solid #fada40;
	}

	.right {
		background: #e6f7e6;
		color: #4cd964;
	}

	.wrong {
		background: #ff4c4c;
		color: #fff;
	}

	.lock {
		background: #f1f1f1;
		color: #999;
	}

	.check-btn {
		height: 88rpx;
		border-radius: 44rpx;
		background: #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
	}

	.check-btn.active {
		background: #fada40;
	}

	::v-deep(.uni-progress-bar) {
		border-radius: 52rpx !important;
	}

	::v-deep(.uni-progress-inner-bar) {
		border-radius: 52rpx !important;
	}
</style>