<!--
* @Author: llxs
* @Date: 2023-04-19 14:43:20
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 10:37:37
* @Description: 功能选项
* @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <div class="music-btn">
        <router-link to="/music/playlist" tag="span">正在播放</router-link>
        <router-link to="/music/toplist" tag="span">推荐</router-link>
        <router-link to="/music/djlist" tag="span">电台</router-link>
        <router-link to="/music/mvlist" tag="span">MV</router-link>
        <router-link to="/music/search" tag="span">搜索</router-link>
        <router-link to="/music/userlist" tag="span">我的歌单</router-link>
        <span class="show-960" @click="$emit('onClickLyric')">歌词</span>
        <router-link to="/music/history" tag="span">我听过的</router-link>
        <router-link to="/music/personlist" tag="span">个人设置</router-link>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.music-btn {
    width: 100%;
    height: 60px;
    font-size: 0;
    white-space: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    span {
        display: inline-block;
        height: 40px;
        box-sizing: border-box;
        margin-right: 8px;
        padding: 0 23px;
        border: 1px solid $btn_color;
        color: $btn_color;
        border-radius: $btn_border_radius;
        font-size: 14px;
        line-height: 40px;
        overflow: hidden;
        cursor: pointer;
        &:nth-last-of-type(1) {
            margin: 0;
        }
        &:hover, &.active {
            border-color: $btn_color_active;
            color: $btn_color_active;
        }
    }
    @media (min-width: 960px) {
        span.show-960 {
            display: none;
        }
    }
    @media (max-width: 960px) {
        span.show-960 {
            display: inline-block;
        }
    }
    @media (max-width: 768px) {
        height: 50px;
        span {
            height: 35px;
            padding: 0 10px;
            margin-right: 6px;
            line-height: 35px;
        }
    }
}
</style>
