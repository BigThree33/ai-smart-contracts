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
    
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-label">Expected earnings for today</text>
        <text class="stat-value">$ 0.00</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">Cumulative income</text>
        <text class="stat-value">$ 0.00</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">Order volume</text>
        <text class="stat-value">0</text>
      </view>
    </view>
    
    <!-- Auto Staking 区域 -->
    <view class="auto-staking-section">
      <text class="auto-staking-text">Auto Staking</text>
      <view class="help-icon">
        <text class="help-icon-text">?</text>
      </view>
    </view>
    
    <view class="pledge-form">
      <view class="product-info">
        <view class="product-header">
          <view class="avatar">
            <text class="avatar-text">M</text>
          </view>
          <view class="product-details">
            <text class="product-name">Mobile AMM Limited</text>
            <text class="purchase-limit">to 2 purchase</text>
          </view>
        </view>
        
        <view class="product-specs">
          <view class="spec-item">
            <text class="spec-label">limit(USDT)</text>
            <text class="spec-value">1,000-10,000</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Rate of return</text>
            <text class="spec-value">1.83-2.01%</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Cycle</text>
            <text class="spec-value">2Day</text>
          </view>
        </view>
        
        <view class="social-icons">
          <view class="social-icon facebook">
            <text class="icon-text">f</text>
          </view>
          <view class="social-icon twitter">
            <text class="icon-text">T</text>
          </view>
          <view class="social-icon instagram">
            <text class="icon-text">IG</text>
          </view>
          <view class="social-icon telegram">
            <text class="icon-text">TG</text>
          </view>
          <view class="social-icon youtube">
            <text class="icon-text">YT</text>
          </view>
        </view>
        
        <view class="buy-button-container">
          <button class="buy-button">To Buy</button>
        </view>
      </view>
    </view>
    
    <!-- 第二个产品框 -->
    <view class="pledge-form">
      <view class="product-info">
        <view class="product-header">
          <view class="avatar">
            <text class="avatar-text">M</text>
          </view>
          <view class="product-details">
            <text class="product-name">Mobile AMM Limited</text>
            <text class="purchase-limit">to 2 purchase</text>
          </view>
        </view>
        
        <view class="product-specs">
          <view class="spec-item">
            <text class="spec-label">limit(USDT)</text>
            <text class="spec-value">1,000-10,000</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Rate of return</text>
            <text class="spec-value">1.83-2.01%</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Cycle</text>
            <text class="spec-value">2Day</text>
          </view>
        </view>
        
        <view class="social-icons">
          <view class="social-icon facebook">
            <text class="icon-text">f</text>
          </view>
          <view class="social-icon twitter">
            <text class="icon-text">T</text>
          </view>
          <view class="social-icon instagram">
            <text class="icon-text">IG</text>
          </view>
          <view class="social-icon telegram">
            <text class="icon-text">TG</text>
          </view>
          <view class="social-icon youtube">
            <text class="icon-text">YT</text>
          </view>
        </view>
        
        <view class="buy-button-container">
          <button class="buy-button">To Buy</button>
        </view>
      </view>
    </view>
    
    <!-- 第三个产品框 -->
    <view class="pledge-form">
      <view class="product-info">
        <view class="product-header">
          <view class="avatar">
            <text class="avatar-text">M</text>
          </view>
          <view class="product-details">
            <text class="product-name">Mobile AMM Limited</text>
            <text class="purchase-limit">to 2 purchase</text>
          </view>
        </view>
        
        <view class="product-specs">
          <view class="spec-item">
            <text class="spec-label">limit(USDT)</text>
            <text class="spec-value">1,000-10,000</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Rate of return</text>
            <text class="spec-value">1.83-2.01%</text>
          </view>
          <view class="spec-item">
            <text class="spec-label">Cycle</text>
            <text class="spec-value">2Day</text>
          </view>
        </view>
        
        <view class="social-icons">
          <view class="social-icon facebook">
            <text class="icon-text">f</text>
          </view>
          <view class="social-icon twitter">
            <text class="icon-text">T</text>
          </view>
          <view class="social-icon instagram">
            <text class="icon-text">IG</text>
          </view>
          <view class="social-icon telegram">
            <text class="icon-text">TG</text>
          </view>
          <view class="social-icon youtube">
            <text class="icon-text">YT</text>
          </view>
        </view>
        
        <view class="buy-button-container">
          <button class="buy-button">To Buy</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

// 数据
const balance = ref('125,890.00');
const escrowFunds = ref('89,456.78');
const totalPledged = ref('1,234,567');
const apy = ref('12.5');
const userCount = ref('3,456');

const pledgeAmount = ref('');
const selectedDuration = ref(0);
const durations = ref([
  { label: '30天', rate: 5, days: 30 },
  { label: '90天', rate: 8, days: 90 },
  { label: '180天', rate: 10, days: 180 },
  { label: '365天', rate: 15, days: 365 }
]);

const pledgeHistory = ref([
  { 
    amount: '1000', 
    date: '2025-06-01', 
    maturity: '2025-07-01', 
    status: 'ongoing',
    statusText: '进行中' 
  },
  { 
    amount: '500', 
    date: '2025-05-01', 
    maturity: '2025-06-01', 
    status: 'completed',
    statusText: '已完成' 
  }
]);

// 计算属性
const maturityDate = computed(() => {
  if (!pledgeAmount.value) return '--';
  
  const now = new Date();
  const days = durations.value[selectedDuration.value].days;
  const future = new Date(now.setDate(now.getDate() + days));
  
  return `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
});

// 方法
const selectDuration = (index) => {
  selectedDuration.value = index;
};

const calculateRewards = () => {
  if (!pledgeAmount.value) return '0';
  
  const amount = parseFloat(pledgeAmount.value);
  const rate = durations.value[selectedDuration.value].rate;
  const days = durations.value[selectedDuration.value].days;
  
  return ((amount * rate * days) / (100 * 365)).toFixed(2);
};

const submitPledge = () => {
  if (!pledgeAmount.value || parseFloat(pledgeAmount.value) <= 0) {
    uni.showToast({
      title: '请输入有效的质押金额',
      icon: 'none'
    });
    return;
  }
  
  // 这里可以添加实际的质押提交逻辑
  uni.showLoading({
    title: '处理中...'
  });
  
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '质押成功',
      icon: 'success'
    });
    
    // 模拟添加一条新记录
    pledgeHistory.value.unshift({
      amount: pledgeAmount.value,
      date: new Date().toISOString().split('T')[0],
      maturity: maturityDate.value,
      status: 'ongoing',
      statusText: '进行中'
    });
    
    pledgeAmount.value = '';
  }, 1500);
};
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
        
        .icon-text {
          font-size: 24rpx;
          color: #ffffff;
          font-weight: bold;
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
</style>
