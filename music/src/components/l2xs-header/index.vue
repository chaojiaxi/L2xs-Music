<!--
 * @Author: llxs
 * @Date: 2023-03-20 20:56:35
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-27 19:45:33
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <!--头部-->
    <header class="L2xs-header">
        <h1 class="header">
            <a href="https://github.com/chaojiaxi/L2xs-Music" target="_blank">L2xs 在线音乐</a>
            <!-- 网站访问量 -->
            <img
                v-if="visitorBadge"
                :src="visitorBadge"
                alt="累计访问数"
                class="visitor"
                onerror="this.style.display='none'"
            />
        </h1>
        <!-- 用户头像 -->
        <dl class="user">
            <template v-if="user.userId">
                <router-link class="user-info" to="/music/userlist" tag="dt">
                    <img class="avatar" :src="`${user.avatarUrl}?param=50y50`" />
                    <span>{{ user.nickname }}</span>
                </router-link>
                <dd class="user-btn" @click="openDialog(2)">
                    <div class="user-login">退出</div>
                </dd>
            </template>
            <dd v-else class="user-btn" @click="openDialog(0)">
                <div class="user-login">登录</div>
            </dd>
        </dl>
        <!--登录弹窗-->
        <L2xsDialog
            ref="loginDialog"
            head-text="登录"
            confirm-btn-text="登录"
            cancel-btn-text="关闭"
            @confirm="login">
            <div class="mm-dialog-text">
                <input
                    v-model.trim="uidValue"
                    class="mm-dialog-input"
                    type="number"
                    autofocus
                    placeholder="请输入您的网易云 UID"
                    @keyup.enter="login"/>
            </div>
            <div slot="btn" @click="openDialog(1)">帮助</div>
        </L2xsDialog>
        <!--帮助-->
        <L2xsDialog
            ref="helpDialog"
            head-text="登录帮助"
            confirm-btn-text="去登录"
            cancel-btn-text="关闭"
            @confirm="openDialog(0)">
            <div class="mm-dialog-text">
                <p>1、<a target="_blank" href="https://music.163.com">点我(https://music.163.com)</a>打开网易云音乐官网</p>
                <p>2、登录账户</p>
                <p>3、点击用户头像，进入我的主页</p>
                <p>4、复制浏览器地址栏 /user/home?id = 【网易云 UID】</p>
            </div>
        </L2xsDialog>
        <!--退出-->
        <L2xsDialog ref="outDialog" body-text="确定退出当前用户吗？" @confirm="out" />
    </header>
</template>
  
<script>
import { getUserPlaylist } from '@/api';
import { mapGetters, mapActions } from 'vuex';
import L2xsDialog from '@/base/L2xs-dialog/index';
import { toHttps } from '@/utils/util';
import { VISITOR_BADGE_ID } from '@/config';

export default {
    name: 'MmHeader',
    components: {
        L2xsDialog
    },
    data() {
        return {
            user: {}, // 用户数据
            uidValue: '3221223261' // 记录用户 UID
        }
    },
    computed: {
        visitorBadge() {
            if (!VISITOR_BADGE_ID) {
                return `https://visitor-badge.laobi.icu/badge?left_color=transparent&right_color=transparent&page_id=jwenjian.visitor-badge`;
                // return `https://visitor-badge.laobi.icu/badge?left_color=transparent&right_color=transparent&page_id=${VISITOR_BADGE_ID}`
            }
            return '';
        },
        ...mapGetters(['uid'])
    },
    created() {
        this.uid && this._getUserPlaylist(this.uid);
    },
    methods: {

        /**
         * @description: 对话框事件
         * @param {*} key
         * @return {*}
         */        
        openDialog(key) {
            switch (key) {
                case 0:
                    // 登录事件
                    this.$refs.loginDialog.show();
                    break;
                case 1:
                    // 帮助事件
                    this.$refs.loginDialog.hide();
                    this.$refs.helpDialog.show();
                    break;
                case 2:
                    // 退出事件
                    this.$refs.outDialog.show();
                    break;
                case 3:
                    // 对话框隐藏
                    this.$refs.loginDialog.hide();
                    break;
            }
        },
        
        /**
         * @description: 退出登录
         * @return {*}
         */        
        out() {
            this.user = {};
            this.setUid(null);
            this.$mmToast('退出成功！');
        },
        
        /**
         * @description: 登录
         * @return {*}
         */        
        login() {
            if (this.uidValue === '') {
                this.$mmToast('UID不能为空，请输入UID值');
                this.openDialog(0);
                return;
            }
            this.openDialog(3);
            this._getUserPlaylist(this.uidValue);
        },
        
        /**
         * @description: 获取用户信息
         * @param {*} uid
         * @return {*}
         */        
        _getUserPlaylist(uid) {
            getUserPlaylist(uid).then(({ playlist = [] }) => {
                // console.log(playlist,'playlist')
                // 清空输入框值
                this.uidValue = '';
                // 歌单是否有 'creator' 字段
                if (playlist.length === 0 || !playlist[0].creator) {
                    this.$mmToast(`未查询找 UID 为 ${uid} 的用户信息`);
                    return;
                }
                const creator = playlist[0].creator;
                // console.log(creator,'creator')
                // 保存uid值
                this.setUid(uid);
                // toHttps 转为 https
                creator.avatarUrl = toHttps(creator.avatarUrl);
                this.user = creator;
                setTimeout(() => {
                    this.$mmToast(`${this.user.nickname} 欢迎使用 L2xs 在线音乐`);
                }, 200)
            })
        },
        ...mapActions(['setUid'])
    }
}
</script>

<style lang="scss">
.L2xs-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    @media (max-width: 768px) {
        background: $header_bg_color;
    }
    .header {
        @include flex-center();
        line-height: 60px;
        color: $text_color_active;
        font-size: $font_size_large;
        @media (max-width: 768px) {
            padding-left: 15px;
            justify-content: flex-start;
        }
        @media (max-width: 414px) {
            font-size: $font_size_medium;
        }
        .visitor {
            margin-left: 6px;
            height: 20px;
            @media (max-width: 414px) {
                display: none;
            }
        }
        
    }
    .user {
        position: absolute;
        top: 50%;
        right: 15px;
        line-height: 30px;
        text-align: right;
        transform: translateY(-50%);
        .user-login {
            background-color: #fff;
            color: #666;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 12px;
        }
        &-info {
            float: left;
            margin-right: 15px;
            cursor: pointer;
            .avatar {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                vertical-align: middle;
            }
            span {
                margin-left: 10px;
                color: $text_color_active;
            }
        }
        &-btn {
            float: left;
            cursor: pointer;
            &:hover {
                color: $text_color_active;
            }
        }
        @media (max-width: 768px) {
            &-info {
                margin-right: 10px;
                span {
                    display: none;
                }
            }
        }
    }
}
.mm-dialog-text {
    text-align: left;
    .mm-dialog-input {
        width: 100%;
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
    a:hover {
        color: #d43c33;
    }
}
</style>