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
            
            <!-- 下方小框 - 存取款方式选择 -->
            <view class="lower-box">
                <!-- 标题 -->
                <text class="selection-title">Select a Deposit and withdrawal method</text>
                
                <!-- 选择选项 -->
                <view class="options-container">
                    <!-- 加密货币选项 -->
                    <view class="option-item" 
                          :class="{'selected': selectedMethod === 'crypto'}"
                          @click="selectMethod('crypto')">
                        <view class="option-left">
                            <uni-icons type="wallet" size="24" color="#666666"></uni-icons>
                            <text class="option-text">Cryptocurrency deposits withdrawal</text>
                        </view>
                        <view class="option-indicator" v-if="selectedMethod === 'crypto'">
                            <view class="blue-circle"></view>
                        </view>
                    </view>
                    
                    <!-- 银行卡选项 -->
                    <view class="option-item" 
                          :class="{'selected': selectedMethod === 'bankcard'}"
                          @click="selectMethod('bankcard')">
                        <view class="option-left">
                            <uni-icons type="wallet" size="24" color="#666666"></uni-icons>
                            <text class="option-text">Bankcard withdrawal</text>
                        </view>
                        <view class="option-indicator" v-if="selectedMethod === 'bankcard'">
                            <view class="blue-circle"></view>
                        </view>
                    </view>
                </view>
                
                <!-- 说明文字 -->
                <text class="description-text">
                    The USDT withdrawn will arrive at your wallet address within 24 hours after applying for withdrawal. The minimum single withdrawal is 30USDT, and the withdrawal fee is 3 USDT of the withdrawal amount.
                </text>
                
                <!-- NEXT按钮 -->
                <view class="next-button" @click="handleNext">
                    <text class="next-button-text">NEXT</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 获取状态栏高度
let statusBarHeight = 0;

// 选中的存取款方式
const selectedMethod = ref('');

// 选择存取款方式
const selectMethod = (method) => {
    selectedMethod.value = method;
    console.log('选择的方式:', method);
};

// 处理NEXT按钮点击
const handleNext = () => {
    if (!selectedMethod.value) {
        uni.showToast({
            title: '请选择存取款方式',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    console.log('进入下一步，选择的方式:', selectedMethod.value);
    // 后续添加跳转逻辑
    // uni.navigateTo({
    //     url: '/pages/withdrawal/index?method=' + selectedMethod.value
    // });
};

// 跳转到交易记录页面
const goToTransactionRecord = () => {
    console.log('跳转到交易记录页面');
    // 后续添加跳转逻辑
    uni.navigateTo({
        url: '/pages/record/index'
    });
};

// 跳转到收益记录页面
const goToRevenueRecord = () => {
    console.log('跳转到收益记录页面');
    // 后续添加跳转逻辑
    uni.navigateTo({
        url: '/pages/record/index'
    });
};

// 页面加载时获取系统信息
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
    margin-top: -15vh; // 向上移动15vh
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
</style>