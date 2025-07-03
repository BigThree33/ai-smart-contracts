<template>
	<view class="index-container">
		<!-- 顶部渐变背景区域(框1) -->
		<view class="gradient-bg">
			<view class="overlay-image-container">
				<image class="overlay-image"
					src="https://www.onchainus.net/static/media/img_banner.c2d112845c769829e979.png" mode="aspectFill">
				</image>
			</view>
		</view>

		<!-- 内容区域(框2) -->
		<view class="content-container">
			<!-- 多个小框 -->
			<view class="card">
				<view class="card-title">
					<uni-icons type="star" size="20" color="#3c8dbc"></uni-icons>
					<text class="title-text">AI Trading Features</text>
				</view>
				<view class="card-content">
					<text class="content-text">
						Experience cutting-edge AI technology that optimizes your trading strategy with machine learning algorithms and predictive analytics.
					</text>
				</view>
			</view>

			<view class="card">
				<view class="card-title">
					<uni-icons type="wallet" size="20" color="#3c8dbc"></uni-icons>
					<text class="title-text">Smart Contract Security</text>
				</view>
				<view class="card-content">
					<text class="content-text">
						Our platform uses audited smart contracts to ensure the highest level of security for all transactions.
					</text>
				</view>
			</view>

			<view class="card">
				<view class="card-title">
					<uni-icons type="refresh" size="20" color="#3c8dbc"></uni-icons>
					<text class="title-text">Automated Trading</text>
				</view>
				<view class="card-content">
					<text class="content-text">
						Set up automated trading strategies that execute trades 24/7 based on predefined parameters and market conditions.
					</text>
				</view>
			</view>

			<view class="card">
				<view class="card-title">
					<uni-icons type="medal" size="20" color="#3c8dbc"></uni-icons>
					<text class="title-text">Community & Governance</text>
				</view>
				<view class="card-content">
					<text class="content-text">
						Join our thriving community of traders and participate in platform governance through our decentralized voting system.
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {

	}
}
</script>

<style>
.index-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	position: relative;
	padding-top: 0;
	margin-top: 0;
}

.gradient-bg {
	position: relative; /* 修改为relative，不再固定在视图顶部 */
	top: 0;
	left: 0;
	right: 0;
	height: 50vh; /* 50% of viewport height */
	background: linear-gradient(to bottom, #094884, white);
	z-index: 0;
}

.overlay-image-container {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 25vh; /* 减小高度，只占据大框1的一部分 */
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	overflow: hidden;
}

.overlay-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: top;
	margin-top: 0;
	display: block;
}

.content-container {
	position: relative;
	z-index: 2;
	margin: 0 30rpx;
	margin-top: -25vh; /* 向上覆盖大框1的一部分 */
	padding: 40rpx;
	background-color: #ffffff;
	border-radius: 20rpx 20rpx 0 0;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	min-height: 70vh; /* 确保足够高度，可自动扩展 */
}

.card {
	margin-bottom: 40rpx;
	padding: 30rpx;
	background-color: #f9f9f9;
	border-radius: 15rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-title {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.title-text {
	margin-left: 20rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.card-content {
	padding-left: 44rpx;
}

.content-text {
	font-size: 28rpx;
	line-height: 1.6;
	color: #666666;
	text-align: justify;
}
</style>
