<!--
 * @Author: llxs
 * @Date: 2023-03-21 20:25:15
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 14:39:42
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--对话框-->
    <transition name="mm-dialog-fade">
        <div v-show="dialogShow" class="L2xs-dialog-box">
            <div class="L2xs-dialog-wrapper">
                <div class="L2xs-dialog-content">
                    <!-- 对话框-头部提示 -->
                    <div class="L2xs-dialog-head" v-text="headText"></div>
                    <slot>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <!-- 对话框-中间文字 -->
                        <div class="mm-dialog-text" v-html="bodyText"></div>
                    </slot>
                    <div class="L2xs-dialog-btns">
                        <!-- 对话框-取消按钮 -->
                        <div class="mm-btn-cancel"
                            v-if="dialogType !== 'alert'"
                            @click="cancel()"
                            v-text="cancelBtnText">
                        </div>
                        <!-- 对话框-其他按钮 -->
                        <slot name="btn"></slot>
                        <!-- 对话框-确定按钮 -->
                        <div class="mm-btn-confirm" @click="confirm" v-text="confirmBtnText"></div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'MmDialog',
    props: {
        // type：confirm、alert
        type: {
            type: String,
            default: 'confirm'
        },
        // 标题文本
        headText: {
            type: String,
            default: '提示'
        },
        // 内容文本（可以是html）
        bodyText: {
            type: String,
            default: ''
        },
        // 取消按钮文本
        cancelBtnText: {
            type: String,
            default: '取消'
        },
        // 确定按钮文本
        confirmBtnText: {
            type: String,
            default: '确定'
        },
        // Dialog 是否插入至 body 元素下
        appendToBody: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            dialogShow: false // 是否显示对话框
        }
    },
    computed: {

        /**
         * @description: 对话框类型
         * @return {*}
         */        
        dialogType() {
            return this.type.toLowerCase()
        }
    },
    watch: {

        /**
         * @description: 对话框显示
         * @param {*} val
         * @return {*}
         */        
        dialogShow(val) {
            if (val && this.appendToBody) {
                document.body.appendChild(this.$el)
            }
        }
    },
    mounted() {
        if (this.dialogShow && this.appendToBody) {
            document.body.appendChild(this.$el)
        }
    },
    destroyed() {
        if (this.appendToBody && this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
        }
    },
    methods: {
        
        /**
         * @description: 显示事件
         * @return {*}
         */        
        show() {
            this.dialogShow = true
        },
        
        /**
         * @description: 隐藏事件
         * @return {*}
         */        
        hide() {
            this.dialogShow = false
        },
        
        /**
         * @description: 取消事件
         * @return {*}
         */        
        cancel() {
            this.hide()
            this.$emit('cancel')
        },
        
        /**
         * @description: 确定事件
         * @return {*}
         */        
        confirm() {
            this.hide()
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="scss">
$dialog-prefix-cls: mm-dialog;

.L2xs-dialog-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1996;
    background-color: $dialog_bg_color;
    user-select: none;
    backdrop-filter: $backdrop_filter;
        &.#{$dialog-prefix-cls}-fade-enter-active {
            animation: mm-dialog-fadein 0.3s;
            .mm-dialog-content {
                animation: mm-dialog-zoom 0.3s;
            }
        }
        .L2xs-dialog-wrapper  {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1996;
            .L2xs-dialog-content {
                width: 420px;
                border-radius: $dialog_border_radius;
                background: $dialog_content_bg_color;
                @media (max-width: 767px) {
                    width: 270px;
                    border-radius: $dialog_mobile_border_radius;
                    text-align: center;
                }
                .L2xs-dialog-head {
                    padding: 15px;
                    padding-bottom: 0;
                    font-size: $font_size_large;
                    color: $text_color_active;
                }
                .#{$dialog-prefix-cls}-text {
                    padding: 20px 15px;
                    line-height: 22px;
                    font-size: $font_size_medium;
                    color: $dialog_text_color;
                }
                .L2xs-dialog-btns {
                    display: flex;
                    align-items: center;
                    padding: 0 15px 10px;
                    text-align: center;
                    color: $dialog_text_color;
                    @media (min-width: 768px) {
                        justify-content: flex-end;
                        div {
                            display: block;
                            padding: 8px 15px;
                            border-radius: $dialog_btn_mobile_border_radius;
                            border: 1px solid $btn_color;
                            font-size: $font_size_medium;
                            cursor: pointer;
                            &:not(:nth-of-type(1)) {
                                margin-left: 10px;
                            }
                            &:hover {
                                color: $text_color_active;
                                border: 1px solid $btn_color_active;
                            }
                        }
                    }
                    @media (max-width: 767px) {
                        & {
                            padding: 0;
                            justify-content: center;
                            div {
                                flex: 1;
                                line-height: 22px;
                                padding: 10px 0;
                                border-top: 1px solid $dialog_line_color;
                                font-size: $font_size_large;
                                &:not(:nth-of-type(1)) {
                                    border-left: 1px solid $dialog_line_color;
                                }
                            }
                        }
                    }
                }
            }
        }
}
  
@keyframes mm-dialog-fadein {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
  
@keyframes mm-dialog-zoom {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>