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
        <text class="stat-value">{{ totalPledged }}</text>
        <text class="stat-label">总质押量</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ apy }}%</text>
        <text class="stat-label">年化收益</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ userCount }}</text>
        <text class="stat-label">参与用户</text>
      </view>
    </view>
    
    <view class="pledge-form">
      <view class="form-title">创建质押</view>
      
      <view class="input-group">
        <text class="input-label">质押金额</text>
        <view class="input-wrapper">
          <input 
            type="number" 
            v-model="pledgeAmount" 
            class="input-field" 
            placeholder="请输入质押金额"
          />
          <text class="input-addon">Token</text>
        </view>
      </view>
      
      <view class="input-group">
        <text class="input-label">质押期限</text>
        <view class="duration-tabs">
          <view 
            v-for="(item, index) in durations" 
            :key="index"
            :class="['duration-tab', selectedDuration === index ? 'active' : '']"
            @click="selectDuration(index)"
          >
            <text>{{ item.label }}</text>
            <text class="rate">{{ item.rate }}%</text>
          </view>
        </view>
      </view>
      
      <view class="summary">
        <view class="summary-row">
          <text>预计收益</text>
          <text class="highlight">{{ calculateRewards() }} Token</text>
        </view>
        <view class="summary-row">
          <text>到期时间</text>
          <text>{{ maturityDate }}</text>
        </view>
      </view>
      
      <button class="pledge-button" @click="submitPledge">立即质押</button>
    </view>
    
    <!-- 托管资金显示 -->
    <view class="escrow-section">
      <text class="escrow-title">Funds in Escrow (USDT)</text>
      <text class="escrow-subtitle">托管资金（USDT）</text>
      <view class="escrow-amount">
        <text class="escrow-value">{{ escrowFunds }}</text>
        <text class="escrow-currency">USDT</text>
      </view>
    </view>
    
    <view class="history">
      <view class="history-title">我的质押记录</view>
      <view v-if="pledgeHistory.length > 0">
        <view 
          v-for="(item, index) in pledgeHistory" 
          :key="index"
          class="history-item"
        >
          <view class="history-info">
            <text class="history-amount">{{ item.amount }} Token</text>
            <text class="history-date">质押日期: {{ item.date }}</text>
            <text class="history-maturity">到期日期: {{ item.maturity }}</text>
          </view>
          <view class="history-status" :class="item.status">
            {{ item.statusText }}
          </view>
        </view>
      </view>
      <view v-else class="empty-history">
        <text>暂无质押记录</text>
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
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .stat-value {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
      color: #3c8dbc;
    }
    
    .stat-label {
      font-size: 24rpx;
      color: #999999;
    }
  }
}

.pledge-form {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  
  .form-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    color: #ffffff;
  }
  
  .input-group {
    margin-bottom: 30rpx;
    
    .input-label {
      display: block;
      margin-bottom: 20rpx;
      font-size: 28rpx;
      color: #cccccc;
    }
    
    .input-wrapper {
      display: flex;
      align-items: center;
      background-color: #444444;
      border-radius: 10rpx;
      padding: 0 20rpx;
      
      .input-field {
        flex: 1;
        height: 80rpx;
        color: #ffffff;
      }
      
      .input-addon {
        color: #3c8dbc;
        font-weight: bold;
        margin-left: 20rpx;
      }
    }
  }
  
  .duration-tabs {
    display: flex;
    justify-content: space-between;
    
    .duration-tab {
      flex: 1;
      background-color: #444444;
      margin: 0 10rpx;
      border-radius: 10rpx;
      padding: 20rpx 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      
      &:first-child {
        margin-left: 0;
      }
      
      &:last-child {
        margin-right: 0;
      }
      
      &.active {
        background-color: #3c8dbc;
      }
      
      .rate {
        font-size: 24rpx;
        margin-top: 10rpx;
        color: #cccccc;
      }
      
      &.active .rate {
        color: #ffffff;
      }
    }
  }
  
  .summary {
    background-color: #444444;
    border-radius: 10rpx;
    padding: 20rpx;
    margin: 30rpx 0;
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .highlight {
        color: #3c8dbc;
        font-weight: bold;
      }
    }
  }
  
  .pledge-button {
    background-color: #3c8dbc;
    color: #ffffff;
    border-radius: 10rpx;
    font-size: 32rpx;
    font-weight: bold;
    height: 90rpx;
    line-height: 90rpx;
  }
}

.escrow-section {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  text-align: center;
  
  .escrow-title {
    font-size: 32rpx;
    color: #ffffff;
    margin-bottom: 10rpx;
    display: block;
  }
  
  .escrow-subtitle {
    font-size: 28rpx;
    color: #999999;
    margin-bottom: 25rpx;
    display: block;
  }
  
  .escrow-amount {
    display: flex;
    justify-content: center;
    align-items: baseline;
    
    .escrow-value {
      font-size: 48rpx;
      font-weight: bold;
      color: #3c8dbc;
      margin-right: 15rpx;
    }
    
    .escrow-currency {
      font-size: 32rpx;
      color: #cccccc;
    }
  }
}

.history {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  
  .history-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    color: #ffffff;
  }
  
  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2rpx solid #444444;
    padding: 20rpx 0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .history-info {
      display: flex;
      flex-direction: column;
      
      .history-amount {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }
      
      .history-date, .history-maturity {
        font-size: 24rpx;
        color: #999999;
        margin-bottom: 5rpx;
      }
    }
    
    .history-status {
      font-size: 28rpx;
      padding: 10rpx 20rpx;
      border-radius: 50rpx;
      
      &.ongoing {
        background-color: rgba(60, 141, 188, 0.2);
        color: #3c8dbc;
      }
      
      &.completed {
        background-color: rgba(92, 184, 92, 0.2);
        color: #5cb85c;
      }
    }
  }
  
  .empty-history {
    text-align: center;
    padding: 40rpx 0;
    color: #999999;
  }
}
</style>
