<template>
  <web-view 
    src="/hybrid/html/index.html" 
    @message="handleMessage"
  ></web-view>
</template>

<script setup>
import { onReady } from '@dcloudio/uni-app';

let webview = null;

onReady(() => {
  // 页面加载完成后获取原生 webview 实例
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  // 获取当前页面的原生 webview
  webview = page.$getAppWebview();
});

const handleMessage = (e) => {
  const data = e.detail.data[0];
  console.log('收到 H5 消息：', data);

  if (data?.action === 'GET_TOKEN') {
    const token = uni.getStorageSync('token');
    console.log('本地 token:', token);

    if (webview) {
      // 遍历子 webview，找到我们的 web-view
      const children = webview.children();
      if (children.length > 0) {
        const childWebview = children[0];
        // 执行 JS
        childWebview.evalJS(`
          window.receiveTokenFromApp('${token || ''}');
        `);
        console.log('✅ 已成功向 H5 发送 token:', token);
      } else {
        console.error('❌ 未找到 web-view 子实例');
      }
    } else {
      console.error('❌ 未获取到当前页面的 webview');
    }
  }
};
</script>

<style scoped>
/* web-view 默认铺满全屏，无需额外样式 */
</style>