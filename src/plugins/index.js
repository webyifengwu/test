import loading from "@/components/base/loading"
import noResult from "@/components/base/no-result"
// import { remove } from "@vue/shared"
import { createApp } from 'vue'
import defaultImg from "@/assets/images/lazy.png"
// 引入
import { useIntersectionObserver } from "@vueuse/core"
export default {
    install(app) {
        // 加载中展示的指令
        app.directive('loading', {
            //绑定指令dom 挂载在页面之后 调用
            mounted(el, binding) {
                // el 是指令绑定的dom元素
                // binding  ：value value 绑定值
                // 把loading 组件转为真实dom 才能插入到绑定的dom元素
                const app = createApp(loading) //把loading 组件 应用到对象
                const instance = app.mount(document.createElement('div'))//loading组件的实例对象 $el 就是真实dom
                el.instance = instance
                if (binding.value) {
                    append(el)
                }
            },

            // 有更新的时候的操作
            updated(el, binding) {
                if (binding.value !== binding.oldValue) {
                    binding.value ? append(el) : removeEl(el)
                }
            },

        })
    
        /* 懒加载逻辑 ： 监听 img dom 是否进入视口区域 进入视口区域 进入 把 真实src赋值给el.src */
        // 懒加载的指令
        app.directive('img-lazy', {
            //需要下载使用 npm i @vueuse/core --save
            mounted(el, binding) {

                // 全部设置为 占位图片
                el.src = defaultImg
                //监听视口的函数                 通过结构赋值
                const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {//这对象会返回一个stop函数


                    // isIntersecting 布尔值 true --- 表示进入了视口区域 false ---- 表示未进入视口区域
                    if (isIntersecting) {
                        // 当请求不到图片的时候 也需要将图片改为默认图片
                        el.onerror = function () {
                            el.src = defaultImg
                        }
                        // 改变真实图片的src
                        el.src = binding.value
                        // 图片已经加载成功后 执行stop函数 停止当前 img的监听
                        stop()
                        
                    }

                })

            }
        })

         // 主页
         app.directive('no-result', {
            //绑定指令dom 挂载在页面之后 调用
            mounted(el, binding) {
                // el 是指令绑定的dom元素
                // binding  ：value value 绑定值
                // 把loading 组件转为真实dom 才能插入到绑定的dom元素
                const app = createApp(noResult) //把loading 组件 应用到对象
                const instance = app.mount(document.createElement('div'))//loading组件的实例对象 $el 就是真实dom
                el.instance = instance
                if (binding.value) {
                    append(el)
                }
            },

            // 有更新的时候的操作
            updated(el, binding) {
                if (binding.value !== binding.oldValue) {
                    binding.value ? append(el) : removeEl(el)
                }
            },
            
        })
    }
}



function append(el) {
    // 把真实dom 插入 指令绑定 
    // 需要判别是否有定位
    //getComputedStyle 是获取元素 在浏览器渲染后的样式
    const style = getComputedStyle(el)
    let arr = ["absolute", 'fixed', 'relative']
    if (arr.indexOf(style.position) === -1) {//没有定位 就加定位
        el.classList.add('g-relative')
    }
    el.appendChild(el.instance.$el)

}

function removeEl(el) {
    el.classList.remove("g-relative")
    el.removeChild(el.instance.$el)

}