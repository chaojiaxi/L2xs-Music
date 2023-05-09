<!--
 * @Author: llxs
 * @Date: 2023-04-19 19:08:53
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 11:17:57
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--我听过的（播放历史）-->
    <div class="historyList">
        <!-- 历史列表 -->
        <MusicList :list="historyList" list-type="duration" @select="selectItem" @del="deleteItem">
            <div slot="listBtn" class="list-btn">
                <span @click="$refs.dialog.show()">清空列表</span>
            </div>
        </MusicList>
        <!-- 是否清空播放历史列表 -->
        <L2xsDialog
            ref="dialog"
            body-text="是否清空播放历史列表"
            confirm-btn-text="清空"
            @confirm="clearList">
        </L2xsDialog>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import MusicList from "@/components/L2xs-list/index";
import L2xsDialog from "@/base/L2xs-dialog/index";

export default {
    name: 'HistoryList',
    components: {
        MusicList,
        L2xsDialog
    },
    computed: {
        ...mapGetters(['historyList', 'playing', 'currentMusic'])
    },
    methods: {
        
        /**
         * @description: 清空列表事件
         * @return {*}
         */        
        clearList() {
            this.clearHistory()
            this.$mmToast('列表清空成功')
        },
        
        /**
         * @description: 播放事件
         * @param {*} item
         * @param {*} index
         * @return {*}
         */        
        selectItem(item, index) {
            this.selectPlay({
                list: this.historyList,
                index
            })
        },
        
        /**
         * @description: 删除事件
         * @param {*} index
         * @return {*}
         */        
        deleteItem(index) {
            let list = [...this.historyList]
            list.splice(index, 1)
            this.removeHistory(list)
            this.$mmToast('删除成功')
        },

        ...mapMutations({
            setPlaying: 'SET_PLAYING'
        }),
        
        ...mapActions(['selectPlay', 'clearHistory', 'removeHistory'])
    }
}
</script>