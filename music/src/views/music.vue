<!--
* @Author: llxs
* @Date: 2023-04-19 10:14:58
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 14:07:35
* @Description: 
* @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <div class="music flex-col">
        <!-- 音乐内容区 -->
        <div class="music-content">
            <div class="music-left flex-col">
                <music-btn @onClickLyric="handleOpenLyric" />
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive" class="router-view" />
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive" :key="$route.path" class="router-view" />
            </div>
            <div class="music-right" :class="{ show: lyricVisible }">
                <div class="close-lyric" @click="handleCloseLyric">关闭歌词</div>
                <Lyric ref="lyric" :lyric="lyric" :nolyric="nolyric" :lyric-index="lyricIndex" />
            </div>
        </div>

        <!--播放器-->
        <div class="music-bar" :class="{ disable: !musicReady || !currentMusic.id }">
            <!-- 控制器 -->
            <div class="music-bar-btns">
                <mm-icon class="pointer" type="prev" :size="36" title="上一曲 Ctrl + Left" @click="prev" />
                <div class="control-play pointer" title="播放暂停 Ctrl + Space" @click="play">
                    <mm-icon :type="playing ? 'pause' : 'play'" :size="24" />
                </div>
                <mm-icon class="pointer" type="next" :size="36" title="下一曲 Ctrl + Right" @click="next" />
            </div>
            <div class="music-music">
                <div class="music-bar-info">
                    <!-- 歌名-歌手 -->
                    <template v-if="currentMusic && currentMusic.id">
                        {{ currentMusic.name }}
                        <span>- {{ currentMusic.singer }}</span>
                    </template>
                    <template v-else>欢迎使用 L2xs 在线音乐</template>
                </div>
                <!-- 歌曲时长 -->
                <div v-if="currentMusic.id" class="music-bar-time">
                    {{ currentTime | format }}/{{ currentMusic.duration % 3600 | format }}
                </div>
                <!-- 歌曲进度条 -->
                <L2xsProgress
                    class="music-progress"
                    :percent="percentMusic"
                    :percent-progress="currentProgress"
                    @percentChange="progressMusic"
                    @percentChangeEnd="progressMusicEnd">
                </L2xsProgress>
            </div>

            <!-- 播放模式 -->
            <mm-icon
                class="icon-color pointer mode"
                :size="30"
                :type="getModeIconType()"
                :title="getModeIconTitle()"
                @click="modeChange">
            </mm-icon>

            <!-- 歌曲评论 -->
            <mm-icon class="icon-color pointer comment" type="comment" :size="30" @click="openComment" />

            <!-- 音量控制 -->
            <div class="music-bar-volume" title="音量加减 [Ctrl + Up / Down]">
                <volume :volume="volume" @volumeChange="volumeChange" />
            </div>
        </div>

        <!--背景板-->
        <div class="L2xsPlayer-bg" :style="{ backgroundImage: picUrl }"></div>
        <!--遮罩-->
        <div class="L2xsPlayer-mask"></div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getLyric } from "@/api";
import { randomSortArray, parseLyric, format, silencePromise } from "@/utils/util";
import { PLAY_MODE, MMPLAYER_CONFIG } from "@/config";
import { getVolume, setVolume } from "@/utils/storage";
import L2xsPlayerMusic from "./musicPlayer";
import L2xsProgress from "@/base/L2xs-progress/index";
import MusicBtn from "@/components/L2xs-button/index";
import Lyric from "@/components/lyrics/index";
import Volume from "@/components/volume/index";

export default {
    name: 'Music',
    components: {
        L2xsProgress,
        MusicBtn,
        Lyric,
        Volume
    },
    filters: {
        
        /**
         * @description: 时间格式化
         * @return {*}
         */        
        format
    },
    data() {
        const volume = getVolume()
        return {
            musicReady: false, // 是否可以使用播放器
            currentTime: 0, // 当前播放时间
            currentProgress: 0, // 当前缓冲进度
            lyricVisible: false, // 移动端歌词显示
            lyric: [], // 歌词
            nolyric: false, // 是否有歌词
            lyricIndex: 0, // 当前播放歌词下标
            isMute: false, // 是否静音
            volume // 音量大小
        }
    },
    computed: {
        
        /**
         * @description: 背景板
         * @return {*}
         */        
        picUrl() {
            return this.currentMusic.id && this.currentMusic.image
            ? `url(${this.currentMusic.image}?param=300y300)`
            : `url(${MMPLAYER_CONFIG.BACKGROUND})`
        },

        /**
         * @description: 音乐进度条
         * @return {*}
         */        
        percentMusic() {
            const duration = this.currentMusic.duration;
            // console.log(this.currentMusic,'this.currentMusic')
            // this.currentTime-当前音乐已经播放的时间，duration-获取当前音乐的总时长
            return this.currentTime && duration ? this.currentTime / duration : 0;
        },

        /**
         * @description: 
         * @return {*}
         */        
        ...mapGetters([
            'audioEle',
            'mode',
            'playing',
            'playlist',
            'orderList',
            'currentIndex',
            'currentMusic',
            'historyList'
        ])
    },
    watch: {
        currentMusic(newMusic, oldMusic) {
            if (!newMusic.id) {
                this.lyric = [];
                return;
            }
            if (newMusic.id === oldMusic.id) {
            return;
            }
            this.audioEle.src = newMusic.url;
            // 重置相关参数
            this.lyricIndex = this.currentTime = this.currentProgress = 0;
            silencePromise(this.audioEle.play());
            this.$nextTick(() => {
            this._getLyric(newMusic.id);
            })
        },
        playing(newPlaying) {
            const audio = this.audioEle;
            this.$nextTick(() => {
            newPlaying ? silencePromise(audio.play()) : audio.pause();
            this.musicReady = true;
            })
        },
        currentTime(newTime) {
            if (this.nolyric) {
            return;
            }
            let lyricIndex = 0;
            for (let i = 0; i < this.lyric.length; i++) {
            if (newTime > this.lyric[i].time) {
                lyricIndex = i;
            }
            }
            this.lyricIndex = lyricIndex;
        },
        $route() {
            this.lyricVisible = false;
        }
    },
    mounted() {
        this.$nextTick(() => {
            L2xsPlayerMusic.initAudio(this);
            this.initKeyDown();
            this.volumeChange(this.volume);
        })
    },
    methods: {

        /**
         * @description: 初始化按键监听事件
         * @return {*}
         */        
        initKeyDown() {
            document.onkeydown = (e) => {
                switch (e.ctrlKey && e.keyCode) {
                    // 播放或暂停音乐Ctrl + Space
                    case 32: {
                        this.play();
                        break;
                    }
                    // 切换到上一首歌曲Ctrl + Left
                    case 37: {
                        this.prev();
                        break;
                    }
                    // 音量增加Ctrl + Up
                    case 38: {
                        let plus = Number((this.volume += 0.1).toFixed(1));
                        if (plus > 1) {
                            plus = 1;
                        }
                        this.volumeChange(plus);
                        break;
                    }
                    // 切换到下一首歌曲Ctrl + Right
                    case 39: {
                        this.next();
                        break;
                    }
                    // 音量减小Ctrl + Down
                    case 40: {
                        let reduce = Number((this.volume -= 0.1).toFixed(1));
                        if (reduce < 0) {
                            reduce = 0;
                        }
                        this.volumeChange(reduce);
                        break;
                    }
                    // 切换播放模式Ctrl + O
                    case 79: {
                        this.modeChange();
                        break;
                    }
                }
            }
        },
        
        /**
         * @description: 切换到上一首歌曲
         * @return {*}
         */        
        prev() {
            // 当前音乐未加载完毕，则直接返回
            if (!this.musicReady) {
                return;
            }
            // 当前播放列表中只有一首歌曲，则循环播放这首歌曲
            if (this.playlist.length === 1) {
                this.loop();
            } else {
                // 当前播放列表中有多首歌曲，则切换到上一首歌曲，如果当前已经是第一首歌曲，则切换到最后一首歌曲
                let index = this.currentIndex - 1;
                if (index < 0) {
                    index = this.playlist.length - 1;
                }
                this.setCurrentIndex(index);
                // 当前处于暂停状态，但音乐已经加载完毕，则将播放状态设置为 true，继续播放
                if (!this.playing && this.musicReady) {
                    this.setPlaying(true);
                }
                // 音乐加载状态
                this.musicReady = false;
            }
        },
        
        /**
         * @description: 播放或暂停音乐
         * @return {*}
         */        
        play() {
            if (!this.musicReady) {
                return;
            }
            // 播放状态设置为相反的值，如果原来是播放状态，则暂停，如果原来是暂停状态，则继续播放
            this.setPlaying(!this.playing);
        },

        /**
         * @description: 切换到下一首歌曲，当 flag 为 true 时，表示上一曲播放失败
         * @param {*} flag
         * @return {*}
         */        
        next(flag = false) {
            // 如果音乐还未准备好，则直接返回
            if (!this.musicReady) {
                return;
            }
            // 获取当前播放列表的长度
            const { playlist: { length } } = this;
            // 当前播放模式为顺序播放，且当前已经是最后一首歌曲
            if ( (length - 1 === this.currentIndex && this.mode === PLAY_MODE.ORDER) || (length === 1 && flag)) {
                // 将当前歌曲索引设置为 -1，表示停止播放
                this.setCurrentIndex(-1);
                // 将播放状态设置为 false，表示停止播放
                this.setPlaying(false);
                return;
            }
            // 播放下一首歌曲
            if (length === 1) {
                // 如果列表只有一首歌曲，则循环播放该歌曲
                this.loop();
            } else {
                // 如果列表有多首歌曲，则按列表循环播放下一首
                let index = this.currentIndex + 1;
                if (index === length) {
                    index = 0;
                }
                if (!this.playing && this.musicReady) {
                    // 如果播放状态为 false 且音乐已准备好，则将播放状态设置为 true
                    this.setPlaying(true);
                }
                // 将当前歌曲索引设置为下一首歌曲的索引
                this.setCurrentIndex(index);
                // 将音乐准备状态设置为 false，表示需要等待音乐加载完成后才能播放
                this.musicReady = false;
            }
        },
        
        /**
         * @description: 循环播放
         * @return {*}
         */        
        loop() {
            // 重置音乐播放时间
            this.audioEle.currentTime = 0;
            // 播放音乐
            silencePromise(this.audioEle.play());
            // 当前音乐状态为播放中
            this.setPlaying(true);
            // 如果有歌词，则重置歌词索引
            if (this.lyric.length > 0) {
                this.lyricIndex = 0;
            }
        },
        
        /**
         * @description: 修改音乐显示时长
         * @param {*} percent
         * @return {*}
         */        
        progressMusic(percent) {
            this.currentTime = this.currentMusic.duration * percent;
        },
        
        /**
         * @description: 修改音乐进度
         * @param {*} percent
         * @return {*}
         */        
        progressMusicEnd(percent) {
            this.audioEle.currentTime = this.currentMusic.duration * percent;
        },
        
        /**
         * @description: 切换播放模式
         * @return {*}
         */        
        modeChange() {
            // 切换播放模式
            const mode = (this.mode + 1) % 4;
            this.setPlayMode(mode);
            // 如果是循环播放，则直接返回
            if (mode === PLAY_MODE.LOOP) {
                return;
            }
            // 根据不同播放模式对歌曲列表进行处理
            let list = [];
            switch (mode) {
                case PLAY_MODE.LIST_LOOP:
                case PLAY_MODE.ORDER:
                    list = this.orderList;
                    break;
                case PLAY_MODE.RANDOM:
                    list = randomSortArray(this.orderList);
                    break;
            }
            // 重置当前播放索引并设置新的播放列表
            this.resetCurrentIndex(list);
            this.setPlaylist(list);
        },
        
        /**
         * @description: 修改当前歌曲索引
         * @param {*} list
         * @return {*}
         */        
        resetCurrentIndex(list) {
            // 重置当前播放索引
            const index = list.findIndex((item) => {
                return item.id === this.currentMusic.id;
            })
            this.setCurrentIndex(index);
        },
        
        /**
         * @description: 音乐评论事件
         * @return {*}
         */        
        openComment() {
            if (!this.currentMusic.id) {
                this.$mmToast('还没有播放歌曲哦！');
                return false;
            }
            this.$router.push(`/music/comment/${this.currentMusic.id}`);
        },
        
        /**
         * @description: 修改音量大小
         * @param {*} percent
         * @return {*}
         */        
        volumeChange(percent) {
            // 是否是静音状态
            percent === 0 ? (this.isMute = true) : (this.isMute = false);
            this.volume = percent;
            this.audioEle.volume = percent;
            setVolume(percent);
        },
        
        /**
         * @description: 获取播放模式 icon
         * @return {*}
         */        
        getModeIconType() {
            return {
                [PLAY_MODE.LIST_LOOP]: 'loop',
                [PLAY_MODE.ORDER]: 'sequence',
                [PLAY_MODE.RANDOM]: 'random',
                [PLAY_MODE.LOOP]: 'loop-one'
            }[this.mode]
        },
        
        /**
         * @description: 获取播放模式 title
         * @return {*}
         */        
        getModeIconTitle() {
            const key = 'Ctrl + O';
            return {
                [PLAY_MODE.LIST_LOOP]: `列表循环 ${key}`,
                [PLAY_MODE.ORDER]: `顺序播放 ${key}`,
                [PLAY_MODE.RANDOM]: `随机播放 ${key}`,
                [PLAY_MODE.LOOP]: `单曲循环 ${key}`
            }[this.mode]
        },
        
        /**
         * @description: 查看歌词
         * @return {*}
         */        
        handleOpenLyric() {
            this.lyricVisible = true;
            this.$nextTick(() => {
                this.$refs.lyric.clacTop();
            })
        },
        
        /**
         * @description: 关闭歌词
         * @return {*}
         */        
        handleCloseLyric() {
            this.lyricVisible = false;
        },
        
        /**
         * @description: 获取歌词
         * @param {*} id
         * @return {*}
         */        
        _getLyric(id) {
            getLyric(id).then((res) => {
                if (res.lrc && res.lrc.lyric) {
                    this.nolyric = false;
                    this.lyric = parseLyric(res.lrc.lyric);
                } else {
                    this.nolyric = true;
                }
                silencePromise(this.audioEle.play());
            })
        },

        ...mapMutations({
            setPlaying: 'SET_PLAYING',
            setPlaylist: 'SET_PLAYLIST',
            setCurrentIndex: 'SET_CURRENTINDEX'
        }),

        ...mapActions(['setHistory', 'setPlayMode'])
    }
}
</script>

<style lang="scss">
.router-view {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.music {
    padding: 75px 25px 25px 25px;
    width: 100%;
    max-width: 1750px;
    margin: 0 auto;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .music-content {
        display: flex;
        flex: 1;
        overflow: hidden;
        width: 100%;
        .music-left {
            flex: 1;
            width: 100%;
            overflow: hidden;
        }
        .music-right {
            position: relative;
            width: 310px;
            margin-left: 10px;
            .close-lyric {
                position: absolute;
                top: 0;
                z-index: 1;
                cursor: pointer;
            }
        }
    }
    /*底部*/
    .music-bar {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 15px 0;
        color: #fff;
        &.disable {
            pointer-events: none;
            opacity: 0.6;
        }
        .icon-color {
            color: #fff;
        }
        .music-bar-btns {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 180px;
            .control-play {
                @include flex-center();
                border-radius: 50%;
                width: 40px;
                height: 40px;
                color: #fff;
                background-color: rgba(255, 255, 255, 0.3);
            }
        }
        @include flex-center();
        .btn-prev {
            width: 19px;
            min-width: 19px;
            height: 20px;
            background-position: 0 -30px;
        }
        .btn-play {
            width: 21px;
            min-width: 21px;
            height: 29px;
            margin: 0 50px;
            background-position: 0 0;
            &.btn-play-pause {
            background-position: -30px 0;
            }
        }
        .btn-next {
            width: 19px;
            min-width: 19px;
            height: 20px;
            background-position: 0 -52px;
        }
        .music-music {
            position: relative;
            width: 100%;
            flex: 1;
            box-sizing: border-box;
            padding-left: 40px;
            font-size: $font_size_small;
            color: $text_color_active;
            .music-bar-info {
                height: 15px;
                padding-right: 80px;
                line-height: 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            .music-bar-time {
                position: absolute;
                top: 0;
                right: 5px;
            }
        }
        .mode,
        .comment,
        .music-bar-volume {
            margin-left: 20px;
        }
        // 音量控制
        .volume-wrapper {
            margin-left: 20px;
            width: 150px;
        }
    }
    /*遮罩*/
    .L2xsPlayer-mask,
    .L2xsPlayer-bg {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
    }

    .L2xsPlayer-mask {
        z-index: -1;
        background-color: $mask_color;
    }

    .L2xsPlayer-bg {
        z-index: -2;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        filter: blur(12px);
        opacity: 0.7;
        transition: all 0.8s;
        transform: scale(1.1);
    }
    @media (min-width: 960px) {
        .close-lyric {
            display: none;
        }
    }
    //当屏幕小于960时
    @media (max-width: 960px) {
        .music-right {
            display: none;
            &.show {
                display: block;
                margin-left: 0;
                width: 100%;
            }
        }
    }
    //当屏幕小于768时
    @media (max-width: 768px) {
        padding: 75px 15px 5px 15px;
        .music-bar {
            padding-top: 10px;
                .music-bar-info span,
                .music-bar-volume .mmProgress {
                display: none;
            }
        }
    }
    //当屏幕小于520时
    @media (max-width: 520px) {
        .music-bar {
            position: relative;
            flex-direction: column;
            .music-bar-btns {
                width: 60%;
                margin-top: 10px;
                order: 2;
            }
            .music-music {
                padding-left: 0;
                order: 1;
            }
            .mode,.comment {
                position: absolute;
                bottom: 20px;
                margin: 0;
            }
            .mode {
                
            }
            .comment {
                right: 5px;
            }
            .music-bar-volume {
                display: none;
            }
        }
    }
}
</style>
