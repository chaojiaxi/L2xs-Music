/*
* @Author: llxs
* @Date: 2023-03-21 20:08:17
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-22 09:43:51
* @Description: 
* @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
*/
import * as types from './mutation-types';

const mutations = {
    // 修改audio元素
    [types.SET_AUDIOELE](state, audioEle) {
        state.audioEle = audioEle;
    },
    // 修改播放模式
    [types.SET_PLAYMODE](state, mode) {
        state.mode = mode;
    },
    // 修改播放状态
    [types.SET_PLAYING](state, playing) {
        state.playing = playing;
    },
    // 修改播放列表
    [types.SET_PLAYLIST](state, playlist) {
        state.playlist = playlist;
    },
    // 修改顺序列表
    [types.SET_ORDERLIST](state, orderList) {
        state.orderList = orderList;
    },
    // 修改当前音乐索引
    [types.SET_CURRENTINDEX](state, currentIndex) {
        state.currentIndex = currentIndex;
    },
    // 修改播放历史列表
    [types.SET_HISTORYLIST](state, historyList) {
        state.historyList = historyList;
    },
    // 修改网易云用户UID
    [types.SET_UID](state, uid) {
        state.uid = uid;
    }
}

export default mutations;
