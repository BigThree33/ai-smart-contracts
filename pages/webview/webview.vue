<template>
	<view class="webview-container">
		<web-view :src="url" @message="handleMessage" @error="handleError"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: ''
		}
	},
	onLoad(options) {
		if (options.url) {
			this.url = decodeURIComponent(options.url);
		}
	},
	methods: {
		handleMessage(e) {
			console.log('收到消息:', e.detail.data);
		},
		handleError(e) {
			console.error('加载错误:', e);
			uni.showToast({
				title: '页面加载失败',
				icon: 'none'
			});
		}
	}
}
</script>

<style>
.webview-container {
	width: 100%;
	height: 100vh;
}
</style>