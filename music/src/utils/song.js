/*
 * @Author: llxs
 * @Date: 2023-03-21 19:49:48
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-22 09:38:43
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
import { toHttps } from './util';

// 歌手信息转换成字符串，用斜杠分隔
function filterSinger(singers) {
    if (!Array.isArray(singers) || !singers.length) {
        return '';
    }
    let arr = [];
    singers.forEach((item) => {
        arr.push(item.name);
    })
    return arr.join('/');
}

// 定义了一个歌曲的数据结构
export class Song {
    constructor({ id, name, singer, album, image, duration, url }) {
        this.id = id;
        this.name = name;
        this.singer = singer;
        this.album = album;
        this.image = image;
        this.duration = duration;
        this.url = url;
    }
}

// 接收一个音乐数据对象，根据其属性创建一个 Song 实例并返回
export function createSong(music) {
    const album = music.album || music.al || {};
    const duration = music.duration || music.dt;
    return new Song({
        id: music.id,
        name: music.name,
        singer: filterSinger(music.ar || music.artists),
        album: album.name,
        image: toHttps(album.picUrl) || null,
        duration: duration / 1000,
        url: `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`
    });
}

// 接收一个音乐列表数据，遍历列表中的每一个元素，调用 createSong 函数创建 Song 实例，并将其存入一个数组中返回
export function formatSongs(list) {
    const Songs = [];
    list.forEach((item) => {
        const musicData = item;
        if (musicData.id) {
            Songs.push(createSong(musicData));
        }
    })
    return Songs;
}
