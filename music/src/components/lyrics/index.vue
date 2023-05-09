<!--
 * @Author: llxs
 * @Date: 2023-04-19 14:47:07
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 10:29:24
 * @Description: 封面
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <div>
        <dl class="music-info">
            <!--封面-->
            <dt>
                <img :src="musicPicUrl" />
            </dt>
            <template v-if="currentMusic.id">
                <dd>歌曲名：{{ currentMusic.name }}</dd>
                <dd>歌手名：{{ currentMusic.singer }}</dd>
                <dd>专辑名：{{ currentMusic.album }}</dd>
            </template>
            <template v-else>
                <dd>L2xs 在线音乐</dd>
                <dd>
                    <a class="hover" target="_blank" href="https://github.com/chaojiaxi/">
                        <mm-icon type="github" :size="14" />&nbsp;前端摸鱼塘
                    </a>
                </dd>
            </template>
        </dl>
        <!--歌词-->
        <div ref="musicLyric" class="music-lyric">
            <div class="music-lyric-items" :style="lyricTop">
                <p v-if="!currentMusic.id">还没有播放音乐哦！</p>
                <p v-else-if="nolyric">暂无歌词！</p>
                    <template v-else-if="lyric.length > 0">
                        <p v-for="(item, index) in lyric" :key="index" :class="{ on: lyricIndex === index }">
                            {{ item.text }}
                        </p>
                    </template>
                <p v-else>歌词加载失败！</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: 'Lyric',
    props: {
        // 歌词数据
        lyric: {
            type: Array,
            default: () => []
        },
        // 是否无歌词
        nolyric: {
            type: Boolean,
            default: false
        },
        // 当前歌词下标
        lyricIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            top: 0 // 歌词居中
        }
    },
    computed: {

        /**
         * @description: 返回当前音乐的图片
         * @return {*}
         */        
        musicPicUrl() {
            return this.currentMusic.id
            ? `${this.currentMusic.image}?param=300y300`
            : require('../../assets/images/img/player_cover.png')
        },

        /**
         * @description: 当前歌词的位置信息，'translate3d'属性将歌词上下移动，
         * lyricIndex是当前歌词的索引，top是歌词的顶部位置，每个歌词行的高度为34px
         * @return {*}
         */        
        lyricTop() {
            return `transform :translate3d(0, ${-34 * (this.lyricIndex - this.top)}px, 0)`;
        },

        ...mapGetters(['currentMusic'])
    },
    mounted() {

        /**
         * @description: 给窗口的resize事件添加一个监听器
         * @return {*}
         */        
        window.addEventListener('resize', () => {
            // 除之前可能存在的定时器
            clearTimeout(this.resizeTimer);
            // 设置一个新的定时器，延迟60毫秒后执行
            this.resizeTimer = setTimeout(() => this.clacTop(), 60);
        })

        /**
         * @description: 渲染完成后立即执行
         * @return {*}
         */        
        this.$nextTick(() => this.clacTop());
    },
    methods: {
        
        /**
         * @description: 用于计算歌词滚动的位置
         * @return {*}
         */        
        clacTop() {
            // 获取组件中名为musicLyric的DOM元素
            const dom = this.$refs.musicLyric;
            // getComputedStyle函数获取dom元素的样式属性
            const { display = '' } = window.getComputedStyle(dom);
            if (display === 'none') {
                return;
            }
            // 获取dom元素的高度
            const height = dom.offsetHeight;
            // 将height除以34再除以2，向下取整，并将结果赋值给组件的top属性。这个属性用于控制歌词的滚动位置
            // 计算方式：当歌词滚动到第n行时，歌词顶部的位置是(n - top) * 34。这里将top计算为height / 34 / 2，即将歌词滚动到中间位置
            this.top = Math.floor(height / 34 / 2);
        }
    }
}
</script>

<style lang="scss" scoped>
.music-info {
    padding-bottom: 20px;
    text-align: center;
    font-size: $font_size_medium;
    dt {
        position: relative;
        width: 186px;
        height: 186px;
        margin: 0 auto 15px;
        &:after {
            content: '';
            position: absolute;
            left: 9px;
            top: 0;
            width: 201px;
            height: 180px;
            background: url('../../assets/images/img/album_cover_player.png') 0 0 no-repeat;
        }
        img {
            vertical-align: middle;
            width: 186px;
            height: 186px;
        }
    }
    dd {
        height: 30px;
        line-height: 30px;
        @include no-wrap();
    }
}
/*歌词部分*/
.music-lyric {
    position: absolute;
    top: 315px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    text-align: center;
    mask-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.6) 15%,
        rgba(255, 255, 255, 1) 25%,
        rgba(255, 255, 255, 1) 75%,
        rgba(255, 255, 255, 0.6) 85%,
        rgba(255, 255, 255, 0) 100%
    );
    .music-lyric-items {
        text-align: center;
        line-height: 34px;
        font-size: $font_size_small;
        transform: translate3d(0, 0, 0);
        transition: transform 0.6s ease-out;
        @include no-wrap();
        .on {
            color: $lyric_color_active;
        }
    }
}
// 当屏幕小于 960 时
@media (max-width: 960px) {
    .music-info {
        display: none;
    }
    .music-lyric {
        top: 0;
    }
}
</style>
