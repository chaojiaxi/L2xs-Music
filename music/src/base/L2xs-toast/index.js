/*
 * @Author: llxs
 * @Date: 2023-04-19 18:49:02
 * @LastEditors: llxs
 * @LastEditTime: 2023-04-20 20:12:59
 * @Description: 自定义全局使用的弹窗插件
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
 */
import TempToast from './toast';

let instance; // 存储组件实例变量
let showToast = false; // 是否显示
let time; // 存储toast显示时间
// mmToast 常量，包含 install() 方法
const mmToast = {
  install(Vue, options = {}) {
    let opt = TempToast.data(); // 获取组件中的默认配置
    Object.assign(opt, options); // 将传递给插件的选项对象与默认选项对象进行合并
    // 将 $mmToast 方法添加到 Vue 的原型中，以便在 Vue 实例中调用
    Vue.prototype.$mmToast = (message, position) => {
      if (showToast) {
        clearTimeout(time);
        instance.vm.visible = showToast = false;
        document.body.removeChild(instance.vm.$el);
        // return;// 如果toast还在，则不再执行
      }
      if (message) {
        opt.message = message; // 如果有传message，则使用所传的message
      }
      if (position) {
        opt.position = position; // 如果有传type，则使用所传的type
      }
      // 使用 Vue.extend() 方法创建一个组件构造函数
      let TempToastConstructor = Vue.extend(TempToast);
      // 实例化组件构造函数，并传递一个包含选项的对象
      instance = new TempToastConstructor({
        data: opt
      });
      // 手动挂载组件实例，以便可以访问它的 $el 属性
      instance.vm = instance.$mount();
      // 手动挂载组件实例，以便可以访问它的 $el 属性
      document.body.appendChild(instance.vm.$el);
      // 设置组件的可见性状态并将 showToast 变量设置为 true
      instance.vm.visible = showToast = true;
      // 启动一个 setTimeout，以便在指定的持续时间后删除组件
      time = setTimeout(function () {
        // 在指定的持续时间
        instance.vm.visible = showToast = false;
        document.body.removeChild(instance.vm.$el);
      }, opt.duration);
    }
  }
}

export default mmToast;