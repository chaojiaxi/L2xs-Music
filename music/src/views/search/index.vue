<!--
 * @Author: llxs
 * @Date: 2023-04-19 19:13:23
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 11:33:43
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--搜索-->
    <div class="search flex-col">
        <mm-loading v-model="mmLoadShow" />
        <div class="search-head">
            <span v-for="(item, index) in Artists" :key="index" @click="clickHot(item.first)">
                {{ item.first }}
            </span>
            <input
                v-model.trim="searchValue"
                class="search-input"
                type="text"
                placeholder="音乐/歌手"
                @keyup.enter="onEnter"/>
        </div>
        <div class="flex-1 overflow-hidden">
            <music-list
                ref="musicList"
                :list="list"
                list-type="pullup"
                @select="selectItem"
                @pullUp="pullUpLoad"/>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { search, searchHot, getMusicDetail } from "@/api";
import { toHttps } from "@/utils/util";
import { loadMixin } from "@/utils/mixin";
import { formatSongs } from "@/utils/song";
import MmLoading from "@/base/L2xs-loading/index";
import MusicList from "@/components/L2xs-list/index";

export default {
    name: 'Search',
    components: {
        MmLoading,
        MusicList
    },
    mixins: [loadMixin],
    data() {
        return {
            searchValue: '', // 搜索关键词
            Artists: [], // 热搜数组
            list: [], // 搜索数组
            page: 0, // 分页
            lockUp: true // 是否锁定上拉加载事件,默认锁定
        }
    },
    computed: {
        ...mapGetters(['playing', 'currentMusic'])
    },
    watch: {

        /**
         * @description: 
         * @param {*} newList
         * @param {*} oldList
         * @return {*}
         */        
        list(newList, oldList) {
            // console.log(newList,'newList')
            // console.log(oldList,'oldList')
            if (newList.length !== oldList.length) {
                // 下拉加载
                this.lockUp = false;
            } else if (newList[newList.length - 1].id !== oldList[oldList.length - 1].id) {
                // 检查最后一个元素
                this.lockUp = false;
            }
        }
    },
    created() {
        
        /**
         * @description: 获取前五个热搜
         * @return {*}
         */        
        searchHot().then(({ result }) => {
            // console.log(result,'result')
            this.Artists = result.hots.slice(0, 5);
            this.mmLoadShow = false;
        })
    },
    methods: {
        /**
         * @description: 点击热搜，searchValue搜索框显示热搜名字，并搜索
         * @param {*} name
         * @return {*}
         */        
        clickHot(name) {
            this.searchValue = name;
            this.onEnter();
        },
        
        /**
         * @description: 搜索事件
         * @return {*}
         */        
        onEnter() {
            // 正则表达式将搜索内容的前后空格去除
            if (this.searchValue.replace(/(^\s+)|(\s+$)/g, '') === '') {
                this.$mmToast('搜索内容不能为空！');
                return;
            }
            // true显示加载动画
            this.mmLoadShow = true;
            this.page = 0;
            if (this.list.length > 0) {
                // 当前列表中已经存在歌曲数据，则将页面滚动到列表的顶部
                this.$refs.musicList.scrollTo();
            }
            // 传入搜索内容作为参数
            search(this.searchValue).then(({ result }) => {
                this.list = formatSongs(result.songs);
                this._hideLoad();
            })
        },
        
        /**
         * @description: 滚动加载事件
         * @return {*}
         */        
        pullUpLoad() {
            this.page += 1;
            search(this.searchValue, this.page).then(({ result }) => {
                if (!result.songs) {
                    // 滚动到底部了
                    this.$mmToast('没有更多歌曲啦！');
                    return;
                }
                this.list = [...this.list, ...formatSongs(result.songs)];
            })
        },
        
        /**
         * @description: 播放歌曲
         * @param {*} music
         * @return {*}
         */        
        async selectItem(music) {
            try {
                const image = await this._getMusicDetail(music.id);
                music.image = toHttps(image);
                this.selectAddPlay(music);
            } catch (error) {
                this.$mmToast('哎呀，出错啦~');
            }
        },
        
        /**
         * @description: 获取歌曲详情
         * @param {*} id
         * @return {*}
         */        
        _getMusicDetail(id) {
            return getMusicDetail(id).then((res) => res.songs[0].al.picUrl);
        },

        ...mapMutations({
            setPlaying: 'SET_PLAYING'
        }),

        ...mapActions(['selectAddPlay'])
    }
}
</script>

<style lang="scss" scoped>
.search {
    overflow: hidden;
    height: 100%;
    .search-head {
        display: flex;
        height: 40px;
        padding: 10px 15px;
        overflow: hidden;
        background: $search_bg_color;
        span {
            line-height: 40px;
            margin-right: 15px;
            cursor: pointer;
            &:hover {
                color: $text_color_active;
            }
            @media (max-width: 640px) {
                & {
                    display: none;
                }
            }
        }
        .search-input {
            flex: 1;
            height: 40px;
            box-sizing: border-box;
            padding: 0 15px;
            border: 1px solid $btn_color;
            outline: 0;
            background: transparent;
            color: $text_color_active;
            font-size: $font_size_medium;
            box-shadow: 0 0 1px 0 #fff inset;
            &::placeholder {
                color: $text_color;
            }
        }
    }
}
</style>
  