<!--
 * @Author: llxs
 * @Date: 2023-04-19 19:11:17
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 09:20:18
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--正在播放-->
    <div class="playList">
        <!-- 正在播放列表 -->
        <music-list :list="playlist" list-type="duration" @select="selectItem" @del="deleteItem">
            <div slot="listBtn" class="list-btn">
            <span @click="$refs.dialog.show()">清空列表</span>
            </div>
        </music-list>
        <!-- 弹窗 -->
        <L2xsDialog
            ref="dialog"
            body-text="是否清空正在播放列表"
            confirm-btn-text="清空"
            @confirm="clearList"
        ></L2xsDialog>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import MusicList from "@/components/L2xs-list/index";
import L2xsDialog from "@/base/L2xs-dialog/index";

export default {
    name: 'PlayList',
    components: {
        MusicList,
        L2xsDialog
    },
    data() {
        return {
            show: false
        }
    },
    computed: {
        ...mapGetters(['playing', 'playlist', 'currentMusic'])
    },
    methods: {
        
        /**
         * @description: 清空列表事件
         * @return {*}
         */        
        clearList() {
            this.clearPlayList();
            this.$mmToast('列表清空成功');
        },
        
        /**
         * @description: 播放暂停事件
         * @param {*} item
         * @param {*} index
         * @return {*}
         */        
        selectItem(item, index) {
            if (item.id !== this.currentMusic.id) {
                this.setCurrentIndex(index);
                this.setPlaying(true);
            }
        },
        
        /**
         * @description: 删除事件
         * @param {*} index
         * @return {*}
         */        
        deleteItem(index) {
            let list = [...this.playlist];
            list.splice(index, 1);
            this.removerPlayListItem({ list, index });
            this.$mmToast('删除成功');
        },

        /**
         * @description: 
         * @return {*}
         */        
        ...mapMutations({
            setPlaying: 'SET_PLAYING',
            setCurrentIndex: 'SET_CURRENTINDEX',
            clearPlaylist: 'CLEAR_PLAYLIST'
        }),

        /**
         * @description: 
         * @return {*}
         */        
        ...mapActions(['removerPlayListItem', 'clearPlayList'])
    }
}
</script>
  