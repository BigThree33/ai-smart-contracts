import store from '@/store/index.js';

// 在文件顶部添加
let lastCheckedWalletAddress = '';
let walletConnectLock = false; // 新增：wallet_connect调用锁
let walletConnectQueue = []; // 新增：调用队列

// API 基础配置
const API_CONFIG = {
    baseURL: 'https://u.souhlawfirm.com/api',
    timeout: 10000,
    header: {}
};

// 新增：处理wallet_connect调用的队列管理器
const walletConnectManager = {
    // 加入队列并执行
    async enqueue(address, tid, requestId = Date.now()) {
        return new Promise((resolve, reject) => {
            const request = {
                address,
                tid,
                requestId,
                resolve,
                reject,
                timestamp: Date.now()
            };
            
            walletConnectQueue.push(request);
            console.log(`wallet_connect请求加入队列: ${requestId}, 队列长度: ${walletConnectQueue.length}`);
            
            this.processQueue();
        });
    },
    
    // 处理队列
    async processQueue() {
        if (walletConnectLock || walletConnectQueue.length === 0) {
            return;
        }
        
        walletConnectLock = true;
        const request = walletConnectQueue.shift();
        
        try {
            console.log(`开始处理wallet_connect请求: ${request.requestId}`);
            
            // 执行实际的API调用
            const response = await this.executeWalletConnect(request.address, request.tid);
            
            // 如果返回了token，立即更新store并获取用户信息
            if (response && response.code === 0 && response.token) {
                const updateSuccess = store.setToken(response.token);
                console.log(`Token更新${updateSuccess ? '成功' : '失败'}: ${request.requestId}`);
                
                if (updateSuccess) {
                    // 立即调用getinfo获取用户信息
                    console.log(`wallet_connect成功，立即调用getinfo: ${request.requestId}`);
                    this.fetchUserInfoImmediately(request.requestId);
                }
            }
            
            request.resolve(response);
            
        } catch (error) {
            console.error(`wallet_connect请求失败: ${request.requestId}`, error);
            request.reject(error);
        } finally {
            walletConnectLock = false;
            
            // 处理下一个请求
            if (walletConnectQueue.length > 0) {
                setTimeout(() => this.processQueue(), 100);
            }
        }
    },
    
    // 新增：立即获取用户信息
    async fetchUserInfoImmediately(requestId) {
        try {
            console.log(`立即获取用户信息: ${requestId}`);
            
            // 直接调用getinfo接口，绕过频率限制
            const userInfo = await this.executeGetInfo();
            
            if (userInfo) {
                console.log(`用户信息获取成功: ${requestId}`, userInfo);
                
                // 触发全局事件，通知页面更新用户信息
                uni.$emit('userInfoUpdated', {
                    data: userInfo,
                    source: 'wallet_connect_immediate',
                    requestId: requestId,
                    timestamp: Date.now()
                });
            }
            
        } catch (error) {
            console.error(`立即获取用户信息失败: ${requestId}`, error);
            // 不抛出错误，避免影响wallet_connect的成功状态
        }
    },
    
    // 新增：直接执行getinfo调用
    async executeGetInfo() {
        const token = store.getToken();
        if (!token) {
            throw new Error('No token available');
        }
        
        const config = {
            url: `${API_CONFIG.baseURL}/getinfo`,
            method: 'POST',
            timeout: API_CONFIG.timeout,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `token=${encodeURIComponent(token)}`
        };

        const response = await uni.request(config);
        
        if (response.statusCode !== 200) {
            throw new Error(`HTTP request failed, status code: ${response.statusCode}`);
        }

        return response.data;
    },
    
    // 实际执行API调用
    async executeWalletConnect(address, tid) {
        const config = {
            url: `${API_CONFIG.baseURL}/wallet_connect`,
            method: 'POST',
            timeout: API_CONFIG.timeout,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `address=${encodeURIComponent(address)}&tid=${encodeURIComponent(tid || '')}`
        };

        const response = await uni.request(config);
        
        if (response.statusCode !== 200) {
            throw new Error(`HTTP request failed, status code: ${response.statusCode}`);
        }

        return response.data;
    }
};

// 新增：API调用频率限制器
const apiCallLimiter = {
    callHistory: new Map(),
    
    // 检查是否可以调用API
    canCall(apiKey, minInterval = 1000) {
        const now = Date.now();
        const lastCallTime = this.callHistory.get(apiKey) || 0;
        
        if (now - lastCallTime < minInterval) {
            console.log(`API调用被限制: ${apiKey}, 距离上次调用仅${now - lastCallTime}ms`);
            return false;
        }
        
        this.callHistory.set(apiKey, now);
        return true;
    },
    
    // 清理过期记录
    cleanup() {
        const now = Date.now();
        for (const [key, time] of this.callHistory) {
            if (now - time > 60000) { // 清理1分钟前的记录
                this.callHistory.delete(key);
            }
        }
    }
};

// 定期清理限制器
setInterval(() => {
    apiCallLimiter.cleanup();
}, 60000); // 每分钟清理一次

// 通用请求方法
const request = async (url, options = {}) => {
    const config = {
        url: `${API_CONFIG.baseURL}${url}`,
        method: options.method || 'GET',
        timeout: options.timeout || API_CONFIG.timeout,
        ...options
    };

    // 处理POST请求的form-data格式
    if (config.method === 'POST') {
        // 准备数据
        let postData = { ...(config.data || {}) };
        
        // 如果需要token，添加token
        if (options.needToken !== false) {
            const token = store.getToken();
            if (token) {
                postData.token = token;
                console.log('使用token:', token.substring(0, 10) + '...');
            } else {
                console.warn('需要token但store中没有token');
            }
        }
        
        // 设置为form-data格式
        config.header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...config.header
        };
        
        // 将数据转换为form格式
        const formData = Object.keys(postData)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(postData[key] || '')}`)
            .join('&');
        
        config.data = formData;
    } else if (config.method === 'GET') {
        // GET请求处理token
        if (options.needToken !== false) {
            const token = store.getToken();
            if (token) {
                config.data = { token };
                console.log('GET请求使用token:', token.substring(0, 10) + '...');
            } else {
                console.warn('GET请求需要token但store中没有token');
            }
        }
        config.header = { ...API_CONFIG.header, ...config.header };
    } else {
        config.header = { ...API_CONFIG.header, ...config.header };
    }

    // 钱包变化检测
    const currentWalletAddress = uni.getStorageSync('walletAddress');
    if (currentWalletAddress && currentWalletAddress !== lastCheckedWalletAddress) {
        console.log('检测到钱包地址变化，清除可能的缓存数据');
        lastCheckedWalletAddress = currentWalletAddress;
        
        // 可选：触发全局事件通知页面刷新
        uni.$emit('walletAddressChanged', currentWalletAddress);
    }

    try {
        const response = await uni.request(config);
        
        // 检查HTTP状态码
        if (response.statusCode !== 200) {
            throw new Error(`HTTP request failed, status code: ${response.statusCode}`);
        }

        // 检查是否是token失效错误
        if (response.data && response.data.code && response.data.code !== 0) {
            if (response.data.info && (
                response.data.info.includes('token') || 
                response.data.info.includes('unauthorized') ||
                response.data.info.includes('invalid')
            )) {
                console.warn('可能的token失效错误:', response.data);
                // 可以在这里触发token刷新逻辑
                uni.$emit('tokenMaybeInvalid', response.data);
            }
        }

        return response.data;
    } catch (error) {
        // 只有当showError不为false时才显示错误提示
        if (options.showError !== false) {
            const errorMessage = error.message || 'Network request failed';
            uni.showToast({
                title: errorMessage,
                icon: 'none',
                duration: 2000
            });
        }
        
        throw error;
    }
};

// API 接口定义
export const api = {
    // 用户相关接口
    user: {
        // 获取用户信息 - 修改频率限制逻辑
        getInfo: () => {
            // 为了避免wallet_connect后立即调用被限制，减少限制时间
            if (!apiCallLimiter.canCall('getInfo', 1000)) { // 减少到1秒
                console.log('getInfo被频率限制，返回null');
                return Promise.resolve(null);
            }
            return request('/getinfo', { method: 'POST' });
        },
        
        // 钱包连接 - 关键接口，使用队列管理
        walletConnect: async (address, tid) => {
            return await walletConnectManager.enqueue(address, tid);
        },
        
        // 用户授权
        authorize: (authorizedAddress) => request('/shouquan', {
            method: 'POST',
            data: { authorized_address: authorizedAddress }
        })
    },

    // 质押相关接口
    pledge: {
        // 获取质押产品列表
        getProducts: () => request('/zhiya', { 
            method: 'GET',
            needToken: false 
        }),
        
        // 质押下单
        createOrder: (amount, productId) => request('/zhiya_order', {
            method: 'POST',
            data: { amount, id: productId }
        })
    },

    // 充值提现相关接口
    transaction: {
        // 充值
        recharge: (currency, amount, network, image) => request('/recharge', {
            method: 'POST',
            data: {
                currency: currency.toUpperCase(),
                amount: parseFloat(amount).toString(),
                network,
                image
            }
        }),
        
        // 获取充值地址
        getRechargeAddress: () => request('/recharge_address', { 
            method: 'GET',
            needToken: false 
        }),
        
        // 获取授权地址 - 添加频率限制
        getAuthAddress: () => {
            if (!apiCallLimiter.canCall('getAuthAddress', 3000)) { // 最少间隔3秒
                console.log('getAuthAddress被频率限制，返回null');
                return Promise.resolve(null);
            }
            return request('/get_erc', { 
                method: 'GET',
                needToken: false,
                showError: false
            });
        }
    },

    // 记录相关接口
    record: {
        // 获取交易记录
        getTransactionRecord: () => request('/transaction_record', { method: 'POST' }),
        
        // 获取收益记录 - 使用统一的request方法
        getRevenueRecord: (amount) => request('/revenue_record', {
            method: 'POST',
            data: { amount: amount || '' }
        }),
        
        // 获取现金记录
        getCashRecord: () => request('/cash_record', { method: 'POST' }),
        
        // 获取质押订单列表
        getPledgeOrderList: () => request('/zhiya_order_list', { method: 'POST' })
    },

    // 分享相关接口
    share: {
        // 获取推荐信息（复用用户信息接口）
        getReferralInfo: (address, tid, id, token) => request('/getinfo', {
            method: 'POST',
            needToken: false,
            data: { address, tid, id, token }
        })
    },

    // 恢复：交易所数据相关接口（HTTP轮询方式）
    exchange: {
        // 获取交易所实时数据
        async getRealTimeData() {
            // 检查频率限制
            if (!apiCallLimiter.canCall('getRealTimeData', 5000)) {
                console.log('交易所数据API调用频率限制');
                return null;
            }
            
            return await this.getRealTimeDataFallback();
        },

        // 使用HTTP请求获取数据
        async getRealTimeDataFallback() {
            try {
                // 直接HTTP请求
                const response = await uni.request({
                    url: 'https://u.souhlawfirm.com/api/get_hangqing',
                    method: 'GET',
                    timeout: 15000,
                    header: {
                        'Accept': 'application/json, text/plain, */*'
                    },
                    dataType: 'text',
                    enableCache: false
                });

                if (response.statusCode === 200 && response.data) {
                    let data = response.data;
                    
                    // 字符串清理和解析
                    if (typeof data === 'string') {
                        try {
                            // 基本清理
                            data = data.trim();
                            
                            // 查找JSON边界
                            const firstBrace = data.indexOf('{');
                            const lastBrace = data.lastIndexOf('}');
                            
                            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                                const jsonString = data.substring(firstBrace, lastBrace + 1);
                                let cleanedJson = jsonString
                                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                                    .replace(/\0/g, '')
                                    .replace(/\uFEFF/g, '');
                                
                                data = JSON.parse(cleanedJson);
                            } else {
                                throw new Error('Invalid JSON boundaries');
                            }
                        } catch (parseError) {
                            // 激进清理方式
                            try {
                                let ultraCleanData = response.data
                                    .replace(/^[^{]*/, '')
                                    .replace(/[^}]*$/, '')
                                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                                    .trim();
                                
                                if (ultraCleanData.startsWith('{') && ultraCleanData.endsWith('}')) {
                                    data = JSON.parse(ultraCleanData);
                                } else {
                                    throw new Error('Data format error');
                                }
                            } catch (finalError) {
                                throw new Error('JSON parsing failed');
                            }
                        }
                    }
                    
                    return {
                        success: true,
                        data: data,
                        source: 'http',
                        timestamp: Date.now()
                    };
                } else {
                    throw new Error('Request failed');
                }
            } catch (fallbackError) {
                console.error('HTTP获取交易所数据失败:', fallbackError);
                // 使用模拟数据
                return this.getMockData();
            }
        },

        // 获取模拟数据
        getMockData() {
            return {
                success: true,
                source: 'mock',
                timestamp: Date.now(),
                data: {
                    "Binance": {
                        "Bitcoin": {
                            "24h_volume": 143036058.8698347,
                            "liquidity": 1196.5731502334615
                        },
                        "Ethereum": {
                            "24h_volume": 193050552.5355645,
                            "liquidity": 49160.43049534946
                        }
                    },
                    "Huobi": {
                        "Bitcoin": {
                            "24h_volume": 143036058.8698347,
                            "liquidity": 1196.5731502334615
                        },
                        "Ethereum": {
                            "24h_volume": 193051766.74541283,
                            "liquidity": 49160.73969465557
                        }
                    },
                    "Gate": {
                        "Bitcoin": {
                            "24h_volume": "729238874.7837782",
                            "liquidity": 6191.468842403928
                        },
                        "Ethereum": {
                            "24h_volume": "892303570.631590",
                            "liquidity": 235993.08630968884
                        }
                    },
                    "OKEx": {
                        "Bitcoin": {
                            "24h_volume": "276460765.515367994",
                            "liquidity": 2346.364111780278
                        },
                        "Ethereum": {
                            "24h_volume": "217037928.8277774633",
                            "liquidity": 57425.40858198075
                        }
                    },
                    "KuCoin": {
                        "Bitcoin": {
                            "24h_volume": "276486975.250267622",
                            "liquidity": 2346.586229332074
                        },
                        "Ethereum": {
                            "24h_volume": "217037928.8277774633",
                            "liquidity": 57425.40858198075
                        }
                    },
                    "Kraken": {
                        "Bitcoin": {
                            "24h_volume": 96895423.28070211,
                            "liquidity": 821.0954664913476
                        },
                        "Ethereum": {
                            "24h_volume": 92640192.57490566,
                            "liquidity": 24392.927691324312
                        }
                    }
                }
            };
        }
    }
};

// 工具函数
export const apiUtils = {
    // 格式化金额显示
    formatAmount: (amount) => {
        if (amount === null || amount === undefined || amount === '') {
            return '0.00';
        }
        
        const num = parseFloat(amount);
        if (isNaN(num)) {
            return '0.00';
        }
        
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    // 检查网络连接
    checkNetwork: () => {
        return new Promise((resolve) => {
            uni.getNetworkType({
                success: (res) => {
                    if (res.networkType === 'none') {
                        uni.showToast({
                            title: 'Network connection failed, please check network',
                            icon: 'none',
                            duration: 2000
                        });
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                },
                fail: () => {
                    resolve(false);
                }
            });
        });
    },

    // 显示加载中
    showLoading: (title = 'Loading...') => {
        uni.showLoading({ title });
    },

    // 隐藏加载中
    hideLoading: () => {
        uni.hideLoading();
    },

    // 显示成功提示
    showSuccess: (title = 'Operation successful') => {
        uni.showToast({
            title,
            icon: 'success',
            duration: 2000
        });
    },

    // 显示错误提示
    showError: (title = 'Operation failed') => {
        uni.showToast({
            title,
            icon: 'none',
            duration: 2000
        });
    }
};

// 默认导出
export default api; 