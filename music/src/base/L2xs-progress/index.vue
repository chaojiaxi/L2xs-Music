<!--
 * @Author: llxs
 * @Date: 2023-04-19 14:39:46
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 15:16:59
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--进度条拖动-->
    <div ref="L2xsProgress" class="L2xsProgress" @click="barClick">
        <!-- 总进度条 -->
        <div class="L2xsProgress-bar"></div>
        <!-- 总进度条-宽度根据屏幕确定 -->
        <div ref="L2xsPercentProgress" class="L2xsProgress-outer"></div>
        <!-- 前进的进度条 -->
        <div ref="L2xsProgressInner" class="L2xsProgress-inner">
            <!-- 进度条原点 -->
            <div class="L2xsProgress-dot" @mousedown="barDown" @touchstart.prevent="barDown"></div>
        </div>
    </div>
</template>

<script>
const dotWidth = 10
export default {
    name: 'MmProgress',
    props: {
        // 进度值一
        percent: {
            type: [Number],
            default: 0
        },
        // 进度值二（歌曲缓冲进度用）
        percentProgress: {
            type: [Number],
            default: 0
        }
    },
    data() {
        return {
            move: {
                status: false, // 是否可拖动
                startX: 0, // 记录最开始点击的X坐标
                left: 0 // 记录当前已经移动的距离
            }
        }
    },
    watch: {
        /**
         * @description: 监听percent属性的变化
         * @param {*} newPercent
         * @return {*}
         */        
        percent(newPercent) {
            // 如果percent大于等于0且move未被激
            if (newPercent >= 0 && !this.move.status) {
                // 计算进度条的宽度和滑块的偏移量
                const barWidth = this.$refs.L2xsProgress.clientWidth - dotWidth;
                const offsetWidth = newPercent * barWidth;
                // 移动滑块到指定的位置
                this.moveSilde(offsetWidth);
            }
        },

        /**
         * @description: 监听percentProgress属性的变化
         * @param {*} newValue
         * @return {*}
         */        
        percentProgress(newValue) {
            // 根据新的百分比值设置进度条的宽度
            let offsetWidth = this.$refs.L2xsProgress.clientWidth * newValue;
            this.$refs.L2xsPercentProgress.style.width = `${offsetWidth}px`;
        }
    },
    mounted() {       
        this.$nextTick(() => {
            // 绑定事件
            this.bindEvents();
            const barWidth = this.$refs.L2xsProgress.clientWidth - dotWidth;
            const offsetWidth = this.percent * barWidth;
            this.moveSilde(offsetWidth);
        })
    },
    beforeDestroy() {
        this.unbindEvents();
    },
    methods: {
        
        /**
         * @description: 添加绑定事件
         * @return {*}
         */        
        bindEvents() {
            // 绑定鼠标移动和鼠标松开事件
            document.addEventListener('mousemove', this.barMove);
            document.addEventListener('mouseup', this.barUp);

            // 绑定触摸移动和触摸结束事件
            document.addEventListener('touchmove', this.barMove);
            document.addEventListener('touchend', this.barUp);
        },

        /**
         * @description: 移除绑定事件
         * @return {*}
         */        
        unbindEvents() {
            // 解除鼠标移动和鼠标松开事件的绑定
            document.removeEventListener('mousemove', this.barMove);
            document.removeEventListener('mouseup', this.barUp);

            // 解除触摸移动和触摸结束事件的绑定
            document.removeEventListener('touchmove', this.barMove);
            document.removeEventListener('touchend', this.barUp);
        },

        /**
         * @description: 点击事件
         * @param {*} e
         * @return {*}
         */        
        barClick(e) {
            // 获取进度条的边界矩形
            let rect = this.$refs.L2xsProgress.getBoundingClientRect();
            // 计算鼠标点击位置的偏移量
            let offsetWidth = Math.min(
                this.$refs.L2xsProgress.clientWidth - dotWidth,
                Math.max(0, e.clientX - rect.left)
            )
            // 移动滑块到指定的位置
            this.moveSilde(offsetWidth);
            this.commitPercent(true);
        },

        /**
         * @description: 鼠标按下事件
         * @param {*} e
         * @return {*}
         */        
        barDown(e) {
            this.move.status = true;
            // 记录鼠标/触摸的起始位置和滑块的初始left值
            this.move.startX = e.clientX || e.touches[0].pageX;
            this.move.left = this.$refs.L2xsProgressInner.clientWidth;
        },

        /**
         * @description: 鼠标/触摸移动事件
         * @param {*} e
         * @return {*}
         */        
        barMove(e) {
            if (!this.move.status) {
                return false;
            }
            e.preventDefault();
            // 计算鼠标/触摸移动的距离和滑块的偏移量
            let endX = e.clientX || e.touches[0].pageX;
            let dist = endX - this.move.startX;
            let offsetWidth = Math.min(
                this.$refs.L2xsProgress.clientWidth - dotWidth,
                Math.max(0, this.move.left + dist)
            )
            // 更新进度条的长度并更新百分比
            this.moveSilde(offsetWidth);
            this.commitPercent();
        },

        /**
         * @description: 鼠标/触摸松开事件处理函数
         * @return {*}
         */        
        barUp() {
            // 如果进度条正在移动状态，则更新百分比并标记为非移动状态
            if (this.move.status) {
                this.commitPercent(true);
                this.move.status = false;
            }
        },

        /**
         * @description: 移动滑块
         * @param {*} offsetWidth
         * @return {*}
         */        
        moveSilde(offsetWidth) {
            this.$refs.L2xsProgressInner.style.width = `${offsetWidth}px`;
        },

        /**
         * @description:  更新百分比
         * @param {*} isEnd
         * @return {*}
         */        
        commitPercent(isEnd = false) {
            const { L2xsProgress, L2xsProgressInner } = this.$refs;
            const lineWidth = L2xsProgress.clientWidth - dotWidth;
            const percent = L2xsProgressInner.clientWidth / lineWidth;
            this.$emit(isEnd ? 'percentChangeEnd' : 'percentChange', percent);
        }
    }
}
</script>

<style lang="scss">
.L2xsProgress {
    position: relative;
    padding: 5px;
    user-select: none;
    cursor: pointer;
    overflow: hidden;
    .L2xsProgress-bar {
        height: 2px;
        width: 100%;
        background: $bar_color;
    }
    .L2xsProgress-outer {
        position: absolute;
        top: 50%;
        left: 5px;
        display: inline-block;
        width: 0;
        height: 2px;
        margin-top: -1px;
        background: rgba(255, 255, 255, 0.2);
    }
    .L2xsProgress-inner {
        position: absolute;
        top: 50%;
        left: 5px;
        display: inline-block;
        width: 0;
        height: 2px;
        margin-top: -1px;
        background: $line_color;
        .L2xsProgress-dot {
            position: absolute;
            top: 50%;
            right: -5px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: $dot_color;
            transform: translateY(-50%);
        }
    }
}
</style>
