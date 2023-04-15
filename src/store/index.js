import { createLogger, createStore } from 'vuex'
import state from "./state.js"
import  mutations  from './mutations.js'
import  actions  from './actions.js'
import  getters  from './getters.js'
const debug = process.env.NODE_ENV!='production'//生产模式
//true 为开发模式 false为生产模式
export default createStore({
state,
mutations,
actions, 
getters,
strcts:debug,//严格模式 除mutations之外的函数修改state内的数据 都是不允许的
plugins:debug?[createLogger()]:[]//自带更新日志插件 用于调试 每一次修改 生成快照 用于追踪数据状态

})
