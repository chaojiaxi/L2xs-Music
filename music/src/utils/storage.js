/*
 * @Author: llxs
 * @Date: 2023-03-21 19:59:47
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-22 09:39:58
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
import { MMPLAYER_CONFIG } from '@/config';

// 浏览器本地存储 API 
const STORAGE = window.localStorage;

const storage = {
    // 从本地存储中获取指定key对应的数据
    get(key, data = []) {
        if (STORAGE) {
        return  STORAGE.getItem(key)
                ? Array.isArray(data)
                ? JSON.parse(STORAGE.getItem(key))
                : STORAGE.getItem(key)
                : data;
        }
    },
    // 将指定key对应的值设置为val
    set(key, val) {
        if (STORAGE) {
            STORAGE.setItem(key, val);
        }
    },
    // 删除指定key对应的数据
    clear(key) {
        if (STORAGE) {
            STORAGE.removeItem(key);
        }
    }
}

/**
 * 播放历史
 * @type    HISTORYLIST_KEY：key值
 *          HistoryListMAX：最大长度
 */
const HISTORYLIST_KEY = '__mmPlayer_historyList__';
const HistoryListMAX = 200;
// 获取播放历史
export function getHistoryList() {
    return storage.get(HISTORYLIST_KEY);
}

// 更新播放历史
export function setHistoryList(music) {
    let list = storage.get(HISTORYLIST_KEY);
    const index = list.findIndex((item) => {
        return item.id === music.id;
    })
    if (index === 0) {
        return list;
    }
    if (index > 0) {
        list.splice(index, 1);
    }
    list.unshift(music);
    if (HistoryListMAX && list.length > HistoryListMAX) {
        list.pop();
    }
    storage.set(HISTORYLIST_KEY, JSON.stringify(list));
    return list;
}

// 删除播放历史列表中指定的音乐
export function removeHistoryList(music) {
    storage.set(HISTORYLIST_KEY, JSON.stringify(music));
    return music;
}

// 清空播放历史列表
export function clearHistoryList() {
    storage.clear(HISTORYLIST_KEY);
    return [];
}

/**
 * 播放模式
 * @type MODE_KEY：key值
 * HistoryListMAX：最大长度
 */
const MODE_KEY = '__mmPlayer_mode__';
// 获取当前播放模式
export function getMode() {
    return Number(storage.get(MODE_KEY, MMPLAYER_CONFIG.PLAY_MODE));
}
// 修改当前的播放模式
export function setMode(mode) {
    storage.set(MODE_KEY, mode);
    return mode;
}

/**
 * 网易云用户uid
 * @type USERID_KEY：key值
 */
const USERID_KEY = '__mmPlayer_userID__';
// 获取用户uid
export function getUserId() {
    return Number(storage.get(USERID_KEY, null));
}
// 修改当前用户的uid
export function setUserId(uid) {
    storage.set(USERID_KEY, uid);
    return uid;
}

/**
 * 版本号
 * @type VERSION_KEY：key值
 */
const VERSION_KEY = '__mmPlayer_version__';
// 获取当前的版本号
export function getVersion() {
    let version = storage.get(VERSION_KEY, null);
    // console.log(version,'11111111')
    return Array.isArray(version) ? null : version;
}
// 修改当前的版本号
export function setVersion(version) {
    storage.set(VERSION_KEY, version);
    return version;
}

/**
 * 音量
 * @type VOLUME_KEY：key值
 */
const VOLUME_KEY = '__mmPlayer_volume__';
// 获取当前音量大小
export function getVolume() {
    const volume = storage.get(VOLUME_KEY, MMPLAYER_CONFIG.VOLUME);
    return Number(volume);
}
// 修改当前的音量大小
export function setVolume(volume) {
    storage.set(VOLUME_KEY, volume);
    return volume;
}
