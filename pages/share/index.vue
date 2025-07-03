<template>
  <view class="share-container">
    <!-- 渐变背景区域 -->
    <view class="gradient-bg"></view>
    
    <!-- 顶部叠加图片 -->
    <view class="overlay-image-container">
      <image class="overlay-image" :src="topImage" mode="aspectFit"></image>
    </view>
    
    <!-- 分享内容区域 -->
    <view class="share-content">
      <view class="section header-section">
        <text class="title">邀请好友加入</text>
        <text class="subtitle">分享获得双倍奖励</text>
      </view>
      
      <view class="section rewards-section">
        <view class="reward-card">
          <view class="reward-icon">
            <uni-icons type="medal" size="40" color="#3c8dbc"></uni-icons>
          </view>
          <view class="reward-info">
            <text class="reward-title">邀请奖励</text>
            <text class="reward-desc">每邀请1位新用户注册，获得5 USDT奖励</text>
          </view>
        </view>
        
        <view class="reward-card">
          <view class="reward-icon">
            <uni-icons type="gift" size="40" color="#3c8dbc"></uni-icons>
          </view>
          <view class="reward-info">
            <text class="reward-title">交易分成</text>
            <text class="reward-desc">好友交易额的0.5%作为持续奖励</text>
          </view>
        </view>
      </view>
      
      <view class="section referral-section">
        <text class="section-title">我的邀请码</text>
        <view class="referral-code">
          <text class="code">{{ referralCode }}</text>
          <view class="copy-btn" @click="copyReferralCode">
            <uni-icons type="copy" size="20" color="#3c8dbc"></uni-icons>
            <text>复制</text>
          </view>
        </view>
      </view>
      
      <view class="section referral-link-section">
        <text class="section-title">邀请链接</text>
        <view class="referral-link">
          <text class="link">{{ referralLink }}</text>
          <view class="copy-btn" @click="copyReferralLink">
            <uni-icons type="copy" size="20" color="#3c8dbc"></uni-icons>
            <text>复制</text>
          </view>
        </view>
      </view>
      
      <view class="section share-buttons-section">
        <text class="section-title">分享方式</text>
        <view class="share-buttons">
          <view class="share-button" @click="shareToWechat">
            <view class="share-icon wechat">
              <uni-icons type="weixin" size="30" color="#ffffff"></uni-icons>
            </view>
            <text class="share-text">微信</text>
          </view>
          
          <view class="share-button" @click="shareToQQ">
            <view class="share-icon qq">
              <uni-icons type="qq" size="30" color="#ffffff"></uni-icons>
            </view>
            <text class="share-text">QQ</text>
          </view>
          
          <view class="share-button" @click="shareToWeibo">
            <view class="share-icon weibo">
              <uni-icons type="weibo" size="30" color="#ffffff"></uni-icons>
            </view>
            <text class="share-text">微博</text>
          </view>
          
          <view class="share-button" @click="generateQRCode">
            <view class="share-icon qrcode">
              <uni-icons type="scan" size="30" color="#ffffff"></uni-icons>
            </view>
            <text class="share-text">二维码</text>
          </view>
        </view>
      </view>
      
      <view class="section stats-section">
        <text class="section-title">邀请统计</text>
        <view class="stats-info">
          <view class="stat-item">
            <text class="stat-label">已邀请人数</text>
            <text class="stat-value">{{ invitedCount }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">累计奖励</text>
            <text class="stat-value">{{ totalRewards }} USDT</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 顶部叠加图片
const topImage = ref('/static/share-banner.png'); // 替换为实际图片路径

// 邀请数据
const referralCode = ref('AISCX7821');
const referralLink = ref('https://example.com/ref/AISCX7821');
const invitedCount = ref(12);
const totalRewards = ref(60);

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

// 复制邀请链接
const copyReferralLink = () => {
  uni.setClipboardData({
    data: referralLink.value,
    success: function() {
      uni.showToast({
        title: '邀请链接已复制',
        icon: 'success'
      });
    }
  });
};

// 分享方法
const shareToWechat = () => {
  uni.showToast({
    title: '正在分享到微信...',
    icon: 'none'
  });
  // 实际的微信分享API调用
};

const shareToQQ = () => {
  uni.showToast({
    title: '正在分享到QQ...',
    icon: 'none'
  });
  // 实际的QQ分享API调用
};

const shareToWeibo = () => {
  uni.showToast({
    title: '正在分享到微博...',
    icon: 'none'
  });
  // 实际的微博分享API调用
};

const generateQRCode = () => {
  uni.showToast({
    title: '生成二维码...',
    icon: 'none'
  });
  // 生成二维码逻辑
};
</script>

<style lang="scss">
.share-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

// 渐变背景，从蓝色到白色
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40vh; // 渐变高度，可调整
  background: linear-gradient(to bottom, #3c8dbc, white);
  z-index: 0;
}

// 顶部叠加图片容器
.overlay-image-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 35vh;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  .overlay-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

// 内容区域
.share-content {
  position: relative;
  z-index: 2;
  padding: 20rpx 30rpx;
  padding-top: 25vh; // 确保内容在图片下方开始
  
  .section {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  }
  
  .header-section {
    text-align: center;
    
    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 10rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      color: #666666;
    }
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20rpx;
    display: block;
  }
  
  // 奖励卡片
  .rewards-section {
    .reward-card {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .reward-icon {
        margin-right: 20rpx;
        background-color: rgba(60, 141, 188, 0.1);
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .reward-info {
        flex: 1;
        
        .reward-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333333;
          margin-bottom: 10rpx;
        }
        
        .reward-desc {
          font-size: 24rpx;
          color: #666666;
        }
      }
    }
  }
  
  // 邀请码和链接
  .referral-code, .referral-link {
    background-color: #f8f8f8;
    padding: 20rpx;
    border-radius: 10rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .code, .link {
      font-size: 30rpx;
      color: #333333;
      font-weight: bold;
      letter-spacing: 2rpx;
    }
    
    .copy-btn {
      display: flex;
      align-items: center;
      background-color: #ffffff;
      padding: 10rpx 20rpx;
      border-radius: 10rpx;
      border: 1px solid #e0e0e0;
      
      text {
        font-size: 24rpx;
        margin-left: 10rpx;
        color: #3c8dbc;
      }
    }
  }
  
  // 分享按钮
  .share-buttons {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    
    .share-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 10rpx;
      margin-bottom: 20rpx;
      
      .share-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10rpx;
        
        &.wechat {
          background-color: #07C160;
        }
        
        &.qq {
          background-color: #12B7F5;
        }
        
        &.weibo {
          background-color: #E6162D;
        }
        
        &.qrcode {
          background-color: #3c8dbc;
        }
      }
      
      .share-text {
        font-size: 24rpx;
        color: #666666;
      }
    }
  }
  
  // 统计信息
  .stats-info {
    display: flex;
    justify-content: space-around;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-label {
        font-size: 24rpx;
        color: #666666;
        margin-bottom: 10rpx;
      }
      
      .stat-value {
        font-size: 40rpx;
        font-weight: bold;
        color: #3c8dbc;
      }
    }
  }
}
</style>
