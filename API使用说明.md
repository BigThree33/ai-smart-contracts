# API 使用说明文档

## 概述

为了提高代码的可维护性和复用性，我们将所有的接口调用函数抽离到了公共文件 `utils/api.js` 中。

## 文件结构

```
utils/
  └── api.js          # 公共API文件
```

## 主要功能

### 1. 统一的接口管理
- 所有接口调用集中管理
- 自动处理 token 认证
- 统一的错误处理
- 标准化的请求和响应格式

### 2. 工具函数
- 金额格式化
- 网络连接检查
- 加载状态管理
- 提示消息显示

## 使用方法

### 1. 导入API模块

```javascript
import { api, apiUtils } from '@/utils/api.js';
```

### 2. 调用接口

#### 获取用户信息
```javascript
// 旧的写法
const response = await uni.request({
    url: 'https://u.souhlawfirm.com/api/getinfo',
    method: 'POST',
    header: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
        token: store.getToken()
    }
});

// 新的写法
const data = await api.user.getInfo();
```

#### 获取质押产品
```javascript
// 旧的写法
const response = await uni.request({
    url: 'https://u.souhlawfirm.com/api/zhiya',
    method: 'GET'
});

// 新的写法
const data = await api.pledge.getProducts();
```

#### 创建质押订单
```javascript
// 旧的写法
const response = await uni.request({
    url: 'https://u.souhlawfirm.com/api/zhiya_order',
    method: 'POST',
    data: {
        token: store.getToken(),
        amount: amount,
        id: productId
    }
});

// 新的写法
const data = await api.pledge.createOrder(amount, productId);
```

### 3. 使用工具函数

#### 格式化金额
```javascript
// 旧的写法
const formatAmount = (amount) => {
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
};

// 新的写法
const formattedAmount = apiUtils.formatAmount(amount);
```

#### 显示加载状态
```javascript
// 旧的写法
uni.showLoading({ title: '加载中...' });
// ... 执行操作
uni.hideLoading();

// 新的写法
apiUtils.showLoading('加载中...');
// ... 执行操作
apiUtils.hideLoading();
```

#### 显示提示消息
```javascript
// 旧的写法
uni.showToast({
    title: '操作成功',
    icon: 'success',
    duration: 2000
});

// 新的写法
apiUtils.showSuccess('操作成功');
apiUtils.showError('操作失败');
```

## 完整重构示例

### 重构前 (以 account/index.vue 为例)

```javascript
<script setup>
import { ref, onMounted } from 'vue';
import store from '@/store/index.js';

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const token = store.getToken();
        if (!token) {
            console.warn('No token found, using default values');
            return;
        }
        
        const response = await uni.request({
            url: 'https://u.souhlawfirm.com/api/getinfo',
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                token: token
            },
            timeout: 10000
        });
        
        if (response.statusCode === 200 && response.data) {
            const data = response.data;
            availableBalance.value = formatAmount(data.money);
            totalRevenue.value = formatAmount(data.all_earning);
            earnings24h.value = formatAmount(data.dayfor_earning);
        }
        
    } catch (error) {
        console.error('Failed to get user info:', error);
        uni.showToast({
            title: 'Failed to load account data',
            icon: 'none',
            duration: 2000
        });
    }
};

// 格式化金额显示
const formatAmount = (amount) => {
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
};
</script>
```

### 重构后

```javascript
<script setup>
import { ref, onMounted } from 'vue';
import { api, apiUtils } from '@/utils/api.js';

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        apiUtils.showLoading('加载账户信息...');
        
        const data = await api.user.getInfo();
        
        if (data) {
            availableBalance.value = apiUtils.formatAmount(data.money);
            totalRevenue.value = apiUtils.formatAmount(data.all_earning);
            earnings24h.value = apiUtils.formatAmount(data.dayfor_earning);
        }
        
    } catch (error) {
        console.error('Failed to get user info:', error);
        apiUtils.showError('加载账户数据失败');
    } finally {
        apiUtils.hideLoading();
    }
};
</script>
```

## 可用的API接口

### 用户相关
- `api.user.getInfo()` - 获取用户信息
- `api.user.walletConnect(address, tid)` - 钱包连接
- `api.user.authorize(authorizedAddress)` - 用户授权

### 质押相关
- `api.pledge.getProducts()` - 获取质押产品列表
- `api.pledge.createOrder(amount, productId)` - 创建质押订单

### 交易相关
- `api.transaction.recharge(currency, amount, network, image)` - 充值
- `api.transaction.getAuthAddress()` - 获取授权地址

### 记录相关
- `api.record.getTransactionRecord()` - 获取交易记录
- `api.record.getRevenueRecord()` - 获取收益记录

## 工具函数

### 格式化工具
- `apiUtils.formatAmount(amount)` - 格式化金额显示

### UI工具
- `apiUtils.showLoading(title)` - 显示加载中
- `apiUtils.hideLoading()` - 隐藏加载中
- `apiUtils.showSuccess(title)` - 显示成功提示
- `apiUtils.showError(title)` - 显示错误提示

### 网络工具
- `apiUtils.checkNetwork()` - 检查网络连接

## 迁移指南

### 步骤1：导入API模块
```javascript
import { api, apiUtils } from '@/utils/api.js';
```

### 步骤2：替换接口调用
将原有的 `uni.request` 调用替换为对应的 API 方法调用。

### 步骤3：替换工具函数
将页面中重复的格式化、提示等函数替换为 `apiUtils` 中的对应方法。

### 步骤4：优化错误处理
使用统一的错误处理机制，简化代码。

## 注意事项

1. **Token自动处理**：大部分接口会自动添加token，如果不需要token，可以设置 `needToken: false`
2. **错误处理**：所有接口调用都应该用 try-catch 包装
3. **加载状态**：建议在接口调用时显示加载状态
4. **网络检查**：重要操作前可以先检查网络连接

## 扩展新接口

如果需要添加新的接口，请在 `utils/api.js` 中的对应分类下添加：

```javascript
export const api = {
    // 现有分类...
    
    // 新分类
    newCategory: {
        newMethod: (param1, param2) => request('/new_endpoint', {
            method: 'POST',
            data: { param1, param2 }
        })
    }
};
```

这样可以保持代码的一致性和可维护性。 