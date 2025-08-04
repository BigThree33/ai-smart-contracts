<template>
  <view class="ai-trading-container">
    <!-- 返回按钮 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="back-icon">←</text>
      </view>
    </view>
    
    <!-- 标题区域 -->
    <view class="title-section">
      <text class="main-title">AI Trading</text>
      <text class="subtitle">The bottom layer of enterprise-level AI, leading algorithms for quantitative trading, automatic machine learning, and hyperparameter optimization to rapidly improve the efficiency of AI quantitative processing</text>
    </view>
    
    <!-- 特性卡片 -->
    <view class="features-section">
      <view class="feature-card">
        <view class="feature-icon">🛡️</view>
        <text class="feature-title">100% Security</text>
      </view>
      
      <view class="feature-card">
        <view class="feature-icon">🌟</view>
        <text class="feature-title">No holidays</text>
      </view>
      
      <view class="feature-card">
        <view class="feature-icon">⚡</view>
        <text class="feature-title">Immediately</text>
      </view>
    </view>
    
    <!-- 收益计算说明 -->
    <view class="info-section">
      <view class="info-card">
        <text class="info-title">Earnings calculation</text>
        <text class="info-content">Apply for entrustment to use artificial intelligence trading, and the current settlement income will be automatically settled according to the entrusted strategic product</text>
      </view>
      
      <view class="info-card">
        <text class="info-title">About liquidated damages</text>
        <text class="info-content">After the entrusted order is completed, the system will automatically return the principal to the user's account, and the user can apply for withdrawal</text>
      </view>
    </view>
    
    <!-- 加入按钮 -->
  </view>
</template>

<script>
export default {
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    
    joinHosting() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    }
  }
}
</script>

<style lang="scss">
.ai-trading-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #4285f4 0%, #6fa8f5 50%, #ffffff 100%);
  padding: 30rpx;
  color: #ffffff;
}

.header {
  margin-bottom: 40rpx;
  padding-top: 30rpx;
  
  .back-button {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .back-icon {
      font-size: 32rpx;
      color: #ffffff;
      font-weight: bold;
    }
  }
}

.title-section {
  margin-bottom: 60rpx;
  
  .main-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #ffffff;
    display: block;
    margin-bottom: 30rpx;
  }
  
  .subtitle {
    font-size: 26rpx;
    color: #ffffff;
    line-height: 1.6;
    opacity: 0.9;
  }
}

.features-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60rpx;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  
  .feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    
    .feature-icon {
      font-size: 40rpx;
      margin-bottom: 15rpx;
    }
    
    .feature-title {
      font-size: 24rpx;
      color: #ffffff;
      text-align: center;
      font-weight: 500;
    }
  }
}

.info-section {
  margin-bottom: 80rpx;
  
  .info-card {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 20rpx;
    padding: 40rpx;
    margin-bottom: 30rpx;
    
    .info-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      display: block;
      margin-bottom: 20rpx;
    }
    
    .info-content {
      font-size: 26rpx;
      color: #666666;
      line-height: 1.6;
    }
  }
}

.join-button-container {
  margin-top: auto;
  
  .join-button {
    width: 100%;
    height: 100rpx;
    background: linear-gradient(to right, #4285f4, #6fa8f5);
    border: none;
    border-radius: 20rpx;
    color: #ffffff;
    font-size: 36rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style> 