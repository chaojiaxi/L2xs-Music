<!--
 * @Author: llxs
 * @Date: 2023-04-19 19:23:25
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-28 11:37:17
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--我的歌单-->
    <div class="userList">
        <!-- 加载动画 -->
        <L2xsLoading v-model="mmLoadShow"></L2xsLoading>
        <!-- 歌单 -->
        <template v-if="list.length > 0">
            <div v-for="item in formatList" :key="item.id" class="list-item" :title="item.name">
                <router-link :to="{ path: `/music/details/${item.id}` }" tag="div" class="userList-item">
                    <img v-lazy="`${item.coverImgUrl}?param=200y200`" class="cover-img" />
                    <span class="trackCount">{{ item.trackCount }}</span>
                    <h3 class="name">{{ item.name }}</h3>
                </router-link>
            </div>
        </template>
        <L2xsResult v-else title="啥也没有哦，快到我的碗里来！"></L2xsResult>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getUserPlaylist } from "@/api";
import { loadMixin } from "@/utils/mixin";
import L2xsLoading from "@/base/L2xs-loading/index";
import L2xsResult from "@/base/L2xs-result/index";

export default {
    name: 'PlayList',
    components: {
        L2xsLoading,
        L2xsResult
    },
    mixins: [loadMixin],
    data() {
        return {
            list: [], // 列表
        }
    },
    computed: {
        formatList() {
            // trackCount:歌单数量
            return this.list.filter((item) => item.trackCount > 0);
        },
        ...mapGetters(['uid'])
    },
    watch: {
        uid(newUid) {
            if (newUid) {
                this.mmLoadShow = true;
                this._getUserPlaylist(newUid);
            } else {
                this.list = [];
            }
        }
    },
    created() {
        if (!this.uid) {
            this.mmLoadShow = false;
        }
    },
    activated() {

        /**
         * @description: 组件被激活时被调用
         * @param {*} this
         * @return {*}
         */        
        if (this.uid && this.list.length === 0) {
            this.mmLoadShow = true;
            this._getUserPlaylist(this.uid);
        } else if (!this.uid && this.list.length !== 0) {
            this.list = [];
        }
    },
    methods: {
        
        /**
         * @description: 获取用户歌单，获取用户的歌单列表中的除了第一项以外的其他所有歌单
         * @param {*} uid
         * @return {*}
         */        
        _getUserPlaylist(uid) {
            getUserPlaylist(uid).then((res) => {
                if (res.playlist.length === 0) {
                    return;
                }
                // console.log(res)
                // 截取数组第一个以外的所有
                this.list = res.playlist.slice(1);
                this._hideLoad();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.userList {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    &-head {
        height: 100px;
    }
    .list-item {
        position: relative;
        float: left;
        width: calc(100% / 7);
        .userList-item {
            width: 130px;
            text-align: center;
            cursor: pointer;
            margin: 0 auto 20px;
            &:hover {
                color: #fff;
            }
            .trackCount {
                position: absolute;
                left: 30px;
                top: 8px;
                color: #fff;
            }
            .name {
                height: 30px;
                line-height: 30px;
                font-size: $font_size_medium;
                @include no-wrap();
            }
            @media (max-width: 1100px) {
                width: 80%;
            }
        }
        @media (max-width: 1500px) {
            width: calc(100% / 6);
        }
        @media (max-width: 1400px), (max-width: 960px) {
            width: calc(100% / 5);
        }
        @media (max-width: 1280px), (max-width: 768px) {
            width: calc(100% / 4);
        }
        @media (max-width: 540px) {
            width: calc(100% / 3);
        }
    }
}
</style>
  