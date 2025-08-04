<template>
  <view class="pledge-container">
    <view class="header">
    </view>
    
    <!-- 余额显示 -->
    <view class="balance-section">
      <view class="balance-display">
        <text class="currency-symbol">$</text>
        <text class="balance-amount">{{ balance }}</text>
      </view>
      <text class="balance-label">Funds in Escrow (USDT)</text>
    </view>
    
    <!-- 导航按钮区域 -->
    <view class="navigation-buttons">
      <button class="nav-button introduce" @click="goToIntroduce">Introduce</button>
      <button class="nav-button order" @click="goToOrderList">Order</button>
    </view>
    
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-label">Expected earnings for today</text>
        <text class="stat-value">$ {{ expectedEarnings }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">Cumulative income</text>
        <text class="stat-value">$ {{ cumulativeIncome }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">Order volume</text>
        <text class="stat-value">{{ orderVolume }}</text>
      </view>
    </view>
    
    <!-- Auto Staking 区域 -->
    <view class="auto-staking-section">
      <text class="auto-staking-text">Auto Staking</text>
      <view class="help-icon">
        <text class="help-icon-text">?</text>
      </view>
    </view>
    
    <!-- 动态渲染质押产品 -->
    <view class="pledge-form" v-for="(product, index) in pledgeProducts" :key="product.id">
      <view class="product-info">
        <view class="product-header">
          <view class="avatar">
            <text class="avatar-text">{{ product.title.charAt(0) }}</text>
          </view>
          <view class="product-details">
            <text class="product-name">{{ product.title }}</text>
            <text class="purchase-limit">{{ product.limit_purchase }} purchase limit</text>
          </view>
        </view>
        
        <view class="product-specs">
          <view class="spec-item">
            <text class="spec-label">limit(USDT)</text>
            <text class="spec-value">{{ formatAmount(product.amount) }}-{{ formatAmount(product.limit_amount) }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Rate of return</text>
            <text class="spec-value">{{ product.lixi_fanwei }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Cycle</text>
            <text class="spec-value">{{ product.days }}Day</text>
          </view>
        </view>
        
        <view class="social-icons">
          <view class="social-icon facebook">
            <image class="icon-image" src="/static/btc.jpg" mode="aspectFit"></image>
          </view>
          <view class="social-icon twitter">
            <image class="icon-image" src="/static/eth.jpg" mode="aspectFit"></image>
          </view>
          <view class="social-icon instagram">
            <image class="icon-image" src="/static/usdt.jpg" mode="aspectFit"></image>
          </view>
          <view class="social-icon telegram">
            <image class="icon-image" src="/static/usdc.jpg" mode="aspectFit"></image>
          </view>
          <view class="social-icon youtube">
            <image class="icon-image" src="/static/usdc.jpg" mode="aspectFit"></image>
          </view>
        </view>
        
        <view class="buy-button-container">
          <button class="buy-button" @click="buyProduct(product)">To Buy</button>
        </view>
      </view>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading-container" v-if="loading">
      <text class="loading-text">Loading...</text>
    </view>
    
    <!-- 空状态 -->
    <view class="empty-container" v-if="!loading && pledgeProducts.length === 0">
      <text class="empty-text">No pledge products</text>
    </view>
  </view>
</template>

<script>
import store from '@/store/index.js';
import { api, apiUtils } from '@/utils/api.js';

export default {
  data() {
    return {
      balance: '0.00',
      expectedEarnings: '0.00',
      cumulativeIncome: '0.00',
      orderVolume: '0',
      pledgeProducts: [], // 质押产品列表
      loading: true, // 加载状态
    }
  },
  
  onLoad() {
    this.loadPageData();
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    this.loadPageData();
  },
  
  methods: {
    // 加载页面数据（用户信息 + 质押产品）
    async loadPageData() {
      try {
        this.loading = true;
        
        // 并行加载用户信息和质押产品
        await Promise.all([
          this.fetchUserInfo(),
          this.loadPledgeProducts()
        ]);
        
      } catch (error) {
        console.error('Loading page data failed:', error);
      } finally {
        this.loading = false;
        // 停止下拉刷新
        uni.stopPullDownRefresh();
      }
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const data = await api.user.getInfo();
        
        if (data) {
          // 映射接口返回的数据到页面显示字段
          this.balance = this.formatBalance(data.money);
          this.expectedEarnings = apiUtils.formatAmount(data.dayfor_earning);
          this.cumulativeIncome = apiUtils.formatAmount(data.all_earning);
          this.orderVolume = data.order_num || '0';
          
          console.log('用户信息更新成功:', {
            balance: this.balance,
            expectedEarnings: this.expectedEarnings,
            cumulativeIncome: this.cumulativeIncome,
            orderVolume: this.orderVolume
          });
        }
        
      } catch (error) {
        console.error('Failed to get user info:', error);
        apiUtils.showError('加载用户数据失败');
      }
    },
    
    // 加载质押产品数据
    async loadPledgeProducts() {
      try {
        const response = await api.pledge.getProducts();
        
        console.log('API response:', response);
        
        if (response && response.zhiya) {
          this.pledgeProducts = response.zhiya.filter(product => product.status === '1'); // 只显示状态为1的产品
          console.log('Pledge product list:', this.pledgeProducts);
        } else {
          throw new Error('Failed to get data');
        }
        
      } catch (error) {
        console.error('Loading pledge products failed:', error);
        apiUtils.showError('Loading pledge products failed:');
        
        // 使用备用数据或重试机制
        this.pledgeProducts = [];
      }
    },
    
    // 格式化余额显示
    formatBalance(amount) {
      if (amount === null || amount === undefined || amount === '') {
        return '0.00';
      }
      
      const num = parseFloat(amount);
      if (isNaN(num)) {
        return '0.00';
      }
      
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    
    // 格式化金额显示
    formatAmount(amount) {
      if (amount === null || amount === undefined || amount === '') {
        return '0.00';
      }
      
      const num = parseFloat(amount);
      if (isNaN(num)) {
        return '0.00';
      }
      
      // 如果数额较大，使用K格式
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    

    // 购买产品
    buyProduct(product) {
      console.log('Purchase product:', product);
      
      // 检查产品状态
      if (product.status !== '1') {
        uni.showToast({
          title: 'This product is not available for purchase',
          icon: 'none'
        });
        return;
      }
      
      // 跳转到购买页面，传递产品信息
      uni.navigateTo({
        url: `/pages/buy/index?productData=${encodeURIComponent(JSON.stringify(product))}`
      });
    },
    
    // 显示购买弹窗
    showBuyDialog(product) {
      const content = `Product name: ${product.title}\n` +
                     `Investment cycle: ${product.days} days\n` +
                     `Expected earnings: ${product.lixi_fanwei}\n` +
                     `Investment range: ${this.formatAmount(product.amount)}-${this.formatAmount(product.limit_amount)} USDT\n` +
                     `Purchase limit: ${product.limit_purchase} times`;
      
      uni.showModal({
        title: 'Product details',
        content: content,
        confirmText: 'Buy now',
        cancelText: 'Cancel',
        success: (res) => {
          if (res.confirm) {
            this.processPurchase(product);
          }
        }
      });
    },
    
    // 处理购买流程
    processPurchase(product) {
      // 这里可以跳转到购买页面或者直接处理购买逻辑
  uni.showLoading({
    title: 'Processing...'
  });
  
      // 模拟购买处理
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
          title: 'Purchase successful',
      icon: 'success'
    });
    
        // 可以在这里调用购买接口
        // this.callPurchaseAPI(product);
      }, 1500);
    },
    
    // 调用购买接口
    async callPurchaseAPI(product, amount) {
      try {
        // 从全局状态获取token
        const token = store.getToken();
        if (!token) {
          throw new Error('未找到token，请先连接钱包');
        }

        const response = await uni.request({
          url: 'https://u.souhlawfirm.com/api/zhiya_order', // 真实的购买接口地址
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': token  // 添加token到请求头
          },
          data: {
            id: product.id,  // 产品ID
            amount: amount,  // 购买数量
            token: token     // token也需要在请求体中传递
          }
        });

        console.log('Purchase interface response:', response);
        
        if (response.statusCode === 200) {
          if (response.data.code === 0) {
            uni.showToast({
              title: 'Purchase successful',
              icon: 'success'
            });
            return response.data;
          } else {
            throw new Error(response.data.info || 'Purchase failed');
          }
        } else {
          throw new Error(`Request failed, status code: ${response.statusCode}`);
        }
      } catch (error) {
        console.error('Failed to call purchase interface:', error);
        uni.showToast({
          title: error.message || 'Purchase failed',
          icon: 'none'
        });
        throw error;
      }
    },
    
    // 获取用户ID（需要根据实际情况实现）
    getUserId() {
      // 从本地存储或全局状态获取用户ID
      return uni.getStorageSync('userId') || '';
    },
    
    // 刷新页面数据
    refreshData() {
      this.loadPledgeProducts();
    },
    
    // 跳转到AI Trading页面
    goToIntroduce() {
      uni.navigateTo({
        url: '/pages/ai-trading/index'
      });
    },
    
    // 跳转到Order List页面
    goToOrderList() {
      uni.navigateTo({
        url: '/pages/record/index'
      });
    }
  }
}
</script>

<style lang="scss">
.pledge-container {
  padding: 30rpx;
  background: linear-gradient(to bottom, #3a73f6, #f5f7fb);
  min-height: 100vh;
  color: #ffffff;
}

.header {
  margin-bottom: 40rpx;
  text-align: center;
  
  .title {
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
    color: #3c8dbc;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #999999;
  }
}

.balance-section {
  text-align: left;
  margin-bottom: 40rpx;
  
  .balance-display {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    margin-bottom: 15rpx;
    
    .currency-symbol {
      font-size: 40rpx;
      color: #ffffff;
      margin-right: 10rpx;
    }
    
    .balance-amount {
      font-size: 56rpx;
      font-weight: bold;
      color: #ffffff;
    }
  }
  
  .balance-label {
    font-size: 28rpx;
    color: #ffffff;
  }
}

.stats-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .stat-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eeeeee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .stat-label {
      font-size: 28rpx;
      color: #666666;
    }
    
    .stat-value {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }
  }
}

.auto-staking-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 40rpx;
  
  .auto-staking-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #ffffff;
    margin-right: 20rpx;
  }
  
  .help-icon {
    width: 60rpx;
    height: 60rpx;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .help-icon-text {
      font-size: 32rpx;
      color: #ffffff;
      font-weight: bold;
    }
  }
}

.pledge-form {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .product-info {
    .product-header {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      
      .avatar {
        width: 80rpx;
        height: 80rpx;
        background-color: #3c8dbc;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20rpx;
        
        .avatar-text {
          font-size: 32rpx;
          color: #ffffff;
          font-weight: bold;
        }
      }
      
      .product-details {
        display: flex;
        flex-direction: column;
        
        .product-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333333;
          margin-bottom: 5rpx;
        }
        
        .purchase-limit {
          font-size: 24rpx;
          color: #666666;
        }
      }
    }
    
    .product-specs {
      display: flex;
      justify-content: space-between;
      
      .spec-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        
        .spec-label {
          font-size: 24rpx;
          color: #666666;
          margin-bottom: 10rpx;
        }
        
        .spec-value {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
          text-align: center;
        }
      }
    }
    
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 20rpx;
      margin-top: 30rpx;
      background-color: #f5f5f5;
      padding: 20rpx;
      border-radius: 15rpx;
      
      .social-icon {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .icon-image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        
        &.facebook {
          background-color: #1877f2;
        }
        
        &.twitter {
          background-color: #1da1f2;
        }
        
        &.instagram {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        }
        
        &.telegram {
          background-color: #0088cc;
        }
        
        &.youtube {
          background-color: #ff0000;
        }
      }
    }
    
    .buy-button-container {
      margin-top: 30rpx;
      
      .buy-button {
        width: 100%;
        height: 80rpx;
        background: linear-gradient(to right, #3a79f6, #52a3f3);
        border: none;
        border-radius: 15rpx;
        color: #ffffff;
        font-size: 32rpx;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

// 加载和空状态样式
.loading-container, .empty-container {
  text-align: center;
  padding: 100rpx 0;
  
  .loading-text, .empty-text {
    font-size: 28rpx;
    color: #ffffff;
  }
}

// 导航按钮样式
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  margin-bottom: 40rpx;
  
  .nav-button {
    flex: 1;
    height: 80rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.5);
    border-radius: 15rpx;
    background-color: transparent;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.introduce {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &.order {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &:active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
