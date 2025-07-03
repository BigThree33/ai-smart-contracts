<template>
    <view class="help-container">
        <!-- 状态栏占位 -->
        <view class="status-bar-placeholder"></view>

        <!-- 背景区域 -->
        <view class="gradient-bg">
            <view class="overlay-image-container">
                <image class="overlay-image"
                    src="https://www.onchainus.net/static/media/img_banner.d6562c9c57149ca18538.png" mode="aspectFill">
                </image>
            </view>
        </view>

        <!-- 客服按钮 -->
        <view class="customer-service-box" @click="contactCustomerService">
            <uni-icons type="headphones" size="24" color="#3c8dbc"></uni-icons>
            <text class="service-text">Online Customer Service</text>
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
                        An AI smart contract trading system is a blockchain technology-based trading system that uses
                        smart contracts as an execution and management tool for trading. A smart contract is a
                        computational code that programmatically defines and automatically executes the terms of a
                        contract. These contract codes are stored on the blockchain to ensure transparency, security and
                        reliability of transactions.

                        At the same time the smart contract trading system allows participants to trade without the need
                        for a third party intermediary. The system works on the principle that the contract code will
                        automatically execute a transaction when predefined conditions are met. This means that
                        transactions can be executed without human intervention, thus reducing the possibility of fraud
                        and errors and increasing the efficiency of transactions.

                        The system can execute various types of transactions, such as digital currency transactions,
                        asset swaps, decentralized finance (DeFi) transactions, etc. It can also provide other functions
                        such as decentralized exchange (DEX) operations, automated trading strategy execution and
                        management, and crowdfunding platform operations.

                        These systems provide a more open and transparent trading environment through blockchain
                        technology, enabling participants to trade securely and without the need to trust third parties.
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
                        self-executing contracts. These contracts automatically execute, control, or document legally
                        relevant events according to the terms written directly into code.

                        The AI component enhances traditional smart contracts by adding capabilities such as pattern
                        recognition, learning from historical data, and making decisions based on complex criteria. This
                        allows the contracts to adapt and respond to changing market conditions more effectively than
                        traditional static contracts.

                        When a predefined condition is met, the smart contract automatically executes the corresponding
                        agreement. The entire process is transparent and secure, with all transactions recorded on the
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

                        1. Automation: Eliminates the need for intermediaries, reducing costs and increasing efficiency.

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
                        AI smart contracts provide a high level of security due to their blockchain foundation. However,
                        like any technology, they are not without risks:

                        - Code Security: Smart contracts are only as secure as their code. We employ rigorous auditing
                        and testing to ensure contract integrity.

                        - Blockchain Security: We use established blockchain networks with proven security records.

                        - Data Privacy: User data is protected through encryption and secure protocols.

                        - Risk Management: Our AI systems include risk assessment tools to prevent unexpected losses.

                        - Regulatory Compliance: Our contracts are designed to comply with relevant financial
                        regulations.

                        We recommend users to start with smaller trades to become familiar with the system before
                        committing larger amounts.
                    </text>
                </view>
            </view>

            <view class="divider"></view>

            <!-- 新增带图片的问题 -->
            <view class="faq-item">
                <view class="faq-title">
                    <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                    <text class="title-text">NMLS Regulated MTL License</text>
                </view>

                <view class="faq-content">
                    <!-- 图片展示 -->
                    <view class="image-container">
                        <image class="license-image" src="https://www.onchainus.net/static/media/MTL.a08660900dab07cbb5d3.jpg" mode="widthFix"></image>
                    </view>
                    
                    <text class="content-text">
                        Our platform operates with a Money Transmitter License (MTL) regulated by the Nationwide Multistate Licensing System (NMLS). This regulatory framework ensures that our operations comply with state and federal financial regulations.
                        
                        The MTL license provides several advantages:
                        
                        - Legal Compliance: Ensures all transactions meet regulatory standards
                        - Consumer Protection: Provides safeguards for user funds and data
                        - Trust and Credibility: Demonstrates our commitment to operating within established financial frameworks
                        - Multi-State Operations: Allows us to legally operate across different states
                        
                        Our NMLS ID is publicly verifiable, and we undergo regular audits to maintain compliance with all applicable regulations. This regulatory oversight adds an additional layer of security and trust for our users.
                    </text>
                </view>
            </view>

            <view class="divider"></view>

            <!-- 新增带图片的问题2 -->
            <view class="faq-item">
                <view class="faq-title">
                    <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                    <text class="title-text">Smart Contract Security Audits</text>
                </view>

                <view class="faq-content">
                    <!-- 图片展示 -->
                    <view class="image-container">
                        <image class="security-image" src="https://www.onchainus.net/static/media/img_banner.d6562c9c57149ca18538.png" mode="widthFix"></image>
                    </view>
                    
                    <text class="content-text">
                        All smart contracts on our platform undergo rigorous security audits by independent third-party security firms. These audits are designed to identify and address potential vulnerabilities before deployment.
                        
                        Our security audit process includes:
                        
                        - Static Analysis: Automated tools scan the code for known vulnerabilities
                        - Dynamic Analysis: Testing contracts in simulated environments
                        - Formal Verification: Mathematical validation of contract properties
                        - Manual Code Review: Expert auditors examine the code line by line
                        
                        After the audit process, we implement any necessary changes and conduct additional verification before deploying contracts to the mainnet. Audit reports are made available to users, ensuring transparency about the security measures in place.
                    </text>
                </view>
            </view>

            <view class="divider"></view>

            <!-- 新增带图片的问题3 -->
            <view class="faq-item">
                <view class="faq-title">
                    <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                    <text class="title-text">Cross-Chain Bridge Security</text>
                </view>

                <view class="faq-content">
                    <!-- 图片展示 -->
                    <view class="image-container">
                        <image class="security-image" src="/static/c9.png" mode="widthFix"></image>
                    </view>
                    
                    <text class="content-text">
                        Our cross-chain bridge technology employs advanced security measures to ensure safe asset transfers between different blockchain networks. Security is our top priority when it comes to managing cross-chain operations.
                        
                        Key security features of our cross-chain bridge include:
                        
                        - Multi-signature validation requiring approval from multiple trusted validators
                        - Threshold signature schemes to distribute signing authority
                        - Real-time monitoring systems to detect unusual activities
                        - Timelocks on large transactions to allow for intervention if needed
                        - Regular security assessments and penetration testing
                        
                        Our bridge architecture implements a custodial model with decentralized validation, striking the optimal balance between security and efficiency. All bridge contracts undergo the same rigorous audit process as our other smart contracts, ensuring robust protection for cross-chain transactions.
                    </text>
                </view>
            </view>

            <view class="divider"></view>

            <!-- 新增带图片的问题4 -->
            <view class="faq-item">
                <view class="faq-title">
                    <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                    <text class="title-text">Community Governance Model</text>
                </view>

                <view class="faq-content">
                    <!-- 图片展示 -->
                    <view class="image-container">
                        <image class="security-image" src="/static/c7.png" mode="widthFix"></image>
                    </view>
                    
                    <text class="content-text">
                        Our platform implements a decentralized governance model that allows token holders to participate in key decision-making processes. This approach ensures that the platform evolves according to the collective wisdom of its community.
                        
                        The governance process includes:
                        
                        - Proposal Submission: Any token holder can submit proposals for platform improvements
                        - Discussion Period: Community members can discuss and refine proposals
                        - Voting Phase: Token holders vote on proposals with voting power proportional to their holdings
                        - Implementation: Approved proposals are implemented by the development team
                        
                        Our governance framework is designed to be transparent and inclusive, allowing for meaningful participation from all stakeholders. This democratic approach helps ensure that the platform remains responsive to user needs and adapts to changing market conditions.
                    </text>
                </view>
            </view>

            <view class="divider"></view>

            <!-- 新增带图片的问题5 -->
            <view class="faq-item">
                <view class="faq-title">
                    <uni-icons type="info" size="20" color="#3c8dbc"></uni-icons>
                    <text class="title-text">Cross-Chain Asset Management</text>
                </view>

                <view class="faq-content">
                    <!-- 图片展示 -->
                    <view class="image-container">
                        <image class="security-image" src="/static/c8.png" mode="widthFix"></image>
                    </view>
                    
                    <text class="content-text">
                        Our platform offers comprehensive tools for managing assets across multiple blockchain networks. These tools are designed to simplify the process of tracking, transferring, and optimizing your cross-chain portfolio.
                        
                        Key features of our cross-chain asset management system:
                        
                        - Unified Dashboard: View all your assets across different blockchains in one interface
                        - Gas Optimization: Intelligent routing to minimize transaction costs
                        - Batch Transactions: Perform multiple operations in a single transaction
                        - Historical Performance: Track the performance of your assets over time
                        - Portfolio Analytics: Gain insights into your asset allocation and diversification
                        
                        Our asset management tools integrate seamlessly with our cross-chain bridge, allowing for efficient movement of assets between networks. This integrated approach provides a smooth user experience while maintaining the highest standards of security and reliability.
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
                        <image class="security-image" src="https://www.onchainus.net/static/media/MTL.a08660900dab07cbb5d3.jpg" mode="widthFix"></image>
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

// 联系客服方法
const contactCustomerService = () => {
    uni.showModal({
        title: '客服联系',
        content: '您确定要联系在线客服吗？',
        success: function (res) {
            if (res.confirm) {
                // 这里可以添加实际的客服联系逻辑，例如打开聊天窗口或拨打电话
                uni.showToast({
                    title: '正在连接客服...',
                    icon: 'none',
                    duration: 2000
                });

                // 模拟客服连接
                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/chat/index' // 假设有一个客服聊天页面
                    });
                }, 1000);
            }
        }
    });
};

// 获取状态栏高度
onMounted(() => {
    try {
        // 获取系统信息
        const systemInfo = uni.getSystemInfoSync();
        statusBarHeight = systemInfo.statusBarHeight || 0;
        // 设置状态栏占位符高度
        document.documentElement.style.setProperty('--status-bar-height', `${statusBarHeight}px`);
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
    padding-top: 0; // 确保没有顶部内边距
    margin-top: 0;
}

// 状态栏占位
.status-bar-placeholder {
    height: var(--status-bar-height, 0);
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: transparent; // 完全透明
}

.gradient-bg {
    position: fixed; // 改为fixed定位，确保从顶部开始
    top: 0;
    left: 0;
    right: 0;
    height: 40vh; // 调整高度以匹配设计要求
    background: linear-gradient(to bottom, #3c8dbc, white);
    z-index: 0;
}

// 顶部叠加图片容器
.overlay-image-container {
    position: absolute;
    top: 0; // 从顶部开始
    left: 0;
    right: 0;
    height: 35vh;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start; // 改为顶部对齐
    overflow: hidden;

    .overlay-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top; // 确保图片从顶部开始显示
        margin-top: 0;
        display: block;
    }
}

.customer-service-box {
    position: relative;
    z-index: 2;
    margin: 0 30rpx;
    margin-top: calc(30vh + var(--status-bar-height, 0)); // 调整位置，考虑状态栏高度
    padding: 30rpx;
    background-color: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    .service-text {
        margin-left: 20rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
    }
}

.faq-container {
    position: relative;
    z-index: 2;
    margin: 30rpx;
    margin-top: 50rpx;
    padding: 40rpx;
    background-color: #ffffff;
    border-radius: 20rpx;
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
            padding-left: 44rpx; // 对齐标题文本

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
