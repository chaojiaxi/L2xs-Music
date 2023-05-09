/*
 * @Author: llxs
 * @Date: 2023-03-21 19:59:18
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-22 08:59:51
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
// 定义一个空函数
function noop() {}

window.MessageChannel = noop;
window.setImmediate = noop;

/** 
 * @description: 作用是将MessageChannel和setImmediate这两个浏览器原生的方法替换成空函数，以防止在运行时出现这两个方法不存在的情况。
 * @return {*}
 */
