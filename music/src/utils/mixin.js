/*
 * @Author: llxs
 * @Date: 2023-04-19 19:33:16
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-19 19:33:16
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
import { mapGetters, mapMutations, mapActions } from "vuex";

/** 
 * @description: 实现歌曲列表的选择和播放
 * @return {*}
 */
export const listMixin = {
    computed: {

        /** 
         * @description: // 从vuex中映射获取playing和currentMusic两个状态
         * @return {*}
         */        
        ...mapGetters(['playing', 'currentMusic'])
    },
    methods: {

        /** 
         * @description: 歌曲列表项的选择事件处理函数
         * @param {*} item
         * @param {*} index
         * @return {*}
         */        
        selectItem(item, index) {
            // 如果点击的是当前播放的歌曲
            if (item.id === this.currentMusic.id && this.playing) {
                // 则暂停播放
                this.setPlaying(false)
            } else {
                // 调用vuex中的selectPlay方法，切换到点击的歌曲并播放
                this.selectPlay({
                    list: this.list,
                    index
                })
            }
        },

        /** 
         * @description: 从vuex中映射获取SET_PLAYING这个mutation
         * @return {*}
         */        
        ...mapMutations({
            setPlaying: 'SET_PLAYING'
        }),

        /** 
         * @description: 从vuex中映射获取selectPlay这个action
         * @return {*}
         */        
        ...mapActions(['selectPlay'])
    }
}

/** 
 * @description: 实现组件中的loading状态显示和隐藏功能
 * @return {*}
 */
export const loadMixin = {
    data() {
        return {
            mmLoadShow: true // mmLoadShow变量表示loading状态
        }
    },
    methods: {

        /** 
         * @description: 隐藏loading状态的方法
         * @return {*}
         */        
        _hideLoad() {
            let timer
            clearTimeout(timer)
            timer = setTimeout(() => {
                this.mmLoadShow = false
            }, 200)
        }
    }
}
