<!--
 * @Author: llxs
 * @Date: 2023-04-19 14:52:31
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 10:36:23
 * @Description: 音量控制组件
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <div class="volume">
        <!-- 音量图标 -->
        <mm-icon
            class="pointer volume-icon"
            :type="getVolumeIconType()"
            :size="30"
            @click="handleToggleVolume">
        </mm-icon>
        <div class="volume-progress-wrapper">
            <!-- 音量进度条 -->
            <L2xsProgress
                :percent="volumeProgress"
                @percentChangeEnd="handleVolumeChange"
                @percentChange="handleVolumeChange">
            </L2xsProgress>
        </div>
    </div>
</template>

<script>
import L2xsProgress from '@/base/L2xs-progress/index';

export default {
    name: 'Volume',
    components: {
        L2xsProgress
    },
    props: {
        volume: {
            type: Number,
            required: true
        }
    },
    computed: {

        /**
         * @description: 返回当前音量的值
         * @return {*}
         */        
        volumeProgress() {
            return this.volume;
        },

        /**
         * @description: 判断是否为静音状态
         * @return {*}
         */        
        isMute: {
            get() {
                return this.volumeProgress === 0;
            },
            set(newMute) {
                // 新值为true（即设置为静音）, 则将volume属性设置为0，并保存当前的音量值到lastVolume属性中
                // 新值为false（即取消静音）则将volume属性设置为lastVolume属性的值（即恢复之前的音量值）
                const volume = newMute ? 0 : this.lastVolume;
                if (newMute) {
                    this.lastVolume = this.volumeProgress;
                }
                // 新的音量值
                this.handleVolumeChange(volume);
            }
        }
    },
    methods: {

        /**
         * @description: 当前音量的图标类型
         * @return {*}
         */        
        getVolumeIconType() {
            return this.isMute ? 'volume-off' : 'volume';
        },

        /**
         * @description: 是否为静音状态
         * @return {*}
         */        
        handleToggleVolume() {
            this.isMute = !this.isMute;
        },

        /**
         * @description: 用于处理音量的改变
         * @param {*} percent 音量百分比值作为参数
         * @return {*}
         */        
        handleVolumeChange(percent) {
            this.$emit('volumeChange', percent);
        }
    }
}
</script>

<style lang="scss" scoped>
.volume {
    display: flex;
    align-items: center;
    width: 150px;
    &-icon {
        margin-right: 5px;
        color: #fff;
    }
    &-progress-wrapper {
        flex: 1;
    }
    @media (max-width: 768px) {
        top: 2px;
        width: 36px;
    }
}
</style>
