<!--
 * @Author: llxs
 * @Date: 2023-04-19 15:18:35
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 14:43:56
 * @Description: icon 组件
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<script>
export default {
    name: 'MmIcon',
    props: {
        // 图标类型
        type: {
            type: String,
            required: true
        },
        // 图标大小
        size: {
            type: Number,
            default: 16
        }
    },
    methods: {

        /**
         * @description: 获取图标
         * @return {*}
         */        
        getIconCls() {
            return `icon-${this.type}`
        },

        /**
         * @description: 图标样式大小
         * @return {*}
         */        
        getIconStyle() {
            return { fontSize: this.size + 'px' }
        },

        /**
         * @description: 点击事件
         * @param {*} e
         * @return {*}
         */        
        onClick(e) {
            this.$emit('click', e)
        }
    },
    render() {
        const Icon = (
            <i class={`iconfont ${this.getIconCls()}`}
                onClick={this.onClick}
                style={this.getIconStyle()}
            />
        )
        return Icon
    }
}
</script>

<style lang="scss">
.iconfont {
    display: inline-block;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    line-height: 1;
    vertical-align: baseline;
    text-transform: none;
    speak: none;
    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
