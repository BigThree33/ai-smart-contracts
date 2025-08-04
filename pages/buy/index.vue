<template>
  <view class="buy-container">
    <!-- 顶部导航 -->
    <view class="header-nav">
      <view class="nav-back" @click="goBack">
        <uni-icons type="left" size="24" color="#ffffff"></uni-icons>
      </view>
    </view>
    
    <!-- 主标题 -->
    <view class="main-title-section">
      <text class="page-title">Order Type</text>
      <text class="page-subtitle">Intelligent protocol to profit back</text>
    </view>
    
    <!-- 产品信息卡片 -->
    <view class="product-card">
      <view class="product-header">
        <view class="product-icon">
          <text class="icon-text">{{ productData.title ? productData.title.charAt(0) : 'M' }}</text>
        </view>
        <view class="product-info">
          <text class="product-name">{{ productData.title || 'Mobile AMM' }}</text>
          <view class="rate-info">
            <text class="rate-label">Rate of return</text>
            <text class="rate-value">{{ productData.lixi_fanwei || '1.83-2.01%' }}</text>
          </view>
        </view>
      </view>
      
      <!-- 产品详情 -->
      <view class="product-details">
        <view class="detail-row">
          <view class="detail-item">
            <text class="detail-label">limit(USDT)</text>
            <text class="detail-value">{{ formatAmount(productData.amount) }}-{{ formatAmount(productData.limit_amount) }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">Income</text>
            <text class="detail-value">Every day</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">Cycle</text>
            <text class="detail-value">{{ productData.days }}Day</text>
          </view>
        </view>
        
        <!-- 社交图标 -->
        <view class="social-icons">
          <view class="social-icon facebook">
            <text class="icon-text">f</text>
          </view>
          <view class="social-icon twitter">
            <text class="icon-text">T</text>
          </view>
          <view class="social-icon github">
            <text class="icon-text">G</text>
          </view>
          <view class="social-icon telegram">
            <text class="icon-text">T</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 托管金额输入 -->
    <view class="escrow-section">
      <text class="escrow-title">Escrow amount</text>
      <view class="amount-input-container">
        <input 
          class="amount-input" 
          v-model="escrowAmount" 
          placeholder="0.00"
          type="digit"
          @input="validateAmount"
        />
        <view class="max-button" @click="setMaxAmount">
          <text class="max-text">MAX</text>
        </view>
      </view>
      
      <!-- 说明文字 -->
      <text class="escrow-description">
        Support hundreds of transactions to run trading strategies at the same time, each variety has an independent thread, automatically monitor quotation depth, strategy calculation, real-time monitoring of transaction conditions, and ensure the immediacy of transaction execution.
      </text>
    </view>
    
    <!-- 确认按钮 -->
    <view class="confirm-button-section">
      <button 
        class="confirm-button" 
        :class="{ 'disabled': !isValidAmount }"
        @click="confirmPurchase"
        :disabled="!isValidAmount"
      >
        Confirm
      </button>
    </view>
  </view>
</template>

<script>
import store from '@/store/index.js';
import { api, apiUtils } from '@/utils/api.js';

export default {
  data() {
    return {
      productData: {},
      escrowAmount: '',
      maxAmount: 125890.00, // 用户余额
    }
  },
  
  computed: {
    isValidAmount() {
      console.log('=== isValidAmount 计算中 ===');
      console.log('this.escrowAmount:', this.escrowAmount);
      console.log('this.productData:', this.productData);
      
      const amount = parseFloat(this.escrowAmount);
      console.log('parsed amount:', amount);
      
      // 如果输入为空或无效，返回 false
      if (!this.escrowAmount || isNaN(amount) || amount <= 0) {
        console.log('返回 false - 输入无效');
        return false;
      }
      
      // 如果有最小金额限制，检查是否满足
      if (this.productData.amount) {
        const minAmount = parseFloat(this.productData.amount);
        if (amount < minAmount) {
          console.log('返回 false - 小于最小金额');
          return false;
        }
      }
      
      // 如果有最大金额限制，检查是否满足
      if (this.productData.limit_amount) {
        const maxAmount = parseFloat(this.productData.limit_amount);
        if (amount > maxAmount) {
          console.log('返回 false - 超过最大金额');
          return false;
        }
      }
      
      console.log('返回 true - 验证通过');
      return true;
    }
  },
  
  onLoad(options) {
    // 获取传递的产品数据
    if (options.productData) {
      try {
        this.productData = JSON.parse(decodeURIComponent(options.productData));
        console.log('Get product data:', this.productData);
      } catch (error) {
        console.error('Parse product data failed:', error);
        this.productData = {};
      }
    }
  },
  
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 格式化金额显示
    formatAmount(amount) {
      if (!amount) return '0';
      
      const num = parseFloat(amount);
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toLocaleString();
    },
    
    // 设置最大金额
    setMaxAmount() {
      const maxAllowed = Math.min(this.maxAmount, parseFloat(this.productData.limit_amount) || this.maxAmount);
      this.escrowAmount = maxAllowed.toString();
    },
    
    // 验证金额输入
    validateAmount() {
      // 移除非数字字符
      this.escrowAmount = this.escrowAmount.replace(/[^\d.]/g, '');
      
      // 确保只有一个小数点
      const parts = this.escrowAmount.split('.');
      if (parts.length > 2) {
        this.escrowAmount = parts[0] + '.' + parts[1];
      }
      
      // 添加调试信息
      console.log('输入后 escrowAmount:', this.escrowAmount);
      console.log('isValidAmount:', this.isValidAmount);
    },
    
    // 确认购买
    confirmPurchase() {
      if (!this.isValidAmount) {
        uni.showToast({
          title: 'Please enter a valid amount',
          icon: 'none'
        });
        return;
      }
      
      const amount = parseFloat(this.escrowAmount);
      const minAmount = parseFloat(this.productData.amount) || 0;
      const maxAmount = parseFloat(this.productData.limit_amount) || 0;
      
      if (amount < minAmount) {
        uni.showToast({
          title: `Minimum investment amount is ${minAmount} USDT`,
          icon: 'none'
        });
        return;
      }
      
      if (amount > maxAmount) {
        uni.showToast({
          title: `Maximum investment amount is ${maxAmount} USDT`,
          icon: 'none'
        });
        return;
      }
      
      // 显示确认弹窗
      this.showConfirmDialog(amount);
    },
    
    // 显示确认弹窗
    showConfirmDialog(amount) {
      const estimatedDaily = (amount * 0.02).toFixed(2); // 假设2%日收益
      const totalReturn = (amount * 0.02 * parseInt(this.productData.days)).toFixed(2);
      
      uni.showModal({
        title: 'Confirm purchase',
        content: `Product: ${this.productData.title}\nInvestment amount: ${amount} USDT\nEstimated daily income: ${estimatedDaily} USDT\nTotal expected income: ${totalReturn} USDT\nInvestment cycle: ${this.productData.days} days`,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        success: (res) => {
          if (res.confirm) {
            this.processPurchase(amount);
          }
        }
      });
    },
    
    // 处理购买
    async processPurchase(amount) {
      uni.showLoading({
        title: 'Processing...'
      });
      
      try {
        // 这里可以调用购买API
        await this.callPurchaseAPI(amount);
        
        uni.hideLoading();
        
        uni.showToast({
          title: 'Purchase successful',
          icon: 'success',
          duration: 2000
        });
        
        // 延迟返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
        
      } catch (error) {
        uni.hideLoading();
        
        // 显示后端返回的具体错误信息
        uni.showToast({
          title: error.message || 'Purchase failed, please try again',
          icon: 'none',
          duration: 3000
        });
      }
    },
    
    // 调用购买API
    async callPurchaseAPI(amount) {
      try {
        const result = await api.pledge.createOrder(amount, this.productData.id);
        console.log('API 响应:', result);
        
        if (result.code === 0) {
          return Promise.resolve(result);
        } else {
          // 返回后端的具体错误信息
          return Promise.reject(new Error(result.info || 'Purchase failed'));
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    
    // 获取用户ID
    getUserId() {
      return uni.getStorageSync('userId') || '';
    },

    // 添加一个调试方法
    debugData() {
      console.log('=== 调试信息 ===');
      console.log('escrowAmount:', this.escrowAmount);
      console.log('productData:', this.productData);
      console.log('isValidAmount:', this.isValidAmount);
    }
  }
}
</script>

<style lang="scss">
.buy-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #3a73f6, #f5f7fb);
  padding: 0 30rpx 40rpx;
}

.header-nav {
  padding-top: 60rpx;
  padding-bottom: 20rpx;
  
  .nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}

.main-title-section {
  margin-bottom: 40rpx;
  
  .page-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #ffffff;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .page-subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    display: block;
  }
}

.product-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  
  .product-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .product-icon {
      width: 80rpx;
      height: 80rpx;
      background-color: #4CAF50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .icon-text {
        font-size: 32rpx;
        color: #ffffff;
        font-weight: bold;
      }
    }
    
    .product-info {
      flex: 1;
      
      .product-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
        display: block;
        margin-bottom: 10rpx;
      }
      
      .rate-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .rate-label {
          font-size: 24rpx;
          color: #666666;
        }
        
        .rate-value {
          font-size: 28rpx;
          font-weight: bold;
          color: #f39c12;
        }
      }
    }
  }
  
  .product-details {
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30rpx;
      
      .detail-item {
        flex: 1;
        text-align: center;
        
        .detail-label {
          font-size: 24rpx;
          color: #666666;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .detail-value {
          font-size: 26rpx;
          font-weight: bold;
          color: #333333;
          display: block;
        }
      }
    }
    
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 20rpx;
      
      .social-icon {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .icon-text {
          font-size: 20rpx;
          color: #ffffff;
          font-weight: bold;
        }
        
        &.facebook {
          background-color: #1877f2;
        }
        
        &.twitter {
          background-color: #1da1f2;
        }
        
        &.github {
          background-color: #333333;
        }
        
        &.telegram {
          background-color: #0088cc;
        }
      }
    }
  }
}

.escrow-section {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .escrow-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .amount-input-container {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .amount-input {
      flex: 1;
      font-size: 48rpx;
      font-weight: bold;
      color: #333333;
      border: none;
      outline: none;
      padding: 0;
      background: transparent;
    }
    
    .max-button {
      background-color: #e3f2fd;
      border-radius: 8rpx;
      padding: 10rpx 20rpx;
      cursor: pointer;
      
      .max-text {
        font-size: 24rpx;
        color: #2196f3;
        font-weight: bold;
      }
    }
  }
  
  .escrow-description {
    font-size: 24rpx;
    color: #666666;
    line-height: 1.5;
  }
}

.confirm-button-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx 40rpx;
  background-color: #ffffff;
  
  .confirm-button {
    width: 100%;
    height: 80rpx;
    background: linear-gradient(to right, #3a73f6, #52a3f3);
    border: none;
    border-radius: 15rpx;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.disabled {
      background: #cccccc;
      color: #999999;
    }
  }
}
</style> 