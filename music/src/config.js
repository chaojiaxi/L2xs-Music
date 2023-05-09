/*
 * @Author: llxs
 * @Date: 2023-03-21 19:52:24
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-20 17:37:27
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */

/** 
 * @description: 当前版本号,process.env.VUE_APP_VERSION = require('./package.json').version
 * @param {*}
 * @return {*}
 */
export const VERSION = process.env.VUE_APP_VERSION;


/** 
 * @description: 访客统计 id ,具体使用文档 https://github.com/jwenjian/visitor-badge
 * @param {*}
 * @return {*}
 */
export const VISITOR_BADGE_ID = process.env.VUE_APP_VISITOR_BADGE_ID;


/** 
 * @description: 背景图（指定目录下导入所有文件-图片文件）
 * @param {*}
 * @return {*}
 */
const requireAll = (requireContext) => requireContext.keys().map(requireContext);
const BACKGROUNDS = requireAll(require.context('@/assets/images/background', false));


/**
 * @description: 播放模式
 * LIST_LOOP: 列表循环
 * ORDER: 顺序播放
 * RANDOM: 随机播放
 * LOOP: 单曲循环
 * @param {*}
 * @return {*}
 */
export const PLAY_MODE = {
    LIST_LOOP: 0,
    ORDER: 1,
    RANDOM: 2,
    LOOP: 3
}


/**
 * @description: 播放器默认配置
 * @param {*}
 * @return {*}
 */
export const MMPLAYER_CONFIG = {
    // 默认歌单ID （正在播放列表）
    // 默认为云音乐热歌榜 https://music.163.com/#/discover/toplist?id=3778678
    PLAYLIST_ID: 3778678,
    // 默认播放模式
    PLAY_MODE: PLAY_MODE.LIST_LOOP,
    // 默认音量
    VOLUME: 0.8,
    // 默认背景
    BACKGROUND: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
}


/**
 * @description: 默认分页数量
 * @param {*}
 * @return {*}
 */
export const DEFAULT_LIMIT = 30;