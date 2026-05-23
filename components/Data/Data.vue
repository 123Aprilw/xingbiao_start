<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 接收父组件传值
const props = defineProps({
	DateTitle: {
		type: String,
		default: ''
	},
	sign: {
		type: Object,
		default: () => ({})
	}
})

const currentDate = ref(new Date())
const todayStr = ref('')

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

// ======================
// 🔥 日历核心逻辑
// ======================
const monthDays = computed(() => {
	const year = currentYear.value
	const month = currentMonth.value

	const daysInMonth = new Date(year, month, 0).getDate()
	const firstDayWeek = new Date(year, month - 1, 1).getDay()

	const days = []
	for (let i = 0; i < firstDayWeek; i++) {
		days.push({ type: 'empty' })
	}
	for (let i = 1; i <= daysInMonth; i++) {
		const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
		days.push({
			type: 'day',
			date: i,
			dateStr,
			isToday: dateStr === todayStr.value,
			// ✅ 关键修复：只要 sign[i] === true 就打卡变黄
			isChecked: props.sign[i] === true,
			isPastAndUnchecked: dateStr < todayStr.value && props.sign[i] !== true
		})
	}
	return days
})

const prevMonth = () => {
	currentDate.value.setMonth(currentDate.value.getMonth() - 1)
	currentDate.value = new Date(currentDate.value)
}
const nextMonth = () => {
	currentDate.value.setMonth(currentDate.value.getMonth() + 1)
	currentDate.value = new Date(currentDate.value)
}

// 监听接口今天日期
watch(
	() => props.DateTitle,
	(newVal) => {
		if (!newVal) return
		todayStr.value = newVal
		const [y, m] = newVal.split('-')
		if (y && m) {
			currentDate.value = new Date(Number(y), Number(m) - 1, 1)
		}
	},
	{ immediate: true }
)

// 监听打卡数据
watch(
	() => props.sign,
	(newVal) => {
		console.log('打卡数据：', newVal)
	},
	{ deep: true, immediate: true }
)
</script>

<template>
	<view class="calendar">
		<view class="calendar-header">
			<text class="title">{{ currentYear }}-{{ String(currentMonth).padStart(2, '0') }}</text>
		</view>
		<view class="week-header">
			<text class="week-item" v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{w}}</text>
		</view>
		<view class="days-grid">
			<view 
				v-for="(item, idx) in monthDays" 
				:key="idx" 
				class="day-item"
				:class="{
					checked: item.isChecked,      // ✅ 为 true 时黄色
					today: item.isToday,
					'past-unchecked': item.isPastAndUnchecked
				}"
			>
				<text v-if="item.type === 'day'">{{ item.date }}</text>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.calendar {
		position: absolute;
		top: 10rpx;
		right: 0;
		left: 0;
		padding: 20rpx;
		background: #fff;
		border-radius: 24rpx;

		.calendar-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.title {
				font-size: 32rpx;
				font-weight: 500;
			}
		}

		.week-header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.week-item {
				width: calc(100% / 7);
				text-align: center;
				font-size: 28rpx;
				color: #666;
			}
		}

		.days-grid {
			display: flex;
			gap: 18rpx;
			flex-wrap: wrap;

			.day-item {
				width: 85rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #333;
				&.checked {
					background: rgba(255, 239, 68, 1);
					border-radius: 16rpx;
				}

				&.today {
					font-weight: bold;
					color: #000;
				}

				&.past-unchecked {
					background: rgba(244, 244, 244, 1);
					border-radius: 16rpx;
				}
			}
		}
	}
</style>