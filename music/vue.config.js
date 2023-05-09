/*
 * @Author: llxs
 * @Date: 2023-03-20 20:12:34
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-20 15:33:12
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
// const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const dayjs = require('dayjs')

function resolve(dir) {
    return path.join(__dirname, dir)
}

// const isEnvProduction = process.env.NODE_ENV === 'production'

// 注入版本信息
process.env.VUE_APP_VERSION = require('./package.json').version
// 注入版本更新时间
process.env.VUE_APP_UPDATE_TIME = dayjs().locale('zh-cn').format('YYYY-MM-DD')

module.exports = {
    publicPath: '',
    // chainWebpack(config) {
    //     config.resolve.alias
    //     .set('api', resolve('src/api'))
    //     .set('assets', resolve('src/assets'))
    //     .set('base', resolve('src/base'))
    //     .set('components', resolve('src/components'))
    //     .set('pages', resolve('src/pages'))
    //     config.plugin('html').tap((args) => {
    //     if (isEnvProduction) {
    //         if (!args[0].minify) {
    //         /* 参考 https://github.com/jantimon/html-webpack-plugin#minification */
    //         args[0].minify = {
    //             collapseWhitespace: true,
    //             keepClosingSlash: true,
    //             removeComments: true,
    //             removeRedundantAttributes: true,
    //             removeScriptTypeAttributes: true,
    //             removeStyleLinkTypeAttributes: true,
    //             useShortDoctype: true,
    //             trimCustomFragments: true
    //         }
    //         }
    //         args[0].minify.minifyJS = true
    //         args[0].minify.minifyCSS = true
    //     }
    //     return args
    //     })
    // },
    chainWebpack(config) {
        // 标题
		config.plugin('html').tap((args) => {
			args[0].title = '前端摸鱼塘';
			return args;
		})
	},
    configureWebpack: {
        // name: name,
        // 设置别名alias
        resolve: {
            extensions: ['.js', '.json', '.vue'], // 自动添加文件名后缀
            alias: {
                // vue$: 'vue/dist/vue.js',
                '@': resolve('src'),
                // '@c': resolve('src/components'),
                // '@a': resolve('src/assets')
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                resolve('src/assets/styles/variables.scss'),
                resolve('src/assets/styles/mixin.scss'),
            ]
        }
    }
}