// 创建全局状态管理
const store = {
    state: {
        token: uni.getStorageSync('userToken') || '',
        tokenTimestamp: uni.getStorageSync('tokenTimestamp') || 0,
        walletAddress: '',
        isWalletConnected: false
    },
    
    // 事件监听器列表
    _listeners: [],
    
    // 设置token - 增强版本，只接受更新的token
    setToken(token, forceUpdate = false) {
        const now = Date.now();
        const currentTimestamp = this.state.tokenTimestamp || 0;
        
        // 如果不是强制更新，且时间戳较旧，则拒绝更新
        if (!forceUpdate && now < currentTimestamp) {
            console.warn('拒绝设置较旧的token', {
                newTimestamp: now,
                currentTimestamp: currentTimestamp,
                tokenPreview: token ? token.substring(0, 10) + '...' : 'empty'
            });
            return false;
        }
        
        const oldToken = this.state.token;
        this.state.token = token;
        this.state.tokenTimestamp = now;
        
        // 同时保存到本地存储
        uni.setStorageSync('userToken', token);
        uni.setStorageSync('tokenTimestamp', now);
        
        console.log('Token已更新', {
            timestamp: now,
            tokenPreview: token ? token.substring(0, 10) + '...' : 'empty',
            oldTokenPreview: oldToken ? oldToken.substring(0, 10) + '...' : 'empty'
        });
        
        // 通知所有监听器 token 已更新
        this._notifyListeners('tokenUpdated', { 
            newToken: token, 
            oldToken: oldToken,
            timestamp: now 
        });
        
        return true;
    },
    
    // 获取token
    getToken() {
        return this.state.token;
    },
    
    // 清除token
    clearToken() {
        const oldToken = this.state.token;
        this.state.token = '';
        this.state.tokenTimestamp = 0;
        uni.removeStorageSync('userToken');
        uni.removeStorageSync('tokenTimestamp');
        this._notifyListeners('tokenCleared', { oldToken });
    },
    
    // 添加事件监听器
    addListener(callback) {
        this._listeners.push(callback);
        return () => {
            // 返回取消监听的函数
            const index = this._listeners.indexOf(callback);
            if (index > -1) {
                this._listeners.splice(index, 1);
            }
        };
    },
    
    // 通知所有监听器
    _notifyListeners(event, data) {
        this._listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Store listener error:', error);
            }
        });
    }
};

export default store; 