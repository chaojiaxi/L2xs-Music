/*
 * @Author: llxs
 * @Date: 2023-03-21 19:50:55
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-22 09:40:58
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */

/** 
 * @description: 随机排序数组/洗牌函数 https://github.com/lodash/lodash/blob/master/shuffle.js
 * @param {*} source
 * @param {*} array
 * @return {*}
 */
function copyArray(source, array) {
    let index = -1;
    const length = source.length;
    array || (array = new Array(length));
    while (++index < length) {
        array[index] = source[index];
    }
    return array;
}

/** 
 * @description: 数组中的元素随机排序
 * @param {*} array
 * @return {*}
 */
export const randomSortArray = function shuffle(array) {
    const length = array == null ? 0 : array.length;
    if (!length) {
        return [];
    }
    let index = -1;
    const lastIndex = length - 1;
    const result = copyArray(array);
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
        const value = result[rand];
        result[rand] = result[index];
        result[index] = value;
    }
    return result;
}

/** 
 * @description: 防抖函数
 * @param {*} func
 * @param {*} delay
 * @return {*}
 */
export function debounce(func, delay) {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay)
    }
}

/** 
 * @description: 如果 s 是一个一位数，则在其前面添加一个 0，并返回结果字符串
 * @param {*} s
 * @return {*}
 */
export function addZero(s) {
    return s < 10 ? '0' + s : s;
}

/** 
 * @description: 歌词解析，解析成时间和歌词文本的数组
 * @param {*} d
 * @return {*}
 */
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;
export function parseLyric(lrc) {
    const lines = lrc.split('\n');
    const lyric = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const result = timeExp.exec(line);
        if (!result) {
            continue;
        }
        const text = line.replace(timeExp, '').trim();
        if (text) {
            lyric.push({
                time: (result[1] * 6e4 + result[2] * 1e3 + (result[3] || 0) * 1) / 1e3,
                text
            });
        }
    }
    return lyric;
}

/** 
 * @description: 一个以秒为单位的时间值转换为 mm:ss 格式的字符串
 * @param {*} value
 * @return {*}
 */
export function format(value) {
    let minute = Math.floor(value / 60);
    let second = Math.floor(value % 60);
    return `${addZero(minute)}:${addZero(second)}`;
}

/**
 * https://github.com/videojs/video.js/blob/master/src/js/utils/promise.js
 * Silence a Promise-like object.
 * This is useful for avoiding non-harmful, but potentially confusing "uncaught
 * play promise" rejection error messages.
 * @param  {Object} value An object that may or may not be `Promise`-like.
 */
export function isPromise(v) {
    return v !== undefined && v !== null && typeof v.then === 'function';
}

/** 
 * @description: 静默 Promise 对象，用于消除 Promise 拒绝时的警告信息
 * @param {*} value
 * @return {*}
 */
export function silencePromise(value) {
    if (isPromise(value)) {
        value.then(null, () => {});
    }
}

/** 
 * @description: 判断变量是否为字符串类型
 * @param {*} v
 * @return {*}
 */
export function isString(v) {
    return typeof v === 'string';
}

/** 
 * @description: http协议转化成https协议
 * @param {*} url
 * @return {*}
 */
export function toHttps(url) {
    if (!isString(url)) {
        return url;
    }
    return url.replace('http://', 'https://');
}
