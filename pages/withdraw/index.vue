<template>
    <view class="account-container">
        <!-- 背景渐变区域 -->
        <view class="gradient-bg"></view>

        <!-- 内容区域 -->
        <view class="content-area">
            <!-- 上方大框 -->
            <view class="upper-box">
                <!-- 顶部导航栏 -->
                <view class="top-nav">
                    <view class="nav-item" @click="goToTransactionRecord">
                        <text class="nav-text">Transaction Record</text>
                        <text class="nav-arrow">></text>
                    </view>
                    <view class="nav-divider">|</view>
                    <view class="nav-item" @click="goToRevenueRecord">
                        <text class="nav-text">Revenue Record</text>
                        <text class="nav-arrow">></text>
                    </view>
                </view>

                <!-- 余额显示区域 -->
                <view class="balance-area">
                    <view class="balance-info">
                        <text class="balance-label">Available Balance(USDT)</text>
                        <text class="balance-amount">$0.00</text>
                    </view>

                    <!-- 收益统计小板块 -->
                    <view class="revenue-stats">
                        <view class="stat-item">
                            <text class="stat-label">Total revenue(USDT)</text>
                            <text class="stat-value">0.00</text>
                        </view>
                        <view class="stat-divider">|</view>
                        <view class="stat-item">
                            <text class="stat-label">Earnings 24h(USDT)</text>
                            <text class="stat-value">0.00</text>
                        </view>
                    </view>
                </view>
                
            </view>

            <!-- 新增的操作框 -->
            <view class="operation-box">
                <!-- 顶部三个按钮 -->
                <view class="operation-tabs">
                    <view class="tab-item" :class="{ 'active': activeTab === 'receive' }" @click="switchTab('receive')">
                        <text class="tab-text">RECEIVE</text>
                    </view>
                    <view class="tab-item" :class="{ 'active': activeTab === 'send' }" @click="switchTab('send')">
                        <text class="tab-text">SEND</text>
                    </view>
                    <view class="tab-item" :class="{ 'active': activeTab === 'convert' }" @click="switchTab('convert')">
                        <text class="tab-text">CONVERT</text>
                    </view>
                </view>

                <!-- RECEIVE 内容 -->
                <view v-if="activeTab === 'receive'" class="tab-content">
                    <!-- Currency Type 标题 -->
                    <text class="section-title">Currency Type</text>

                    <!-- 四个货币按钮 -->
                    <view class="currency-buttons">
                        <view class="currency-item" :class="{ 'selected': selectedCurrency === 'btc' }"
                            @click="selectCurrency('btc')">
                            <uni-icons type="wallet" size="24" color="#f7931a"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedCurrency === 'eth' }"
                            @click="selectCurrency('eth')">
                            <uni-icons type="wallet" size="24" color="#627eea"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedCurrency === 'usdt' }"
                            @click="selectCurrency('usdt')">
                            <uni-icons type="wallet" size="24" color="#26a17b"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedCurrency === 'ltc' }"
                            @click="selectCurrency('ltc')">
                            <uni-icons type="wallet" size="24" color="#bfbbbb"></uni-icons>
                        </view>
                    </view>

                    <!-- 分割线 -->
                    <view class="divider-line"></view>

                    <!-- USDT recharge 区域 -->
                    <view class="recharge-section">
                        <view class="recharge-header">
                            <uni-icons type="wallet" size="20" color="#26a17b"></uni-icons>
                            <text class="recharge-title">USDT recharge</text>
                        </view>

                        <!-- ERC20 按钮 -->
                        <view class="network-button">
                            <text class="network-text">ERC20</text>
                        </view>

                        <!-- 上传图片区域 -->
                        <view class="upload-area" @click="chooseImage">
                            <uni-icons type="camera" size="40" color="#999999"></uni-icons>
                            <text class="upload-text">点击上传转账截图</text>
                            <image v-if="uploadedImage" :src="uploadedImage" class="uploaded-image"></image>
                        </view>

                        <!-- Recharge amount -->
                        <text class="amount-label">Recharge amount</text>
                        <input class="amount-input" v-model="rechargeAmount" placeholder="Please input amount"
                            type="number" />

                        <!-- 说明文字 -->
                        <text class="notice-text">
                            Please do not send other types of assets to the above address. Doing so may result in the
                            loss of your assets. After successful sending, the network node needs to confirm the receipt
                            of the respective asset. Therefore, once you have completed the transfer, submit a
                            screenshot of the successful transfer through the platform and wait for the system to review
                            and confirm. After the system audit, the funds will be automatically added to your AI
                            account for you. If you have any questions, please contact online customer service for
                            verification.
                        </text>
                        <view class="withdraw-button" @click="handleSend">
                            <text class="withdraw-button-text">WITHDRAW</text>
                        </view>
                    </view>
                </view>

                <!-- SEND 内容 -->
                <view v-if="activeTab === 'send'" class="tab-content">
                    <!-- Currency Type 标题 -->
                    <text class="section-title">Currency Type</text>
                    
                    <!-- 四个货币按钮 -->
                    <view class="currency-buttons">
                        <view class="currency-item" :class="{ 'selected': selectedSendCurrency === 'btc' }"
                            @click="selectSendCurrency('btc')">
                            <uni-icons type="wallet" size="24" color="#f7931a"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedSendCurrency === 'eth' }"
                            @click="selectSendCurrency('eth')">
                            <uni-icons type="wallet" size="24" color="#627eea"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedSendCurrency === 'usdt' }"
                            @click="selectSendCurrency('usdt')">
                            <uni-icons type="wallet" size="24" color="#26a17b"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedSendCurrency === 'ltc' }"
                            @click="selectSendCurrency('ltc')">
                            <uni-icons type="wallet" size="24" color="#bfbbbb"></uni-icons>
                        </view>
                    </view>
                    
                    <!-- 分割线 -->
                    <view class="divider-line"></view>
                    
                    <!-- USDT 提取区域 -->
                    <view class="send-section">
                        <view class="send-header">
                            <uni-icons type="wallet" size="20" color="#26a17b"></uni-icons>
                            <text class="send-title">USDT withdrawal</text>
                        </view>
                        
                        <!-- ERC20 按钮 -->
                        <view class="network-button">
                            <text class="network-text">ERC20</text>
                        </view>
                        
                        <!-- Withdrawal address -->
                        <text class="input-label">Withdrawal address</text>
                        <input class="address-input" 
                               v-model="withdrawalAddress" 
                               placeholder="Please input address" 
                               type="text" />
                        
                        <!-- Quantity -->
                        <text class="input-label">Quantity</text>
                        <view class="quantity-input-container">
                            <input class="quantity-input" 
                                   v-model="withdrawalAmount" 
                                   placeholder="0.00" 
                                   type="number" />
                            <view class="max-button" @click="setMaxAmount">
                                <text class="max-text">MAX</text>
                            </view>
                        </view>
                        
                        <!-- 说明文字 -->
                        <text class="notice-text">
                            Please do not send other types of assets to the above address. Doing so may result in the
                            loss of your assets. After successful sending, the network node needs to confirm the receipt
                            of the respective asset. Therefore, once you have completed the transfer, submit a
                            screenshot of the successful transfer through the platform and wait for the system to review
                            and confirm. After the system audit, the funds will be automatically added to your AI
                            account for you. If you have any questions, please contact online customer service for
                            verification.
                        </text>
                        
                        <!-- WITHDRAW 大按钮 -->
                        <view class="withdraw-button" @click="handleSend">
                            <text class="withdraw-button-text">WITHDRAW</text>
                        </view>
                    </view>
                </view>

                <!-- CONVERT 内容 -->
                <view v-if="activeTab === 'convert'" class="tab-content">
                    <!-- Currency Type 标题 -->
                    <text class="section-title">Currency Type</text>
                    
                    <!-- 四个货币按钮 -->
                    <view class="currency-buttons">
                        <view class="currency-item" :class="{ 'selected': selectedConvertCurrency === 'btc' }"
                            @click="selectConvertCurrency('btc')">
                            <uni-icons type="wallet" size="24" color="#f7931a"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedConvertCurrency === 'eth' }"
                            @click="selectConvertCurrency('eth')">
                            <uni-icons type="wallet" size="24" color="#627eea"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedConvertCurrency === 'usdt' }"
                            @click="selectConvertCurrency('usdt')">
                            <uni-icons type="wallet" size="24" color="#26a17b"></uni-icons>
                        </view>
                        <view class="currency-item" :class="{ 'selected': selectedConvertCurrency === 'ltc' }"
                            @click="selectConvertCurrency('ltc')">
                            <uni-icons type="wallet" size="24" color="#bfbbbb"></uni-icons>
                        </view>
                    </view>
                    
                    <!-- 分割线 -->
                    <view class="divider-line"></view>
                    
                    <!-- 转换区域 -->
                    <view class="convert-section">
                        <view class="convert-header">
                            <uni-icons type="wallet" size="20" color="#26a17b"></uni-icons>
                            <text class="convert-title">Currency Conversion</text>
                        </view>
                        
                        <!-- From -->
                        <text class="input-label">From</text>
                        <view class="convert-input-container">
                            <view class="currency-info">
                                <uni-icons type="wallet" size="20" color="#007aff"></uni-icons>
                                <text class="currency-name">USDC</text>
                            </view>
                            <view class="amount-input-wrapper">
                                <input class="convert-amount-input" 
                                       v-model="convertFromAmount" 
                                       placeholder="0.00" 
                                       type="number"
                                       @input="onConvertAmountChange" />
                                <view class="max-button" @click="setMaxConvertAmount">
                                    <text class="max-text">MAX</text>
                                </view>
                            </view>
                        </view>
                        
                        <!-- 分割线 -->
                        <view class="divider-line"></view>
                        
                        <!-- To -->
                        <text class="input-label">To</text>
                        <view class="convert-input-container">
                            <view class="currency-info">
                                <uni-icons type="wallet" size="20" color="#26a17b"></uni-icons>
                                <text class="currency-name">USDT</text>
                            </view>
                            <view class="amount-display">
                                <text class="convert-result">{{ convertToAmount }}</text>
                            </view>
                        </view>
                        
                        <!-- 分割线 -->
                        <view class="divider-line"></view>
                        
                        <!-- CONVERT 大按钮 -->
                        <view class="convert-button" @click="handleConvert">
                            <text class="convert-button-text">CONVERT</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 获取状态栏高度
let statusBarHeight = 0;

// 当前激活的标签页
const activeTab = ref('receive');

// RECEIVE 相关数据
const selectedCurrency = ref('usdt');
const rechargeAmount = ref('');
const uploadedImage = ref('');

// SEND 相关数据
const selectedSendCurrency = ref('usdt');
const withdrawalAddress = ref('');
const withdrawalAmount = ref('');

// CONVERT 相关数据
const selectedConvertCurrency = ref('usdt');
const convertFromAmount = ref('');

// 计算转换后的金额（这里假设1:1的汇率，实际应该从API获取）
const convertToAmount = computed(() => {
    if (!convertFromAmount.value || parseFloat(convertFromAmount.value) <= 0) {
        return '0.00';
    }
    return convertFromAmount.value;
});

// 切换标签页
const switchTab = (tab) => {
    activeTab.value = tab;
    console.log('切换到标签页:', tab);
};

// RECEIVE 相关方法
const selectCurrency = (currency) => {
    selectedCurrency.value = currency;
    console.log('选择货币:', currency);
};

const chooseImage = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            uploadedImage.value = res.tempFilePaths[0];
            console.log('选择图片:', res.tempFilePaths[0]);
        },
        fail: (err) => {
            console.error('选择图片失败:', err);
        }
    });
};

const handleRecharge = () => {
    if (!uploadedImage.value) {
        uni.showToast({
            title: '请先上传转账截图',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    if (!rechargeAmount.value || parseFloat(rechargeAmount.value) <= 0) {
        uni.showToast({
            title: '请输入有效的充值金额',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    console.log('充值信息:', {
        currency: selectedCurrency.value,
        amount: rechargeAmount.value,
        image: uploadedImage.value
    });
    
    uni.showToast({
        title: '充值申请已提交',
        icon: 'success',
        duration: 2000
    });
};

// SEND 相关方法
const selectSendCurrency = (currency) => {
    selectedSendCurrency.value = currency;
    console.log('选择发送货币:', currency);
};

const setMaxAmount = () => {
    // 这里应该设置用户的最大可用余额
    withdrawalAmount.value = '100.00'; // 示例值
    console.log('设置最大金额');
};

const handleSend = () => {
    if (!withdrawalAddress.value.trim()) {
        uni.showToast({
            title: '请输入提取地址',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    if (!withdrawalAmount.value || parseFloat(withdrawalAmount.value) <= 0) {
        uni.showToast({
            title: '请输入有效的提取金额',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    console.log('提取信息:', {
        currency: selectedSendCurrency.value,
        address: withdrawalAddress.value,
        amount: withdrawalAmount.value
    });
    
    uni.showToast({
        title: '提取申请已提交',
        icon: 'success',
        duration: 2000
    });
};

// CONVERT 相关方法
const selectConvertCurrency = (currency) => {
    selectedConvertCurrency.value = currency;
    console.log('选择转换货币:', currency);
};

const setMaxConvertAmount = () => {
    // 这里应该设置用户的最大可用USDC余额
    convertFromAmount.value = '500.00'; // 示例值
    console.log('设置最大转换金额');
};

const onConvertAmountChange = () => {
    // 当输入金额变化时，自动计算转换结果
    console.log('转换金额变化:', convertFromAmount.value);
};

const handleConvert = () => {
    if (!convertFromAmount.value || parseFloat(convertFromAmount.value) <= 0) {
        uni.showToast({
            title: '请输入有效的转换金额',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    console.log('转换信息:', {
        fromCurrency: 'USDC',
        toCurrency: 'USDT',
        amount: convertFromAmount.value
    });
    
    uni.showToast({
        title: '转换申请已提交',
        icon: 'success',
        duration: 2000
    });
};

// 其他现有方法...
const goToTransactionRecord = () => {
    console.log('跳转到交易记录页面');
    uni.navigateTo({
        url: '/pages/record/index'
    });
};

const goToRevenueRecord = () => {
    console.log('跳转到收益记录页面');
    uni.navigateTo({
        url: '/pages/record/index'
    });
};

onMounted(() => {
    try {
        const systemInfo = uni.getSystemInfoSync();
        statusBarHeight = systemInfo.statusBarHeight || 0;
    } catch (e) {
        console.error('获取状态栏高度失败', e);
    }
});
</script>

<style lang="scss">
/* 整体容器 - 控制整个account页面的基本布局 */
.account-container {
    min-height: 100vh; // 最小高度为整个视口高度
    position: relative; // 相对定位，为内部元素提供参考
    overflow-x: hidden; // 隐藏水平滚动条
}

/* 背景渐变区域 - 控制页面背景的渐变效果 */
.gradient-bg {
    position: fixed; // 固定定位，背景不随内容滚动
    top: 0; // 距离顶部0像素
    left: 0; // 距离左侧0像素
    right: 0; // 距离右侧0像素
    height: 100vh; // 高度为视口高度的100%
    background: linear-gradient(to bottom,
            #0055ff 0%, // 顶部深蓝色
            #76b8ff 40%, // 渐变到浅蓝色
            #c9d6e5 50%, // 继续渐变到更浅的蓝色
            #ffffff 60%, // 在50%处变为白色
            #ffffff 100% // 下半部分保持白色
        ); // 上方50%蓝白渐变，下方50%纯白色
    z-index: 0; // z轴位置最低，作为背景
}

/* 内容区域 - 控制两个框的容器 */
.content-area {
    position: relative; // 相对定位
    z-index: 1; // 位于背景之上
    padding: 60rpx 40rpx; // 内边距：上下60rpx，左右40rpx
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直方向排列
    align-items: center; // 水平居中对齐
    justify-content: center; // 垂直居中对齐
    min-height: 100vh; // 最小高度为视口高度
    margin-top: 8vh; // 向上移动15vh
    gap: 40rpx; // 两个框之间的间距
}

/* 上方大框 - 控制上方较大的框 */
.upper-box {
    width: 100%; // 宽度为容器的95%
    background-color: #ffffff; // 背景色为白色
    border-radius: 10rpx; // 圆角20rpx
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1); // 添加阴影效果
    overflow: hidden; // 确保内容不会溢出圆角
    padding: 0; // 移除整体padding，让子元素自己控制
}

/* 顶部导航栏 - 控制Transaction Record和Revenue Record区域 */
.top-nav {
    background-color: #f8e1c0; // 浅橙色背景
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: space-around; // 平均分布
    padding: 22rpx; // 内边距25rpx
    height: 40rpx; // 固定高度
}

/* 导航项 - 控制每个导航选项 */
.nav-item {
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    cursor: pointer; // 鼠标指针样式
    flex: 1; // 占用相等空间
    justify-content: center; // 居中对齐

    &:hover {
        opacity: 0.8; // 悬停时透明度变化
    }
}

/* 导航文字 - 控制导航项的文字样式 */
.nav-text {
    font-size: 26rpx; // 字体大小26rpx
    color: #333333; // 字体颜色深灰色
    font-weight: 500; // 字体粗细
    margin-right: 8rpx; // 右边距8rpx，与箭头保持距离
}

/* 导航箭头 - 控制">"符号的样式 */
.nav-arrow {
    font-size: 24rpx; // 字体大小24rpx
    color: #666666; // 字体颜色中灰色
    font-weight: bold; // 字体加粗
}

/* 导航分隔符 - 控制中间的"|"分隔符 */
.nav-divider {
    font-size: 30rpx; // 字体大小30rpx
    color: #999999; // 字体颜色浅灰色
    margin: 0 20rpx; // 左右边距20rpx
}

/* 余额显示区域 - 控制下方渐变背景区域 */
.balance-area {
    background: linear-gradient(90deg, #fd9a5c, #fbe6b7); // 从左到右橙色渐变
    padding: 30rpx; // 内边距30rpx
    position: relative; // 相对定位
}

/* 余额信息 - 控制Available Balance显示 */
.balance-info {
    margin-bottom: 30rpx; // 底部边距30rpx
}

/* 余额标签 - 控制"Available Balance(USDT)"文字 */
.balance-label {
    display: block; // 块级元素，独占一行
    font-size: 26rpx; // 字体大小26rpx
    color: #333333; // 字体颜色深灰色
    margin-bottom: 10rpx; // 底部边距10rpx
    font-weight: 500; // 字体粗细
}

/* 余额金额 - 控制"$0.00"金额显示 */
.balance-amount {
    display: block; // 块级元素，独占一行
    font-size: 48rpx; // 字体大小48rpx，突出显示
    color: #333333; // 字体颜色深灰色
    font-weight: bold; // 字体加粗
}

/* 收益统计板块 - 控制底部的统计信息板块 */
.revenue-stats {
    background-color: #f8f9fa; // 浅灰白色背景
    border-radius: 12rpx; // 圆角12rpx
    padding: 25rpx; // 内边距25rpx
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: space-around; // 平均分布
}

/* 统计项 - 控制每个统计数据项 */
.stat-item {
    flex: 1; // 占用相等空间
    text-align: center; // 文字居中对齐
}

/* 统计标签 - 控制统计项的标签文字 */
.stat-label {
    display: block; // 块级元素，独占一行
    font-size: 22rpx; // 字体大小22rpx
    color: #666666; // 字体颜色中灰色
    margin-bottom: 8rpx; // 底部边距8rpx
}

/* 统计数值 - 控制统计项的数值 */
.stat-value {
    display: block; // 块级元素，独占一行
    font-size: 28rpx; // 字体大小28rpx
    color: #333333; // 字体颜色深灰色
    font-weight: 600; // 字体粗细
}

/* 统计分隔符 - 控制统计项之间的"|"分隔符 */
.stat-divider {
    font-size: 24rpx; // 字体大小24rpx
    color: #cccccc; // 字体颜色浅灰色
    margin: 0 15rpx; // 左右边距15rpx
}

/* 下方小框 - 控制下方较小的框 */
.lower-box {
    width: 85%; // 宽度为容器的85%，比上方框小
    background-color: #ffffff; // 背景色为白色
    border-radius: 10rpx; // 圆角15rpx，比上方框小一些
    box-shadow: 0 6rpx 25rpx rgba(0, 0, 0, 0.08); // 阴影效果稍微轻一些
    padding: 40rpx 30rpx; // 内边距：上下40rpx，左右30rpx
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直方向排列
    align-items: stretch; // 拉伸对齐，让子元素占满宽度
}

/* 选择标题 - 控制"Select a Deposit and withdrawal method"文字 */
.selection-title {
    font-size: 24rpx; // 很小的字体
    color: #666666; // 中灰色
    text-align: center; // 居中对齐
    margin-bottom: 30rpx; // 底部间距30rpx
    font-weight: 400; // 正常字重
}

/* 选项容器 - 控制两个选择项的容器 */
.options-container {
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直方向排列
    gap: 20rpx; // 两个选项之间的间距
    margin-bottom: 30rpx; // 底部间距30rpx
}

/* 单个选项 - 控制每个选择项 */
.option-item {
    background-color: #f8f9fa; // 浅灰白色背景
    border-radius: 12rpx; // 圆角12rpx
    padding: 25rpx 20rpx; // 内边距：上下25rpx，左右20rpx
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: space-between; // 两端对齐
    cursor: pointer; // 鼠标指针样式
    border: 2rpx solid transparent; // 默认透明边框
    transition: all 0.3s ease; // 过渡动画

    &.selected {
        border-color: #999999; // 选中时灰色边框
        background-color: #f0f0f0; // 选中时稍微深一点的背景
    }

    &:hover {
        background-color: #f0f0f0; // 悬停时背景色变化
    }
}

/* 选项左侧内容 - 包含图标和文字 */
.option-left {
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    flex: 1; // 占用剩余空间
}

/* 选项文字 - 控制选项的文字样式 */
.option-text {
    font-size: 23rpx; // 字体大小28rpx
    color: #333333; // 深灰色
    margin-left: 15rpx; // 左边距15rpx，与图标保持距离
    font-weight: 400; // 字体粗细
}

/* 选中指示器容器 - 控制右侧蓝色圆圈的容器 */
.option-indicator {
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
}

/* 蓝色圆圈 - 控制选中时的蓝色圆圈 */
.blue-circle {
    width: 20rpx; // 宽度20rpx
    height: 20rpx; // 高度20rpx
    background-color: #007aff; // 蓝色背景
    border-radius: 50%; // 圆形
    border: 3rpx solid #ffffff; // 白色边框
    box-shadow: 0 0 0 2rpx #007aff; // 外层蓝色阴影，形成双圈效果
}

/* 说明文字 - 控制底部的说明文字 */
.description-text {
    font-size: 20rpx; // 很小很小的字体
    color: #999999; // 浅灰色
    line-height: 1.6; // 行高1.6
    text-align: justify; // 两端对齐
    margin-bottom: 40rpx; // 底部间距40rpx（大一点点）
    font-weight: 300; // 较细的字重
}

/* NEXT按钮 - 控制底部的NEXT按钮 */
.next-button {
    background-color: #5dade2; // 浅蓝色背景
    border-radius: 12rpx; // 圆角12rpx
    padding: 18rpx 0; // 内边距：上下18rpx，左右0
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    cursor: pointer; // 鼠标指针样式
    transition: all 0.3s ease; // 过渡动画
    margin-top: 10rpx; // 顶部间距10rpx

    &:hover {
        background-color: #3498db; // 悬停时更深的蓝色
        transform: translateY(-2rpx); // 悬停时轻微上移
    }

    &:active {
        transform: translateY(0); // 点击时恢复位置
        background-color: #2980b9; // 点击时最深的蓝色
    }
}

/* NEXT按钮文字 - 控制按钮中的文字样式 */
.next-button-text {
    font-size: 32rpx; // 字体大小32rpx
    color: #ffffff; // 白色文字
    font-weight: 600; // 字体加粗
    letter-spacing: 2rpx; // 字母间距2rpx
}

/* 新增的操作框 - 与上方大框宽度一致 */
.operation-box {
    width: 100%; // 与上方大框宽度一致
    background-color: #ffffff; // 背景色为白色
    border-radius: 10rpx; // 圆角10rpx
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1); // 添加阴影效果
    overflow: hidden; // 确保内容不会溢出圆角
    padding: 0; // 移除整体padding
}

/* 操作标签页 - 控制三个按钮的容器 */
.operation-tabs {
    display: flex; // 使用flex布局
    background-color: #f8f9fa; // 浅灰色背景
    border-bottom: 1rpx solid #e0e0e0; // 底部边框
}

/* 标签页项 - 控制每个按钮 */
.tab-item {
    flex: 1; // 平均分配空间
    padding: 25rpx 0; // 内边距：上下25rpx
    text-align: center; // 文字居中
    cursor: pointer; // 鼠标指针样式
    transition: all 0.3s ease; // 过渡动画
    border-bottom: 3rpx solid transparent; // 默认透明底边框

    &.active {
        background-color: #ffffff; // 激活时白色背景
        border-bottom-color: #007aff; // 激活时蓝色底边框

        .tab-text {
            color: #007aff; // 激活时蓝色文字
            font-weight: 600; // 激活时字体加粗
        }
    }

    &:hover {
        background-color: rgba(255, 255, 255, 0.5); // 悬停时半透明白色背景
    }
}

/* 标签页文字 - 控制按钮文字样式 */
.tab-text {
    font-size: 28rpx; // 字体大小28rpx
    color: #666666; // 默认灰色文字
    font-weight: 500; // 字体粗细
    transition: all 0.3s ease; // 过渡动画
}

/* 标签页内容 - 控制每个标签页的内容区域 */
.tab-content {
    padding: 40rpx 30rpx; // 内边距：上下40rpx，左右30rpx
}

/* 区域标题 - 控制"Currency Type"等标题 */
.section-title {
    font-size: 30rpx; // 字体大小30rpx
    color: #333333; // 深灰色
    font-weight: 600; // 字体加粗
    margin-bottom: 25rpx; // 底部边距25rpx
    display: block; // 块级元素
}

/* 货币按钮容器 - 控制四个货币图标的容器 */
.currency-buttons {
    display: flex; // 使用flex布局
    justify-content: space-around; // 平均分布
    margin-bottom: 30rpx; // 底部边距30rpx
}

/* 货币项 - 控制每个货币图标按钮 */
.currency-item {
    width: 80rpx; // 宽度80rpx
    height: 80rpx; // 高度80rpx
    background-color: #f8f9fa; // 浅灰色背景
    border-radius: 50%; // 圆形
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    cursor: pointer; // 鼠标指针样式
    border: 2rpx solid transparent; // 默认透明边框
    transition: all 0.3s ease; // 过渡动画

    &.selected {
        border-color: #007aff; // 选中时蓝色边框
        background-color: rgba(0, 122, 255, 0.1); // 选中时浅蓝色背景
    }

    &:hover {
        background-color: #e9ecef; // 悬停时背景色变化
        transform: scale(1.05); // 悬停时略微放大
    }
}

/* 分割线 - 控制分割线样式 */
.divider-line {
    width: 100%; // 宽度100%
    height: 2rpx; // 高度2rpx
    background-color: #e0e0e0; // 浅灰色
    margin: 30rpx 0; // 上下边距30rpx
}

/* 充值区域 - 控制充值相关内容的容器 */
.recharge-section {
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直方向排列
    gap: 20rpx; // 元素之间的间距
}

/* 充值标题 - 控制"USDT recharge"标题区域 */
.recharge-header {
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    gap: 15rpx; // 图标和文字间距
}

/* 充值标题文字 - 控制"USDT recharge"文字 */
.recharge-title {
    font-size: 28rpx; // 字体大小28rpx
    color: #333333; // 深灰色
    font-weight: 500; // 字体粗细
}

/* 网络按钮 - 控制"ERC20"按钮 */
.network-button {
    align-self: flex-start; // 左对齐
    background-color: #e3f2fd; // 浅蓝色背景
    border: 1rpx solid #2196f3; // 蓝色边框
    border-radius: 20rpx; // 圆角20rpx
    padding: 10rpx 25rpx; // 内边距：上下10rpx，左右25rpx
}

/* 网络按钮文字 - 控制"ERC20"文字 */
.network-text {
    font-size: 24rpx; // 字体大小24rpx
    color: #2196f3; // 蓝色文字
    font-weight: 500; // 字体粗细
}

/* 上传区域 - 控制图片上传区域 */
.upload-area {
    border: 2rpx dashed #cccccc; // 虚线边框
    border-radius: 15rpx; // 圆角15rpx
    padding: 60rpx; // 内边距60rpx
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直方向排列
    align-items: center; // 水平居中对齐
    justify-content: center; // 垂直居中对齐
    cursor: pointer; // 鼠标指针样式
    transition: all 0.3s ease; // 过渡动画
    position: relative; // 相对定位

    &:hover {
        border-color: #007aff; // 悬停时蓝色边框
        background-color: rgba(0, 122, 255, 0.05); // 悬停时浅蓝色背景
    }
}

/* 上传文字 - 控制上传提示文字 */
.upload-text {
    font-size: 26rpx; // 字体大小26rpx
    color: #999999; // 浅灰色
    margin-top: 15rpx; // 顶部边距15rpx
}

/* 已上传图片 - 控制已上传的图片样式 */
.uploaded-image {
    position: absolute; // 绝对定位
    top: 0; // 距离顶部0
    left: 0; // 距离左侧0
    width: 100%; // 宽度100%
    height: 100%; // 高度100%
    object-fit: cover; // 覆盖整个容器
    border-radius: 13rpx; // 圆角13rpx，略小于容器
}

/* 金额标签 - 控制"Recharge amount"标签 */
.amount-label {
    font-size: 28rpx; // 字体大小28rpx
    color: #333333; // 深灰色
    font-weight: 500; // 字体粗细
    margin-bottom: 15rpx; // 底部边距15rpx
}

/* 金额输入框 - 控制金额输入框样式 */
.amount-input {
    border: 1rpx solid #e0e0e0; // 浅灰色边框
    border-radius: 10rpx; // 圆角10rpx
    padding: 25rpx 20rpx; // 内边距：上下25rpx，左右20rpx
    font-size: 28rpx; // 字体大小28rpx
    color: #333333; // 深灰色
    background-color: #ffffff; // 白色背景

    &:focus {
        border-color: #007aff; // 聚焦时蓝色边框
        outline: none; // 移除默认聚焦样式
    }
}

/* 说明文字 - 控制长段说明文字 */
.notice-text {
    font-size: 22rpx; // 字体大小22rpx
    color: #666666; // 中灰色
    line-height: 1.6; // 行高1.6
    text-align: justify; // 两端对齐
    margin-top: 25rpx; // 顶部边距25rpx
}

/* 占位文字 - 控制其他标签页的占位内容 */
.placeholder-text {
    font-size: 28rpx; // 字体大小28rpx
    color: #999999; // 浅灰色
    text-align: center; // 居中对齐
    padding: 60rpx 0; // 内边距：上下60rpx
}
.recharge-button {
    background-color: #5dade2; // 浅蓝色背景
    border-radius: 12rpx; // 圆角12rpx
    padding: 20rpx 0; // 内边距：上下20rpx，左右0
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    cursor: pointer; // 鼠标指针样式
    transition: all 0.3s ease; // 过渡动画
    margin-top: 30rpx; // 顶部间距30rpx
    width: 100%; // 宽度100%
    
    &:hover {
        background-color: #3498db; // 悬停时更深的蓝色
        transform: translateY(-2rpx); // 悬停时轻微上移
        box-shadow: 0 4rpx 15rpx rgba(52, 152, 219, 0.3); // 悬停时添加阴影
    }
    
    &:active {
        transform: translateY(0); // 点击时恢复位置
        background-color: #2980b9; // 点击时最深的蓝色
    }
}

/* RECHARGE按钮文字 - 控制按钮中的文字样式 */
.recharge-button-text {
    font-size: 32rpx; // 字体大小32rpx
    color: #ffffff; // 白色文字
    font-weight: 600; // 字体加粗
    letter-spacing: 2rpx; // 字母间距2rpx
}

/* SEND 相关样式 */
.send-section {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.send-header {
    display: flex;
    align-items: center;
    gap: 15rpx;
}

.send-title {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.input-label {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 15rpx;
    margin-top: 10rpx;
}

.address-input {
    border: 1rpx solid #e0e0e0;
    border-radius: 10rpx;
    padding: 25rpx 20rpx;
    font-size: 28rpx;
    color: #333333;
    background-color: #ffffff;
    
    &:focus {
        border-color: #007aff;
        outline: none;
    }
}

.quantity-input-container {
    display: flex;
    align-items: center;
    border: 1rpx solid #e0e0e0;
    border-radius: 10rpx;
    background-color: #ffffff;
    
    &:focus-within {
        border-color: #007aff;
    }
}

.quantity-input {
    flex: 1;
    border: none;
    padding: 25rpx 20rpx;
    font-size: 28rpx;
    color: #333333;
    background-color: transparent;
    
    &:focus {
        outline: none;
    }
}

.max-button {
    background-color: #f5f5f5;
    border-radius: 8rpx;
    padding: 12rpx 20rpx;
    margin-right: 15rpx;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #e0e0e0;
    }
}

.max-text {
    font-size: 24rpx;
    color: #007aff;
    font-weight: 500;
}

.send-button {
    background-color: #5dade2;
    border-radius: 12rpx;
    padding: 20rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 30rpx;
    width: 100%;
    
    &:hover {
        background-color: #3498db;
        transform: translateY(-2rpx);
        box-shadow: 0 4rpx 15rpx rgba(52, 152, 219, 0.3);
    }
    
    &:active {
        transform: translateY(0);
        background-color: #2980b9;
    }
}

.send-button-text {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 2rpx;
}

/* CONVERT 相关样式 */
.convert-section {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.convert-header {
    display: flex;
    align-items: center;
    gap: 15rpx;
}

.convert-title {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.convert-input-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1rpx solid #e0e0e0;
    border-radius: 10rpx;
    padding: 25rpx 20rpx;
    background-color: #ffffff;
}

.currency-info {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.currency-name {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.amount-input-wrapper {
    display: flex;
    align-items: center;
    gap: 15rpx;
    flex: 1;
    justify-content: flex-end;
}

.convert-amount-input {
    border: none;
    font-size: 28rpx;
    color: #333333;
    text-align: right;
    background-color: transparent;
    width: 200rpx;
    
    &:focus {
        outline: none;
    }
}

.amount-display {
    display: flex;
    align-items: center;
}

.convert-result {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.convert-button {
    background-color: #5dade2;
    border-radius: 12rpx;
    padding: 20rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 30rpx;
    width: 100%;
    
    &:hover {
        background-color: #3498db;
        transform: translateY(-2rpx);
        box-shadow: 0 4rpx 15rpx rgba(52, 152, 219, 0.3);
    }
    
    &:active {
        transform: translateY(0);
        background-color: #2980b9;
    }
}

.convert-button-text {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 2rpx;
}

/* WITHDRAW按钮 - 控制SEND标签页的提取按钮 */
.withdraw-button {
    background-color: #5dade2; // 浅蓝色背景
    border-radius: 12rpx; // 圆角12rpx
    padding: 20rpx 0; // 内边距：上下20rpx，左右0
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    cursor: pointer; // 鼠标指针样式
    transition: all 0.3s ease; // 过渡动画
    margin-top: 30rpx; // 顶部间距30rpx
    width: 100%; // 宽度100%
    
    &:hover {
        background-color: #3498db; // 悬停时更深的蓝色
        transform: translateY(-2rpx); // 悬停时轻微上移
        box-shadow: 0 4rpx 15rpx rgba(52, 152, 219, 0.3); // 悬停时添加阴影
    }
    
    &:active {
        transform: translateY(0); // 点击时恢复位置
        background-color: #2980b9; // 点击时最深的蓝色
    }
}

/* WITHDRAW按钮文字 - 控制按钮中的文字样式 */
.withdraw-button-text {
    font-size: 32rpx; // 字体大小32rpx
    color: #ffffff; // 白色文字
    font-weight: 600; // 字体加粗
    letter-spacing: 2rpx; // 字母间距2rpx
}
</style>