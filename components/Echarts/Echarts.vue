<template>
	<view class="chart-page">
		<view class="chart-container">
			<view class="chart-wrapper">
				<qiun-data-charts type="radar" :opts="opts" :chartData="chartData" />
				<view class="center-text">
					<text class="main-number">{{totalScore}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		watch,
		computed
	} from 'vue'
	import QiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'
	const props = defineProps(['Accuracy', 'Fluency', 'Integrity', 'TotalScore'])
	const opts = reactive({
		color: ["#ffffff"], // 白色线条，适配你的绿色背景
		padding: [0, 0, 0, 0],
		dataLabel: false,
		legend: {
			show: false
		},
		extra: {
			radar: {
				gridType: "circle",
				gridColor: "#ffffff",
				gridCount: 5,
				opacity: 0.3,
				max: 100,
				labelShow: true,
				border: true,
				area: true,
				areaOpacity: 0.2,
				lineWidth: 2,
				labelFontSize: 11,
				labelColor: "#fff",
				startAngle: 180
			}
		}
	})

	const chartData = reactive({
		categories: ["流利度", "准确度", "完整度"],
		series: [{
			name: "评分",
			data: [88, 100, 85]
		}]
	})
	watch(() => [props.Fluency, props.Accuracy, props.Integrity], () => {
		chartData.series[0].data = [
			Number(props.Fluency || 0),
			Number(props.Accuracy || 0),
			Number(props.Integrity || 0)
		]
	}, {
		immediate: true
	})
	const totalScore = computed(() => {
		return Number(props.TotalScore || 0)
	})
</script>

<style scoped lang="scss">
	.chart-wrapper {
		/* 核心：直接给固定 px 大小，秋云图表最吃这个 */
		width: 550rpx !important;
		height: 550rpx !important;
		padding-bottom: 50rpx;
	}

	.center-text {
		position: absolute;
		left: 0;
		top: -95rpx;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		text {
			font-family: PingFang SC;
			font-weight: 500;
			font-style: Medium;
			font-size: 40rpx;
			color: rgba(255, 255, 255, 1);
		}
	}
</style>