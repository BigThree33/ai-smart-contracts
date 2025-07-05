<template>
    <view class="account-container">
        <!-- 返回按钮 - 提取到外层 -->
        <view class="back-button" @click="goBack">
            <uni-icons type="back" size="30" color="#0f0f0f"></uni-icons>
        </view>
        
        <!-- 背景渐变区域 -->
        <view class="gradient-bg"></view>

        <!-- 内容区域 -->
        <view class="content-area">
            <image class="no-data-image"
                src="https://www.smartaicontracts.net/static/media/icon_nodata.26457e3468442aa98af7.png"
                mode="scaleToFill"
            />
            <view class="no-data-text">No Record</view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 获取状态栏高度
let statusBarHeight = 0;

const goBack = () => {
    console.log('返回上一页');
    uni.navigateBack({
        delta: 1
    });
};

// 页面加载时获取系统信息
onMounted(() => {
    try {
        const systemInfo = uni.getSystemInfoSync();
        statusBarHeight = systemInfo.statusBarHeight || 0;
    } catch (e) {
        console.error('获取状态栏高度失败', e);
    }
});
</script>

<style lang="scss">
/* 整体容器 - 控制整个account页面的基本布局 */
.account-container {
    min-height: 100vh; // 最小高度为整个视口高度
    position: relative; // 相对定位，为内部元素提供参考
    overflow-x: hidden; // 隐藏水平滚动条
}

/* 返回按钮 - 调整到手机页面左上角位置 */
.back-button {
    position: fixed; // 固定定位
    top: 50rpx; // 距离顶部50rpx（状态栏下方）
    left: 25rpx; // 距离左侧25rpx
    width: 80rpx; // 宽度80rpx
    height: 80rpx; // 高度80rpx
    background-color: rgba(255, 255, 255, 0.9); // 半透明白色背景
    border-radius: 50%; // 圆形按钮
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中对齐
    justify-content: center; // 水平居中对齐
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15); // 添加阴影效果
    z-index: 1000; // 确保在最上层
    cursor: pointer; // 鼠标指针样式
    backdrop-filter: blur(10rpx); // 毛玻璃效果（可选）
    transition: all 0.3s ease; // 过渡动画
    
    &:hover {
        background-color: rgba(255, 255, 255, 1); // 悬停时背景变为不透明
        transform: scale(1.1); // 悬停时略微放大
    }
    
    &:active {
        transform: scale(0.95); // 点击时略微缩小
    }
}

/* 背景渐变区域 - 控制页面背景的渐变效果 */
.gradient-bg {
    position: fixed; // 固定定位，背景不随内容滚动
    top: 0; // 距离顶部0像素
    left: 0; // 距离左侧0像素
    right: 0; // 距离右侧0像素
    height: 100vh; // 高度为视口高度的100%
    background: linear-gradient(to bottom,
        #0055ff 0%, // 顶部深蓝色
        #76b8ff 40%, // 渐变到浅蓝色
        #c9d6e5 50%, // 继续渐变到更浅的蓝色
        #ffffff 60%, // 在50%处变为白色
        #ffffff 100% // 下半部分保持白色
    ); // 上方50%蓝白渐变，下方50%纯白色
    z-index: 0; // 修改为0，作为背景层
}

/* 内容区域 - 控制两个框的容器 */
.content-area {
    position: relative; // 相对定位
    z-index: 1; // 位于背景之上
    padding: 60rpx 40rpx; // 内边距：上下60rpx，左右40rpx
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直方向排列
    align-items: center; // 水平居中对齐
    justify-content: center; // 垂直居中对齐
    min-height: 100vh; // 最小高度为视口高度
    margin-top: -30vh; // 向上移动30vh
    gap: 40rpx; // 两个框之间的间距
}

.no-data-image {
    width: 250rpx; // 图片宽度250rpx
    height: 200rpx; // 图片高度200rpx
    margin-bottom: 20rpx; // 图片下方间距20rpx
}

.no-data-text {
    font-size: 28rpx; // 字体大小28rpx
    color: #666666; // 修改为更合适的灰色
}
</style>