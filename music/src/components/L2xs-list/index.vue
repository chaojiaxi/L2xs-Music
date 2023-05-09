<!--
 * @Author: llxs
 * @Date: 2023-04-19 18:52:14
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 10:24:29
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--歌曲列表-->
    <div class="music-list flex-col">
        <template v-if="list.length > 0">
            <div class="list-item list-header">
                <span class="list-name">歌曲</span>
                <span class="list-artist">歌手</span>
                <span v-if="isDuration" class="list-time">时长</span>
                <span v-else class="list-album">专辑</span>
            </div>
            <div ref="listContent" class="list-content" @scroll="listScroll($event)">
                <div class="list-item"
                    v-for="(item, index) in list"
                    :key="item.id"
                    :class="{ on: playing && currentMusic.id === item.id }"
                    @dblclick="selectItem(item, index, $event)">
                    <span class="list-num" v-text="index + 1"></span>
                    <div class="list-name">
                        <span>{{ item.name }}</span>
                        <div class="list-menu">
                            <mm-icon
                            class="hover"
                            :type="getPlayIconType(item)"
                            :size="40"
                            @click.stop="selectItem(item, index)"
                            />
                        </div>
                    </div>
                    <span class="list-artist">{{ item.singer }}</span>
                    <span v-if="isDuration" class="list-time">
                        {{ item.duration % 3600 | format }}
                        <mm-icon
                            class="hover list-menu-icon-del"
                            type="delete-mini"
                            :size="40"
                            @click.stop="deleteItem(index)"
                        />
                    </span>
                    <span v-else class="list-album">{{ item.album }}</span>
                </div>
                <slot name="listBtn"></slot>
            </div>
        </template>
        <L2xsResult v-else title="怎么啥也没有!快到我的碗里来!" />
    </div>
</template>

<script>
// import {getCheckMusic} from "@/api"
import { mapGetters, mapMutations } from "vuex";
import { format } from "@/utils/util";
import L2xsResult from "@/base/L2xs-result/index";

const LIST_TYPE_ALBUM = 'album'; // 专辑
const LIST_TYPE_DURATION = 'duration'; // 时长
const LIST_TYPE_PULLUP = 'pullup'; // 歌曲

// 触发滚动加载的阈值
const THRESHOLD = 100;

export default {
    name: 'MusicList',
    components: {
        L2xsResult
    },
    filters: {
        format
    },
    props: {
        // 歌曲数据
        list: {
            type: Array,
            default: () => []
        },
        // album: 显示专辑栏目（默认）, duration: 显示时长栏目 , pullup: 开启上拉加载
        listType: {
            type: String,
            default: LIST_TYPE_ALBUM
        }
    },
    data() {
        return {
            lockUp: true // 是否锁定滚动加载事件,默认锁定
        }
    },
    computed: {
        isDuration() {
            return this.listType === LIST_TYPE_DURATION;
        },
        ...mapGetters(['playing', 'currentMusic'])
    },
    watch: {

        /**
         * @description: 下拉刷新列表组件的上拉加载更多数据
         * @param {*} newList
         * @param {*} oldList
         * @return {*}
         */        
        list(newList, oldList) {
            // 
            if (this.listType !== LIST_TYPE_PULLUP) {
                return;
            }
            // 列表滑到底部时，如果检测到新的列表数据已经加载完毕，则将this.lockUp设置为false
            if (newList.length !== oldList.length) {
                this.lockUp = false;
            } else if (newList[newList.length - 1].id !== oldList[oldList.length - 1].id) {
                this.lockUp = false;
            }
        }
    },
    activated() {

        /**
         * @description: 在组件被重新激活时，将组件的滚动位置还原到之前的位置。当组件被切换到其他页面后再返回时，这个函数可以确保组件恢复之前的滚动位置
         * @return {*}
         */        
        this.scrollTop && this.$refs.listContent && (this.$refs.listContent.scrollTop = this.scrollTop)
    },
    methods: {
        
        /**
         * @description: 处理列表滚动事件
         * @param {*} e
         * @return {*} 
         */        
        listScroll(e) {
            // 列表滚动
            const scrollTop = e.target.scrollTop;
            this.scrollTop = scrollTop;
            if (this.listType !== LIST_TYPE_PULLUP || this.lockUp) {
                return;
            }
            // 滚动条内容区域的高度scrollHeight和滚动条本身的高度offsetHeight
            const { scrollHeight, offsetHeight } = e.target;
            if (scrollTop + offsetHeight >= scrollHeight - THRESHOLD) {
                // 锁定滚动加载
                this.lockUp = true;
                // 触发滚动加载事件
                this.$emit('pullUp');
            }
        },
        
        /**
         * @description: 回到顶部
         * @return {*}
         */        
        scrollTo() {
            this.$refs.listContent.scrollTop = 0;
        },
        
        /**
         * @description: 处理播放暂停事件
         * @param {*} item 被点击的项目
         * @param {*} index 项目在列表中的索引
         * @param {*} e 事件对象
         * @return {*}
         */        
        selectItem(item, index, e) {
            // 判断是否存在事件对象e
            if (e && /list-menu-icon-del/.test(e.target.className)) {
                return;
            }
            // 当前音乐的id存在，则调用setPlaying方法来切换播放状态
            if (this.currentMusic.id && item.id === this.currentMusic.id) {
                this.setPlaying(!this.playing);
                return;
            }
            // 触发点击播放事件
            this.$emit('select', item, index);
        },
        
        /**
         * @description: 根据当前音乐的状态返回播放按钮的图标类型
         * @param {*} id 某个音乐的id
         * @return {*}
         */        
        getPlayIconType({ id: itemId }) {
            // playing代表当前音乐是否正在播放，currentMusic代表当前正在播放的音乐
            const { playing, currentMusic: { id } } = this;
            // 判断当前音乐的播放状态和传入的参数中的id是否相等
            return playing && id === itemId ? 'pause-mini' : 'play-mini';
        },
        
        /**
         * @description: 删除事件
         * @param {*} index
         * @return {*}
         */        
        deleteItem(index) {
            this.$emit('del', index); // 触发删除事件
        },

        ...mapMutations({
            setPlaying: 'SET_PLAYING'
        })
    }
}
</script>

<style lang="scss" scoped>
.music-list {
    height: 100%;
}
.list-header {
    border-bottom: 1px solid $list_head_line_color;
    color: $text_color_active;
    .list-name {
        padding-left: 40px;
        user-select: none;
    }
}
.list-content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.list-no {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: $text_color;
}
.list-item {
    display: flex;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid $list_item_line_color;
    line-height: 50px;
    overflow: hidden;
    &.list-item-no {
        justify-content: center;
        align-items: center;
    }
    &.on {
        color: #fff;
        // 音乐播放动图
        .list-num {
            font-size: 0;
            background: url('../../assets/images/img/wave.gif') no-repeat center center;
        }
    }
    &:hover {
        .list-name {
            padding-right: 80px;
            .list-menu {
                display: block;
            }
        }
    }
    &:not([class*='list-header']):hover {
        .list-name {
            padding-right: 80px;
            .list-menu {
                display: block;
            }
        }
        .list-time {
            font-size: 0;
            .list-menu-icon-del {
                display: block;
            }
        }
    }
    .list-num {
        display: block;
        width: 30px;
        margin-right: 10px;
        text-align: center;
    }
    .list-name {
        position: relative;
        flex: 1;
        box-sizing: border-box;
        & > span {
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        small {
            margin-left: 5px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
        }
        /*hover菜单*/
        .list-menu {
            display: none;
            position: absolute;
            top: 50%;
            right: 10px;
            height: 40px;
            font-size: 0;
            transform: translateY(-50%);
        }
    }
    .list-artist, .list-album {
        display: block;
        width: 300px;
        @include no-wrap();
        @media (max-width: 1440px) {
            width: 200px;
        }
        @media (max-width: 1200px) {
            width: 150px;
        }
    }
    .list-time {
        display: block;
        width: 60px;
        position: relative;
        .list-menu-icon-del {
            display: none;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        }
    }
}
.list-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    span {
        padding: 5px 20px;
        cursor: pointer;
        user-select: none;
        &:hover {
            color: $text_color_active;
        }
    }
}
@media (max-width: 960px) {
    .list-item .list-name {
        padding-right: 70px;
    }
}
@media (max-width: 768px) {
    .list-item {
        .list-name .list-menu {
            display: block;
        }
        .list-artist, .list-album {
            width: 20%;
        }
    }
}
@media (max-width: 640px) {
    .list-item {
        .list-artist {
            width: 80px;
        }
        .list-album, .list-time {
            display: none;
        }
    }
}
</style>
  