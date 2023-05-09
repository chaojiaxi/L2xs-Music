<!--
 * @Author: llxs
 * @Date: 2023-04-19 18:39:10
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 15:18:03
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--弹出层提示-->
    <transition name="toast-fade">
        <div v-show="visible" class="mm-toast" :class="positionClasss">
            {{ message }}
        </div>
    </transition>
</template>

<script>
export default {
    name: 'L2xsToast',
    data() {
        return {
            position: 'center', // 默认显示位置
            message: '', // 默认显示文本
            duration: 2000, // 显示时间, 毫秒
            visible: false // 是否显示
        }
    },
    computed: {
        
        /**
         * @description: 显示位置
         * @param {*}
         * @return {*}
         */        
        positionClasss() {
            return 'mm-toast-' + this.position;
        }
    }
}
</script>

<style lang="scss">
$prefix-cls: mm-toast;

.#{$prefix-cls} {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 50%;
    z-index: 2023;
    min-width: 380px;
    box-sizing: border-box;
    border-radius: $border_radius;
    padding: 15px 15px 15px 20px;
    overflow: hidden;
    text-align: center;
    // min-height: 40px;
    // line-height: 20px;
    font-size: 14px;
    color: #fff;
    background-color: rgba(194, 12, 12, .5);
    user-select: none;
    transform: translateX(-50%);
    transition: opacity .3s,transform .4s,top .4s;
    &-top {
        top: 10%;
    }
    &-center {
        top: 20px;
        margin-top: 0;
    }
    &-bottom {
        bottom: 10%;
    }
}

.toast-fade-enter {
    opacity: 0;
    transform: translate3d(-50%, -10px, 0);
}

.toast-fade-enter-active {
    will-change: transform;
    transition: all 0.2s;
}

.toast-fade-enter-to {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
}
</style>
  