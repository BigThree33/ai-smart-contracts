<template>
  <view class="share-container">
    <!-- 顶部叠加图片 -->
    <view class="overlay-image-container">
      <image class="overlay-image" :src="topImage" mode="aspectFit"></image>
    </view>
    
    <!-- 分享内容区域 -->
    <view class="share-content">
      <view class="section referral-section">
        <!-- 奖励信息容器 -->
        <view class="reward-info-container">
          <!-- 标题栏 -->
          <text class="reward-title">Referral reward (USDT)</text>
          
          <!-- 奖励数值 -->
          <text class="reward-amount">0.00</text>
          
          <!-- 推荐人数统计 -->
          <view class="stats-row">
            <view class="stat-item">
              <uni-icons type="person" size="24" color="#3c8dbc"></uni-icons>
              <text class="stat-label">Direct</text>
              <text class="stat-value">0</text>
            </view>
            <view class="stat-item">
              <uni-icons type="person" size="24" color="#ff8c00"></uni-icons>
              <text class="stat-label">Indirect</text>
              <text class="stat-value">0</text>
            </view>
          </view>
        </view>
        
        <!-- 分割线 -->
        <view class="divider"></view>
        
        <!-- 奖励说明 -->
        <view class="reward-info">
          <text class="reward-main-text">Get referral <text class="highlight">20</text> USDT rewards</text>
          <text class="reward-desc">Invite friends to use Ai quantitative trading, you can get 20USDT reward</text>
        </view>
        
        <!-- 分享链接区域 -->
        <view class="share-link-section">
          <view class="link-input">
            <text class="link-text">{{ shareLink }}</text>
          </view>
          <view class="copy-btn" @click="copyShareLink">
            <text>Copy</text>
          </view>
        </view>
        
        <!-- 分享按钮 -->
        <view class="share-button" @click="handleShareLink">
          <text class="share-button-text">SHARE LINK</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 顶部叠加图片
const topImage = ref('/static/sahrebg.png'); // 使用加密货币主题背景图

// 邀请数据
const referralCode = ref('AISCX7821');
const shareLink = ref('https://www.onchainus.net/#/?tid=AISCX7821');

// 复制邀请码
const copyReferralCode = () => {
  uni.setClipboardData({
    data: referralCode.value,
    success: function() {
      uni.showToast({
        title: '邀请码已复制',
        icon: 'success'
      });
    }
  });
};

// 复制分享链接
const copyShareLink = () => {
  uni.setClipboardData({
    data: shareLink.value,
    success: function() {
      uni.showToast({
        title: '链接已复制',
        icon: 'success'
      });
    }
  });
};

// 分享链接
const handleShareLink = () => {
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: shareLink.value,
    title: 'AI智能合约交易平台',
    summary: '邀请好友使用AI量化交易，获得20USDT奖励',
    imageUrl: '/static/logo.png',
    success: function(res) {
      uni.showToast({
        title: '分享成功',
        icon: 'success'
      });
    },
    fail: function(err) {
      // 如果分享失败，可以复制链接作为备选方案
      uni.setClipboardData({
        data: shareLink.value,
        success: function() {
          uni.showToast({
            title: '链接已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    }
  });
};
</script>

<style lang="scss">
.share-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #3a73f6, #f5f7fb);
  position: relative;
}

// 顶部叠加图片容器
.overlay-image-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40vh;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
  
  .overlay-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8; // 添加透明度让背景渐变效果更好地展现
  }
}

// 内容区域
.share-content {
  position: relative;
  z-index: 2;
  padding: 20rpx 30rpx;
  padding-top: 30vh; // 确保内容在图片下方开始，调整为与图片高度匹配
  
  .section {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  }
  
  // 奖励信息容器
  .reward-info-container {
    background-color: #f8f8f8;
    border-radius: 15rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    border: 1px solid #e0e0e0;
  }
  
  // 奖励标题
  .reward-title {
    font-size: 28rpx;
    color: #999999;
    text-align: center;
    margin-bottom: 20rpx;
    display: block;
  }
  
  // 奖励数值
  .reward-amount {
    font-size: 60rpx;
    font-weight: bold;
    color: #333333;
    text-align: center;
    margin-bottom: 40rpx;
    display: block;
  }
  
  // 推荐人数统计
  .stats-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40rpx;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      
      .stat-label {
        font-size: 24rpx;
        color: #666666;
        margin-top: 10rpx;
        margin-bottom: 8rpx;
      }
      
      .stat-value {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
    }
  }
  
  // 分割线
  .divider {
    height: 1px;
    background-color: #e0e0e0;
    margin: 30rpx 40rpx;
  }
  
  // 奖励说明
  .reward-info {
    text-align: center;
    margin-bottom: 40rpx;
    
    .reward-main-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 15rpx;
      display: block;
      
      .highlight {
        color: #3c8dbc;
      }
    }
    
    .reward-desc {
      font-size: 24rpx;
      color: #999999;
      line-height: 1.5;
      display: block;
    }
  }
  
  // 分享链接区域
  .share-link-section {
    display: flex;
    align-items: center;
    gap: 20rpx;
    width: 100%;
    box-sizing: border-box;
    
    .link-input {
      flex: 1;
      min-width: 0; // 确保弹性项目能够正确收缩
      background-color: #f8f8f8;
      padding: 20rpx;
      border-radius: 10rpx;
      border: 1px solid #e0e0e0;
      
      .link-text {
        font-size: 26rpx;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
    
    .copy-btn {
      background-color: #f0f0f0;
      padding: 20rpx 30rpx;
      border-radius: 10rpx;
      border: 1px solid #e0e0e0;
      flex-shrink: 0; // 防止复制按钮被压缩
      white-space: nowrap; // 防止按钮文字换行
      
      text {
        font-size: 26rpx;
        color: #666666;
      }
    }
  }
  
  // 分享按钮
  .share-button {
    width: 100%;
    height: 80rpx;
    background: linear-gradient(to right, #3875f6, #52a3f3);
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(56, 117, 246, 0.3);
    
    .share-button-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 2rpx;
    }
  }
}
</style>
