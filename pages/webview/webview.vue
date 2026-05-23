<template>
	<web-view src="/hybrid/html/demo.html" @message="handleMessage"></web-view>
</template>

<script setup>
	const handleMessage = (e) => {
		console.log('收到 H5 消息：', e.detail);
		uni.showModal({
			title: '收到H5消息',
			content: e.detail.data[0].message
		});
	};
</script>

<style scoped>
	/* web-view 默认铺满全屏，无需额外样式 */
</style>