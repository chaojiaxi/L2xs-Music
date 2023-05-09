/*
 * @Author: llxs
 * @Date: 2023-03-21 19:30:58
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-20 18:00:28
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
import Vue from 'vue';
import axios from "axios";
// const baseURL= process.env.VUE_APP_BASE_API_URL
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/** 
 * @description: 创建实例
 * @return {*}
 */
const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_URL,
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    timeout: 60 * 1000, // 请求超时时间
});

/** 
 * @description: request拦截器
 * @return {*}
 */
request.interceptors.response.use(
    (response) => { // 成功响应的处理函数
        // 将响应存入window对象中
        window.response = response;
  
        if (response.status === 200 && response.data.code === 200) {
            // 返回响应数据
            return response.data;
        }
        // 抛出错误
        return Promise.reject(response);
    },
    (error) => { // 错误响应的处理函数
        // console.log(error,'error');
        // 使用Vue的原型链方法显示错误信息
        Vue.prototype.$mmToast(error.response ? error.response.data.message : error.message)
        return error;
    }
)

export default request;