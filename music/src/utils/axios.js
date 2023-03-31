/*
 * @Author: llxs
 * @Date: 2023-03-21 19:30:58
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-22 08:59:41
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
// import Vue from 'vue';
import axios from "axios";
// const baseURL= process.env.VUE_APP_BASE_API_URL
// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_URL,
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
});

// console.log(baseURL,'baseURL')

// request拦截器
request.interceptors.response.use(
    (response) => {
        window.response = response;
  
        if (response.status === 200 && response.data.code === 200) {
            return response.data;
        }
        return Promise.reject(response);
    },
    (error) => {
        console.log(error,'error');
        // Vue.prototype.$mmToast(error.response ? error.response.data.message : error.message)
        return error;
    }
)

export default request;

// _axios.interceptors.request.use(
//   function(config) {
//     // Do something before request is sent
//     return config;
//   },
//   function(error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// _axios.interceptors.response.use(
//   function(response) {
//     // Do something with response data
//     return response;
//   },
//   function(error) {
//     // Do something with response error
//     return Promise.reject(error);
//   }
// );

// Plugin.install = function(Vue, options) {
//   Vue.axios = _axios;
//   window.axios = _axios;
//   Object.defineProperties(Vue.prototype, {
//     axios: {
//       get() {
//         return _axios;
//       }
//     },
//     $axios: {
//       get() {
//         return _axios;
//       }
//     },
//   });
// };

// Vue.use(Plugin)


