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
                <view class="service-row" @click="toggleCustomerService">
                    <view class="service-left">
                        <uni-icons type="headphones" size="20" color="#3c8dbc"></uni-icons>
                        <text class="service-text">Online Customer Service</text>
                    </view>
                    <text class="expand-arrow" :class="{'rotated': showSubService}">></text>
                </view>

                <!-- 展开的子选项 -->
                <view v-if="showSubService" class="sub-service-row" @click="navigateToChat">
                    <view class="service-left">
                        <uni-icons type="chat" size="20" color="#3c8dbc"></uni-icons>
                        <text class="service-text">Contact Support</text>
                    </view>
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

// 获取状态栏高度
let statusBarHeight = 0;

// 控制客服子选项显示
const showSubService = ref(false);

// 切换客服子选项显示
const toggleCustomerService = () => {
    showSubService.value = !showSubService.value;
};

// 跳转到客服聊天页面
const navigateToChat = () => {
    // 这里可以添加实际的跳转逻辑
    uni.showToast({
        title: '即将跳转到客服页面...',
        icon: 'none',
        duration: 1500
    });
    
    // 后续可以添加实际的跳转代码
    uni.navigateTo({
        url: '/pages/borrow/index'
    });
};

// 原有的联系客服方法（如果还需要的话可以保留）
const contactCustomerService = () => {
    uni.showModal({
        title: '客服联系',
        content: '您确定要联系在线客服吗？',
        success: function (res) {
            if (res.confirm) {
                uni.showToast({
                    title: '正在连接客服...',
                    icon: 'none',
                    duration: 2000
                });

                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/chat/index'
                    });
                }, 1000);
            }
        }
    });
};

// 获取状态栏高度
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
</style>
