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
					<text class="connecting-text">Connecting to wallet...</text>
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
					<text class="connecting-text">Checking network connection...</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import store from '@/store/index.js';
import { api, apiUtils } from '@/utils/api.js';

export default {
	data() {
		return {
			isConnecting: false,
			showErrorPage: false,
			walletAddress: '',
			currentUrl: '',
			urlTid: '', // 新增：存储从URL获取的tid
			isWalletConnected: false, // 新增：标记钱包连接状态
			accountsChangedHandler: null, // 新增：账户变化监听器
			chainChangedHandler: null, // 新增：链变化监听器
			connectHandler: null, // 新增：连接监听器
			disconnectHandler: null // 新增：断开连接监听器
		}
	},
	async onLoad(options) {
		// #ifdef H5
		console.log('Current full URL:', window.location.href);
		console.log('URL search part:', window.location.search);
		console.log('URL hash part:', window.location.hash);
		// #endif
		
		// 获取URL参数中的tid - 使用多种方法确保兼容性
		this.urlTid = this.getTidFromUrl(options);
		console.log('tid obtained from URL:', this.urlTid);
		console.log('onLoad received options:', options);
		
		// 保存tid到本地存储，避免丢失
		if (this.urlTid) {
			uni.setStorageSync('urlTid', this.urlTid);
		}
		
		// 如果没有tid，显示邀请码提示
		if (!this.urlTid) {
			this.showInviteCodeError();
			return;
		}
		
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
			console.log('=== Start checking wallet connection status ===');
			
			// 首先检查本地存储，但只接受ETH地址
			const walletAddress = uni.getStorageSync('walletAddress');
			const walletType = uni.getStorageSync('walletType');
			console.log('Local storage wallet address:', walletAddress);
			console.log('Local storage wallet type:', walletType);
			console.log('Is valid ETH address:', this.isValidEthAddress(walletAddress));
			
			// 如果本地存储的不是有效ETH地址或不是TokenPocket，清除它
			if (walletAddress && (!this.isValidEthAddress(walletAddress) || walletType !== 'TokenPocket-ETH')) {
				console.log('Clear local storage non-TokenPocket ETH address:', walletAddress, walletType);
				uni.removeStorageSync('walletAddress');
				uni.removeStorageSync('walletType');
				uni.removeStorageSync('walletConnected');
			}
			
			if (walletAddress && this.isValidEthAddress(walletAddress) && walletType === 'TokenPocket-ETH') {
				// 已连接TokenPocket ETH钱包，设置监听并直接跳转到首页
				this.walletAddress = walletAddress;
				this.isWalletConnected = true;
				console.log('Use local storage TokenPocket ETH wallet address:', walletAddress);
				
				// 设置钱包监听
				this.setupWalletListeners();
				
				// 直接跳转到首页
				this.navigateToHome();
				return;
			}
			
			// 如果本地存储中没有有效的TokenPocket ETH地址，检查TokenPocket是否已有活跃连接
			const activeWalletAddress = await this.checkActiveWalletConnection();
			console.log('Detected active wallet address:', activeWalletAddress);
			console.log('Is valid ETH address:', this.isValidEthAddress(activeWalletAddress));
			
			// 如果检测到不支持的钱包
			if (activeWalletAddress === 'unsupported_wallet') {
				console.log('Detected unsupported wallet, showing error page');
				this.startConnectionFlow();
				return;
			}
			
			if (activeWalletAddress && this.isValidEthAddress(activeWalletAddress)) {
				// 检测到活跃的TokenPocket ETH连接，保存并跳转
				await this.saveWalletConnection('TokenPocket-ETH', activeWalletAddress);
				this.walletAddress = activeWalletAddress;
				this.isWalletConnected = true;
				console.log('Use detected TokenPocket ETH wallet address:', activeWalletAddress);
				
				// 设置钱包监听
				this.setupWalletListeners();
				
				// 直接跳转到首页
				this.navigateToHome();
				return;
			}
			
			console.log('No valid TokenPocket ETH wallet connection found, start connection process');
			// 都没有连接，开始连接流程
			this.startConnectionFlow();
		},

		// 设置钱包事件监听 - 新增方法
		setupWalletListeners() {
			try {
				console.log('Set wallet event listener...');
				
				// 获取以太坊提供者
				let ethereum = this.getEthereumProvider();
				
				if (!ethereum) {
					console.log('No Ethereum provider found, cannot set listener');
					return;
				}
				
				// 移除之前的监听器（避免重复绑定）
				this.removeWalletListeners();
				
				// 监听账户变化
				this.accountsChangedHandler = (accounts) => {
					console.log('Detected account change:', accounts);
					this.handleAccountsChanged(accounts);
				};
				
				// 监听链变化
				this.chainChangedHandler = (chainId) => {
					console.log('Detected chain change:', chainId);
					this.handleChainChanged(chainId);
				};
				
				// 监听连接状态变化
				this.connectHandler = (connectInfo) => {
					console.log('Detected connection:', connectInfo);
					this.handleConnect(connectInfo);
				};
				
				// 监听断开连接
				this.disconnectHandler = (error) => {
					console.log('Detected disconnection:', error);
					this.handleDisconnect(error);
				};
				
				// 绑定事件监听器
				ethereum.on('accountsChanged', this.accountsChangedHandler);
				ethereum.on('chainChanged', this.chainChangedHandler);
				ethereum.on('connect', this.connectHandler);
				ethereum.on('disconnect', this.disconnectHandler);
				
				console.log('Wallet event listener set successfully');
				
			} catch (error) {
				console.error('Failed to set wallet listener:', error);
			}
		},

		// 移除钱包事件监听 - 新增方法
		removeWalletListeners() {
			try {
				let ethereum = this.getEthereumProvider();
				
				if (ethereum && this.accountsChangedHandler) {
					ethereum.removeListener('accountsChanged', this.accountsChangedHandler);
					ethereum.removeListener('chainChanged', this.chainChangedHandler);
					ethereum.removeListener('connect', this.connectHandler);
					ethereum.removeListener('disconnect', this.disconnectHandler);
					console.log('Wallet event listener removed');
				}
			} catch (error) {
				console.error('Failed to remove wallet listener:', error);
			}
		},

		// 获取以太坊提供者 - 新增方法
		getEthereumProvider() {
			if (typeof window === 'undefined') return null;
			
			// 尝试多种方式获取ethereum对象
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

		// 处理账户变化 - 新增方法
		async handleAccountsChanged(accounts) {
			try {
				console.log('=== Handle account change ===');
				console.log('New account list:', accounts);
				
				if (accounts.length === 0) {
					// 用户断开了所有账户
					console.log('User disconnected all accounts');
					await this.handleWalletDisconnected();
				} else {
					// 用户切换了账户
					const newAddress = accounts[0];
					console.log('User switched to new account:', newAddress);
					
					if (this.isValidEthAddress(newAddress)) {
						if (newAddress !== this.walletAddress) {
							console.log('Account switched from', this.walletAddress, 'to', newAddress);
							
							// 更新钱包地址
							this.walletAddress = newAddress;
							
							// 保存到本地存储
							uni.setStorageSync('walletAddress', newAddress);
							
							// 调用API同步新地址
							try {
								await this.callWalletConnectAPI(newAddress);
								console.log('New wallet address synchronized to server');
							} catch (apiError) {
								console.warn('API synchronization failed, but does not affect wallet switching:', apiError.message);
							}
							
							// 显示切换提示
							uni.showToast({
								title: `Wallet switched to ${this.formatWalletAddress(newAddress)}`,
								icon: 'success',
								duration: 3000
							});
						} else {
							console.log('Account address unchanged, no update needed');
						}
					} else {
						console.warn('New account is not a valid ETH address:', newAddress);
						uni.showToast({
							title: 'Detected non-ETH account, please switch to ETH account',
							icon: 'none',
							duration: 3000
						});
					}
				}
			} catch (error) {
				console.error('Handle account change failed:', error);
				uni.showToast({
					title: 'Wallet switching failed',
					icon: 'none'
				});
			}
		},

		// 处理链变化 - 新增方法
		handleChainChanged(chainId) {
			console.log('=== Handle chain change ===');
			console.log('New chain ID:', chainId);
			
			// 可以在这里添加链验证逻辑
			// 例如：确保用户在正确的网络上
			
			uni.showToast({
				title: `Network switched to ${chainId}`,
				icon: 'success',
				duration: 2000
			});
		},

		// 处理连接 - 新增方法
		handleConnect(connectInfo) {
			console.log('=== Handle wallet connection ===');
			console.log('Connection information:', connectInfo);
		},

		// 处理断开连接 - 新增方法
		async handleDisconnect(error) {
			console.log('=== Handle wallet disconnection ===');
			console.log('Disconnection error:', error);
			
			await this.handleWalletDisconnected();
		},

		// 处理钱包断开连接 - 新增方法
		async handleWalletDisconnected() {
			try {
				console.log('Wallet disconnected, cleaning state...');
				
				// 清除本地存储
				uni.removeStorageSync('walletType');
				uni.removeStorageSync('walletAddress');
				uni.removeStorageSync('walletConnected');
				uni.removeStorageSync('connectTime');
				uni.removeStorageSync('userTid');
				
				// 重置状态
				this.walletAddress = '';
				this.isWalletConnected = false;
				this.isConnecting = false;
				this.showErrorPage = false;
				
				// 移除事件监听
				this.removeWalletListeners();
				
				// 显示断开提示
				uni.showToast({
					title: 'Wallet disconnected',
					icon: 'none',
					duration: 2000
				});
				
				// 延迟后重新开始连接流程
				setTimeout(() => {
					this.startConnectionFlow();
				}, 2000);
				
			} catch (error) {
				console.error('Handle wallet disconnection failed:', error);
			}
		},

		// 验证是否为有效的以太坊地址 - 严格验证
		isValidEthAddress(address) {
			if (!address || typeof address !== 'string') {
				console.log('Address is empty or not a string:', address);
				return false;
			}
			
			// 严格验证：必须是42位，以0x开头，且符合十六进制格式
			const isValid = address.length === 42 && 
							address.startsWith('0x') && 
							/^0x[a-fA-F0-9]{40}$/.test(address);
			
			// 额外检查：确保不是Tron地址
			const isTronAddress = address.startsWith('T') && address.length === 34;
			
			console.log('Address validation result:', {
				address: address,
				length: address.length,
				startsWithOx: address.startsWith('0x'),
				matchesPattern: /^0x[a-fA-F0-9]{40}$/.test(address),
				isTronAddress: isTronAddress,
				isValid: isValid && !isTronAddress
			});
			
			return isValid && !isTronAddress;
		},

		// 格式化钱包地址显示
		formatWalletAddress(address) {
			if (!address) return '';
			if (address.length <= 10) return address;
			return `${address.slice(0, 6)}...${address.slice(-4)}`;
		},

		// 断开钱包连接
		async disconnectWallet() {
			try {
				console.log('=== Start disconnecting wallet ===');
				
				// 移除事件监听
				this.removeWalletListeners();
				
				// 清除本地存储
				uni.removeStorageSync('walletType');
				uni.removeStorageSync('walletAddress');
				uni.removeStorageSync('walletConnected');
				uni.removeStorageSync('connectTime');
				uni.removeStorageSync('userTid');
				
				// 重置状态
				this.walletAddress = '';
				this.isWalletConnected = false;
				this.isConnecting = false;
				this.showErrorPage = false;
				
				console.log('状态重置完成 - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
				
				// 如果在钱包环境中，尝试断开连接
				if (typeof window !== 'undefined') {
					// 尝试断开以太坊连接
					try {
						if (window.ethereum && window.ethereum.disconnect) {
							await window.ethereum.disconnect();
						}
					} catch (error) {
						console.log('Failed to disconnect Ethereum connection:', error);
					}
					
					// 尝试断开其他钱包连接
					try {
						if (window.tokenpocket && window.tokenpocket.disconnect) {
							await window.tokenpocket.disconnect();
						}
					} catch (error) {
						console.log('Failed to disconnect TokenPocket connection:', error);
					}
				}
				
				console.log('Wallet connection disconnected');
			} catch (error) {
				console.error('Failed to disconnect wallet:', error);
				throw error;
			}
		},

		// 在TokenPocket环境中连接 - 只连接ETH
		async connectWithTokenPocket() {
			try {
				console.log('Start connecting TokenPocket Ethereum wallet...');
				
				// 只尝试连接以太坊钱包
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('TokenPocket-ETH', ethAddress);
					
					// 设置钱包监听
					this.setupWalletListeners();
					
					// 连接成功提示
					uni.showToast({
						title: 'TokenPocket Ethereum wallet connected successfully',
						icon: 'success'
					});
					
					// 跳转到首页
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('No available Ethereum wallet connection found');
			} catch (error) {
				console.error('TokenPocket ETH connection detailed error:', error);
				throw error;
			}
		},

		// 连接MetaMask钱包
		async connectWithMetaMask() {
			try {
				console.log('Start connecting MetaMask wallet...');
				
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('MetaMask', ethAddress);
					
					// 设置钱包监听
					this.setupWalletListeners();
					
					uni.showToast({
						title: 'MetaMask wallet connected successfully',
						icon: 'success'
					});
					
					setTimeout(() => {
						this.navigateToHome();
					}, 1500);
					return;
				}
				
				throw new Error('MetaMask connection failed');
			} catch (error) {
				console.error('MetaMask connection detailed error:', error);
				throw error;
			}
		},

		// 连接ImToken钱包
		async connectWithImToken() {
			try {
				console.log('Start connecting ImToken wallet...');
				
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('ImToken', ethAddress);
					
					uni.showToast({
						title: 'ImToken wallet connected successfully',
						icon: 'success'
					});
					
					this.isConnecting = false;
					console.log('ImToken connected successfully - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
					
					// 强制刷新页面状态
					this.$forceUpdate();
					return;
				}
				
				throw new Error('ImToken connection failed');
			} catch (error) {
				console.error('ImToken connection detailed error:', error);
				throw error;
			}
		},

		// 连接Bifrost钱包
		async connectWithBifrost() {
			try {
				console.log('Start connecting Bifrost wallet...');
				
				// 首先尝试Bifrost专用连接方法
				if (window.bifrost) {
					const accounts = await window.bifrost.request({ method: 'eth_requestAccounts' });
					if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
						this.walletAddress = accounts[0];
						this.isWalletConnected = true;
						await this.saveWalletConnection('Bifrost', accounts[0]);
						
						uni.showToast({
							title: 'Bifrost wallet connected successfully',
							icon: 'success'
						});
						
						this.isConnecting = false;
						console.log('Bifrost connected successfully - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
						
						// 强制刷新页面状态
						this.$forceUpdate();
						return;
					}
				}
				
				// 回退到以太坊连接
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('Bifrost', ethAddress);
					
					uni.showToast({
						title: 'Bifrost wallet connected successfully',
						icon: 'success'
					});
					
					this.isConnecting = false;
					console.log('Bifrost connected successfully - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
					
					// 强制刷新页面状态
					this.$forceUpdate();
					return;
				}
				
				throw new Error('Bifrost connection failed');
			} catch (error) {
				console.error('Bifrost connection detailed error:', error);
				throw error;
			}
		},

		// 连接Onchain钱包
		async connectWithOnchain() {
			try {
				console.log('Start connecting Onchain wallet...');
				
				// 首先尝试Onchain专用连接方法
				if (window.onchain) {
					const accounts = await window.onchain.request({ method: 'eth_requestAccounts' });
					if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
						this.walletAddress = accounts[0];
						this.isWalletConnected = true;
						await this.saveWalletConnection('Onchain', accounts[0]);
						
						uni.showToast({
							title: 'Onchain wallet connected successfully',
							icon: 'success'
						});
						
						this.isConnecting = false;
						console.log('Onchain connected successfully - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
						
						// 强制刷新页面状态
						this.$forceUpdate();
						return;
					}
				}
				
				// 回退到以太坊连接
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('Onchain', ethAddress);
					
					uni.showToast({
						title: 'Onchain wallet connected successfully',
						icon: 'success'
					});
					
					this.isConnecting = false;
					console.log('Onchain connected successfully - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
					
					// 强制刷新页面状态
					this.$forceUpdate();
					return;
				}
				
				throw new Error('Onchain connection failed');
			} catch (error) {
				console.error('Onchain connection detailed error:', error);
				throw error;
			}
		},

		// 连接Crypto钱包
		async connectWithCrypto() {
			try {
				console.log('Start connecting Crypto wallet...');
				
				// 首先尝试Crypto专用连接方法
				if (window.crypto && window.crypto.ethereum) {
					const accounts = await window.crypto.ethereum.request({ method: 'eth_requestAccounts' });
					if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
						this.walletAddress = accounts[0];
						this.isWalletConnected = true;
						await this.saveWalletConnection('Crypto', accounts[0]);
						
						uni.showToast({
							title: 'Crypto wallet connected successfully',
							icon: 'success'
						});
						
						this.isConnecting = false;
						console.log('Crypto connected successfully - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
						
						// 强制刷新页面状态
						this.$forceUpdate();
						return;
					}
				}
				
				// 回退到以太坊连接
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('Crypto', ethAddress);
					
					uni.showToast({
						title: 'Crypto wallet connected successfully',
						icon: 'success'
					});
					
					this.isConnecting = false;
					console.log('Crypto connected successfully - walletAddress:', this.walletAddress, 'isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
					
					// 强制刷新页面状态
					this.$forceUpdate();
					return;
				}
				
				throw new Error('Crypto wallet connection failed');
			} catch (error) {
				console.error('Crypto wallet connection detailed error:', error);
				throw error;
			}
		},

		// 连接以太坊钱包 - 只连接ETH
		async connectEthereumWallet() {
			try {
				console.log('Start connecting Ethereum wallet...');
				
				let ethereum;
				
				// 尝试多种方式获取ethereum对象
				if (window.tokenpocket && window.tokenpocket.ethereum) {
					ethereum = window.tokenpocket.ethereum;
					console.log('Use TokenPocket\'s Ethereum provider to connect');
				} else if (window.bifrost) {
					ethereum = window.bifrost;
					console.log('Use Bifrost provider to connect');
				} else if (window.onchain) {
					ethereum = window.onchain;
					console.log('Use Onchain provider to connect');
				} else if (window.crypto && window.crypto.ethereum) {
					ethereum = window.crypto.ethereum;
					console.log('Use Crypto\'s Ethereum provider to connect');
				} else if (window.ethereum) {
					ethereum = window.ethereum;
					console.log('Use standard Ethereum provider to connect');
				} else {
					console.log('No Ethereum provider found');
					return null;
				}
				
				console.log('Used Ethereum provider:', ethereum);
				
				// 请求连接账户
				const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
				console.log('ETH accounts list obtained after connection:', accounts);
				
				if (accounts.length > 0) {
					const address = accounts[0];
					console.log('First ETH account address connected:', address);
					
					// 严格验证是否为有效的以太坊地址
					if (this.isValidEthAddress(address)) {
						console.log('Connected ETH address validated:', address);
						return address;
					} else {
						console.warn('Address obtained from connection is not a valid ETH address:', address);
						return null;
					}
				}
				
				console.log('No ETH accounts obtained after connection');
				return null;
			} catch (error) {
				console.log('Ethereum wallet connection failed:', error);
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
				throw new Error('Please use a supported wallet on mobile devices');
				// #endif
				
				// #ifdef MP-WEIXIN
				// 小程序环境无法直接打开外部应用，显示错误页面
				throw new Error('WeChat environment cannot open wallet application');
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
						reject(new Error('Wallet connection timeout'));
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
						title: 'Link copied',
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
						title: 'Link copied',
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
					title: 'Link copied',
					icon: 'success'
				});
			} catch (err) {
				uni.showToast({
					title: 'Copy failed, please copy manually',
					icon: 'none'
				});
			}
			
			document.body.removeChild(textArea);
		},

		// 保存钱包连接信息并调用后端接口
		async saveWalletConnection(walletType, address) {
			console.log('saveWalletConnection start, current urlTid:', this.urlTid);
			
			try {
				// 保存到本地存储
				uni.setStorageSync('walletType', walletType);
				uni.setStorageSync('walletAddress', address);
				uni.setStorageSync('walletConnected', true);
				uni.setStorageSync('connectTime', Date.now());
				
				// 尝试调用钱包连接接口，但不阻塞流程
				try {
					await this.callWalletConnectAPI(address);
					console.log('Wallet connection information saved and synchronized to server');
				} catch (apiError) {
					console.warn('API synchronization failed, but does not affect wallet connection:', apiError.message);
					// API失败不影响钱包连接流程
				}
				
			} catch (error) {
				console.error('Failed to save wallet connection information:', error);
				throw error;
			}
		},

		// 调用钱包连接API
		async callWalletConnectAPI(address) {
			try {
				// 获取tid，保持为字符串类型
				const tid = this.generateTid();
				
				console.log('准备调用API');
				console.log('  - address (text):', address);
				console.log('  - tid (text):', tid);
				
				// 使用新的API方法
				const responseData = await api.user.walletConnect(address, tid);
				
				console.log('API响应:', responseData);
				
				// 检查接口返回结果并保存相关数据
				if (responseData && responseData.code === 0) {
					console.log('钱包连接同步成功');
					
					// 保存token到全局状态和本地存储
					if (responseData.token) {
						store.setToken(responseData.token);
						console.log('Token已保存到全局状态和本地存储');
					} else {
						console.warn('响应中没有找到token');
					}
					
					// 保存从接口返回的tid
					const returnedTid = responseData.id || responseData.tid || tid;
					uni.setStorageSync('userTid', returnedTid);
					console.log('已保存tid到本地存储:', returnedTid);
					
				} else {
					console.error('API返回格式异常:', responseData);
					
					// 对于格式异常但状态码正常的情况，我们也认为是成功的
					console.warn('API格式异常但状态码正常，视为成功');
					uni.setStorageSync('userTid', tid);
					console.log('已保存tid到本地存储(API格式异常):', tid);
				}
				
				return responseData;
			} catch (error) {
				console.error('调用钱包连接接口失败:', error);
				console.error('错误详情:', {
					message: error.message,
					stack: error.stack,
					response: error.response
				});
				throw error;
			}
		},

		// 生成tid（从URL参数获取，如果没有就传空）
		generateTid() {
			// 优先使用当前的urlTid，如果为空则从本地存储获取
			const tid = this.urlTid || uni.getStorageSync('urlTid') || '';
			console.log('generateTid called, return value (text):', tid);
			return tid; // 保持字符串格式
		},

		// 简单hash函数（如果需要根据地址生成tid）
		simpleHash(str) {
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				const char = str.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // 转换为32位整数
			}
			return Math.abs(hash);
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
		},

		// 获取tid参数 - 兼容多种环境（完整版本）
		getTidFromUrl(options) {
			// 方法1: 从uni-app的options中获取
			if (options && options.tid) {
				console.log('Get tid from options:', options.tid);
				return options.tid;
			}
			
			// 方法2: 在H5环境下直接解析URL参数
			// #ifdef H5
			try {
				const urlParams = new URLSearchParams(window.location.search);
				const tidFromUrl = urlParams.get('tid');
				if (tidFromUrl) {
					console.log('Get tid from URL search parameter:', tidFromUrl);
					return tidFromUrl;
				}
				
				// 方法3: 从hash中解析参数（如果参数在hash后面）
				const hash = window.location.hash;
				if (hash.includes('tid=')) {
					const hashParams = hash.split('?')[1];
					if (hashParams) {
						const hashUrlParams = new URLSearchParams(hashParams);
						const tidFromHash = hashUrlParams.get('tid');
						if (tidFromHash) {
							console.log('Get tid from hash parameter:', tidFromHash);
							return tidFromHash;
						}
					}
				}
				
				// 方法4: 手动解析完整URL
				const fullUrl = window.location.href;
				console.log('Full URL:', fullUrl);
				const tidMatch = fullUrl.match(/[?&]tid=([^&#]*)/);
				if (tidMatch && tidMatch[1]) {
					console.log('Get tid from full URL match:', tidMatch[1]);
					return tidMatch[1];
				}
			} catch (error) {
				console.error('H5 environment parsing URL parameters failed:', error);
			}
			// #endif
			
			console.log('All methods failed to get tid');
			return '';
		},

		// 显示邀请码错误提示 - 改为英文
		showInviteCodeError() {
			uni.showModal({
				title: 'Invitation Code Required',
				content: 'An invitation code is required to access this application. Please contact the administrator or use a valid invitation link.',
				showCancel: false,
				confirmText: 'OK'
			});
		},

		// 临时调试方法 - 手动触发状态检查
		debugWalletState() {
			console.log('=== Current wallet state debug information ===');
			console.log('walletAddress:', this.walletAddress);
			console.log('isConnecting:', this.isConnecting);
			console.log('showErrorPage:', this.showErrorPage);
			console.log('isWalletConnected:', this.isWalletConnected);
		    console.log('Wallet connection interface display conditions:', this.walletAddress && !this.isConnecting && !this.showErrorPage);
			
			// 检查本地存储
			const storedAddress = uni.getStorageSync('walletAddress');
			console.log('Local storage address:', storedAddress);
			console.log('Local storage address is valid ETH:', this.isValidEthAddress(storedAddress));
			
			// 强制清除非ETH地址
			if (storedAddress && !this.isValidEthAddress(storedAddress)) {
				console.log('Found non-ETH address, clearing...');
				uni.removeStorageSync('walletAddress');
				uni.removeStorageSync('walletType');
				uni.removeStorageSync('walletConnected');
				this.walletAddress = '';
				this.isWalletConnected = false;
				this.$forceUpdate();
				console.log('Cleared non-ETH address, re-checking connection status');
				setTimeout(() => {
					this.checkWalletConnection();
				}, 1000);
			}
		},

		// 检查活跃的钱包连接 - 新增方法
		async checkActiveWalletConnection() {
			try {
				console.log('Checking active wallet connection...');
				
				if (typeof window === 'undefined') {
					console.log('Non-browser environment, cannot check wallet connection');
					return null;
				}
				
				// 检查各种钱包提供者
				const providers = [
					{ name: 'TokenPocket', provider: window.tokenpocket?.ethereum },
					{ name: 'Bifrost', provider: window.bifrost },
					{ name: 'Onchain', provider: window.onchain },
					{ name: 'Crypto', provider: window.crypto?.ethereum },
					{ name: 'MetaMask', provider: window.ethereum }
				];
				
				for (const { name, provider } of providers) {
					if (provider) {
						try {
							console.log(`Checking ${name} wallet...`);
							const accounts = await provider.request({ method: 'eth_accounts' });
							
							if (accounts && accounts.length > 0) {
								const address = accounts[0];
								console.log(`${name} detected active connection:`, address);
								
								if (this.isValidEthAddress(address)) {
									console.log(`${name} returned valid ETH address:`, address);
									return address;
								} else {
									console.log(`${name} returned address is not a valid ETH address:`, address);
								}
							} else {
								console.log(`${name} has no active connection`);
							}
						} catch (error) {
							console.log(`Checking ${name} wallet failed:`, error.message);
						}
					}
				}
				
				console.log('No active wallet connection detected');
				return null;
			} catch (error) {
				console.error('Checking active wallet connection failed:', error);
				return null;
			}
		},

		// 开始连接流程 - 新增方法
		async startConnectionFlow() {
			try {
				console.log('=== Start wallet connection process ===');
				
				// 设置连接状态
				this.isConnecting = true;
				this.showErrorPage = false;
				
				console.log('连接状态更新 - isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
				
				// 等待页面状态更新
				await this.delay(100);
				
				// 检测钱包环境并自动连接
				const walletType = this.detectWalletEnvironment();
				console.log('Detected wallet environment:', walletType);
				
				if (walletType) {
					await this.autoConnectWallet(walletType);
				} else {
					// 没有检测到钱包环境，显示错误页面
					console.log('No supported wallet environment detected, displaying error page');
					await this.delay(2000); // 给用户一些时间看到连接状态
					this.isConnecting = false;
					this.showErrorPage = true;
					console.log('Display error page - isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
				}
			} catch (error) {
				console.error('Connection process failed:', error);
				this.isConnecting = false;
				this.showErrorPage = true;
				console.log('Connection failed, displaying error page - isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
			}
		},

		// 检测钱包环境 - 新增方法
		detectWalletEnvironment() {
			try {
				console.log('Start detecting wallet environment...');
				
				if (typeof window === 'undefined') {
					console.log('Non-browser environment');
					return null;
				}
				
				// 检测TokenPocket环境
				if (this.detectTokenPocketEnvironment()) {
					console.log('Detected TokenPocket environment');
					return 'TokenPocket';
				}
				
				// 检测其他钱包环境
				if (window.bifrost) {
					console.log('Detected Bifrost environment');
					return 'Bifrost';
				}
				
				if (window.onchain) {
					console.log('Detected Onchain environment');
					return 'Onchain';
				}
				
				if (window.crypto && window.crypto.ethereum) {
					console.log('Detected Crypto.com environment');
					return 'Crypto';
				}
				
				if (window.ethereum) {
					// 检测具体的钱包类型
					if (window.ethereum.isMetaMask) {
						console.log('Detected MetaMask environment');
						return 'MetaMask';
					} else if (window.ethereum.isImToken) {
						console.log('Detected ImToken environment');
						return 'ImToken';
					} else {
						console.log('Detected universal Ethereum environment');
						return 'Ethereum';
					}
				}
				
				console.log('No wallet environment detected');
				return null;
			} catch (error) {
				console.error('Failed to detect wallet environment:', error);
				return null;
			}
		},

		// 检测TokenPocket环境 - 新增方法
		detectTokenPocketEnvironment() {
			try {
				if (typeof window === 'undefined') return false;
				
				// 检查TokenPocket特有的全局对象
				return !!(
					window.tokenpocket || 
					window.tronWeb || 
					(window.ethereum && window.ethereum.isTokenPocket) ||
					(navigator.userAgent && navigator.userAgent.includes('TokenPocket'))
				);
			} catch (error) {
				console.error('Failed to detect TokenPocket environment:', error);
				return false;
			}
		},

		// 自动连接钱包 - 新增方法
		async autoConnectWallet(walletType) {
			try {
				console.log(`Start auto-connecting ${walletType} wallet...`);
				
				switch (walletType) {
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
					case 'Ethereum':
						// 通用以太坊连接
						const ethAddress = await this.connectEthereumWallet();
						if (ethAddress && this.isValidEthAddress(ethAddress)) {
							this.walletAddress = ethAddress;
							this.isWalletConnected = true;
							await this.saveWalletConnection('Ethereum', ethAddress);
							
							// 设置钱包监听
							this.setupWalletListeners();
							
							uni.showToast({
								title: 'Ethereum wallet connected successfully',
								icon: 'success'
							});
							
							setTimeout(() => {
								this.navigateToHome();
							}, 1500);
						} else {
							throw new Error('Ethereum wallet connection failed');
						}
						break;
					default:
						throw new Error(`Unsupported wallet type: ${walletType}`);
				}
				
			} catch (error) {
				console.error(`Auto-connecting ${walletType} wallet failed:`, error);
				
				// 连接失败，显示错误页面
				this.isConnecting = false;
				this.showErrorPage = true;
				
				uni.showToast({
					title: `${walletType} wallet connection failed`,
					icon: 'none',
					duration: 3000
				});
			}
		}
	},
	
	// 添加页面显示时的钩子
	onShow() {
		console.log('Page displayed, current wallet state:', {
			walletAddress: this.walletAddress,
			isConnecting: this.isConnecting,
			showErrorPage: this.showErrorPage
		});
		
		// 检查当前地址是否为ETH地址
		if (this.walletAddress && !this.isValidEthAddress(this.walletAddress)) {
			console.log('Found non-ETH address, clearing and reconnecting...');
			this.disconnectWallet().then(() => {
				this.checkWalletConnection();
			});
			return;
		}
		
		// 如果页面显示但没有钱包地址，重新检查
		if (!this.walletAddress && !this.isConnecting && !this.showErrorPage) {
			console.log('Page displayed but no wallet address, re-checking connection status');
			this.checkWalletConnection();
		}
	},
	
	// 添加页面隐藏时的钩子
	onHide() {
		console.log('Page hidden');
		// 页面隐藏时不移除监听器，保持连接状态
	},
	
	// 添加页面卸载时的钩子
	onUnload() {	
		console.log('Page unloaded, removing wallet listeners');
		this.removeWalletListeners();
	}
}
</script>

<style>
/* 保持原来的样式，移除钱包连接成功界面的样式 */
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

/* 错误页面样式保持不变 */
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