// WebSocket 连接管理器
class WebSocketManager {
    constructor() {
        this.ws = null;
        this.url = 'wss://u.souhlawfirm.com/ws/hangqing'; // 假设的WebSocket地址
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000; // 3秒
        this.heartbeatInterval = 30000; // 30秒心跳
        this.heartbeatTimer = null;
        this.isConnecting = false;
        this.isManualClose = false;
        
        // 事件监听器
        this.listeners = {
            message: [],
            open: [],
            close: [],
            error: []
        };
    }

    // 连接WebSocket
    connect() {
        if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
            console.log('WebSocket正在连接中，跳过重复连接');
            return;
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket已连接，跳过重复连接');
            return;
        }

        console.log('开始连接WebSocket:', this.url);
        this.isConnecting = true;
        this.isManualClose = false;

        try {
            this.ws = new WebSocket(this.url);
            this.setupEventListeners();
        } catch (error) {
            console.error('WebSocket连接失败:', error);
            this.isConnecting = false;
            this.handleReconnect();
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        this.ws.onopen = (event) => {
            console.log('WebSocket连接成功');
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            
            // 启动心跳
            this.startHeartbeat();
            
            // 触发open事件
            this.emit('open', event);
        };

        this.ws.onmessage = (event) => {
            console.log('收到WebSocket消息:', event.data);
            
            try {
                const data = JSON.parse(event.data);
                
                // 处理心跳响应
                if (data.type === 'pong') {
                    console.log('收到心跳响应');
                    return;
                }
                
                // 触发message事件
                this.emit('message', data);
            } catch (error) {
                console.error('解析WebSocket消息失败:', error, event.data);
            }
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket连接关闭:', event.code, event.reason);
            this.isConnecting = false;
            
            // 停止心跳
            this.stopHeartbeat();
            
            // 触发close事件
            this.emit('close', event);
            
            // 如果不是手动关闭，尝试重连
            if (!this.isManualClose) {
                this.handleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
            this.isConnecting = false;
            
            // 触发error事件
            this.emit('error', error);
        };
    }

    // 发送消息
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = typeof data === 'object' ? JSON.stringify(data) : data;
            this.ws.send(message);
            console.log('发送WebSocket消息:', message);
        } else {
            console.warn('WebSocket未连接，无法发送消息:', data);
        }
    }

    // 关闭连接
    close() {
        console.log('手动关闭WebSocket连接');
        this.isManualClose = true;
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    // 处理重连
    handleReconnect() {
        if (this.isManualClose) {
            console.log('手动关闭，跳过重连');
            return;
        }

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('WebSocket重连次数已达上限，停止重连');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1); // 指数退避
        
        console.log(`WebSocket将在${delay}ms后进行第${this.reconnectAttempts}次重连`);
        
        setTimeout(() => {
            if (!this.isManualClose) {
                this.connect();
            }
        }, delay);
    }

    // 启动心跳
    startHeartbeat() {
        this.stopHeartbeat(); // 先停止之前的心跳
        
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping', timestamp: Date.now() });
            }
        }, this.heartbeatInterval);
        
        console.log('WebSocket心跳已启动');
    }

    // 停止心跳
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
            console.log('WebSocket心跳已停止');
        }
    }

    // 添加事件监听器
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    // 移除事件监听器
    off(event, callback) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(callback);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
            }
        }
    }

    // 触发事件
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('WebSocket事件监听器错误:', error);
                }
            });
        }
    }

    // 获取连接状态
    getReadyState() {
        return this.ws ? this.ws.readyState : WebSocket.CLOSED;
    }

    // 检查是否已连接
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

export default WebSocketManager; 