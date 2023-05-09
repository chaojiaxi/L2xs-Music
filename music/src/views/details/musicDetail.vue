<!--
 * @Author: llxs
 * @Date: 2023-04-19 19:06:08
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 11:14:59
 * @Description: 歌单详情
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--歌单详情-->
    <div class="details">
        <!-- 加载动画 -->
        <L2xsLoading v-model="mmLoadShow" ></L2xsLoading>
        <!-- 歌单列表 -->
        <MusicList :list="list" @select="selectItem"></MusicList>
    </div>
</template>
  
<script>
import { mapActions } from "vuex";
import { getPlaylistDetail } from "@/api";
import { loadMixin } from "@/utils/mixin";
import L2xsLoading from "@/base/L2xs-loading/index";
import MusicList from "@/components/L2xs-list/index";

export default {
    name: 'Detail',
    components: {
        L2xsLoading,
        MusicList
    },
    mixins: [loadMixin],
    data() {
        return {
            list: [] // 列表
        }
    },
    created() {
        
        /**
         * @description: 获取歌单详情
         * @return {*}
         */        
        getPlaylistDetail(this.$route.params.id).then((playlist) => {
            document.title = `${playlist.name} - L2xs 在线音乐`;
            // 播放列表
            this.list = playlist.tracks;
            // 隐藏加载动画
            this._hideLoad();
        }).catch(() => {
            this._hideLoad();
        })
    },
    methods: {
        
        /**
         * @description: 播放暂停事件
         * @param {*} item
         * @param {*} index
         * @return {*}
         */        
        selectItem(item, index) {
            this.selectPlay({
                list: this.list,
                index
            });
        },
        ...mapActions(['selectPlay'])
    }
}
</script>

<style lang="scss" scoped>
.details {
    .music-list {
        height: 100%;
    }
}
</style>
  