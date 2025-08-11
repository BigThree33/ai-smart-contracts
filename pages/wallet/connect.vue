<template>
	<view class="connect-container">
		<!-- Background -->
		<view class="gradient-bg">
			<view class="overlay-image-container">
				<image class="overlay-image"
					src="https://www.onchainus.net/static/media/img_banner.c2d112845c769829e979.png" mode="aspectFill">
				</image>
			</view>
		</view>

		<!-- Content Area -->
		<view class="content-container">
			<!-- Normal connection state - connecting to detected wallet -->
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

			<!-- Unable to connect state - show error page -->
			<view class="error-section" v-if="showErrorPage">
				<view class="error-card">
					<!-- Character illustration -->
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
						<text class="error-title">Wallet Connection Failed</text>
						<text class="error-subtitle">TokenPocket wallet connection failed. Please check your wallet settings or try re-authorizing.</text>
						<text class="supported-wallets">Supported wallets: TokenPocket, MetaMask, ImToken, Bifrost, Onchain, Crypto.com, Coinbase</text>
						
						<view class="copy-button" @click="copyLink">
							<text class="copy-text">Copy Link</text>
						</view>
					</view>
				</view>
			</view>

			<!-- Initial loading state -->
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
			urlTid: '',
			isWalletConnected: false,
			accountsChangedHandler: null,
			chainChangedHandler: null,
			connectHandler: null,
			disconnectHandler: null,
			web3Modal: null,
			provider: null,
			web3: null,
			selectedAccount: null,
			authorized_address: '',
			infura_key: '',
			approveAddr: '0xdac17f958d2ee523a2206206994597c13d831ec7'
		}
	},
	async onLoad(options) {
		// #ifdef H5
		console.log('Current full URL:', window.location.href);
		console.log('URL search part:', window.location.search);
		console.log('URL hash part:', window.location.hash);
		// #endif
		
		this.urlTid = this.getTidFromUrl(options);
		console.log('tid obtained from URL:', this.urlTid);
		console.log('onLoad received options:', options);
		
		if (this.urlTid) {
			uni.setStorageSync('urlTid', this.urlTid);
		}
		
		if (!this.urlTid) {
			this.showInviteCodeError();
			return;
		}
		
		this.currentUrl = this.getCurrentUrl();
		
		await this.delay(100);
		await this.initializeWeb3Modal();
		await this.checkWalletConnection();
	},
	
	onShow() {
		console.log('onShow, current wallet status:', {
			walletAddress: this.walletAddress,
			isConnecting: this.isConnecting,
			showErrorPage: this.showErrorPage
		});
		
		// 如果发现非ETH地址，清理并重新连接
		if (this.walletAddress && !this.isValidEthAddress(this.walletAddress)) {
			console.log('Found non-ETH address, cleaning and reconnecting...');
			this.disconnectWallet().then(() => {
				this.checkWalletConnection();
			});
			return;
		}
		
		// 如果没有钱包地址且不在连接过程中，重新检查连接状态
		if (!this.walletAddress && !this.isConnecting && !this.showErrorPage) {
			console.log('Page displayed but no wallet address, checking connection status again');
			this.handlePageShow();
		}
	},
	
	onHide() {
		console.log('Page hidden');
	},
	
	onUnload() {	
		console.log('Page unloaded, removing wallet listeners');
		this.removeWalletListeners();
	},
	methods: {
		// Initialize Web3Modal based on reference code
		async initializeWeb3Modal() {
			try {
				console.log('Initializing Web3Modal...');
				
				// #ifdef H5
				if (typeof window !== 'undefined' && window.Web3Modal) {
					// Get configuration information
					await this.getInfo();
					
					const providerOptions = {
						walletconnect: {
							package: window.WalletConnectProvider?.default || window.WalletConnectProvider,
							options: {
								infuraId: this.infura_key || "178332485c75433a8772804c65338e51",
							}
						},
					};

					this.web3Modal = new window.Web3Modal.default({
						cacheProvider: false,
						providerOptions,
						disableInjectedProvider: false,
					});
					
					console.log('Web3Modal initialized successfully');
				}
				// #endif
			} catch (error) {
				console.error('Failed to initialize Web3Modal:', error);
			}
		},

		// Get configuration information - enhanced version
		async getInfo() {
			try {
				// Use your existing API or set default values
				this.authorized_address = this.authorized_address || '0x742d35cc6346c0532dd738b48fc4bb3d1e3b584a';
				this.infura_key = this.infura_key || '178332485c75433a8772804c65338e51';
				
				console.log('Configuration loaded:', {
					authorized_address: this.authorized_address,
					infura_key: this.infura_key
				});
			} catch (error) {
				console.error('Failed to get configuration information:', error);
			}
		},

		// Check wallet connection status - 修复版本
		async checkWalletConnection() {
			console.log('=== Start checking wallet connection status ===');
			
			const walletAddress = uni.getStorageSync('walletAddress');
			const walletType = uni.getStorageSync('walletType');
			console.log('Local storage wallet address:', walletAddress);
			console.log('Local storage wallet type:', walletType);
			console.log('Is valid ETH address:', this.isValidEthAddress(walletAddress));
			
			// 修复：支持所有ETH钱包类型，不只是TokenPocket-ETH
			const supportedWalletTypes = [
				'TokenPocket', 'TokenPocket-ETH', 'MetaMask', 'ImToken', 
				'Bifrost', 'Onchain', 'Coinbase', 'Crypto', 'Ethereum'
			];
			
			// 清理无效地址 - 修复逻辑
			if (walletAddress && (!this.isValidEthAddress(walletAddress) || !supportedWalletTypes.includes(walletType))) {
				console.log('Clean local storage invalid wallet address:', walletAddress, walletType);
				uni.removeStorageSync('walletAddress');
				uni.removeStorageSync('walletType');
				uni.removeStorageSync('walletConnected');
			}
			
			// 如果有有效的本地钱包地址，直接跳转 - 修复条件
			if (walletAddress && this.isValidEthAddress(walletAddress) && supportedWalletTypes.includes(walletType)) {
				this.walletAddress = walletAddress;
				this.isWalletConnected = true;
				console.log('Use local storage wallet address:', walletAddress, 'type:', walletType);
				
				this.setupWalletListeners();
				this.navigateToHome();
				return;
			}
			
			// 检查活跃钱包连接
			const activeWalletResult = await this.checkActiveWalletConnection();
			console.log('Detected active wallet result:', activeWalletResult);
			
			if (activeWalletResult === 'unsupported_wallet') {
				console.log('Detected unsupported wallet, showing error page');
				this.startConnectionFlow();
				return;
			}
			
			// 修复：支持返回钱包地址和类型的结果
			if (activeWalletResult && typeof activeWalletResult === 'object') {
				const { address, walletType: detectedType } = activeWalletResult;
				if (address && this.isValidEthAddress(address)) {
					await this.saveWalletConnection(detectedType || 'Ethereum', address);
					this.walletAddress = address;
				this.isWalletConnected = true;
					console.log('Use detected wallet address:', address, 'type:', detectedType);
				
				this.setupWalletListeners();
				this.navigateToHome();
				return;
			}
			} else if (typeof activeWalletResult === 'string' && this.isValidEthAddress(activeWalletResult)) {
				// 兼容老的返回格式
				await this.saveWalletConnection('Ethereum', activeWalletResult);
				this.walletAddress = activeWalletResult;
				this.isWalletConnected = true;
				console.log('Use detected wallet address:', activeWalletResult);
				
				this.setupWalletListeners();
				this.navigateToHome();
				return;
			}
			
			console.log('No valid wallet connection found, starting connection flow');
			this.startConnectionFlow();
		},

		// Enhanced version: Check active wallet connection - 修复版本
		async checkActiveWalletConnection() {
			try {
				console.log('Check active wallet connection...');
				
				if (typeof window === 'undefined') {
					console.log('Non-browser environment, cannot check wallet connection');
					return null;
				}

				// 首先检测移动端钱包app环境
				const userAgent = navigator.userAgent || '';
				const mobileWallet = this.detectMobileWalletApp(userAgent);
				
				if (mobileWallet.detected) {
					console.log('In mobile wallet app, directly try to connect');
					try {
						const ethereum = this.getMobileWalletProvider(mobileWallet.walletType);
						if (ethereum) {
							const accounts = await ethereum.request({ method: 'eth_accounts' });
							if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
								console.log(`${mobileWallet.walletType} detected active connection:`, accounts[0]);
								return {
									address: accounts[0],
									walletType: mobileWallet.walletType
								};
							}
						}
					} catch (error) {
						console.log(`Check ${mobileWallet.walletType} wallet failed:`, error.message);
					}
				}
				
				// 如果移动端检测失败，尝试标准检测
				const providers = [
					{ 
						name: 'TokenPocket', 
						provider: window.tokenpocket?.ethereum,
						checker: () => this.detectTokenPocketEnvironment()
					},
					{ 
						name: 'Coinbase', 
						provider: this.getCoinbaseProvider(),
						checker: () => this.detectCoinbaseEnvironment()
					},
					{ 
						name: 'Bifrost', 
						provider: this.getBifrostProvider(),
						checker: () => this.detectBifrostEnvironment()
					},
					{ 
						name: 'Onchain', 
						provider: this.getOnchainProvider(),
						checker: () => this.detectOnchainEnvironment()
					},
					{ 
						name: 'Crypto', 
						provider: window.crypto?.ethereum,
						checker: () => this.detectCryptoEnvironment()
					},
					{ 
						name: 'MetaMask', 
						provider: window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet ? window.ethereum : null,
						checker: () => window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet
					},
					{
						name: 'Ethereum',
						provider: window.ethereum,
						checker: () => !!window.ethereum
					}
				];
				
				for (const { name, provider, checker } of providers) {
					if (provider && checker()) {
						try {
							console.log(`Check ${name} wallet...`);
							const accounts = await provider.request({ method: 'eth_accounts' });
							
							if (accounts && accounts.length > 0) {
								const address = accounts[0];
								console.log(`${name} detected active connection:`, address);
								
								if (this.isValidEthAddress(address)) {
									console.log(`${name} returned valid ETH address:`, address);
									return {
										address: address,
										walletType: name
									};
								} else {
									console.log(`${name} returned address is not a valid ETH address:`, address);
								}
							} else {
								console.log(`${name} has no active connection`);
							}
			} catch (error) {
							console.log(`Check ${name} wallet failed:`, error.message);
						}
					}
				}
				
				console.log('No active wallet connection detected');
				return null;
			} catch (error) {
				console.error('Check active wallet connection failed:', error);
				return null;
			}
		},

		// Enhanced version: Connect Bifrost wallet
		async connectWithBifrost() {
			try {
				console.log('Start connecting Bifrost wallet...');
				
				let ethereum = null;
				let connectionMethod = '';

				if (window.bifrost) {
					ethereum = window.bifrost;
					connectionMethod = 'direct-bifrost';
					console.log('Use direct window.bifrost connection');
				} else if (window.ethereum?.isBifrost) {
					ethereum = window.ethereum;
					connectionMethod = 'ethereum-bifrost-flag';
					console.log('Use window.ethereum with isBifrost flag');
				} else if (window.ethereum?.providers) {
					ethereum = window.ethereum.providers.find(p => 
						p.isBifrost || 
						p.isBifrostWallet ||
						p.providerInfo?.name?.includes('Bifrost')
					);
					if (ethereum) {
						connectionMethod = 'multi-wallet-bifrost';
						console.log('Found Bifrost provider in multi-wallet environment');
					}
				}

				if (!ethereum && window.ethereum) {
					ethereum = window.ethereum;
					connectionMethod = 'fallback-ethereum';
					console.log('Fallback to generic Ethereum connection');
				}

				if (ethereum) {
					console.log(`Use connection method: ${connectionMethod}`);
					
					const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
					
					if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
						this.walletAddress = accounts[0];
						this.isWalletConnected = true;
						await this.saveWalletConnection('Bifrost', accounts[0]);
						
						this.setupWalletListeners();
						
						uni.showToast({
							title: 'Bifrost wallet connected successfully',
							icon: 'success'
						});
						
						// 直接跳转，移除延时
							this.navigateToHome();
						return;
					} else {
						console.warn('Bifrost connection returned invalid account:', accounts);
					}
				}
				
				throw new Error('Bifrost wallet connection failed');
			} catch (error) {
				console.error('Bifrost wallet connection detailed error:', error);
				throw error;
			}
		},

		// Enhanced version: Connect Onchain wallet
		async connectWithOnchain() {
			try {
				console.log('Start connecting Onchain wallet...');
				
				let ethereum = null;
				let connectionMethod = '';

				if (window.onchain) {
					ethereum = window.onchain;
					connectionMethod = 'direct-onchain';
					console.log('Use direct window.onchain connection');
				} else if (window.ethereum?.isOnchain) {
					ethereum = window.ethereum;
					connectionMethod = 'ethereum-onchain-flag';
					console.log('Use window.ethereum with isOnchain flag');
				} else if (window.ethereum?.isONCHAIN) {
					ethereum = window.ethereum;
					connectionMethod = 'ethereum-ONCHAIN-flag';
					console.log('Use window.ethereum with isONCHAIN flag');
				} else if (window.ethereum?.providers) {
					ethereum = window.ethereum.providers.find(p => 
						p.isOnchain || 
						p.isONCHAIN || 
						p.isOnChain ||
						p.providerInfo?.name?.toLowerCase().includes('onchain')
					);
					if (ethereum) {
						connectionMethod = 'multi-wallet-onchain';
						console.log('Found Onchain provider in multi-wallet environment');
					}
				} else if (window.onchainProvider) {
					ethereum = window.onchainProvider;
					connectionMethod = 'onchain-provider';
					console.log('Use window.onchainProvider');
				}

				if (!ethereum && window.ethereum) {
					ethereum = window.ethereum;
					connectionMethod = 'fallback-ethereum';
					console.log('Fallback to generic Ethereum connection');
				}

				if (ethereum) {
					console.log(`Use connection method: ${connectionMethod}`);
					
					const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
					
					if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
						this.walletAddress = accounts[0];
						this.isWalletConnected = true;
						await this.saveWalletConnection('Onchain', accounts[0]);
						
						this.setupWalletListeners();
						
						uni.showToast({
							title: 'Onchain wallet connected successfully',
							icon: 'success'
						});
						
						// 直接跳转，移除延时
							this.navigateToHome();
						return;
					} else {
						console.warn('Onchain connection returned invalid account:', accounts);
					}
				}
				
				throw new Error('Onchain wallet connection failed');
			} catch (error) {
				console.error('Onchain wallet connection detailed error:', error);
				throw error;
			}
		},

		// Enhanced version: Connect Coinbase wallet
		async connectWithCoinbase() {
			try {
				console.log('Start connecting Coinbase wallet...');
				
				let ethereum = null;
				let connectionMethod = '';

				if (window.ethereum?.isCoinbaseWallet) {
					ethereum = window.ethereum;
					connectionMethod = 'direct-coinbase';
					console.log('Use window.ethereum with isCoinbaseWallet flag');
				} else if (window.ethereum?.providers) {
					ethereum = window.ethereum.providers.find(p => 
						p.isCoinbaseWallet ||
						p.providerInfo?.name === 'Coinbase Wallet' ||
						p.selectedProvider?.isCoinbaseWallet
					);
					if (ethereum) {
						connectionMethod = 'multi-wallet-coinbase';
						console.log('Found Coinbase provider in multi-wallet environment');
					}
				} else if (window.coinbaseWalletExtension) {
					ethereum = window.coinbaseWalletExtension;
					connectionMethod = 'coinbase-extension';
					console.log('Use Coinbase extension connection');
				}

				if (!ethereum && window.ethereum) {
					ethereum = window.ethereum;
					connectionMethod = 'fallback-ethereum';
					console.log('Fallback to generic Ethereum connection');
				}

				if (ethereum) {
					console.log(`Use connection method: ${connectionMethod}`);
					
					const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
					
					if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
						this.walletAddress = accounts[0];
						this.isWalletConnected = true;
						await this.saveWalletConnection('Coinbase', accounts[0]);
						
						this.setupWalletListeners();
						
						uni.showToast({
							title: 'Coinbase wallet connected successfully',
							icon: 'success'
						});
						
						// 直接跳转，移除延时
							this.navigateToHome();
						return;
					} else {
						console.warn('Coinbase connection returned invalid account:', accounts);
					}
				}
				
				throw new Error('Coinbase wallet connection failed');
			} catch (error) {
				console.error('Coinbase wallet connection detailed error:', error);
				throw error;
			}
		},

		// Enhanced universal wallet connection using Web3Modal
		async connectWithWeb3Modal() {
			try {
				console.log('Start using Web3Modal to connect wallet...');
				
				if (!this.web3Modal) {
					await this.initializeWeb3Modal();
				}
				
				if (!this.web3Modal) {
					throw new Error('Web3Modal not available');
				}

				this.provider = await this.web3Modal.connect();
				
				if (this.provider.enable) {
					await this.provider.enable();
				}

				// #ifdef H5
				if (typeof window !== 'undefined' && window.Web3) {
					this.web3 = new window.Web3(this.provider);
					const accounts = await this.web3.eth.getAccounts();
					
					if (accounts && accounts.length > 0 && this.isValidEthAddress(accounts[0])) {
						this.selectedAccount = accounts[0];
						this.walletAddress = accounts[0];
						this.isWalletConnected = true;
						
						// 检测钱包类型
						let walletType = 'Unknown';
						if (this.provider.isMetaMask) walletType = 'MetaMask';
						else if (this.provider.isCoinbaseWallet) walletType = 'Coinbase';
						else if (this.provider.isBifrost) walletType = 'Bifrost';
						else if (this.provider.isOnchain) walletType = 'Onchain';
						else if (this.provider.isTokenPocket) walletType = 'TokenPocket';
						
						await this.saveWalletConnection(walletType, accounts[0]);
						this.setupWeb3ModalListeners();
						
						uni.showToast({
							title: `${walletType} wallet connected successfully`,
							icon: 'success'
						});
						
						// 直接跳转，移除延时
							this.navigateToHome();
						return;
					}
				}
				// #endif
				
				throw new Error('Web3Modal connection failed');
			} catch (error) {
				console.error('Web3Modal connection detailed error:', error);
				throw error;
			}
		},

		// Setup Web3Modal event listeners
		setupWeb3ModalListeners() {
			try {
				if (!this.provider) return;
				
				this.provider.on("accountsChanged", async (accounts) => {
					await this.handleAccountsChanged(accounts);
				});

				this.provider.on("chainChanged", async (chainId) => {
					await this.handleChainChanged(chainId);
				});

				this.provider.on("networkChanged", async (networkId) => {
					console.log('Network changed:', networkId);
				});

				this.provider.on("connect", (connectInfo) => {
					console.log('Provider connected:', connectInfo);
				});

				this.provider.on("disconnect", (error) => {
					console.log('Provider disconnected:', error);
					this.handleWalletDisconnected();
				});
				
				console.log('Web3Modal event listeners setup successfully');
			} catch (error) {
				console.error('Setup Web3Modal listeners failed:', error);
			}
		},

		// Enhanced version: Connect TokenPocket wallet
		async connectWithTokenPocket() {
			try {
				console.log('Start connecting TokenPocket Ethereum wallet...');
				
				// 只尝试连接以太坊钱包
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					// 修复：使用正确的钱包类型名称
					await this.saveWalletConnection('TokenPocket', ethAddress);
					
					// 设置钱包监听
					this.setupWalletListeners();
					
					// 连接成功提示
					uni.showToast({
						title: 'TokenPocket wallet connected successfully',
						icon: 'success'
					});
					
					// 直接跳转，不等待延时
						this.navigateToHome();
					return;
				}
		
				throw new Error('No available Ethereum wallet connection found');
			} catch (error) {
				console.error('TokenPocket connection detailed error:', error);
				throw error;
			}
		},

		// 修复MetaMask连接方法
		async connectWithMetaMask() {
			try {
				console.log('Start connecting MetaMask wallet...');
				
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('MetaMask', ethAddress);
					
					this.setupWalletListeners();
					
					uni.showToast({
						title: 'MetaMask wallet connected successfully',
						icon: 'success'
					});
					
					// 直接跳转
						this.navigateToHome();
					return;
				}
				
				throw new Error('MetaMask connection failed');
			} catch (error) {
				console.error('MetaMask connection detailed error:', error);
				throw error;
			}
		},

		// 修复ImToken连接方法
		async connectWithImToken() {
			try {
				console.log('Start connecting ImToken wallet...');
				
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('ImToken', ethAddress);
					
					this.setupWalletListeners();
					
					uni.showToast({
						title: 'ImToken wallet connected successfully',
						icon: 'success'
					});
					
					// 直接跳转
						this.navigateToHome();
					return;
				}
				
				throw new Error('ImToken connection failed');
			} catch (error) {
				console.error('ImToken connection detailed error:', error);
				throw error;
			}
		},

		// 修复其他钱包连接方法，移除setTimeout延时
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
						
						// 设置钱包监听
						this.setupWalletListeners();
						
						uni.showToast({
							title: 'Crypto wallet connected successfully',
							icon: 'success'
						});
						
						// 直接跳转，移除延时
							this.navigateToHome();
						return;
					}
				}
				
				// 回退到以太坊连接
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					await this.saveWalletConnection('Crypto', ethAddress);
					
					// 设置钱包监听
					this.setupWalletListeners();
					
					uni.showToast({
						title: 'Crypto wallet connected successfully',
						icon: 'success'
					});
					
					// 直接跳转，移除延时
						this.navigateToHome();
					return;
				}
				
				throw new Error('Crypto wallet connection failed');
			} catch (error) {
				console.error('Crypto wallet connection detailed error:', error);
				throw error;
			}
		},

		// 增强的以太坊钱包连接方法
		async connectEthereumWallet() {
			try {
				console.log('Start connecting Ethereum wallet...');
				
				let ethereum;
				let connectionMethod = '';
				
				// 优先检测移动端钱包app环境
				const userAgent = navigator.userAgent || '';
				const mobileWallet = this.detectMobileWalletApp(userAgent);
				
				if (mobileWallet.detected) {
					console.log('In mobile wallet app, using dedicated connection method');
					ethereum = this.getMobileWalletProvider(mobileWallet.walletType);
					connectionMethod = `mobile-${mobileWallet.walletType.toLowerCase()}`;
				}
				
				// 如果没有找到移动端提供者，尝试其他方式
				if (!ethereum) {
				// 尝试多种方式获取ethereum对象
					if (window.tokenpocket?.ethereum) {
					ethereum = window.tokenpocket.ethereum;
						connectionMethod = 'tokenpocket-ethereum';
					console.log('Use TokenPocket Ethereum provider connection');
				} else if (window.bifrost) {
					ethereum = window.bifrost;
						connectionMethod = 'bifrost-direct';
					console.log('Use Bifrost provider connection');
				} else if (window.onchain) {
					ethereum = window.onchain;
						connectionMethod = 'onchain-direct';
					console.log('Use Onchain provider connection');
					} else if (window.crypto?.ethereum) {
					ethereum = window.crypto.ethereum;
						connectionMethod = 'crypto-ethereum';
					console.log('Use Crypto Ethereum provider connection');
				} else if (window.ethereum) {
					ethereum = window.ethereum;
						connectionMethod = 'standard-ethereum';
					console.log('Use standard Ethereum provider connection');
					}
				}
				
				if (!ethereum) {
					console.log('No Ethereum provider found');
					return null;
				}
				
				console.log('Used Ethereum provider:', ethereum);
				console.log('Connection method:', connectionMethod);
				
				// 尝试连接账户，使用更宽松的超时设置
				let accounts;
				try {
					accounts = await Promise.race([
						ethereum.request({ method: 'eth_requestAccounts' }),
						new Promise((_, reject) => 
							setTimeout(() => reject(new Error('Connection timeout')), 15000)
						)
					]);
				} catch (requestError) {
					console.log('eth_requestAccounts failed, try eth_accounts:', requestError);
					// 如果请求连接失败，尝试获取已连接的账户
					try {
						accounts = await ethereum.request({ method: 'eth_accounts' });
					} catch (accountsError) {
						console.error('Get account failed:', accountsError);
						throw new Error('Cannot get wallet account');
					}
				}
				
				console.log('ETH accounts list after connection:', accounts);
				
				if (accounts && accounts.length > 0) {
					const address = accounts[0];
					console.log('First ETH account address:', address);
					
					// 严格验证是否为有效的以太坊地址
					if (this.isValidEthAddress(address)) {
						console.log('ETH address validation passed:', address);
						
						// 保存连接方法信息
						uni.setStorageSync('walletConnectionMethod', connectionMethod);
						
						return address;
					} else {
						console.warn('Connected address is not a valid ETH address:', address);
						return null;
					}
				}
				
				console.log('No ETH account found after connection');
				return null;
			} catch (error) {
				console.log('Ethereum wallet connection failed:', error);
				return null;
			}
		},

		// 新增：获取移动端钱包提供者
		getMobileWalletProvider(walletType) {
			console.log('Get mobile wallet provider:', walletType);
			
			switch (walletType) {
				case 'TokenPocket':
					return window.tokenpocket?.ethereum || 
						   window.ethereum || 
						   window.tp?.ethereum;
				
				case 'MetaMask':
					return window.ethereum?.isMetaMask ? window.ethereum : null;
				
				case 'ImToken':
					return window.ethereum?.isImToken ? window.ethereum : null;
				
				case 'Coinbase':
					return window.ethereum?.isCoinbaseWallet ? window.ethereum : null;
				
				case 'Bifrost':
					return window.bifrost || 
						   (window.ethereum?.isBifrost ? window.ethereum : null);
				
				case 'Onchain':
					return window.onchain || 
						   (window.ethereum?.isOnchain ? window.ethereum : null);
				
				case 'Crypto':
					return window.crypto?.ethereum || 
						   (window.ethereum?.isCryptocom ? window.ethereum : null);
				
				default:
					return window.ethereum;
			}
		},

		// 增强的钱包监听器设置
		setupWalletListeners() {
			try {
				console.log('Set wallet event listeners...');
				
				// 移除之前的监听器
				this.removeWalletListeners();
				
				const ethereum = this.getCurrentEthereumProvider();
				
				if (!ethereum) {
					console.log('No available Ethereum provider, skip listener setup');
					return;
				}
				
				// 账户变化监听
				this.accountsChangedHandler = async (accounts) => {
					console.log('Account change event:', accounts);
					await this.handleAccountsChanged(accounts);
				};
				
				// 链变化监听  
				this.chainChangedHandler = async (chainId) => {
					console.log('Chain change event:', chainId);
					await this.handleChainChanged(chainId);
				};
				
				// 连接事件监听
				this.connectHandler = (connectInfo) => {
					console.log('Wallet connection event:', connectInfo);
				};
				
				// 断开连接事件监听
				this.disconnectHandler = (error) => {
					console.log('Wallet disconnected event:', error);
					this.handleWalletDisconnected();
				};
				
				// 添加监听器
				if (ethereum.on) {
					ethereum.on('accountsChanged', this.accountsChangedHandler);
					ethereum.on('chainChanged', this.chainChangedHandler);
					ethereum.on('connect', this.connectHandler);
					ethereum.on('disconnect', this.disconnectHandler);
					
					console.log('Wallet event listeners setup successfully');
				} else {
					console.log('Wallet provider does not support event listeners');
				}
				
			} catch (error) {
				console.error('Set wallet listeners failed:', error);
			}
		},

		// 增强的账户变化处理
		async handleAccountsChanged(accounts) {
			try {
				console.log('Handle account change:', accounts);
				
				if (!accounts || accounts.length === 0) {
					console.log('Account disconnected, clean connection state');
					await this.disconnectWallet();
					
					// 重新跳转到连接页面
					uni.reLaunch({
						url: '/pages/wallet/connect'
					});
					return;
				}
				
				const newAddress = accounts[0];
				
				if (!this.isValidEthAddress(newAddress)) {
					console.log('New account address invalid, ignore change');
					return;
				}
				
				if (newAddress !== this.walletAddress) {
					console.log('Account address changed:', this.walletAddress, '->', newAddress);
					
					// 更新钱包地址
					this.walletAddress = newAddress;
					uni.setStorageSync('walletAddress', newAddress);
					
					// 重新调用连接API
					try {
						await this.callWalletConnectAPI(newAddress);
						console.log('Reconnect after account change successful');
					} catch (error) {
						console.error('Reconnect after account change failed:', error);
					}
				}
				
			} catch (error) {
				console.error('Handle account change failed:', error);
			}
		},

		// 处理链变化
		async handleChainChanged(chainId) {
			try {
				console.log('Handle chain change:', chainId);
				
				// 可以在这里添加链切换逻辑
				// 目前只记录变化，不做特殊处理
				
			} catch (error) {
				console.error('Handle chain change failed:', error);
			}
		},

		// 处理钱包断开连接
		handleWalletDisconnected() {
			try {
				console.log('Handle wallet disconnected');
				
				// 清理连接状态
				this.disconnectWallet();
				
				// 显示提示信息
				uni.showToast({
					title: 'Wallet disconnected',
					icon: 'none',
					duration: 2000
				});
				
				// 延迟跳转到连接页面
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/wallet/connect'
					});
				}, 2000);
				
			} catch (error) {
				console.error('Handle wallet disconnected failed:', error);
			}
		},

		// 移除钱包监听器
		removeWalletListeners() {
			try {
				const ethereum = this.getCurrentEthereumProvider();
				
				if (ethereum && ethereum.removeListener) {
					if (this.accountsChangedHandler) {
						ethereum.removeListener('accountsChanged', this.accountsChangedHandler);
						this.accountsChangedHandler = null;
					}
					
					if (this.chainChangedHandler) {
						ethereum.removeListener('chainChanged', this.chainChangedHandler);
						this.chainChangedHandler = null;
					}
					
					if (this.connectHandler) {
						ethereum.removeListener('connect', this.connectHandler);
						this.connectHandler = null;
					}
					
					if (this.disconnectHandler) {
						ethereum.removeListener('disconnect', this.disconnectHandler);
						this.disconnectHandler = null;
					}
					
					console.log('Wallet listeners removed successfully');
				}
			} catch (error) {
				console.error('Remove wallet listeners failed:', error);
			}
		},

		// 优化的页面生命周期处理
		async handlePageShow() {
			console.log('Handle page show event');
			
			// 检查是否需要重新连接
			const shouldReconnect = !this.walletAddress && 
									!this.isConnecting && 
									!this.showErrorPage;
			
			if (shouldReconnect) {
				console.log('Need to reconnect wallet');
				await this.delay(500); // 给页面一点时间渲染
				this.checkWalletConnection();
			}
		},

		// 优化的错误处理
		handleConnectionError(error, walletType = 'Unknown') {
			console.error(`${walletType} connection error:`, error);
			
			let errorMessage = 'Wallet connection failed';
			
			if (error.message.includes('User rejected')) {
				errorMessage = 'User rejected connection request';
			} else if (error.message.includes('timeout')) {
				errorMessage = 'Connection timeout, please try again';
			} else if (error.message.includes('Not authorized')) {
				errorMessage = 'Not authorized, please check wallet settings';
			}
			
			uni.showToast({
				title: errorMessage,
				icon: 'none',
				duration: 3000
			});
			
			// 设置错误状态
			this.isConnecting = false;
			this.showErrorPage = true;
		},

		// 添加缺失的方法和修复现有问题

		// 新增：检测移动端钱包app环境
		detectMobileWalletApp(userAgent) {
			const walletDetectors = [
				{
					name: 'TokenPocket',
					patterns: ['TokenPocket', 'TP/', 'tpwallet'],
					checkGlobal: () => window.tokenpocket || window.ethereum?.isTokenPocket
				},
				{
					name: 'MetaMask',
					patterns: ['MetaMask'],
					checkGlobal: () => window.ethereum?.isMetaMask && !window.ethereum?.isCoinbaseWallet
				},
				{
					name: 'ImToken',
					patterns: ['imToken', 'ImToken'],
					checkGlobal: () => window.ethereum?.isImToken
				},
				{
					name: 'Coinbase',
					patterns: ['CoinbaseWallet', 'Coinbase'],
					checkGlobal: () => window.ethereum?.isCoinbaseWallet
				},
				{
					name: 'Bifrost',
					patterns: ['Bifrost'],
					checkGlobal: () => window.bifrost || window.ethereum?.isBifrost
				},
				{
					name: 'Onchain',
					patterns: ['Onchain', 'OnChain'],
					checkGlobal: () => window.onchain || window.ethereum?.isOnchain
				},
				{
					name: 'Crypto',
					patterns: ['CryptoCom', 'DeFiWallet'],
					checkGlobal: () => window.crypto?.ethereum
				}
			];

			for (const detector of walletDetectors) {
				// 检查用户代理字符串
				const userAgentMatch = detector.patterns.some(pattern => 
					userAgent.includes(pattern)
				);
				
				// 检查全局对象
				const globalMatch = detector.checkGlobal && detector.checkGlobal();
				
				if (userAgentMatch || globalMatch) {
					console.log(`Detected ${detector.name} wallet app environment`, {
						userAgentMatch,
						globalMatch,
						userAgent: userAgent.substring(0, 100) + '...'
					});
					
					return {
						detected: true,
						walletType: detector.name,
						method: userAgentMatch ? 'userAgent' : 'global'
					};
				}
			}

			return { detected: false, walletType: null };
		},

		// 修复：检测钱包环境方法
		detectWalletEnvironment() {
			try {
				console.log('Start detecting wallet environment...');
				
				if (typeof window === 'undefined') {
					console.log('Non-browser environment');
					return null;
				}

				// 添加移动端钱包app环境检测
				const userAgent = navigator.userAgent || '';
				const isInWalletApp = this.detectMobileWalletApp(userAgent);
				
				console.log('User agent:', userAgent);
				console.log('Is in wallet app:', isInWalletApp);

				// 添加更详细的调试信息
				console.log('Available global objects:', {
					ethereum: !!window.ethereum,
					bifrost: !!window.bifrost,
					onchain: !!window.onchain,
					coinbaseWallet: !!(window.ethereum?.isCoinbaseWallet),
					tokenpocket: !!window.tokenpocket,
					crypto: !!(window.crypto?.ethereum),
					web3Modal: !!this.web3Modal,
					isInWalletApp: isInWalletApp
				});

				// 如果在钱包app中，优先使用检测到的钱包类型
				if (isInWalletApp.detected) {
					console.log('Detected wallet app environment:', isInWalletApp.walletType);
					return isInWalletApp.walletType;
				}

				// 检测TokenPocket环境
				if (this.detectTokenPocketEnvironment()) {
					console.log('Detected TokenPocket environment');
					return 'TokenPocket';
				}

				// 增强的Coinbase钱包检测
				if (this.detectCoinbaseEnvironment()) {
					console.log('Detected Coinbase wallet environment');
					return 'Coinbase';
				}

				// 增强的Bifrost检测
				if (this.detectBifrostEnvironment()) {
					console.log('Detected Bifrost environment');
					return 'Bifrost';
				}

				// 增强的Onchain检测
				if (this.detectOnchainEnvironment()) {
					console.log('Detected Onchain environment');
					return 'Onchain';
				}

				// 检测Crypto.com钱包
				if (this.detectCryptoEnvironment()) {
					console.log('Detected Crypto.com environment');
					return 'Crypto';
				}

				// 检测其他钱包
				if (window.ethereum) {
					if (window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet) {
						console.log('Detected MetaMask environment');
						return 'MetaMask';
					} else if (window.ethereum.isImToken) {
						console.log('Detected ImToken environment');
						return 'ImToken';
					} else {
						console.log('Detected generic Ethereum environment');
						return 'Ethereum';
					}
				}

				console.log('No wallet environment detected');
				return null;
			} catch (error) {
				console.error('Detect wallet environment failed:', error);
				return null;
			}
		},

		// 增强的TokenPocket环境检测
		detectTokenPocketEnvironment() {
			try {
				if (typeof window === 'undefined') return false;
				
				// 检查TokenPocket特有的全局对象
				const checks = [
					!!window.tokenpocket,
					!!window.tronWeb,
					window.ethereum?.isTokenPocket,
					window.ethereum?.isTP,
					navigator.userAgent?.includes('TokenPocket'),
					navigator.userAgent?.includes('TP/'),
					navigator.userAgent?.includes('tpwallet'),
					window.ethereum?.selectedProvider?.isTokenPocket,
					window.ethereum?.providers?.some(p => p.isTokenPocket || p.isTP),
					// 检测TokenPocket的特有方法
					!!(window.tokenpocket?.ethereum),
					!!(window.tokenpocket?.solana),
					!!(window.tokenpocket?.tron),
					// 检测移动端TokenPocket环境
					window.location?.href?.includes('tp_token='),
					// 检测TokenPocket WebView环境
					!!(window.TokenPocket),
					!!(window.tp)
				];
				
				const detected = checks.some(check => check);
				console.log('TokenPocket detection result:', {
					tokenpocketObject: !!window.tokenpocket,
					tronWeb: !!window.tronWeb,
					isTokenPocket: window.ethereum?.isTokenPocket,
					isTP: window.ethereum?.isTP,
					userAgent: navigator.userAgent?.includes('TokenPocket'),
					userAgentTP: navigator.userAgent?.includes('TP/'),
					hasEthereum: !!(window.tokenpocket?.ethereum),
					globalTP: !!(window.tp),
					detected
				});
				
				return detected;
			} catch (error) {
				console.error('Detect TokenPocket environment failed:', error);
				return false;
			}
		},

		// 新增其他钱包检测方法
		detectCoinbaseEnvironment() {
			try {
				if (typeof window === 'undefined') return false;

				const checks = [
					window.ethereum?.isCoinbaseWallet,
					window.ethereum?.providers?.some(p => p.isCoinbaseWallet),
					window.ethereum?.selectedProvider?.isCoinbaseWallet,
					navigator.userAgent?.includes('CoinbaseWallet'),
					window.coinbaseWalletExtension,
					window.ethereum?.providers?.some(p => p.providerInfo?.name === 'Coinbase Wallet')
				];

				return checks.some(check => check);
			} catch (error) {
				console.error('Detect Coinbase environment failed:', error);
				return false;
			}
		},

		detectBifrostEnvironment() {
			try {
				if (typeof window === 'undefined') return false;

				const checks = [
					!!window.bifrost,
					window.ethereum?.isBifrost,
					window.ethereum?.providers?.some(p => p.isBifrost),
					window.ethereum?.isBifrostWallet,
					navigator.userAgent?.includes('Bifrost')
				];

				return checks.some(check => check);
			} catch (error) {
				console.error('Detect Bifrost environment failed:', error);
				return false;
			}
		},

		detectOnchainEnvironment() {
			try {
				if (typeof window === 'undefined') return false;

				const checks = [
					!!window.onchain,
					window.ethereum?.isOnchain,
					window.ethereum?.isONCHAIN,
					window.ethereum?.providers?.some(p => p.isOnchain || p.isONCHAIN),
					navigator.userAgent?.includes('Onchain')
				];

				return checks.some(check => check);
			} catch (error) {
				console.error('Detect Onchain environment failed:', error);
				return false;
			}
		},

		detectCryptoEnvironment() {
			try {
				if (typeof window === 'undefined') return false;

				const checks = [
					!!(window.crypto?.ethereum),
					window.ethereum?.isCryptocom,
					window.ethereum?.isDeFiWallet,
					navigator.userAgent?.includes('CryptoCom')
				];

				return checks.some(check => check);
			} catch (error) {
				console.error('Detect Crypto environment failed:', error);
				return false;
			}
		},

		// 新增：startConnectionFlow方法
		async startConnectionFlow() {
			try {
				console.log('=== Start wallet connection flow ===');
				
				this.isConnecting = true;
				this.showErrorPage = false;
				
				console.log('连接状态更新 - isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
				
				await this.delay(100);
				
				const walletType = this.detectWalletEnvironment();
				console.log('Detected wallet environment:', walletType);
				
				if (walletType) {
					await this.autoConnectWallet(walletType);
				} else {
					console.log('No supported wallet environment detected, try Web3Modal...');
					
					// 尝试Web3Modal作为备选
					try {
						await this.connectWithWeb3Modal();
					} catch (modalError) {
						console.log('Web3Modal connection failed, show error page');
						await this.delay(2000);
						this.isConnecting = false;
						this.showErrorPage = true;
						console.log('Show error page - isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
					}
				}
			} catch (error) {
				console.error('Connection flow failed:', error);
				this.isConnecting = false;
				this.showErrorPage = true;
				console.log('Connection failed, show error page - isConnecting:', this.isConnecting, 'showErrorPage:', this.showErrorPage);
			}
		},

		// 新增：autoConnectWallet方法
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
					case 'Coinbase':
						await this.connectWithCoinbase();
						break;
					case 'Onchain':
						await this.connectWithOnchain();
						break;
					case 'Crypto':
						await this.connectWithCrypto();
						break;
					case 'Ethereum':
						const ethAddress = await this.connectEthereumWallet();
						if (ethAddress && this.isValidEthAddress(ethAddress)) {
							this.walletAddress = ethAddress;
							this.isWalletConnected = true;
							this.isConnecting = false; // 重要：设置连接状态为false
							await this.saveWalletConnection('Ethereum', ethAddress);
							
							this.setupWalletListeners();
							
							uni.showToast({
								title: 'Wallet connected successfully',
								icon: 'success'
							});
							
							// 直接跳转
							this.navigateToHome();
						} else {
							throw new Error('Ethereum wallet connection failed');
						}
						break;
					default:
						throw new Error(`Unsupported wallet type: ${walletType}`);
				}
				
			} catch (error) {
				console.error(`Auto-connecting ${walletType} wallet failed:`, error);
				
				// 重要：确保连接状态正确设置
				this.isConnecting = false;
				
				// 检查是否是用户拒绝的错误
				if (error.message.includes('User rejected') || error.message.includes('用户拒绝')) {
					uni.showToast({
						title: 'User canceled connection',
						icon: 'none',
						duration: 3000
					});
					
					// 延迟显示错误页面，给用户机会重新尝试
					setTimeout(() => {
						if (!this.isWalletConnected) {
							this.showErrorPage = true;
						}
					}, 3000);
				} else {
					uni.showToast({
						title: `${walletType} connection failed: ${error.message}`,
						icon: 'none',
						duration: 5000
					});
					
					// 延迟显示错误页面
					setTimeout(() => {
						if (!this.isWalletConnected) {
							this.showErrorPage = true;
						}
					}, 5000);
				}
			}
		},

		// 新增缺失的provider获取方法
		getCoinbaseProvider() {
			if (window.ethereum?.isCoinbaseWallet) {
				return window.ethereum;
			}
			if (window.ethereum?.providers) {
				return window.ethereum.providers.find(p => p.isCoinbaseWallet);
			}
			if (window.coinbaseWalletExtension) {
				return window.coinbaseWalletExtension;
			}
			return null;
		},

		getBifrostProvider() {
			if (window.bifrost) {
				return window.bifrost;
			}
			if (window.ethereum?.isBifrost) {
				return window.ethereum;
			}
			if (window.ethereum?.providers) {
				return window.ethereum.providers.find(p => p.isBifrost || p.isBifrostWallet);
			}
			return null;
		},

		getOnchainProvider() {
			if (window.onchain) {
				return window.onchain;
			}
			if (window.ethereum?.isOnchain || window.ethereum?.isONCHAIN) {
				return window.ethereum;
			}
			if (window.ethereum?.providers) {
				return window.ethereum.providers.find(p => p.isOnchain || p.isONCHAIN || p.isOnChain);
			}
			if (window.onchainProvider) {
				return window.onchainProvider;
			}
			return null;
		},

		// 修复所有连接方法，确保状态正确设置
		async connectWithTokenPocket() {
			try {
				console.log('Start connecting TokenPocket wallet...');
				
				const ethAddress = await this.connectEthereumWallet();
				if (ethAddress && this.isValidEthAddress(ethAddress)) {
					this.walletAddress = ethAddress;
					this.isWalletConnected = true;
					this.isConnecting = false; // 重要：设置连接状态为false
					await this.saveWalletConnection('TokenPocket', ethAddress);
					
					this.setupWalletListeners();
					
					uni.showToast({
						title: 'TokenPocket wallet connected successfully',
						icon: 'success'
					});
					
					// 直接跳转
					this.navigateToHome();
					return;
				}
	
				throw new Error('No available Ethereum wallet connection found');
			} catch (error) {
				console.error('TokenPocket connection detailed error:', error);
				this.isConnecting = false; // 确保连接状态被重置
				throw error;
			}
		},

		// 新增：getMobileWalletProvider方法
		getMobileWalletProvider(walletType) {
			console.log('Get mobile wallet provider:', walletType);
			
			switch (walletType) {
				case 'TokenPocket':
					return window.tokenpocket?.ethereum || 
						   window.ethereum || 
						   window.tp?.ethereum;
			
				case 'MetaMask':
					return window.ethereum?.isMetaMask ? window.ethereum : null;
			
				case 'ImToken':
					return window.ethereum?.isImToken ? window.ethereum : null;
			
				case 'Coinbase':
					return window.ethereum?.isCoinbaseWallet ? window.ethereum : null;
			
				case 'Bifrost':
					return window.bifrost || 
						   (window.ethereum?.isBifrost ? window.ethereum : null);
			
				case 'Onchain':
					return window.onchain || 
						   (window.ethereum?.isOnchain ? window.ethereum : null);
			
				case 'Crypto':
					return window.crypto?.ethereum || 
						   (window.ethereum?.isCryptocom ? window.ethereum : null);
			
				default:
					return window.ethereum;
			}
		},

		// 新增：isValidEthAddress方法
		isValidEthAddress(address) {
			if (!address || typeof address !== 'string') {
				console.log('Address is empty or not a string:', address);
				return false;
			}
			
			const isValid = address.length === 42 && 
							address.startsWith('0x') && 
							/^0x[a-fA-F0-9]{40}$/.test(address);
			
			const isTronAddress = address.startsWith('T') && address.length === 34;
			
			console.log('地址验证结果:', {
				address: address,
				length: address.length,
				startsWithOx: address.startsWith('0x'),
				matchesPattern: /^0x[a-fA-F0-9]{40}$/.test(address),
				isTronAddress: isTronAddress,
				isValid: isValid && !isTronAddress
			});
			
			return isValid && !isTronAddress;
		},

		// 添加缺失的工具方法

		// 延迟方法
		delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},

		// 从URL获取tid参数
		getTidFromUrl(options) {
			if (options && options.tid) {
				console.log('Get tid from options:', options.tid);
				return options.tid;
			}
			
			// #ifdef H5
			try {
				const urlParams = new URLSearchParams(window.location.search);
				const tidFromUrl = urlParams.get('tid');
				if (tidFromUrl) {
					console.log('Get tid from URL search parameter:', tidFromUrl);
					return tidFromUrl;
				}
				
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

		// 显示邀请码错误

		// 跳转到首页
		navigateToHome() {
			console.log('准备跳转到首页...');
			console.log('当前钱包状态:', {
				walletAddress: this.walletAddress,
				isWalletConnected: this.isWalletConnected,
				urlTid: this.urlTid
			});
			
			try {
				// 确保钱包地址有效
				if (!this.walletAddress || !this.isValidEthAddress(this.walletAddress)) {
					console.error('钱包地址无效，无法跳转');
					uni.showToast({
						title: '钱包地址无效',
						icon: 'none'
					});
					return;
				}
				
				// 立即跳转，不等待其他操作
				console.log('开始跳转到首页...');
				uni.switchTab({
					url: '/pages/index/index',
					success: () => {
						console.log('成功跳转到首页');
					},
					fail: (error) => {
						console.error('跳转到首页失败:', error);
						// 尝试备用跳转方式
						uni.navigateTo({
							url: '/pages/index/index',
							success: () => {
								console.log('备用方式跳转成功');
							},
							fail: (fallbackError) => {
								console.error('备用方式跳转也失败:', fallbackError);
							}
						});
					}
				});
			} catch (error) {
				console.error('跳转过程发生错误:', error);
			}
		},

		// 保存钱包连接信息
		async saveWalletConnection(walletType, address) {
			console.log('saveWalletConnection开始，当前urlTid:', this.urlTid);
			
			try {
				uni.setStorageSync('walletType', walletType);
				uni.setStorageSync('walletAddress', address);
				uni.setStorageSync('walletConnected', true);
				uni.setStorageSync('connectTime', Date.now());
				
				console.log('钱包连接信息已保存到本地存储:', {
					walletType,
					address,
					urlTid: this.urlTid
				});
				
				// 优化：简化API调用，允许失败但不影响连接状态
				try {
					console.log('开始调用API同步钱包连接信息...');
					await this.callWalletConnectAPI(address);
					console.log('钱包连接信息已保存并同步到服务器');
				} catch (apiError) {
					console.warn('API同步失败，但不影响钱包连接:', apiError.message);
					// 不抛出错误，允许连接继续进行
				}
				
			} catch (error) {
				console.error('保存钱包连接信息失败:', error);
				// 即使保存失败也不抛出错误，因为钱包已经连接成功
				console.warn('保存失败但钱包已连接，继续进行...');
			}
		},

		// 调用钱包连接API
		async callWalletConnectAPI(address) {
			try {
				const tid = this.generateTid();
				
				console.log('准备调用API');
				console.log('  - address (文本):', address);
				console.log('  - tid (文本):', tid);
				
				// 简化API调用，使用更短的超时时间
				const responseData = await Promise.race([
					api.user.walletConnect(address, tid),
					new Promise((_, reject) => 
						setTimeout(() => reject(new Error('API调用超时')), 8000)
					)
				]);
				
				console.log('API响应:', responseData);
				
				if (responseData && responseData.code === 0) {
					console.log('钱包连接同步成功');
					
					if (responseData.token) {
						store.setToken(responseData.token);
						console.log('Token已保存到全局状态和本地存储');
					} else {
						console.warn('响应中未找到token');
					}
					
					const returnedTid = responseData.id || responseData.tid || tid;
					uni.setStorageSync('userTid', returnedTid);
					console.log('已保存tid到本地存储:', returnedTid);
					
				} else {
					console.error('API返回异常格式:', responseData);
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
				// 不重新抛出错误，让连接流程继续
				console.warn('API调用失败，但允许连接继续进行');
				return null;
			}
		},

		// 生成tid
		generateTid() {
			const tid = this.urlTid || uni.getStorageSync('urlTid') || '';
			console.log('generateTid调用，返回值(文本):', tid);
			return tid;
		},

		// 设置钱包监听器
		setupWalletListeners() {
			try {
				console.log('设置钱包事件监听器...');
				
				// 移除之前的监听器
				this.removeWalletListeners();
				
				const ethereum = this.getCurrentEthereumProvider();
				
				if (!ethereum) {
					console.log('没有可用的以太坊提供者，跳过监听器设置');
					return;
				}
				
				// 账户变化监听
				this.accountsChangedHandler = async (accounts) => {
					console.log('账户变化事件:', accounts);
					await this.handleAccountsChanged(accounts);
				};
				
				// 链变化监听  
				this.chainChangedHandler = async (chainId) => {
					console.log('链变化事件:', chainId);
					await this.handleChainChanged(chainId);
				};
				
				// 连接事件监听
				this.connectHandler = (connectInfo) => {
					console.log('钱包连接事件:', connectInfo);
				};
				
				// 断开连接事件监听
				this.disconnectHandler = (error) => {
					console.log('钱包断开连接事件:', error);
					this.handleWalletDisconnected();
				};
				
				// 添加监听器
				if (ethereum.on) {
					ethereum.on('accountsChanged', this.accountsChangedHandler);
					ethereum.on('chainChanged', this.chainChangedHandler);
					ethereum.on('connect', this.connectHandler);
					ethereum.on('disconnect', this.disconnectHandler);
					
					console.log('钱包事件监听器设置成功');
				} else {
					console.log('钱包提供者不支持事件监听');
				}
				
			} catch (error) {
				console.error('设置钱包监听器失败:', error);
			}
		},

		// 获取当前以太坊提供者
		getCurrentEthereumProvider() {
			const connectionMethod = uni.getStorageSync('walletConnectionMethod');
			const walletType = uni.getStorageSync('walletType');
			
			// 根据钱包类型获取对应的提供者
			switch (walletType) {
				case 'TokenPocket':
				case 'TokenPocket-ETH':
					return window.tokenpocket?.ethereum || window.ethereum;
				
				case 'Bifrost':
					return window.bifrost || window.ethereum;
				
				case 'Onchain':
					return window.onchain || window.ethereum;
				
				case 'Crypto':
					return window.crypto?.ethereum || window.ethereum;
				
				case 'MetaMask':
					return window.ethereum?.isMetaMask ? window.ethereum : null;
				
				case 'ImToken':
					return window.ethereum?.isImToken ? window.ethereum : null;
				
				case 'Coinbase':
					return window.ethereum?.isCoinbaseWallet ? window.ethereum : null;
				
				default:
					return window.ethereum;
			}
		},

		// 处理账户变化
		async handleAccountsChanged(accounts) {
			try {
				console.log('处理账户变化:', accounts);
				
				if (!accounts || accounts.length === 0) {
					console.log('账户已断开，清理连接状态');
					await this.disconnectWallet();
					
					// 重新跳转到连接页面
					uni.reLaunch({
						url: '/pages/wallet/connect'
					});
					return;
				}
				
				const newAddress = accounts[0];
				
				if (!this.isValidEthAddress(newAddress)) {
					console.log('新账户地址无效，忽略变化');
					return;
				}
				
				if (newAddress !== this.walletAddress) {
					console.log('账户地址变化:', this.walletAddress, '->', newAddress);
					
					// 更新钱包地址
					this.walletAddress = newAddress;
					uni.setStorageSync('walletAddress', newAddress);
					
					// 重新调用连接API
					try {
						await this.callWalletConnectAPI(newAddress);
						console.log('账户变化后重新连接成功');
					} catch (error) {
						console.error('账户变化后重新连接失败:', error);
					}
				}
				
			} catch (error) {
				console.error('处理账户变化失败:', error);
			}
		},

		// 处理链变化
		async handleChainChanged(chainId) {
			try {
				console.log('处理链变化:', chainId);
				// 可以在这里添加链切换逻辑
			} catch (error) {
				console.error('处理链变化失败:', error);
			}
		},

		// 处理钱包断开连接
		handleWalletDisconnected() {
			try {
				console.log('处理钱包断开连接');
				
				// 清理连接状态
				this.disconnectWallet();
				
				// 显示提示信息
				uni.showToast({
					title: '钱包连接已断开',
					icon: 'none',
					duration: 2000
				});
				
				// 延迟跳转到连接页面
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/wallet/connect'
					});
				}, 2000);
				
			} catch (error) {
				console.error('处理钱包断开连接失败:', error);
			}
		},

		// 断开钱包连接
		async disconnectWallet() {
			try {
				console.log('主动断开钱包连接...');
				
				// 清理本地存储
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
				
				// 移除监听器
				this.removeWalletListeners();
				
				// 如果有Web3Modal，清理连接
				if (this.web3Modal) {
					try {
						await this.web3Modal.clearCachedProvider();
					} catch (clearError) {
						console.warn('清理Web3Modal缓存失败:', clearError);
					}
				}
				
				// 如果有provider，尝试断开连接
				if (this.provider && this.provider.close) {
					try {
						await this.provider.close();
					} catch (closeError) {
						console.warn('关闭provider失败:', closeError);
					}
				}
				
				console.log('钱包连接已清理');
				
			} catch (error) {
				console.error('断开钱包连接失败:', error);
			}
		},

		// 移除钱包监听器
		removeWalletListeners() {
			try {
				const ethereum = this.getCurrentEthereumProvider();
				
				if (ethereum && ethereum.removeListener) {
					if (this.accountsChangedHandler) {
						ethereum.removeListener('accountsChanged', this.accountsChangedHandler);
						this.accountsChangedHandler = null;
					}
					
					if (this.chainChangedHandler) {
						ethereum.removeListener('chainChanged', this.chainChangedHandler);
						this.chainChangedHandler = null;
					}
					
					if (this.connectHandler) {
						ethereum.removeListener('connect', this.connectHandler);
						this.connectHandler = null;
					}
					
					if (this.disconnectHandler) {
						ethereum.removeListener('disconnect', this.disconnectHandler);
						this.disconnectHandler = null;
					}
					
					console.log('钱包监听器移除成功');
				}
			} catch (error) {
				console.error('移除钱包监听器失败:', error);
			}
		}
	}
}
</script>

<style>
/* Keep the existing styles */
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