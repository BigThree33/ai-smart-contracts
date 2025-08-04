<template>
  <view class="order-list-container">
    <!-- 返回按钮和标题 -->
    <view class="header">
      <view class="back-button" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <!-- 根据来源和类型显示不同标题 -->
      <text class="page-title">{{ getPageTitle() }}</text>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">Loading...</text>
    </view>
    
    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <text class="error-text">{{ error }}</text>
      <view class="retry-button" @click="fetchOrderList">
        <text>Retry</text>
      </view>
    </view>
    
    <!-- 订单列表 -->
    <view v-else>
      <!-- 空状态 -->
      <view v-if="orderList.length === 0" class="empty-container">
        <text class="empty-text">No order records</text>
      </view>
      
      <!-- 订单详情卡片列表 -->
      <view v-else class="order-card" v-for="order in orderList" :key="order.id">
        
        <!-- account来源：只显示4个字段 -->
        <template v-if="source === 'account'">
          <view class="order-row">
            <text class="label">Type</text>
            <text class="value">{{ order.info }}</text>
          </view>
          
          <view class="order-row">
            <text class="label">ID</text>
            <text class="value">{{ order.id }}</text>
          </view>
          
          <view class="order-row">
            <text class="label">Amount</text>
            <text class="value">{{ formatAmount(order.amount) }}<text class="currency">USDT</text></text>
          </view>
          
          <view class="order-row">
            <text class="label">Time</text>
            <text class="value">{{ formatTime(order.addtime) }}</text>
          </view>
        </template>
        
        <!-- 其他来源：显示完整字段 -->
        <template v-else>
          <view class="order-row">
            <text class="label">Order Type</text>
            <view class="tag-container">
              <text class="tag">{{ getOrderTypeTag(order.type) }}</text>
              <text class="product-name">{{ order.title }}</text>
            </view>
          </view>
          
          <view class="order-row">
            <text class="label">Escrow amount</text>
            <text class="value">{{ formatAmount(order.amount) }}<text class="currency">USDT</text></text>
          </view>
          
          <view class="order-row">
            <text class="label">Profit</text>
            <text class="value">{{ formatPercentage(order.bilv) }}<text class="currency">%</text></text>
          </view>
          
          <view class="order-row">
            <text class="label">Order time</text>
            <text class="value">{{ formatTime(order.addtime) }}</text>
          </view>
          
          <view class="order-row">
            <text class="label">Expire date</text>
            <text class="value">{{ formatTime(order.endtime) }}</text>
          </view>
          
          <view class="order-row">
            <text class="label">Order ID</text>
            <text class="value">{{ order.order_id }}</text>
          </view>
          
          <view class="order-row">
            <text class="label">Order Status</text>
            <text class="status-value" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</text>
          </view>
          
          <!-- 社交媒体图标 -->
          <view class="social-icons">
            <view class="social-icon facebook">f</view>
            <view class="social-icon twitter">Ⓜ</view>
            <view class="social-icon telegram">📱</view>
            <view class="social-icon youtube">🎭</view>
            <view class="social-icon whatsapp">🎯</view>
            <view class="social-icon bitcoin">₿</view>
            <view class="social-icon other">🌟</view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { api, apiUtils } from '@/utils/api.js';
import store from '@/store/index.js';

export default {
  data() {
    return {
      orderList: [],
      loading: false,
      error: null,
      source: '', // 添加来源标识
      recordType: 'transaction' // 添加记录类型标识
    }
  },
  
  onLoad(options) {
    // 获取页面来源
    this.source = options.source || 'pledge';
    // 获取记录类型（用于区分 transaction 和 revenue）
    this.recordType = options.type || 'transaction';
    console.log('Page loaded with source:', this.source, 'type:', this.recordType);
    this.fetchOrderList();
  },
  
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    
    // 获取页面标题
    getPageTitle() {
      if (this.source === 'account') {
        return this.recordType === 'revenue' ? 'Revenue Record' : 'Transaction Record';
      }
      return 'Order List';
    },
    
    async fetchOrderList() {
      this.loading = true;
      this.error = null;
      
      try {
        apiUtils.showLoading('Loading...');
        
        // 检查token
        const token = store.getToken();
        console.log('Current token:', token);
        
        if (!token) {
          // token不存在，尝试重新连接钱包
          throw new Error('Authorization token not found, please reconnect wallet');
        }

        console.log('Sending order list request, token:', token, 'source:', this.source, 'type:', this.recordType);

        let responseData;
        if (this.source === 'account') {
          if (this.recordType === 'revenue') {
            // 使用收益记录接口
            responseData = await api.record.getRevenueRecord('4080000');
          } else {
            // 使用现金记录接口（transaction）
            responseData = await api.record.getCashRecord();
          }
        } else {
          // 使用质押订单列表接口
          responseData = await api.record.getPledgeOrderList();
        }

        console.log('Order list response:', responseData);

        // 检查响应结果
        if (responseData.code === 1) {
          // 如果是token相关错误，清除token并提示重新连接
          if (responseData.info && responseData.info.includes('token')) {
            console.log('Token validation failed, clearing token');
            store.clearToken();
            throw new Error('Session expired, please reconnect wallet');
          }
          throw new Error(responseData.info || 'Request failed');
        }

        // 根据不同接口处理不同的响应数据结构
        let orderData = [];
        if (this.source === 'account') {
          if (this.recordType === 'revenue') {
            // revenue_record 接口返回的是 zhiya 数组（与cash_record相同结构）
            if (responseData && responseData.zhiya && Array.isArray(responseData.zhiya)) {
              orderData = responseData.zhiya.map(item => this.mapRevenueRecordData(item));
            }
          } else {
            // cash_record 接口返回的是 zhiya 数组
            if (responseData && responseData.zhiya && Array.isArray(responseData.zhiya)) {
              orderData = responseData.zhiya.map(item => this.mapCashRecordData(item));
            }
          }
        } else {
          // zhiya_order_list 接口返回的是 data 数组
          if (responseData && responseData.data && Array.isArray(responseData.data)) {
            orderData = responseData.data;
          }
        }

        this.orderList = orderData;
        console.log('Order list loaded successfully, count:', this.orderList.length);

      } catch (error) {
        console.error('Failed to get order list:', error);
        this.error = error.message || 'Network request failed';

        if (error.message.includes('token') || error.message.includes('Session')) {
          // 显示重新连接提示
          apiUtils.showError('Please reconnect wallet');
          
          // 延迟后跳转到钱包连接页面
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/wallet/connect'
            });
          }, 2000);
        } else {
          apiUtils.showError(this.error);
        }
      } finally {
        this.loading = false;
        apiUtils.hideLoading();
      }
    },
    
    // 将 cash_record 接口的数据映射为统一格式
    mapCashRecordData(item) {
      return {
        id: item.id,
        type: item.type || '3',
        title: item.info || 'Cash Record',
        amount: item.amount,
        bilv: item.bilv || '0',
        addtime: item.addtime,
        endtime: item.addtime,
        order_id: item.id,
        status: this.getCashRecordStatus(item),
        address: item.address,
        min_amount: item.min_amount,
        uid: item.uid,
        info: item.info // 保持原始的info字段用于显示
      };
    },

    // 将 revenue_record 接口的数据映射为统一格式
    mapRevenueRecordData(item) {
      return {
        id: item.id || item.uid || Math.random().toString(),
        type: item.type || '5',
        title: item.info || 'Revenue Record',
        amount: item.amount,
        bilv: item.bilv || '0',
        addtime: item.addtime,
        endtime: item.addtime,
        order_id: item.id || item.uid,
        status: this.getRevenueRecordStatus(item),
        address: item.address,
        min_amount: item.min_amount,
        uid: item.uid,
        info: item.info // 保持原始的info字段用于显示
      };
    },

    // 获取 revenue_record 的状态
    getRevenueRecordStatus(item) {
      // 根据业务逻辑确定状态，这里需要根据实际情况调整
      if (item.info === 'Profit' || item.info === '利润' || item.info === '推荐收益') {
        return '1'; // 已完成
      }
      return '0'; // 进行中
    },

    // 获取 cash_record 的状态
    getCashRecordStatus(item) {
      // 根据业务逻辑确定状态，这里需要根据实际情况调整
      if (item.info === 'Recharge' || item.info === '充值') {
        return '1'; // 已完成
      }
      return '0'; // 进行中
    },
    
    // 格式化金额
    formatAmount(amount) {
      if (!amount) return '0.00';
      return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    
    // 格式化时间戳
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    },
    
    // 获取订单类型标签
    getOrderTypeTag(type) {
      const typeMap = {
        '1': 'LP',
        '2': 'ST',
        '3': 'TF',
        '4': 'AMM'
      };
      return typeMap[type] || 'TF';
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '0': 'in progress',
        '1': 'completed',
        '2': 'expired',
        '3': 'cancelled'
      };
      return statusMap[status] || 'unknown';
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      const classMap = {
        '0': 'in-progress',
        '1': 'completed',
        '2': 'expired',
        '3': 'cancelled'
      };
      return classMap[status] || 'in-progress';
    },
    
    // 格式化百分比
    formatPercentage(value) {
      if (!value) return '0';
      // 移除字符串末尾的 '%' 符号（如果有）
      const numStr = value.toString().replace(/%$/, '');
      // 转换为数字并格式化
      const num = parseFloat(numStr);
      // 如果是整数，直接返回
      if (Number.isInteger(num)) {
        return num.toString();
      }
      // 如果小数部分是0，返回整数部分
      if (num % 1 === 0) {
        return num.toString();
      }
      // 否则保留需要的小数位数
      return num.toString().replace(/\.?0+$/, '');
    }
  }
}
</script>

<style lang="scss">
.order-list-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #e8f2ff 0%, #f5f7fb 50%, #ffffff 100%);
  padding: 30rpx;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding-top: 30rpx;
  
  .back-button {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .back-icon {
      font-size: 32rpx;
      color: #333333;
      font-weight: bold;
    }
  }
  
  .page-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
  }
}

// 加载状态
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  
  .loading-text {
    font-size: 28rpx;
    color: #888888;
  }
}

// 错误状态
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  
  .error-text {
    font-size: 28rpx;
    color: #ff4444;
    margin-bottom: 40rpx;
    text-align: center;
  }
  
  .retry-button {
    background-color: #4285f4;
    color: #ffffff;
    padding: 20rpx 40rpx;
    border-radius: 10rpx;
    font-size: 26rpx;
  }
}

// 空状态
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  
  .empty-text {
    font-size: 28rpx;
    color: #888888;
  }
}

.order-card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .order-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-of-type {
      border-bottom: none;
      margin-bottom: 30rpx;
    }
    
    .label {
      font-size: 28rpx;
      color: #888888;
      flex: 1;
    }
    
    .value {
      font-size: 28rpx;
      color: #333333;
      text-align: right;
      
      .currency {
        font-size: 24rpx;
        color: #888888;
      }
    }
    
    .tag-container {
      display: flex;
      align-items: center;
      
      .tag {
        background-color: #4CAF50;
        color: #ffffff;
        padding: 8rpx 16rpx;
        border-radius: 8rpx;
        font-size: 20rpx;
        margin-right: 15rpx;
      }
      
      .product-name {
        font-size: 28rpx;
        color: #4285f4;
        font-weight: 500;
      }
    }
    
    .status-value {
      font-size: 28rpx;
      font-weight: 500;
      
      &.in-progress {
        color: #4CAF50;
      }
      
      &.completed {
        color: #2196F3;
      }
      
      &.expired {
        color: #FF9800;
      }
      
      &.cancelled {
        color: #F44336;
      }
    }
  }
  
  .social-icons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20rpx 0;
    
    .social-icon {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 24rpx;
      font-weight: bold;
      
      &.facebook {
        background-color: #1877f2;
      }
      
      &.twitter {
        background-color: #1da1f2;
      }
      
      &.telegram {
        background-color: #0088cc;
      }
      
      &.youtube {
        background-color: #ff0000;
      }
      
      &.whatsapp {
        background-color: #25d366;
      }
      
      &.bitcoin {
        background-color: #f7931a;
      }
      
      &.other {
        background-color: #6c5ce7;
      }
    }
  }
}
</style>