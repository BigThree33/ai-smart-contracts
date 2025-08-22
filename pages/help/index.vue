<template>
    <view class="help-container">
        <!-- 顶部渐变背景区域(框1) -->

        <view class="gradient-bg">
            <view class="overlay-image-container">
                <image class="overlay-image"
                    src="https://www.onchainus.net/static/media/img_banner.d6562c9c57149ca18538.png" mode="aspectFill">
                </image>
            </view>
        </view>
        <!-- 内容区域(框2) -->
        <view class="content-container">
            <!-- 客服按钮 -->
            <view class="customer-service-box">
                <view class="service-row" @click="openCustomerService">
                    <view class="service-left">
                        <uni-icons type="headphones" size="20" color="#3c8dbc"></uni-icons>
                        <text class="service-text">Online Customer Service</text>
                    </view>
                    <uni-icons type="right" size="16" color="#999999"></uni-icons>
                </view>
            </view>

            <!-- 调试信息面板 -->
            <view class="debug-panel" v-if="debugInfo.visible">
                <view class="debug-title">
                    <uni-icons type="settings" size="20" color="#ff6b35"></uni-icons>
                    <text class="debug-title-text">Debug Information</text>
                    <view class="debug-close" @click="hideDebugInfo">×</view>
                </view>
                
                <view class="debug-content">
                    <view class="debug-item">
                        <text class="debug-label">Wallet Environment:</text>
                        <text class="debug-value" :class="{'debug-value-error': debugInfo.walletEnv === 'unknown'}">
                            {{ debugInfo.walletEnv }}
                        </text>
                    </view>
                    
                    <view class="debug-item">
                        <text class="debug-label">User Agent:</text>
                        <text class="debug-value debug-value-small">{{ debugInfo.userAgent }}</text>
                    </view>
                    
                    <view class="debug-item">
                        <text class="debug-label">Customer Service URL:</text>
                        <text class="debug-value debug-value-small" :class="{'debug-value-error': !debugInfo.kefuUrl}">
                            {{ debugInfo.kefuUrl || 'Not Available' }}
                        </text>
                    </view>
                    
                    <view class="debug-item">
                        <text class="debug-label">Token Status:</text>
                        <text class="debug-value" :class="{'debug-value-success': debugInfo.hasToken, 'debug-value-error': !debugInfo.hasToken}">
                            {{ debugInfo.hasToken ? 'Available' : 'Not Available' }}
                        </text>
                    </view>
                    
                    <view class="debug-item" v-if="debugInfo.lastError">
                        <text class="debug-label">Last Error:</text>
                        <text class="debug-value debug-value-error debug-value-small">{{ debugInfo.lastError }}</text>
                    </view>
                    
                    <view class="debug-item" v-if="debugInfo.apiResponse">
                        <text class="debug-label">API Response:</text>
                        <text class="debug-value debug-value-small">{{ JSON.stringify(debugInfo.apiResponse, null, 2) }}</text>
                    </view>
                </view>
                
                <view class="debug-actions">
                    <button class="debug-btn" @click="copyDebugInfo">Copy Debug Info</button>
                    <button class="debug-btn debug-btn-test" @click="testFallbackUrl">Test Fallback URL</button>
                </view>
            </view>

            <!-- FAQ内容区域 -->
            <view class="faq-container">
                <!-- 第一个问题 -->
                <view class="faq-item">
                    <view class="faq-title">
                        <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                        <text class="title-text">What is an artificial intelligence (AI) smart contract trading
                            system?</text>
                    </view>

                    <view class="faq-content">
                        <text class="content-text">
                            An AI smart contract trading system is a blockchain technology-based trading system that
                            uses
                            smart contracts as an execution and management tool for trading. A smart contract is a
                            computational code that programmatically defines and automatically executes the terms of a
                            contract. These contract codes are stored on the blockchain to ensure transparency, security
                            and
                            reliability of transactions.

                            At the same time the smart contract trading system allows participants to trade without the
                            need
                            for a third party intermediary. The system works on the principle that the contract code
                            will
                            automatically execute a transaction when predefined conditions are met. This means that
                            transactions can be executed without human intervention, thus reducing the possibility of
                            fraud
                            and errors and increasing the efficiency of transactions.

                            The system can execute various types of transactions, such as digital currency transactions,
                            asset swaps, decentralized finance (DeFi) transactions, etc. It can also provide other
                            functions
                            such as decentralized exchange (DEX) operations, automated trading strategy execution and
                            management, and crowdfunding platform operations.

                            These systems provide a more open and transparent trading environment through blockchain
                            technology, enabling participants to trade securely and without the need to trust third
                            parties.
                        </text>
                    </view>
                </view>

                <view class="divider"></view>

                <!-- 第二个问题 -->
                <view class="faq-item">
                    <view class="faq-title">
                        <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                        <text class="title-text">How do AI smart contracts work?</text>
                    </view>

                    <view class="faq-content">
                        <text class="content-text">
                            AI smart contracts combine artificial intelligence with blockchain technology to create
                            self-executing contracts. These contracts automatically execute, control, or document
                            legally
                            relevant events according to the terms written directly into code.

                            The AI component enhances traditional smart contracts by adding capabilities such as pattern
                            recognition, learning from historical data, and making decisions based on complex criteria.
                            This
                            allows the contracts to adapt and respond to changing market conditions more effectively
                            than
                            traditional static contracts.

                            When a predefined condition is met, the smart contract automatically executes the
                            corresponding
                            agreement. The entire process is transparent and secure, with all transactions recorded on
                            the
                            blockchain.
                        </text>
                    </view>
                </view>

                <view class="divider"></view>

                <!-- 第三个问题 -->
                <view class="faq-item">
                    <view class="faq-title">
                        <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                        <text class="title-text">What are the benefits of using AI smart contracts?</text>
                    </view>

                    <view class="faq-content">
                        <text class="content-text">
                            AI smart contracts offer numerous advantages over traditional trading systems:

                            1. Automation: Eliminates the need for intermediaries, reducing costs and increasing
                            efficiency.

                            2. Security: Blockchain technology ensures that contracts cannot be altered once deployed.

                            3. Transparency: All parties can view the contract terms and execution history.

                            4. Efficiency: Transactions are processed quickly and automatically when conditions are met.

                            5. Reduced Risk: Smart contracts minimize the risk of fraud and errors.

                            6. Accessibility: Available 24/7, allowing for trading at any time without downtime.

                            7. Adaptability: AI components can adjust strategies based on market conditions.

                            8. Cost-Effective: Reduces overhead costs associated with traditional trading systems.
                        </text>
                    </view>
                </view>

                <view class="divider"></view>

                <!-- 第四个问题 -->
                <view class="faq-item">
                    <view class="faq-title">
                        <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                        <text class="title-text">Is it safe to use AI smart contracts for trading?</text>
                    </view>

                    <view class="faq-content">
                        <text class="content-text">
                            AI smart contracts provide a high level of security due to their blockchain foundation.
                            However,
                            like any technology, they are not without risks:

                            - Code Security: Smart contracts are only as secure as their code. We employ rigorous
                            auditing
                            and testing to ensure contract integrity.

                            - Blockchain Security: We use established blockchain networks with proven security records.

                            - Data Privacy: User data is protected through encryption and secure protocols.

                            - Risk Management: Our AI systems include risk assessment tools to prevent unexpected
                            losses.

                            - Regulatory Compliance: Our contracts are designed to comply with relevant financial
                            regulations.

                            We recommend users to start with smaller trades to become familiar with the system before
                            committing larger amounts.
                        </text>
                    </view>
                </view>

                <view class="divider"></view>

                <!-- 新增带图片的问题6 -->
                <view class="faq-item">
                    <view class="faq-title">
                        <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                        <text class="title-text">NMLS Regulated MTL License</text>
                    </view>

                    <view class="faq-content">
                        <!-- 图片展示 -->
                        <view class="image-container">
                            <image class="security-image"
                                src="https://www.onchainus.net/static/media/MTL.a08660900dab07cbb5d3.jpg"
                                mode="widthFix"></image>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api, apiUtils } from '@/utils/api.js';
import store from '@/store'; // 导入store

// 获取状态栏高度
let statusBarHeight = 0;

// 控制客服子选项显示
const showSubService = ref(false);

// 调试信息 - 默认显示
const debugInfo = ref({
    visible: true, // 直接显示
    walletEnv: 'unknown',
    userAgent: '',
    kefuUrl: '',
    hasToken: false,
    lastError: '',
    apiResponse: null
});

// 显示调试信息
const showDebugInfo = () => {
    debugInfo.value.visible = true;
    updateDebugInfo();
};

// 隐藏调试信息
const hideDebugInfo = () => {
    debugInfo.value.visible = false;
};

// 更新调试信息
const updateDebugInfo = () => {
    debugInfo.value.walletEnv = detectWalletEnvironment();
    debugInfo.value.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A';
    debugInfo.value.hasToken = !!store.getToken();
};

// 复制调试信息
const copyDebugInfo = () => {
    const debugText = `
Wallet Environment: ${debugInfo.value.walletEnv}
User Agent: ${debugInfo.value.userAgent}
Customer Service URL: ${debugInfo.value.kefuUrl || 'Not Available'}
Token Status: ${debugInfo.value.hasToken ? 'Available' : 'Not Available'}
Last Error: ${debugInfo.value.lastError || 'None'}
API Response: ${JSON.stringify(debugInfo.value.apiResponse, null, 2)}
    `.trim();
    
    uni.setClipboardData({
        data: debugText,
        success: () => {
            uni.showToast({
                title: 'Debug info copied to clipboard',
                icon: 'success',
                duration: 2000
            });
        },
        fail: () => {
            uni.showToast({
                title: 'Failed to copy debug info',
                icon: 'error',
                duration: 2000
            });
        }
    });
};

// 测试备用URL
const testFallbackUrl = async () => {
    const fallbackUrl = 'https://tawk.to/chat/your-customer-service-id';
    try {
        await openExternalLink(fallbackUrl);
        uni.showToast({
            title: 'Fallback URL test completed',
            icon: 'success',
            duration: 2000
        });
    } catch (error) {
        debugInfo.value.lastError = error.message;
        uni.showToast({
            title: 'Fallback URL test failed',
            icon: 'error',
            duration: 2000
        });
    }
};

// 在openCustomerService函数之前添加钱包环境检测
const detectWalletEnvironment = () => {
    if (typeof window === 'undefined') return 'unknown';
    
    const userAgent = navigator.userAgent || '';
    console.log('Current UserAgent:', userAgent);
    
    // 检测imToken/imPocket
    if (userAgent.includes('imToken') || 
        userAgent.includes('ImToken') ||
        userAgent.includes('imPocket') ||
        window.ethereum?.isImToken) {
        return 'imToken';
    }
    
    // 检测TokenPocket
    if (userAgent.includes('TokenPocket') || 
        userAgent.includes('TP/') ||
        window.tokenpocket ||
        window.ethereum?.isTokenPocket) {
        return 'TokenPocket';
    }
    
    // 其他环境
    return 'other';
};

// 修改openExternalLink函数，针对不同钱包环境采用不同策略
const openExternalLink = (url) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('Preparing to open link:', url);
            const walletEnv = detectWalletEnvironment();
            console.log('Detected wallet environment:', walletEnv);
            
            // 更新调试信息
            debugInfo.value.walletEnv = walletEnv;
            debugInfo.value.kefuUrl = url;
            
            // 针对imToken/imPocket的特殊处理
            if (walletEnv === 'imToken') {
                console.log('imToken environment, trying special handling');
                
                // 方案1：尝试使用系统浏览器打开
                if (uni.openDocument) {
                    uni.openDocument({
                        filePath: url,
                        showMenu: true,
                        success: () => {
                            console.log('Successfully opened via openDocument');
                            resolve();
                        },
                        fail: (error) => {
                            console.log('openDocument failed, trying other methods');
                            debugInfo.value.lastError = `openDocument failed: ${JSON.stringify(error)}`;
                            tryAlternativeOpenMethods(url, resolve, reject);
                        }
                    });
                    return;
                }
                
                // 方案2：尝试复制链接到剪贴板
                uni.setClipboardData({
                    data: url,
                    success: () => {
                        uni.showModal({
                            title: 'Notice',
                            content: 'Customer service link has been copied to clipboard. Please paste it in your browser to access.',
                            showCancel: false,
                            confirmText: 'OK',
                            success: () => resolve()
                        });
                    },
                    fail: () => {
                        tryAlternativeOpenMethods(url, resolve, reject);
                    }
                });
                return;
            }
            
            // 原有的处理逻辑（适用于其他钱包）
            // #ifdef MP-WEIXIN
            uni.navigateTo({
                url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
                success: () => {
                    console.log('Successfully navigated to webview');
                    resolve();
                },
                fail: (error) => {
                    console.error('Failed to navigate to webview:', error);
                    debugInfo.value.lastError = `Webview navigation failed: ${JSON.stringify(error)}`;
                    tryAlternativeOpenMethods(url, resolve, reject);
                }
            });
            // #endif
            
            // #ifdef APP-PLUS
            plus.runtime.openURL(url);
            resolve();
            // #endif
            
            // #ifdef H5
            window.open(url, '_blank');
            resolve();
            // #endif
            
        } catch (error) {
            console.error('Failed to open external link:', error);
            debugInfo.value.lastError = error.message;
            reject(error);
        }
    });
};

// 新增：备用打开方法
const tryAlternativeOpenMethods = (url, resolve, reject) => {
    console.log('Trying alternative opening methods');
    
    // 尝试方法1：使用uni.navigateTo跳转到webview
    uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
        success: () => {
            console.log('Alternative method 1 succeeded');
            resolve();
        },
        fail: (error1) => {
            console.log('Alternative method 1 failed:', error1);
            
            // 尝试方法2：复制链接到剪贴板
            uni.setClipboardData({
                data: url,
                success: () => {
                    uni.showModal({
                        title: 'Unable to Direct Navigate',
                        content: 'Due to wallet restrictions, the customer service link has been copied to clipboard. Please open browser and paste to access, or contact technical support.',
                        showCancel: true,
                        cancelText: 'Cancel',
                        confirmText: 'OK',
                        success: (res) => {
                            if (res.confirm) {
                                resolve();
                            } else {
                                reject(new Error('User cancelled'));
                            }
                        }
                    });
                },
                fail: (error2) => {
                    console.log('Alternative method 2 failed:', error2);
                    
                    // 最后的备用方案：显示链接让用户手动复制
                    uni.showModal({
                        title: 'Customer Service Link',
                        content: `Please manually copy this link and open in browser: ${url}`,
                        showCancel: false,
                        confirmText: 'OK',
                        success: () => resolve(),
                        fail: () => reject(new Error('All alternative methods failed'))
                    });
                }
            });
        }
    });
};

// 点击在线客服 - 获取kefu地址并跳转
const openCustomerService = async () => {
    try {
        // 显示加载中
        uni.showLoading({
            title: 'Connecting to customer service...'
        });

        console.log('Getting customer service address...');
        
        // 先检查是否有token
        const currentToken = store.getToken();
        console.log('Current token status:', currentToken ? 'exists' : 'not exists');
        debugInfo.value.hasToken = !!currentToken;
        
        // 如果没有token，先尝试使用当前钱包地址获取
        if (!currentToken) {
            const walletAddress = uni.getStorageSync('walletAddress');
            if (walletAddress) {
                console.log('No token, trying to reconnect wallet to get token...');
                try {
                    const connectResponse = await api.user.walletConnect(
                        walletAddress,
                        uni.getStorageSync('userTid') || ''
                    );
                    
                    if (connectResponse && connectResponse.code === 0 && connectResponse.token) {
                        store.setToken(connectResponse.token);
                        console.log('Successfully re-obtained token');
                        debugInfo.value.hasToken = true;
                    }
                } catch (connectError) {
                    console.warn('Failed to reconnect wallet:', connectError);
                    debugInfo.value.lastError = `Wallet reconnection failed: ${connectError.message}`;
                }
            }
        }
        
        // 调用getinfo接口获取kefu参数，增加重试逻辑
        let response = null;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries && !response) {
            try {
                if (retryCount > 0) {
                    console.log(`Attempt ${retryCount + 1} to get customer service address...`);
                    // 等待一段时间再重试，避免频率限制
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                
                response = await api.user.getInfo();
                
                if (response === null) {
                    console.log('API rate limited, waiting for retry...');
                    retryCount++;
                    continue;
                }
                
                break;
            } catch (error) {
                console.error(`Attempt ${retryCount + 1} failed:`, error);
                debugInfo.value.lastError = `API call failed (attempt ${retryCount + 1}): ${error.message}`;
                retryCount++;
                if (retryCount >= maxRetries) {
                    throw error;
                }
            }
        }
        
        console.log('getinfo response:', response);
        console.log('kefu value:', response?.kefu);
        debugInfo.value.apiResponse = response;
        
        uni.hideLoading();

        // 修改判断条件：处理多种情况
        if (response && response.kefu) {
            const kefuUrl = response.kefu;
            console.log('Customer service address:', kefuUrl);
            debugInfo.value.kefuUrl = kefuUrl;
            
            // 跳转到客服地址
            await openExternalLink(kefuUrl);
        } else if (response === null) {
            // API被频率限制的情况
            console.log('API call rate limited');
            throw new Error('Service temporarily busy, please try again in a moment');
        } else {
            // 响应中没有kefu字段的情况
            console.log('kefu not found in response:', response);
            debugInfo.value.lastError = 'Customer service URL not found in API response';
            
            // 提供备用客服方案
            const fallbackUrl = 'https://tawk.to/chat/your-customer-service-id'; // 替换为实际的备用客服地址
            console.log('Using fallback customer service address:', fallbackUrl);
            debugInfo.value.kefuUrl = fallbackUrl;
            await openExternalLink(fallbackUrl);
        }
    } catch (error) {
        uni.hideLoading();
        console.error('Failed to get customer service address:', error);
        debugInfo.value.lastError = error.message;
        
        // 根据错误类型显示不同的提示
        let errorMessage = 'Cannot connect to customer service, please try again later';
        
        if (error.message.includes('busy') || error.message.includes('rate')) {
            errorMessage = 'Service is busy, please try again in a moment';
        } else if (error.message.includes('token') || error.message.includes('unauthorized')) {
            errorMessage = 'Please reconnect your wallet and try again';
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
            errorMessage = 'Network error, please check your connection';
        }
        
        // 显示错误提示
        uni.showModal({
            title: 'Notice',
            content: errorMessage,
            showCancel: false,
            confirmText: 'OK'
        });
    }
};

// 原有的切换客服子选项显示（如果还需要的话可以保留）
const toggleCustomerService = () => {
    showSubService.value = !showSubService.value;
};

// 跳转到客服聊天页面（备用方法）
const navigateToChat = () => {
    uni.showToast({
        title: 'Jumping to customer service page...',
        icon: 'none',
        duration: 1500
    });
    
    uni.navigateTo({
        url: '/pages/borrow/index'
    });
};

// 获取状态栏高度
onMounted(() => {
    try {
        const systemInfo = uni.getSystemInfoSync();
        statusBarHeight = systemInfo.statusBarHeight || 0;
        
        // 页面加载时初始化调试信息
        updateDebugInfo();
    } catch (e) {
        console.error('Failed to get status bar height:', e);
    }
});
</script>

<style lang="scss">
.help-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    position: relative;
    padding-top: 0;
    margin-top: 0;
}

.gradient-bg {
     position: relative; // 使用相对定位
    top: 0; // 距离顶部0像素
    left: 0; // 距离左侧0像素
    right: 0; // 距离右侧0像素
    height: 50vh; // 高度为视口高度的50%
    background: linear-gradient(to bottom, #094884, white); // 从深蓝色到白色的渐变背景
    z-index: 0; // z轴位置，确保在其他元素之下
}


//TODO hetght更改图片不同显示大小
.overlay-image-container {
     position: absolute; // 使用绝对定位
    top: 0; // 距离顶部0像素
    left: 0; // 距离左侧0像素
    right: 0; // 距离右侧0像素
    height: 40vh; // 增加高度到30vh，给图片更多显示空间
    z-index: 1; // z轴位置，位于gradient-bg之上
    display: flex; // 使用flex布局
    justify-content: center; // 水平居中
    align-items: center; // 改为居中对齐，避免顶部裁剪
    overflow: hidden; // 确保超出容器的图片部分被裁剪
    padding-top: var(--status-bar-height, 20px); // 添加状态栏高度的内边距
}

.overlay-image {
    width: 100%;
    height: 90%;
     max-height: 100%; // 最大高度不超过容器
    object-fit: contain;
    object-position: center; // 图片居中显示
    margin-top: 0;
    display: block;
}

.content-container {
    position: relative;
    z-index: 2;
    margin: 0 0rpx;
    margin-top: -27vh; /* 向上覆盖大框1的一部分 */
    padding: 40rpx;
    background-color: transparent;
    border-radius: 20rpx 20rpx 0 0;
    // box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
    min-height: 70vh; /* 确保足够高度，可自动扩展 */
}

/* 客服按钮 - 控制"Online Customer Service"按钮的样式 */
.customer-service-box {
    margin: 0 0 30rpx 0; // 上右下左外边距：上0，右0，下30rpx，左0
    padding: 0; // 移除整体padding，让子元素自己控制
    background-color: #ffffff; // 背景色为白色
    border-radius: 15rpx; // 所有角都有15rpx的圆角
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1); // 添加阴影效果
    overflow: hidden; // 确保子元素不会溢出圆角
}

/* 主服务行 - 控制主要的客服选项行 */
.service-row {
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: space-between; // 两端对齐
    padding: 25rpx 30rpx; // 内边距：上下25rpx，左右30rpx
    cursor: pointer; // 鼠标指针样式
    
    &:hover {
        background-color: #f8f9fa; // 悬停时的背景色
    }
}

/* 左侧内容区域 - 包含图标和文字 */
.service-left {
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: flex-start; // 左对齐
    flex: 1; // 占用剩余空间
}

/* 客服按钮文本 - 控制"Online Customer Service"文字的样式 */
.service-text {
    margin-left: 15rpx; // 左外边距15rpx，与图标保持距离
    font-size: 28rpx; // 字体大小调小到28rpx
    font-weight: 500; // 字体粗细调整
    color: #333333; // 字体颜色深灰色
}

/* 展开箭头 - 控制右侧的">"箭头 */
.expand-arrow {
    font-size: 24rpx; // 箭头字体大小
    color: #999999; // 箭头颜色为灰色
    transition: transform 0.3s ease; // 旋转动画过渡
    transform: rotate(0deg); // 初始状态不旋转
    
    &.rotated {
        transform: rotate(90deg); // 展开时顺时针旋转90度
    }
}

/* 子服务行 - 控制展开后的子选项行 */
.sub-service-row {
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    padding: 20rpx 30rpx 25rpx 50rpx; // 内边距：上20rpx，右30rpx，下25rpx，左50rpx（左侧多一些缩进）
    border-top: 1rpx solid #f0f0f0; // 顶部添加分隔线
    background-color: #fafafa; // 稍微不同的背景色以区分
    cursor: pointer; // 鼠标指针样式
    
    &:hover {
        background-color: #f0f0f0; // 悬停时的背景色
    }
    
    .service-text {
        font-size: 26rpx; // 子选项的字体稍微小一点
        color: #666666; // 颜色稍微浅一点
    }
}

.faq-container {
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 15rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

    .faq-item {
        margin-bottom: 40rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .faq-title {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20rpx;

            .title-text {
                margin-left: 20rpx;
                font-size: 32rpx;
                font-weight: bold;
                color: #333333;
                flex: 1;
            }
        }

        .faq-content {
            padding-left: 44rpx;
            /* 对齐标题文本 */

            .content-text {
                font-size: 28rpx;
                line-height: 1.6;
                color: #666666;
                text-align: justify;
            }
        }
    }

    .divider {
        height: 2rpx;
        background-color: #eeeeee;
        margin: 40rpx 0;
    }

    .image-container {
        width: 100%;
        margin-bottom: 30rpx;

        .security-image {
            width: 100%;
            border-radius: 10rpx;
            box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
        }
    }
}

/* 调试面板样式 */
.debug-panel {
    margin: 20rpx 0;
    padding: 0;
    background-color: #ffffff;
    border-radius: 15rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    border: 2rpx solid #ff6b35;
    overflow: hidden;
}

.debug-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    background-color: #ff6b35;
    color: white;
    
    .debug-title-text {
        margin-left: 15rpx;
        font-size: 28rpx;
        font-weight: bold;
        flex: 1;
    }
    
    .debug-close {
        font-size: 40rpx;
        font-weight: bold;
        cursor: pointer;
        padding: 0 10rpx;
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
        }
    }
}

.debug-content {
    padding: 20rpx 30rpx;
    max-height: 600rpx;
    overflow-y: auto;
}

.debug-item {
    margin-bottom: 20rpx;
    
    &:last-child {
        margin-bottom: 0;
    }
    
    .debug-label {
        display: block;
        font-size: 24rpx;
        font-weight: bold;
        color: #666666;
        margin-bottom: 8rpx;
    }
    
    .debug-value {
        display: block;
        font-size: 26rpx;
        color: #333333;
        background-color: #f8f9fa;
        padding: 10rpx 15rpx;
        border-radius: 8rpx;
        word-break: break-all;
        
        &.debug-value-small {
            font-size: 22rpx;
            line-height: 1.4;
        }
        
        &.debug-value-success {
            color: #28a745;
            background-color: #d4edda;
        }
        
        &.debug-value-error {
            color: #dc3545;
            background-color: #f8d7da;
        }
    }
}

.debug-actions {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    background-color: #f8f9fa;
    border-top: 1rpx solid #e9ecef;
    
    .debug-btn {
        flex: 1;
        padding: 15rpx 20rpx;
        margin: 0 10rpx;
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 8rpx;
        font-size: 24rpx;
        cursor: pointer;
        
        &:first-child {
            margin-left: 0;
        }
        
        &:last-child {
            margin-right: 0;
        }
        
        &.debug-btn-test {
            background-color: #17a2b8;
        }
        
        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
