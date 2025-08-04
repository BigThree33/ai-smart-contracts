<template>
    <view class="borrow-container">
        <!-- 背景渐变区域 -->
        <view class="gradient-bg"></view>
        
        <!-- 内容区域 -->
        <view class="content-area">
            <!-- 主要信息大框 -->
            <view class="main-info-box">
                <!-- 标题 -->
                <text class="main-title">In the monetary</text>
                
                <!-- 金额显示 -->
                <text class="amount-display">0.00/USDT</text>
                
                <!-- To repay 按钮 -->
                <view class="repay-button" @click="handleRepay">
                    <text class="repay-button-text">To repay</text>
                </view>
                
                <!-- 统计信息区域 -->
                <view class="stats-section">
                    <!-- 左侧：累计借款 -->
                    <view class="stat-item left">
                        <text class="stat-title">The cumulative monetary(USDT)</text>
                        <text class="stat-value">0.00</text>
                    </view>
                    
                    <!-- 右侧：未还款次数 -->
                    <view class="stat-item right">
                        <text class="stat-title">Number of outstanding payments</text>
                        <text class="stat-value">0</text>
                    </view>
                </view>
            </view>
            
            <!-- 新增借款输入框 -->
            <view class="borrow-input-box">
                <!-- 顶部标题行 -->
                <view class="input-header">
                    <!-- 左侧标题 -->
                    <view class="left-section">
                        <text class="input-title">Amount Borrowed(USDT)</text>
                        <input class="amount-input" 
                               v-model="borrowAmount" 
                               placeholder="Please enter amount" 
                               type="number" />
                    </view>
                    
                    <!-- 右侧标题 -->
                    <view class="right-section">
                        <text class="input-title">Credit cycle(days)</text>
                        <view class="cycle-selector" @click="showCycleOptions">
                            <text class="cycle-value">{{ selectedCycle }}</text>
                            <uni-icons type="right" size="16" color="#666666"></uni-icons>
                        </view>
                    </view>
                </view>
            </view>
            
            <!-- 贷款详情框 -->
            <view class="loan-details-box">
                <!-- 日利率 -->
                <view class="detail-row">
                    <text class="detail-label">Daily rate</text>
                    <text class="detail-value">{{ dailyRate }}</text>
                </view>
                
                <!-- 分割线 -->
                <view class="detail-divider"></view>
                
                <!-- 还款方式 -->
                <view class="detail-row">
                    <text class="detail-label">Reimbursement means</text>
                    <text class="detail-value">The principal and interest will be repaid once due</text>
                </view>
                
                <!-- 分割线 -->
                <view class="detail-divider"></view>
                
                <!-- 利息 -->
                <view class="detail-row">
                    <text class="detail-label">Interest</text>
                    <text class="detail-value">{{ calculatedInterest }}</text>
                </view>
                
                <!-- 分割线 -->
                <view class="detail-divider"></view>
                
                <!-- 放贷方 -->
                <view class="detail-row">
                    <text class="detail-label">Lenders</text>
                    <text class="detail-value">Intercontinental Exchange</text>
                </view>
            </view>

            <!-- 信贷贷款照片上传区域 -->
            <view class="upload-section">
                <!-- 标题 -->
                <text class="upload-title">Credit Loan(photo upload)</text>
                
                <!-- 照片上传框 -->
                <view class="upload-container">
                    <!-- 照片上传项 -->
                    <view class="upload-item" 
                          v-for="(item, index) in uploadItems" 
                          :key="index"
                          @click="selectImage(index)">
                        <view class="upload-content">
                            <!-- 已上传的图片 -->
                            <image v-if="item.image" 
                                   :src="item.image" 
                                   class="uploaded-photo"
                                   mode="aspectFill"></image>
                            <!-- 未上传时显示相机图标 -->
                            <view v-else class="upload-placeholder">
                                <uni-icons type="camera" size="40" color="#cccccc"></uni-icons>
                            </view>
                        </view>
                        <!-- 右上角提示文字 -->
                        <view class="upload-tip">
                            <text class="tip-text">{{ item.tip }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
        <!-- 周期选择弹窗 -->
        <view v-if="showCycleModal" class="cycle-modal" @click="hideCycleOptions">
            <view class="cycle-modal-content" @click.stop>
                <view class="cycle-option" 
                      v-for="option in cycleOptions" 
                      :key="option.value"
                      @click="selectCycle(option)">
                    <text class="cycle-option-text">{{ option.label }}</text>
                </view>
                <view class="cycle-option cancel" @click="hideCycleOptions">
                    <text class="cycle-option-text">cancel</text>
                </view>
            </view>
        </view>
        
        <!-- 底部固定区域 -->
        <view class="bottom-fixed-area">
            <!-- 协议勾选行 -->
            <view class="agreement-row">
                <view class="checkbox-container" @click="toggleAgreement">
                    <view class="checkbox" :class="{ 'checked': isAgreed }">
                        <uni-icons v-if="isAgreed" type="checkmarkempty" size="16" color="#ffffff"></uni-icons>
                    </view>
                </view>
                <text class="agreement-text">I have read and agree Apply for a currency agreement</text>
            </view>
            
            <!-- 申请按钮 -->
            <view class="apply-button" 
                  :class="{ 'disabled': !isAgreed }" 
                  @click="handleApply">
                <text class="apply-button-text">Click Apply for credit</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 获取状态栏高度
let statusBarHeight = 0;

// 借款金额
const borrowAmount = ref('');

// 选中的周期
const selectedCycle = ref('15');

// 是否显示周期选择弹窗
const showCycleModal = ref(false);

// 是否同意协议
const isAgreed = ref(false);

// 周期选项
const cycleOptions = [
    { value: '7', label: '7' },
    { value: '15', label: '15' },
    { value: '30', label: '30' }
];

// 照片上传项目
const uploadItems = ref([
    { tip: '1.ID card/driver license', image: '' },
    { tip: '2.Payroll', image: '' },
    { tip: '3.Proof of real estate', image: '' },
    { tip: '4.Credit score', image: '' },
    { tip: '5.Proof of property', image: '' },
    { tip: '6.Guarantor Information', image: '' }
]);

// 计算日利率
const dailyRate = computed(() => {
    const cycle = parseInt(selectedCycle.value);
    switch (cycle) {
        case 7:
            return '0.028%';
        case 15:
            return '0.018%';
        case 30:
            return '0.012%';
        default:
            return '0.018%';
    }
});

// 计算利息
const calculatedInterest = computed(() => {
    const amount = parseFloat(borrowAmount.value) || 0;
    const cycle = parseInt(selectedCycle.value);
    
    if (amount === 0) {
        return '0.0000';
    }
    
    let rate;
    switch (cycle) {
        case 7:
            rate = 0.00028;
            break;
        case 15:
            rate = 0.00018;
            break;
        case 30:
            rate = 0.00012;
            break;
        default:
            rate = 0.00018;
    }
    
    const interest = amount * rate * cycle;
    return interest.toFixed(4);
});

// 切换协议同意状态
const toggleAgreement = () => {
    isAgreed.value = !isAgreed.value;
    console.log('Agreement status:', isAgreed.value);
};

// 处理申请按钮点击
const handleApply = () => {
    if (!isAgreed.value) {
        uni.showToast({
            title: 'please agree to the agreement first',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    // 检查必填信息
    if (!borrowAmount.value || parseFloat(borrowAmount.value) <= 0) {
        uni.showToast({
            title: 'please enter a valid loan amount',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    // 检查是否上传了必要的照片
    const uploadedCount = uploadItems.value.filter(item => item.image).length;
    if (uploadedCount < 6) {
        uni.showToast({
            title: `please upload all necessary documents (${uploadedCount}/6)`,
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    console.log('apply for credit:', {
        amount: borrowAmount.value,
        cycle: selectedCycle.value,
        dailyRate: dailyRate.value,
        interest: calculatedInterest.value,
        uploadedPhotos: uploadedCount
    });
    
    uni.showToast({
        title: 'credit application submitted',
        icon: 'success',
        duration: 2000
    });
};

// 选择图片
const selectImage = (index) => {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            uploadItems.value[index].image = res.tempFilePaths[0];
            console.log(`upload the ${index + 1}th image:`, res.tempFilePaths[0]);
            uni.showToast({
                title: 'image upload successful',
                icon: 'success',
                duration: 1500
            });
        },
        fail: (err) => {
            console.error('failed to select image:', err);
            uni.showToast({
                title: 'failed to select image',
                icon: 'none',
                duration: 2000
            });
        }
    });
};

// 处理还款按钮点击
const handleRepay = () => {
    console.log('Click repayment button');
    uni.showToast({
        title: 'jump to repayment page',
        icon: 'none',
        duration: 2000
    });
};

// 显示周期选择弹窗
const showCycleOptions = () => {
    showCycleModal.value = true;
    console.log('Show cycle selection modal');
};

// 隐藏周期选择弹窗
const hideCycleOptions = () => {
    showCycleModal.value = false;
    console.log('Hide cycle selection modal');
};

// 选择周期
const selectCycle = (option) => {
    selectedCycle.value = option.value;
    showCycleModal.value = false;
    console.log('Select cycle:', option.value);
};

// 页面加载时获取系统信息
onMounted(() => {
    try {
        const systemInfo = uni.getSystemInfoSync();
        statusBarHeight = systemInfo.statusBarHeight || 0;
        console.log('status bar height:', statusBarHeight);
    } catch (e) {
        console.error('failed to get status bar height', e);
    }
});
</script>

<style lang="scss">
/* 背景渐变区域 - 控制页面背景的渐变效果 */
.gradient-bg {
    position: absolute; // 改为absolute，让背景随内容滚动
    top: 0;
    left: 0;
    right: 0;
    height: 40vh; // 只占据40%的视口高度
    background: linear-gradient(to bottom,
        #151524 0%,
        #151524 80%,
        #151524 100%
    ); // 纯黑蓝色背景
    z-index: 0;
}

/* 整体容器 - 控制整个borrow页面的基本布局 */
.borrow-container {
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    background-color: #ffffff; // 设置整体白色背景
}

/* 内容区域 - 控制页面内容的容器 */
.content-area {
    position: relative;
    z-index: 1;
    padding: 40rpx 30rpx 180rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: transparent; // 透明背景，显示下层背景
}

/* 主要信息大框 - 控制透明背景的主要内容容器 */
.main-info-box {
    width: 100%;
    max-width: 550rpx; // 减少最大宽度
    background-color: transparent;
    border-radius: 15rpx; // 减少圆角
    padding: 30rpx 25rpx; // 大幅减少内边距
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx; // 大幅减少元素间距
    margin-top: 20rpx; // 减少顶部外边距
}

/* 主标题 - 控制"In the monetary"标题 */
.main-title {
    font-size: 32rpx; // 减小字体
    color: #ffffff;
    font-weight: 600;
    text-align: center;
    margin-bottom: 10rpx; // 减少底部边距
    letter-spacing: 1rpx; // 减少字母间距
}

/* 金额显示 - 控制"0.00/USDT"显示 */
.amount-display {
    font-size: 40rpx; // 减小字体
    color: #ffffff;
    font-weight: 700;
    text-align: center;
    margin-bottom: 15rpx; // 减少底部边距
    font-family: 'Arial', 'Helvetica', sans-serif;
}

/* To repay 按钮 - 控制椭圆形还款按钮 */
.repay-button {
    background-color: #5dade2;
    border-radius: 35rpx; // 减少圆角
    padding: 15rpx 40rpx; // 减少内边距
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20rpx; // 大幅减少底部边距
    box-shadow: 0 4rpx 15rpx rgba(93, 173, 226, 0.3); // 减少阴影

    &:hover {
        background-color: #3498db;
        transform: translateY(-2rpx); // 减少移动距离
        box-shadow: 0 6rpx 20rpx rgba(52, 152, 219, 0.4);
    }

    &:active {
        transform: translateY(-1rpx);
        background-color: #2980b9;
    }
}

/* To repay 按钮文字 - 控制按钮中的文字样式 */
.repay-button-text {
    font-size: 26rpx; // 减小字体
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 1rpx; // 减少字母间距
}

/* 统计信息区域 - 控制两个统计信息的容器 */
.stats-section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 20rpx; // 减少间距
    margin-top: 10rpx; // 减少顶部边距
}

/* 统计项 - 控制每个统计信息块 */
.stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 15rpx; // 大幅减少内边距
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10rpx; // 减少圆角
    backdrop-filter: blur(10rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.2);

    &.left {
        margin-right: 10rpx; // 减少右边距
    }

    &.right {
        margin-left: 10rpx; // 减少左边距
    }
}

/* 统计标题 - 控制统计信息的标题文字 */
.stat-title {
    font-size: 20rpx; // 减小字体
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin-bottom: 10rpx; // 减少底部边距
    line-height: 1.3; // 减少行高
    font-weight: 500;
}

/* 统计数值 - 控制统计信息的数值显示 */
.stat-value {
    font-size: 28rpx; // 减小字体
    color: #ffffff;
    font-weight: 700;
    text-align: center;
    font-family: 'Arial', 'Helvetica', sans-serif;
}

/* 新增借款输入框 - 控制借款金额和周期输入的容器 */
.borrow-input-box {
    width: 100%;
    max-width: 650rpx;
    background-color: #ffffff;
    border-radius: 15rpx;
    padding: 30rpx 25rpx;
    margin-top: 30rpx;
    box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}

/* 输入框头部 - 控制两个输入区域的容器 */
.input-header {
    display: flex;
    justify-content: space-between;
    gap: 30rpx;
}

/* 左侧区域 - 控制借款金额输入 */
.left-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* 右侧区域 - 控制信贷周期选择 */
.right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* 输入标题 - 控制"Amount Borrowed"和"Credit cycle"标题 */
.input-title {
    font-size: 24rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 15rpx;
    line-height: 1.2;
}

/* 金额输入框 - 控制借款金额输入框 */
.amount-input {
    border: 1rpx solid #e0e0e0;
    border-radius: 8rpx;
    padding: 20rpx 15rpx;
    font-size: 28rpx;
    color: #333333;
    background-color: #f8f9fa;
    
    &:focus {
        border-color: #5dade2;
        outline: none;
        background-color: #ffffff;
    }
}

/* 周期选择器 - 控制周期选择的容器 */
.cycle-selector {
    border: 1rpx solid #e0e0e0;
    border-radius: 8rpx;
    padding: 20rpx 15rpx;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        border-color: #5dade2;
        background-color: #ffffff;
    }
}

/* 周期数值 - 控制显示的周期数字 */
.cycle-value {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

/* 新增贷款详情框 - 控制贷款详情信息的容器 */
.loan-details-box {
    width: 100%;
    max-width: 650rpx;
    background-color: #ffffff;
    border-radius: 15rpx;
    padding: 30rpx 25rpx;
    margin-top: 20rpx;
    box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}

/* 详情行 - 控制每一行信息的容器 */
.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15rpx 0;
    gap: 20rpx;
}

/* 详情标签 - 控制左侧标签文字 */
.detail-label {
    font-size: 26rpx;
    color: #333333;
    font-weight: 500;
    flex-shrink: 0;
    min-width: 200rpx;
}

/* 详情值 - 控制右侧数值文字 */
.detail-value {
    font-size: 26rpx;
    color: #666666;
    font-weight: 400;
    text-align: right;
    flex: 1;
    line-height: 1.4;
}

/* 详情分割线 - 控制每行之间的分割线 */
.detail-divider {
    width: 100%;
    height: 1rpx;
    background-color: #f0f0f0;
    margin: 5rpx 0;
}

.cycle-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.cycle-modal-content {
    background-color: #ffffff;
    border-radius: 15rpx;
    width: 80%;
    max-width: 400rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.3);
}

.cycle-option {
    padding: 40rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:last-child {
        border-bottom: none;
    }
    
    &:hover {
        background-color: #f8f9fa;
    }
    
    &:active {
        background-color: #e9ecef;
    }
    
    &.cancel {
        color: #dc3545;
        border-top: 8rpx solid #f0f0f0;
        
        .cycle-option-text {
            color: #dc3545;
        }
    }
}

.cycle-option-text {
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
    text-align: center;
}

/* 照片上传区域 - 控制整个照片上传部分 */
.upload-section {
    width: 100%;
    max-width: 650rpx;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
}

/* 上传标题 - 控制"Credit Loan(photo upload)"标题 */
.upload-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: 600;
    margin-bottom: 30rpx;
    text-align: center;
    letter-spacing: 1rpx;
}

/* 上传容器 - 控制六个上传项的容器 */
.upload-container {
    background-color: #ffffff;
    border-radius: 15rpx;
    padding: 30rpx 40rpx; // 增加左右内边距
    box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 30rpx; // 增加行间距
}

/* 上传项 - 控制每个照片上传项（一行布局） */
.upload-item {
    width: 100%; // 占据整行
    height: 120rpx; // 减少高度
    display: flex; // 水平布局
    align-items: center; // 垂直居中
    gap: 30rpx; // 图片和文字之间的间距
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:active {
        transform: scale(0.98);
    }
}

/* 上传内容 - 控制图片上传区域 */
.upload-content {
    width: 50%; // 占据50%宽度
    height: 100%; // 占据整个高度
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2rpx dashed #e0e0e0;
    border-radius: 12rpx;
    overflow: hidden;
    transition: all 0.3s ease;
    background-color: #f8f9fa;
    
    &:hover {
        border-color: #5dade2;
        background-color: rgba(93, 173, 226, 0.05);
    }
}

/* 已上传的照片 - 控制显示的图片样式 */
.uploaded-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10rpx;
}

/* 上传占位符 - 控制未上传时的显示 */
.upload-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

/* 上传提示 - 控制右侧的提示文字 */
.upload-tip {
    flex: 1; // 占据剩余空间
    display: flex;
    align-items: center;
    justify-content: flex-start; // 左对齐
    padding-left: 20rpx; // 左侧内边距
}

/* 提示文字 - 控制提示内容的样式 */
.tip-text {
    font-size: 24rpx;
    color: #666666; // 灰色文字
    font-weight: 400;
    line-height: 1.4;
    text-align: left; // 左对齐
}

/* 底部固定区域 - 控制置底的协议和按钮区域 */
.bottom-fixed-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff;
    padding: 25rpx 30rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
    z-index: 9999; // 高层级，盖住其他内容
    border-top: 1rpx solid #f0f0f0;
}

/* 协议勾选行 - 控制协议文字和勾选框的容器 */
.agreement-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    gap: 15rpx;
}

/* 勾选框容器 - 控制勾选框的点击区域 */
.checkbox-container {
    cursor: pointer;
    padding: 5rpx; // 增加点击区域
}

/* 勾选框 - 控制勾选框的样式 */
.checkbox {
    width: 32rpx;
    height: 32rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    background-color: #ffffff;
    
    &.checked {
        background-color: #5dade2;
        border-color: #5dade2;
        
        &:hover {
            background-color: #3498db;
            border-color: #3498db;
        }
    }
    
    &:hover {
        border-color: #5dade2;
    }
}

/* 协议文字 - 控制协议内容的文字样式 */
.agreement-text {
    font-size: 26rpx;
    color: #333333;
    line-height: 1.4;
    flex: 1;
    font-weight: 400;
}

/* 申请按钮 - 控制"Click Apply for credit"按钮 */
.apply-button {
    width: 100%;
    background-color: #5dade2; // 一直保持浅蓝色
    border-radius: 12rpx;
    padding: 25rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4rpx 15rpx rgba(93, 173, 226, 0.3);
    
    &:hover {
        background-color: #3498db; // 悬停时更深的蓝色
        transform: translateY(-2rpx);
        box-shadow: 0 6rpx 20rpx rgba(52, 152, 219, 0.4);
    }
    
    &:active {
        transform: translateY(0);
        background-color: #2980b9; // 点击时最深的蓝色
    }
}

/* 申请按钮文字 - 控制按钮中的文字样式 */
.apply-button-text {
    font-size: 32rpx;
    color: #ffffff; // 一直保持白色文字
    font-weight: 600;
    letter-spacing: 2rpx;
}
</style>