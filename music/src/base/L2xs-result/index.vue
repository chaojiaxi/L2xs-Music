<!--
 * @Author: llxs
 * @Date: 2023-04-19 18:36:18
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 15:17:36
 * @Description: 暂无数据提示
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--暂无数据提示-->
    <div class="mm-no-result">
        <p class="mm-no-result-text">{{ title }}</p>
    </div>
</template>

<script>
export default {
    name: 'MmNoResult',
    props: {
        // 无数据提示文本
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss">
.mm-no-result {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    &-text {
        margin-top: 30px;
        font-size: $font_size_medium;
        color: $text_color;
    }
}
</style>
  