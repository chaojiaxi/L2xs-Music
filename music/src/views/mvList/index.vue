<template>
    <!--排行榜-->
    <div class="topList">
        <L2xsLoading v-model="mmLoadShow"></L2xsLoading>
        <template v-if="!mmLoadShow">
            <div class="topList-head">热门歌单</div>
            <div class="topList-content">
                <div v-for="(item, index) in list" :key="index" class="list-item" :title="item.name">
                    <router-link :to="{ path: `/music/details/${item.id}` }" tag="div" class="topList-item">
                        <div class="topList-img">
                            <img v-lazy="`${item.picUrl}?param=300y300`" class="cover-img" />
                        </div>
                        <div class="playCount-bottom">
                            <span class="playCount">{{ item.playCount }}</span>
                        </div>
                        <h3 class="name">{{ item.name }}</h3>
                    </router-link>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { getMvPersonalized } from "@/api";
import { loadMixin } from "@/utils/mixin";
import L2xsLoading from "@/base/L2xs-loading/index";

export default {
    name: 'PlayList',
    components: {
        L2xsLoading
    },
    mixins: [loadMixin],
    data() {
        return {
            list: [] // 推荐mv
        }
    },
    created() {

        /**
         * @description: 获取云音乐特色榜、热门歌单
         * @return {*}
         */        
         getMvPersonalized().then( mvlist => {
            console.log(mvlist,'mvlist')
            // 播放列表
            this.list = mvlist.result;
            // 隐藏加载动画
            this._hideLoad();
        }).catch(() => {
            this._hideLoad();
        })
    }
}
</script>

<style lang="scss" scoped>
.topList {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    &-head {
        width: 100%;
        height: 34px;
        line-height: 34px;
        padding: 20px 0;
        font-size: $font_size_large;
        color: $text_color_active;
    }
    &-content {
        overflow: hidden;
    }
    .list-item {
        float: left;
        width: calc(100% / 7);
        .topList-item {
            position: relative;
            width: 130px;
            text-align: center;
            cursor: pointer;
            margin: 0 auto 20px;
            &:hover {
                color: #fff;
            }
            .playCount-bottom {
                position: absolute;
                top: 0px;
                left: 0;
                color: #fff;
                height: 20px;
                width: 100%;
                background: rgba(204, 204, 204, .4);
                text-align: right;
                .playCount {
                    margin-right: 6px;
                    line-height: 20px;
                }
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
        .topList-img {
            position: relative;
            padding-top: 100%;
            width: 100%;
            height: 0;
            .cover-img {
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
}
</style>
  