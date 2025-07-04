<template>
	<view class="connect-container">
		<!-- 背景 -->
		<view class="gradient-bg">
			<view class="overlay-image-container">
				<image class="overlay-image"
					src="https://www.onchainus.net/static/media/img_banner.c2d112845c769829e979.png" mode="aspectFill">
				</image>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-container">
			<!-- 正常连接状态 - 直接连接TokenPocket -->
			<view class="connecting-section" v-if="!showErrorPage && isConnecting">
				<view class="welcome-section">
					<view class="logo-container">
						<view class="app-logo-custom">
							<view class="ai-icon">
								<view class="ai-circle">
									<text class="ai-text">AI</text>
								</view>
								<view class="ai-dots">
									<view class="dot dot1"></view>
									<view class="dot dot2"></view>
									<view class="dot dot3"></view>
								</view>
							</view>
						</view>
					</view>
					<text class="welcome-title">Welcome to AI Smart Contracts</text>
					<text class="welcome-subtitle">Connecting to TokenPocket...</text>
				</view>
				
				<view class="connect-status">
					<view class="loading-spinner"></view>
					<text class="connecting-text">正在连接TokenPocket钱包...</text>
				</view>
			</view>

			<!-- 无法连接状态 - 显示错误页面 -->
			<view class="error-section" v-if="showErrorPage">
				<view class="error-card">
					<!-- 人物插画 -->
					<view class="character-container">
						<view class="character-avatar">
							<view class="character-head">
								<view class="character-face">
									<view class="character-eyes">
										<view class="eye left-eye"></view>
										<view class="eye right-eye"></view>
									</view>
									<view class="character-mouth"></view>
								</view>
								<view class="character-hair"></view>
								<view class="character-glasses">
									<view class="glass left-glass"></view>
									<view class="glass right-glass"></view>
									<view class="glass-bridge"></view>
								</view>
							</view>
							<view class="character-body">
								<view class="character-suit"></view>
								<view class="character-tie"></view>
								<view class="character-hand">
									<view class="coffee-cup"></view>
								</view>
							</view>
						</view>
					</view>
					
					<view class="error-content">
						<text class="error-title">Unable to connect</text>
						<text class="error-subtitle">This website relies on Ethereum smart contracts to operate, please use a decentralized wallet to access.</text>
						
						<view class="copy-button" @click="copyLink">
							<text class="copy-text">Copy Link</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 初始加载状态 -->
			<view class="loading-section" v-if="!showErrorPage && !isConnecting">
				<view class="welcome-section">
					<view class="logo-container">
						<view class="app-logo-custom">
							<view class="ai-icon">
								<view class="ai-circle">
									<text class="ai-text">AI</text>
								</view>
								<view class="ai-dots">
									<view class="dot dot1"></view>
									<view class="dot dot2"></view>
									<view class="dot dot3"></view>
								</view>
							</view>
						</view>
					</view>
					<text class="welcome-title">Welcome to AI Smart Contracts</text>
					<text class="welcome-subtitle">Checking network connection...</text>
				</view>
				
				<view class="connect-status">
					<view class="loading-spinner"></view>
					<text class="connecting-text">正在检查网络连接...</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isConnecting: false,
			showErrorPage: false,
			walletAddress: '',
			currentUrl: ''
		}
	},
	onLoad() {
		// 获取当前页面URL
		this.currentUrl = this.getCurrentUrl();
		
		// 检查是否已经连接过钱包
		this.checkWalletConnection();
	},
	methods: {
		// 检查钱包连接状态
		checkWalletConnection() {
			const walletAddress = uni.getStorageSync('walletAddress');
			if (walletAddress) {
				// 已连接，直接跳转到首页
				this.navigateToHome();
			} else {
				// 未连接，开始连接流程
				this.startConnectionFlow();
			}
		},

		// 开始连接流程
		async startConnectionFlow() {
			// 延迟一点显示加载状态
			await this.delay(1000);
			
			// 尝试检测TokenPocket环境，带重试机制
			const isTokenPocketEnv = await this.detectTokenPocketEnvironmentWithRetry();
			
			if (isTokenPocketEnv) {
				// 在TokenPocket环境中，直接连接
				this.connectTokenPocket();
			} else {
				// 不在TokenPocket环境中，显示错误页面
				this.showErrorPage = true;
			}
		},

		// 带重试机制的TokenPocket环境检测
		async detectTokenPocketEnvironmentWithRetry() {
			let retryCount = 0;
			const maxRetries = 5;
			
			while (retryCount < maxRetries) {
				if (this.detectTokenPocketEnvironment()) {
					return true;
				}
				
				// 等待一段时间后重试
				await this.delay(500);
				retryCount++;
			}
			
			return false;
		},

		// 检测TokenPocket环境
		detectTokenPocketEnvironment() {
			if (typeof window === 'undefined') {
				return false;
			}
			
			// 检查多种可能的TokenPocket环境标识
			const hasTokenPocket = window.tokenpocket;
			const hasEthereumWithTokenPocket = window.ethereum && (
				window.ethereum.isTokenPocket || 
				window.ethereum.isTP ||
				window.ethereum.providers?.some(p => p.isTokenPocket || p.isTP)
			);
			const hasTPUserAgent = navigator.userAgent.includes('TokenPocket');
			
			console.log('TokenPocket环境检测:', {
				hasTokenPocket: !!hasTokenPocket,
				hasEthereumWithTokenPocket: !!hasEthereumWithTokenPocket,
				hasTPUserAgent: !!hasTPUserAgent,
				ethereum: !!window.ethereum,
				userAgent: navigator.userAgent,
				ethereumProvider: window.ethereum ? {
					isTokenPocket: window.ethereum.isTokenPocket,
					isTP: window.ethereum.isTP,
					providers: window.ethereum.providers
				} : null
			});
			
			return hasTokenPocket || hasEthereumWithTokenPocket || hasTPUserAgent;
		},

		// 检查网络连接
		async checkNetworkConnection() {
			try {
				// 检查网络状态
				const networkType = await new Promise((resolve) => {
					uni.getNetworkType({
						success: (res) => resolve(res.networkType),
						fail: () => resolve('none')
					});
				});
				
				if (networkType === 'none') {
					return false;
				}
				
				// 尝试ping一个简单的API
				const pingResult = await this.pingNetwork();
				return pingResult;
			} catch (error) {
				console.error('网络检查失败:', error);
				return false;
			}
		},

		// 网络连通性测试
		async pingNetwork() {
			return new Promise((resolve) => {
				uni.request({
					url: 'https://api.github.com/zen',
					timeout: 5000,
					success: () => resolve(true),
					fail: () => resolve(false)
				});
			});
		},

		// 连接TokenPocket钱包
		async connectTokenPocket() {
			this.isConnecting = true;
			
			try {
				// 延迟显示连接状态
				await this.delay(500);
				
				// 直接连接TokenPocket（因为已经确认在TokenPocket环境中）
				await this.connectWithTokenPocket();
			} catch (error) {
				console.error('TokenPocket连接失败:', error);
				
				// 显示具体的错误信息
				let errorMessage = '钱包连接失败';
				if (error.message.includes('User rejected')) {
					errorMessage = '用户拒绝连接';
				} else if (error.message.includes('未找到Web3提供者')) {
					errorMessage = '未检测到钱包环境';
				} else if (error.message.includes('用户拒绝连接')) {
					errorMessage = '用户拒绝连接';
				}
				
				uni.showToast({
					title: errorMessage,
					icon: 'none',
					duration: 2000
				});
				
				// 连接失败，显示错误页面
				this.isConnecting = false;
				this.showErrorPage = true;
			}
		},

		// 在TokenPocket环境中连接
		async connectWithTokenPocket() {
			try {
				let ethereum;
				
				// 尝试多种方式获取ethereum对象
				if (window.tokenpocket && window.tokenpocket.ethereum) {
					ethereum = window.tokenpocket.ethereum;
				} else if (window.ethereum) {
					ethereum = window.ethereum;
				} else {
					throw new Error('未找到Web3提供者');
				}
				
				console.log('使用的以太坊提供者:', ethereum);
				
				// 请求连接账户
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				
				if (accounts.length > 0) {
					this.walletAddress = accounts[0];
					this.saveWalletConnection('TokenPocket', this.walletAddress);
					
					// 连接成功提示
					uni.showToast({
						title: '钱包连接成功',
						icon: 'success'
					});
					
					// 跳转到首页
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
				} else {
					throw new Error('用户拒绝连接');
				}
			} catch (error) {
				console.error('TokenPocket连接详细错误:', error);
				throw error;
			}
		},

		// 拉起TokenPocket应用
		async openTokenPocket() {
			try {
				// #ifdef APP-PLUS
				const tokenPocketUrl = `tpoutside://dapp/open?dappUrl=${encodeURIComponent(this.currentUrl)}`;
				plus.runtime.openURL(tokenPocketUrl);
				// 等待用户从TokenPocket返回
				await this.waitForTokenPocketReturn();
				// #endif
				
				// #ifdef H5
				// 在H5环境中，直接显示错误页面，避免深链接问题
				throw new Error('请在移动设备上使用TokenPocket钱包访问');
				// #endif
				
				// #ifdef MP-WEIXIN
				// 小程序环境无法直接打开外部应用，显示错误页面
				throw new Error('小程序环境无法打开TokenPocket');
				// #endif
				
			} catch (error) {
				throw error;
			}
		},

		// 等待从TokenPocket返回
		async waitForTokenPocketReturn() {
			return new Promise((resolve, reject) => {
				let checkCount = 0;
				const maxChecks = 30; // 最多检查30次，每次2秒
				
				const checkInterval = setInterval(() => {
					checkCount++;
					
					// 检查是否已经在TokenPocket环境中
					if (this.detectTokenPocketEnvironment()) {
						clearInterval(checkInterval);
						this.connectWithTokenPocket().then(resolve).catch(reject);
						return;
					}
					
					// 检查是否超时
					if (checkCount >= maxChecks) {
						clearInterval(checkInterval);
						reject(new Error('TokenPocket连接超时'));
						return;
					}
				}, 2000);
			});
		},

		// 获取当前URL
		getCurrentUrl() {
			// #ifdef H5
			return window.location.href;
			// #endif
			
			// #ifdef APP-PLUS
			return 'https://ai-smart-contracts.com/app'; // 您的应用URL
			// #endif
			
			// #ifdef MP-WEIXIN
			return 'https://ai-smart-contracts.com/mp'; // 您的小程序URL
			// #endif
		},

		// 复制链接
		copyLink() {
			const linkToCopy = this.currentUrl;
			
			// #ifdef H5
			if (navigator.clipboard) {
				navigator.clipboard.writeText(linkToCopy).then(() => {
					uni.showToast({
						title: '链接已复制',
						icon: 'success'
					});
				}).catch(() => {
					this.fallbackCopyTextToClipboard(linkToCopy);
				});
			} else {
				this.fallbackCopyTextToClipboard(linkToCopy);
			}
			// #endif
			
			// #ifdef APP-PLUS || MP-WEIXIN
			uni.setClipboardData({
				data: linkToCopy,
				success: () => {
					uni.showToast({
						title: '链接已复制',
						icon: 'success'
					});
				}
			});
			// #endif
		},

		// 备用复制方法
		fallbackCopyTextToClipboard(text) {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			
			try {
				document.execCommand('copy');
				uni.showToast({
					title: '链接已复制',
					icon: 'success'
				});
			} catch (err) {
				uni.showToast({
					title: '复制失败，请手动复制',
					icon: 'none'
				});
			}
			
			document.body.removeChild(textArea);
		},

		// 保存钱包连接信息
		saveWalletConnection(walletType, address) {
			uni.setStorageSync('walletType', walletType);
			uni.setStorageSync('walletAddress', address);
			uni.setStorageSync('walletConnected', true);
			uni.setStorageSync('connectTime', Date.now());
		},

		// 跳转到首页
		navigateToHome() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},

		// 延迟函数
		delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},

		// 检测是否是移动设备
		isMobileDevice() {
			// #ifdef H5
			const userAgent = navigator.userAgent;
			const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
			return mobileRegex.test(userAgent);
			// #endif
			
			// #ifdef APP-PLUS
			return true;
			// #endif
			
			// #ifdef MP-WEIXIN
			return true;
			// #endif
		}
	}
}
</script>

<style>
.connect-container {
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

.welcome-section {
	text-align: center;
	margin-bottom: 60rpx;
}

.logo-container {
	margin-bottom: 30rpx;
}

.app-logo {
	width: 120rpx;
	height: 120rpx;
}

.app-logo-custom {
	width: 120rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
}

.ai-icon {
	position: relative;
	width: 100rpx;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.ai-circle {
	width: 80rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 16rpx rgba(74, 144, 226, 0.3);
	position: relative;
	z-index: 2;
}

.ai-text {
	font-size: 28rpx;
	font-weight: bold;
	color: white;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.ai-dots {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 1;
}

.dot {
	position: absolute;
	width: 12rpx;
	height: 12rpx;
	background-color: #4A90E2;
	border-radius: 50%;
	animation: pulse 2s infinite;
}

.dot1 {
	top: 10rpx;
	right: 20rpx;
	animation-delay: 0s;
}

.dot2 {
	bottom: 10rpx;
	left: 15rpx;
	animation-delay: 0.7s;
}

.dot3 {
	top: 50%;
	left: 5rpx;
	transform: translateY(-50%);
	animation-delay: 1.4s;
}

@keyframes pulse {
	0%, 100% {
		opacity: 0.3;
		transform: scale(1);
	}
	50% {
		opacity: 1;
		transform: scale(1.2);
	}
}

.welcome-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.welcome-subtitle {
	font-size: 28rpx;
	color: #666;
	display: block;
}

.connect-status {
	text-align: center;
	padding: 40rpx;
	background-color: #f8f9fa;
	border-radius: 15rpx;
	margin-bottom: 40rpx;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid #f3f3f3;
	border-top: 4rpx solid #4A90E2;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto 20rpx;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.connecting-text {
	font-size: 28rpx;
	color: #666;
	display: block;
}

/* 错误页面样式 */
.error-section {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 60vh;
}

.error-card {
	background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
	border-radius: 30rpx;
	padding: 60rpx 40rpx;
	text-align: center;
	box-shadow: 0 20rpx 40rpx rgba(74, 144, 226, 0.3);
	max-width: 600rpx;
	width: 100%;
}

.character-container {
	margin-bottom: 40rpx;
}

.character-avatar {
	width: 200rpx;
	height: 200rpx;
	position: relative;
	margin: 0 auto;
}

.character-head {
	width: 120rpx;
	height: 120rpx;
	background-color: #fdbcb4;
	border-radius: 50%;
	position: relative;
	margin: 0 auto;
	margin-bottom: 20rpx;
}

.character-face {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 80rpx;
	height: 80rpx;
}

.character-eyes {
	position: absolute;
	top: 30rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 60rpx;
	height: 20rpx;
}

.eye {
	width: 12rpx;
	height: 12rpx;
	background-color: #333;
	border-radius: 50%;
	position: absolute;
	top: 4rpx;
}

.left-eye {
	left: 8rpx;
}

.right-eye {
	right: 8rpx;
}

.character-mouth {
	position: absolute;
	top: 50rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 24rpx;
	height: 12rpx;
	border: 2rpx solid #333;
	border-top: none;
	border-radius: 0 0 24rpx 24rpx;
}

.character-hair {
	position: absolute;
	top: -10rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 100rpx;
	height: 40rpx;
	background-color: #8B4513;
	border-radius: 50rpx 50rpx 0 0;
}

.character-glasses {
	position: absolute;
	top: 25rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 80rpx;
	height: 30rpx;
}

.glass {
	width: 30rpx;
	height: 30rpx;
	border: 3rpx solid #333;
	border-radius: 50%;
	position: absolute;
	background-color: rgba(255, 255, 255, 0.3);
}

.left-glass {
	left: 0;
}

.right-glass {
	right: 0;
}

.glass-bridge {
	position: absolute;
	top: 15rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 20rpx;
	height: 3rpx;
	background-color: #333;
}

.character-body {
	width: 140rpx;
	height: 100rpx;
	position: relative;
	margin: 0 auto;
}

.character-suit {
	width: 100rpx;
	height: 80rpx;
	background-color: #2C3E50;
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	border-radius: 8rpx;
}

.character-tie {
	width: 16rpx;
	height: 60rpx;
	background-color: #E74C3C;
	position: absolute;
	top: 10rpx;
	left: 50%;
	transform: translateX(-50%);
	border-radius: 0 0 8rpx 8rpx;
}

.character-hand {
	position: absolute;
	top: 20rpx;
	right: -10rpx;
	width: 40rpx;
	height: 40rpx;
}

.coffee-cup {
	width: 24rpx;
	height: 32rpx;
	background-color: #8B4513;
	border-radius: 0 0 8rpx 8rpx;
	position: relative;
}

.coffee-cup::before {
	content: '';
	position: absolute;
	top: 8rpx;
	right: -8rpx;
	width: 12rpx;
	height: 16rpx;
	border: 2rpx solid #8B4513;
	border-left: none;
	border-radius: 0 8rpx 8rpx 0;
}

.coffee-cup::after {
	content: '';
	position: absolute;
	top: 2rpx;
	left: 2rpx;
	right: 2rpx;
	height: 6rpx;
	background-color: #654321;
	border-radius: 4rpx 4rpx 0 0;
}

.error-content {
	color: white;
}

.error-title {
	font-size: 48rpx;
	font-weight: bold;
	color: white;
	display: block;
	margin-bottom: 30rpx;
}

.error-subtitle {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.6;
	display: block;
	margin-bottom: 60rpx;
}

.copy-button {
	background-color: rgba(255, 255, 255, 0.2);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50rpx;
	padding: 25rpx 60rpx;
	display: inline-block;
	cursor: pointer;
	transition: all 0.3s ease;
}

.copy-button:hover {
	background-color: rgba(255, 255, 255, 0.3);
	transform: translateY(-2rpx);
}

.copy-text {
	font-size: 32rpx;
	color: white;
	font-weight: bold;
}
</style>