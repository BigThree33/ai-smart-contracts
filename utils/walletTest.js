/**
 * 钱包连接测试工具
 * 用于调试和验证钱包连接功能
 */

class WalletConnectionTest {
	constructor() {
		this.testResults = [];
	}

	// 运行所有测试
	async runAllTests() {
		console.log('=== 开始钱包连接测试 ===');
		
		this.testResults = [];
		
		await this.testEnvironmentDetection();
		await this.testWalletAvailability();
		await this.testConnectionFlow();
		
		this.printTestResults();
		
		return this.testResults;
	}

	// 测试环境检测
	async testEnvironmentDetection() {
		const test = {
			name: '环境检测测试',
			passed: false,
			details: {}
		};

		try {
			// 检测浏览器环境
			test.details.isBrowser = typeof window !== 'undefined';
			
			// 检测全局对象
			test.details.ethereum = !!window.ethereum;
			test.details.tokenpocket = !!window.tokenpocket;
			test.details.web3 = !!window.Web3;
			test.details.web3Modal = !!window.Web3Modal;
			
			// 检测UserAgent
			test.details.userAgent = navigator.userAgent;
			test.details.isTokenPocketUA = navigator.userAgent.includes('TokenPocket');
			
			test.passed = test.details.isBrowser && test.details.ethereum;
			test.details.message = test.passed ? '环境检测通过' : '缺少必要的钱包环境';
			
		} catch (error) {
			test.details.error = error.message;
			test.details.message = '环境检测失败';
		}

		this.testResults.push(test);
	}

	// 测试钱包可用性
	async testWalletAvailability() {
		const test = {
			name: '钱包可用性测试',
			passed: false,
			details: {}
		};

		try {
			const wallets = [];
			
			// 检测TokenPocket
			if (window.tokenpocket) {
				wallets.push({
					name: 'TokenPocket',
					ethereum: !!window.tokenpocket.ethereum,
					available: true
				});
			}
			
			// 检测MetaMask
			if (window.ethereum?.isMetaMask) {
				wallets.push({
					name: 'MetaMask',
					available: true
				});
			}
			
			// 检测Coinbase
			if (window.ethereum?.isCoinbaseWallet) {
				wallets.push({
					name: 'Coinbase',
					available: true
				});
			}
			
			test.details.availableWallets = wallets;
			test.details.count = wallets.length;
			test.passed = wallets.length > 0;
			test.details.message = test.passed ? 
				`发现 ${wallets.length} 个可用钱包` : 
				'未发现任何钱包';
			
		} catch (error) {
			test.details.error = error.message;
			test.details.message = '钱包检测失败';
		}

		this.testResults.push(test);
	}

	// 测试连接流程
	async testConnectionFlow() {
		const test = {
			name: '连接流程测试',
			passed: false,
			details: {}
		};

		try {
			if (!window.ethereum) {
				test.details.message = '无以太坊提供者，跳过连接测试';
				this.testResults.push(test);
				return;
			}

			// 尝试获取账户（不请求连接）
			const accounts = await window.ethereum.request({ 
				method: 'eth_accounts' 
			});
			
			test.details.existingAccounts = accounts;
			test.details.hasConnection = accounts.length > 0;
			
			if (accounts.length > 0) {
				test.details.firstAccount = accounts[0];
				test.details.isValidEth = this.isValidEthAddress(accounts[0]);
				test.passed = test.details.isValidEth;
				test.details.message = test.passed ? 
					'已连接有效的以太坊账户' : 
					'连接的账户不是有效的以太坊地址';
			} else {
				test.details.message = '未检测到已连接的账户';
			}
			
		} catch (error) {
			test.details.error = error.message;
			test.details.message = '连接测试失败';
		}

		this.testResults.push(test);
	}

	// 验证以太坊地址
	isValidEthAddress(address) {
		return address && 
			   typeof address === 'string' && 
			   address.length === 42 && 
			   address.startsWith('0x') && 
			   /^0x[a-fA-F0-9]{40}$/.test(address);
	}

	// 打印测试结果
	printTestResults() {
		console.log('\n=== 钱包连接测试结果 ===');
		
		this.testResults.forEach((test, index) => {
			console.log(`\n${index + 1}. ${test.name}`);
			console.log(`   状态: ${test.passed ? '✅ 通过' : '❌ 失败'}`);
			console.log(`   详情:`, test.details);
		});
		
		const passedCount = this.testResults.filter(t => t.passed).length;
		console.log(`\n总结: ${passedCount}/${this.testResults.length} 项测试通过`);
		
		if (passedCount === this.testResults.length) {
			console.log('🎉 所有测试通过！钱包连接环境正常');
		} else {
			console.log('⚠️  部分测试失败，请检查钱包环境');
		}
	}

	// 获取环境信息摘要
	getEnvironmentSummary() {
		return {
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			hasEthereum: !!window.ethereum,
			hasTokenPocket: !!window.tokenpocket,
			hasWeb3: !!window.Web3,
			walletProviders: this.detectWalletProviders()
		};
	}

	// 检测钱包提供者
	detectWalletProviders() {
		const providers = [];
		
		if (window.ethereum) {
			if (window.ethereum.isMetaMask) providers.push('MetaMask');
			if (window.ethereum.isCoinbaseWallet) providers.push('Coinbase');
			if (window.ethereum.isTokenPocket) providers.push('TokenPocket');
			if (window.ethereum.isBifrost) providers.push('Bifrost');
			if (window.ethereum.isOnchain) providers.push('Onchain');
		}
		
		if (window.tokenpocket) providers.push('TokenPocket-Native');
		if (window.bifrost) providers.push('Bifrost-Native');
		if (window.onchain) providers.push('Onchain-Native');
		
		return providers;
	}
}

// 导出测试工具
const walletTest = new WalletConnectionTest();

// 添加到全局对象以便在控制台中使用
if (typeof window !== 'undefined') {
	window.walletTest = walletTest;
}

export default walletTest; 