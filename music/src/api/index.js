/*
 * @Author: llxs
 * @Date: 2023-03-21 19:47:32
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-21 20:15:52
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
import axios from '@/utils/axios';
import { DEFAULT_LIMIT } from '@/config';
import { formatSongs } from '@/utils/song';

/** 
 * @description: 排行榜列表
 * @return {*}
 */
export function getToplistDetail() {
    return axios.get('/toplist/detail');
}

/** 
 * @description: 推荐歌单
 * @return {*}
 */
export function getPersonalized() {
    return axios.get('/personalized');
}

/** 
 * @description: 推荐电台
 * @return {*}
 */
export function getDjProgram(page = 0, limit = 30) {
    return axios.get('/dj/hot', {
        params: {
            offset: page * limit,
            limit: limit,
        }
    });
}


/** 
 * @description: 获取电台详情
 * @param {*} ids
 * @return {*}
 */
export function getDjDetail(rid) {
    return axios.get('/dj/detail', {
        params: {
            rid
        }
    })
}

/** 
 * @description: 推荐mv
 * @return {*}
 */
export function getMvPersonalized() {
    return axios.get('/personalized/mv');
}

/** 
 * @description: 歌单详情
 * @param {*} id
 * @return {*}
 */
export function getPlaylistDetail(id) {
    return new Promise((resolve, reject) => {
        axios.get('/playlist/detail', {
            params: { id }
        }).then(({ playlist }) => playlist || {}).then((playlist) => {
            const { trackIds, tracks } = playlist
            if (!Array.isArray(trackIds)) {
                reject(new Error('获取歌单详情失败'))
                return
            }
            // 过滤完整歌单 如排行榜
            if (tracks.length === trackIds.length) {
                playlist.tracks = formatSongs(playlist.tracks)
                resolve(playlist)
                return
            }
            // 限制歌单详情最大 500
            const ids = trackIds.slice(0, 500).map((v) => v.id).toString()
                getMusicDetail(ids).then(({ songs }) => {
                    playlist.tracks = formatSongs(songs)
                resolve(playlist)
            })
        })
    })
}

/** 
 * @description: 搜索
 * @param {*} keywords
 * @param {*} page
 * @param {*} limit
 * @return {*}
 */
export function search(keywords, page = 0, limit = DEFAULT_LIMIT) {
    return axios.get('/search', {
        params: {
            offset: page * limit,
            limit: limit,
            keywords
        }
    })
}

/** 
 * @description: 热搜
 * @return {*}
 */
export function searchHot() {
    return axios.get('/search/hot')
}

/** 
 * @description: 获取用户歌单
 * @param {*} uid
 * @return {*}
 */
export function getUserPlaylist(uid) {
    return axios.get('/user/playlist', {
        params: {
            uid
        }
    })
}

/** 
 * @description: 获取歌曲详情
 * @param {*} ids
 * @return {*}
 */
export function getMusicDetail(ids) {
    return axios.get('/song/detail', {
        params: {
            ids
        }
    })
}

/** 
 * @description: 获取音乐是否可以用
 * @param {*} id
 * @return {*}
 */
export function getCheckMusic(id) {
    return axios.get('/check/music', {
        params: {
            id
        }
    })
}

/** 
 * @description: 获取音乐地址
 * @param {*} id
 * @return {*}
 */
export function getMusicUrl(id) {
    return axios.get('/song/url', {
        params: {
            id
        }
    })
}

/** 
 * @description: 获取歌词
 * @param {*} id
 * @return {*}
 */
export function getLyric(id) {
    const url = '/lyric'
    return axios.get(url, {
        params: {
            id
        }
    })
}

/** 
 * @description: 获取音乐评论
 * @param {*} id
 * @param {*} page
 * @param {*} limit
 * @return {*}
 */
export function getComment(id, page, limit = DEFAULT_LIMIT) {
    return axios.get('/comment/music', {
        params: {
            offset: page * limit,
            limit: limit,
            id
        }
    })
}
