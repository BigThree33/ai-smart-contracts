<?php
require_once 'vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use React\Socket\Server as ReactServer;

class ExchangeDataServer implements MessageComponentInterface {
    protected $clients;
    protected $subscriptions;
    protected $logger;
    protected $exchangeDataCache;
    protected $heartbeatInterval = 30; // 30秒心跳检测
    
    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->subscriptions = [];
        $this->exchangeDataCache = [];
        $this->initLogger();
        
        echo "WebSocket服务器已启动\n";
        
        // 启动定时任务
        $this->startPeriodicTasks();
    }
    
    private function initLogger() {
        $this->logger = function($message) {
            echo "[" . date('Y-m-d H:i:s') . "] " . $message . "\n";
        };
    }
    
    // 新客户端连接
    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        $clientId = $conn->resourceId;
        
        ($this->logger)("新客户端连接: {$clientId}");
        
        // 发送欢迎消息
        $welcomeMessage = json_encode([
            'type' => 'welcome',
            'clientId' => $clientId,
            'timestamp' => time(),
            'message' => '连接成功，请发送订阅消息'
        ]);
        
        $conn->send($welcomeMessage);
        
        // 如果有缓存数据，立即发送
        if (!empty($this->exchangeDataCache)) {
            $conn->send(json_encode([
                'type' => 'market_data',
                'data' => $this->exchangeDataCache,
                'timestamp' => time()
            ]));
        }
    }
    
    // 收到客户端消息
    public function onMessage(ConnectionInterface $from, $msg) {
        $clientId = $from->resourceId;
        ($this->logger)("收到客户端 {$clientId} 消息: {$msg}");
        
        try {
            $data = json_decode($msg, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->sendError($from, 'Invalid JSON format');
                return;
            }
            
            $this->handleMessage($from, $data);
            
        } catch (Exception $e) {
            ($this->logger)("处理消息出错: " . $e->getMessage());
            $this->sendError($from, 'Message processing error');
        }
    }
    
    // 处理不同类型的消息
    private function handleMessage(ConnectionInterface $conn, $data) {
        $type = $data['type'] ?? '';
        $clientId = $conn->resourceId;
        
        switch ($type) {
            case 'ping':
                // 处理心跳
                $this->handlePing($conn, $data);
                break;
                
            case 'subscribe':
                // 处理订阅
                $this->handleSubscription($conn, $data);
                break;
                
            case 'unsubscribe':
                // 处理取消订阅
                $this->handleUnsubscription($conn, $data);
                break;
                
            default:
                ($this->logger)("未知消息类型: {$type} from client {$clientId}");
                $this->sendError($conn, 'Unknown message type');
        }
    }
    
    // 处理心跳
    private function handlePing(ConnectionInterface $conn, $data) {
        $response = json_encode([
            'type' => 'pong',
            'timestamp' => time(),
            'clientTimestamp' => $data['timestamp'] ?? 0
        ]);
        
        $conn->send($response);
    }
    
    // 处理订阅
    private function handleSubscription(ConnectionInterface $conn, $data) {
        $channels = $data['channels'] ?? [];
        $clientId = $conn->resourceId;
        
        foreach ($channels as $channel) {
            if (!isset($this->subscriptions[$channel])) {
                $this->subscriptions[$channel] = new \SplObjectStorage;
            }
            
            $this->subscriptions[$channel]->attach($conn);
            ($this->logger)("客户端 {$clientId} 订阅频道: {$channel}");
        }
        
        // 发送订阅确认
        $response = json_encode([
            'type' => 'subscription_confirmed',
            'channels' => $channels,
            'timestamp' => time()
        ]);
        
        $conn->send($response);
    }
    
    // 处理取消订阅
    private function handleUnsubscription(ConnectionInterface $conn, $data) {
        $channels = $data['channels'] ?? [];
        $clientId = $conn->resourceId;
        
        foreach ($channels as $channel) {
            if (isset($this->subscriptions[$channel])) {
                $this->subscriptions[$channel]->detach($conn);
                ($this->logger)("客户端 {$clientId} 取消订阅频道: {$channel}");
            }
        }
    }
    
    // 客户端断开连接
    public function onClose(ConnectionInterface $conn) {
        $clientId = $conn->resourceId;
        ($this->logger)("客户端断开连接: {$clientId}");
        
        // 从所有订阅中移除
        foreach ($this->subscriptions as $channel => $subscribers) {
            $subscribers->detach($conn);
        }
        
        $this->clients->detach($conn);
    }
    
    // 连接错误
    public function onError(ConnectionInterface $conn, \Exception $e) {
        $clientId = $conn->resourceId;
        ($this->logger)("客户端 {$clientId} 发生错误: " . $e->getMessage());
        
        $conn->close();
    }
    
    // 发送错误消息
    private function sendError(ConnectionInterface $conn, $message) {
        $error = json_encode([
            'type' => 'error',
            'message' => $message,
            'timestamp' => time()
        ]);
        
        $conn->send($error);
    }
    
    // 广播消息到指定频道
    public function broadcastToChannel($channel, $data) {
        if (!isset($this->subscriptions[$channel])) {
            return;
        }
        
        $message = json_encode($data);
        $count = 0;
        
        foreach ($this->subscriptions[$channel] as $client) {
            try {
                $client->send($message);
                $count++;
            } catch (Exception $e) {
                ($this->logger)("发送消息失败: " . $e->getMessage());
            }
        }
        
        ($this->logger)("向频道 {$channel} 广播消息，到达 {$count} 个客户端");
    }
    
    // 启动定时任务
    private function startPeriodicTasks() {
        // 每30秒获取并广播交易所数据
        $loop = \React\EventLoop\Factory::create();
        
        $loop->addPeriodicTimer(30, function() {
            $this->fetchAndBroadcastExchangeData();
        });
        
        // 每60秒清理无效连接
        $loop->addPeriodicTimer(60, function() {
            $this->cleanupConnections();
        });
        
        // 立即获取一次数据
        $this->fetchAndBroadcastExchangeData();
    }
    
    // 获取并广播交易所数据
    private function fetchAndBroadcastExchangeData() {
        ($this->logger)("开始获取交易所数据...");
        
        try {
            // 这里调用实际的API获取数据
            $exchangeData = $this->getExchangeDataFromAPI();
            
            // 更新缓存
            $this->exchangeDataCache = $exchangeData;
            
            // 广播到market_data频道
            $this->broadcastToChannel('market_data', [
                'type' => 'market_data',
                'data' => $exchangeData,
                'timestamp' => time()
            ]);
            
            ($this->logger)("交易所数据广播完成");
            
        } catch (Exception $e) {
            ($this->logger)("获取交易所数据失败: " . $e->getMessage());
            
            // 发送错误通知
            $this->broadcastToChannel('market_data', [
                'type' => 'error',
                'message' => 'Failed to fetch exchange data',
                'timestamp' => time()
            ]);
        }
    }
    
    // 从API获取交易所数据
    private function getExchangeDataFromAPI() {
        // 这里实现实际的API调用逻辑
        // 可以调用币安、火币等交易所的API
        
        // 示例：模拟数据
        $mockData = [
            'Binance' => [
                'Bitcoin' => [
                    '24h_volume' => mt_rand(100000000, 200000000),
                    'liquidity' => mt_rand(1000, 2000),
                    'price' => mt_rand(40000, 50000)
                ],
                'Ethereum' => [
                    '24h_volume' => mt_rand(150000000, 250000000),
                    'liquidity' => mt_rand(40000, 60000),
                    'price' => mt_rand(2500, 3500)
                ]
            ],
            'Huobi' => [
                'Bitcoin' => [
                    '24h_volume' => mt_rand(100000000, 200000000),
                    'liquidity' => mt_rand(1000, 2000),
                    'price' => mt_rand(40000, 50000)
                ],
                'Ethereum' => [
                    '24h_volume' => mt_rand(150000000, 250000000),
                    'liquidity' => mt_rand(40000, 60000),
                    'price' => mt_rand(2500, 3500)
                ]
            ]
        ];
        
        // 实际实现中，这里应该调用真实的API
        // $data = $this->callExchangeAPIs();
        
        return $mockData;
    }
    
    // 清理无效连接
    private function cleanupConnections() {
        $cleaned = 0;
        
        foreach ($this->clients as $client) {
            try {
                // 尝试发送ping测试连接
                $client->send(json_encode(['type' => 'ping_test']));
            } catch (Exception $e) {
                // 连接已断开，清理
                $this->clients->detach($client);
                $cleaned++;
            }
        }
        
        if ($cleaned > 0) {
            ($this->logger)("清理了 {$cleaned} 个无效连接");
        }
    }
}

// 启动服务器
$exchangeServer = new ExchangeDataServer();

$wsServer = new WsServer($exchangeServer);
$httpServer = new HttpServer($wsServer);

$server = IoServer::factory($httpServer, 8080, '0.0.0.0');

echo "WebSocket服务器运行在 ws://0.0.0.0:8080\n";
echo "按 Ctrl+C 停止服务器\n";

$server->run(); 