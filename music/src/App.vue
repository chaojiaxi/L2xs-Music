<!--
 * @Author: llxs
 * @Date: 2023-03-20 19:33:18
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-27 18:08:18
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <div id="app">
        <!-- 头部 -->
        <L2xsHeader></L2xsHeader>
        <!-- 路由 -->
        <router-view />
        <!--更新说明-->
        <L2xsDialog ref="versionDialog" type="alert" head-text="更新提示" :body-text="versionInfo" ></L2xsDialog>
        <!--播放器-->
        <audio ref="L2xs"></audio>
    </div>
</template>

<script>
import { getPlaylistDetail } from "@/api";
import { mapMutations, mapActions } from "vuex";
import { MMPLAYER_CONFIG, VERSION } from "@/config";
import { getVersion, setVersion } from "@/utils/storage";
import L2xsDialog from "@/base/L2xs-dialog/index";
import L2xsHeader from "@/components/L2xs-header/index";

// 显示更新版本信息
const VERSION_INFO = `<div class="mm-dialog-text text-left">
版本号：${VERSION}（${process.env.VUE_APP_UPDATE_TIME}）<br/>
1、 采用新版图标<br>
2、 修复音乐搜索<br>
3、 优化滚动条样式
</div>`

export default {
    name: '',
    components: {
        L2xsHeader,
        L2xsDialog
    },
    created() {
        
        /**
         * @description: 设置版本更新信息
         * @param {*}
         * @return {*}
         */        
        this.versionInfo = VERSION_INFO;
        // this.$refs.versionDialog.show();
        // console.log(this.versionInfo,'111111111')

        /**
         * @description: 获取指定播放列表，100条歌曲
         * @param {*}
         * @return {*}
         */                
        getPlaylistDetail(MMPLAYER_CONFIG.PLAYLIST_ID).then((playlist) => {
            const list = playlist.tracks.slice(0, 100);
            // 当前播放列表
            this.setPlaylist({ list });
        })

        /**
         * @description: 页面失去焦点或重新获得焦点时改变文档标题title
         * @param {*}
         * @return {*}
         */               
        let OriginTitile = document.title;
        let titleTime;
        // 监听页面是否隐藏的事件
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                // 如果页面被隐藏，则设置新的文档标题
                document.title = '死鬼去哪里了！';
                clearTimeout(titleTime);
            } else {
                // 如果页面重新获得焦点，则恢复原始的文档标题
                document.title = '(つェ⊂)咦!又好了!';
                titleTime = setTimeout(function () {
                    document.title = OriginTitile;
                }, 2000)
            }
        })

        /**
         * @description: 设置audio元素
         * @param {*}
         * @return {*}
         */        
        this.$nextTick(() => {
            this.setAudioele(this.$refs.L2xs);
        })

        /**
         * @description: 首次加载完成后移除动画
         * @param {*}
         * @return {*}
         */    
        // 获取页面上的加载动画元素    
        let loadDOM = document.querySelector('#appLoading');
        if (loadDOM) {
            // 定义一个animationend事件回调函数
            const animationendFunc = function () {
                // 移除animationend和webkitAnimationEnd事件监听器
                loadDOM.removeEventListener('animationend', animationendFunc);
                loadDOM.removeEventListener('webkitAnimationEnd', animationendFunc);
                // 从文档中移除加载动画元素
                document.body.removeChild(loadDOM);
                loadDOM = null;
                 // 获取当前版本
                const version = getVersion();
                if (version !== null) {

                    setVersion(VERSION);
                    // 如果当前版本与记录的版本不一致，则显示对话框
                    if (version !== VERSION) {
                        // 版本修改则弹窗显示更新版本信息
                        this.$refs.versionDialog.show();
                    }
                } else {
                    // 如果不存在版本记录，则设置版本为当前版本，并显示对话框
                    setVersion(VERSION);
                    this.$refs.versionDialog.show();
                }
            }.bind(this)
            // 添加animationend和webkitAnimationEnd事件监听器
            loadDOM.addEventListener('animationend', animationendFunc);
            loadDOM.addEventListener('webkitAnimationEnd', animationendFunc);
            // 添加CSS类来触发加载动画的移除动画效果
            loadDOM.classList.add('removeAnimate');
        }
    },
    methods: {

        /**
         * @description: 
         * @param {*}
         * @return {*}
         */        
        ...mapMutations({ setAudioele: 'SET_AUDIOELE' }),
        ...mapActions([ 'setPlaylist' ])
    }
}
</script>

<style lang="scss">
#app {
    position: relative;
    width: 100%;
    height: 100%;
    color: $text_color;
    font-size: $font_size_medium;
    audio {
        position: fixed;
    }
}
</style>