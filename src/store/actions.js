const actions = {
    // 使用场景 歌手（歌曲 旁行榜）详情页面的 li 搜索详情 Li
    // 添加一首歌曲
    addOnePlay({ commit, state }, list) {
        const playlist = state.playlist.slice()//复制一份
        const sequenceList = state.sequenceList.slice()
        let currentIndex = state.currentIndex
        // 判断 加入的歌曲 是否存在 sequenceList 不存在为 -1 反之为非负整数
        let sequenceIndex = findIndex(sequenceList, list[0])
        // 新增歌曲
        sequenceList.splice(currentIndex + 1, 0, list[0])
        if (sequenceIndex >= 0) {//添加的歌曲已经存在的情况（重复）
            if (sequenceIndex > currentIndex) {//在当前播放歌曲的后面
                sequenceList.splice(sequenceIndex + 1, 1)
                // 重复项（之前）的下标 因为添加的缘故 加了1
                currentIndex++;
            } else {//在当前播放歌曲的前面
                sequenceList.splice(sequenceIndex, 1)
            }

        } else {//歌曲不存在的情况
            currentIndex++;
            playlist.unshift(list[0])
        }

        // 边界情况
        if (sequenceList.length === 1) {
            currentIndex = 0 //其他的下标 没有数据
        }

        // 设置当前播放歌曲列表
        commit('setSequenceList', sequenceList)
        // 设置源歌曲列表
        commit('setPlaylist', playlist)
        // 设置播放状态 
        commit('setPlayingState', true)
        // 设置全屏
        commit('setFullScreen', true)
        // 设置当前歌曲下标
        commit('setCurrentIndex', currentIndex)
    },
    // 设置 全部歌曲 到 当前的播放列表 和 源播放歌曲列表
    // 使用场景 所有的 顺序播放歌曲列表
    addAllPlay({ commit, state }, list) {
        // 设置当前播放歌曲列表
        commit('setSequenceList', list);
        // 设置源歌曲列表
        commit('setPlaylist', list);
        // 设置播放状态 
        commit('setPlayingState', true);
        // 设置全屏
        commit('setFullScreen', true);
        // 设置当前歌曲下标
        commit('setCurrentIndex', 0);
        //  设置播放模式 切换 为顺序模式
        commit('setPlayMode', 0);

    },
    // 修改播放模式
    changeMode({ commit, state, getters }, mode) {
        const currentSong = getters.currentSong
        // 修改随机播放
        if (mode === 2) {
            // 把乱序之后的playList 赋值给sequenceList
            commit('setSequenceList', shuffle(state.playlist))
        } else {
            commit('setSequenceList', state.playlist)
        }
        // 当前播放的歌曲不变
        const index = findIndex(state.sequenceList, currentSong)
        commit('setCurrentIndex', index)
        commit("setPlayMode", mode)
    },
    // 移除播放列表的某首歌曲
    removeSong({ commit, state }, song) {
        const sequenceList = state.sequenceList.slice();
        const playlist = state.playlist.slice()
        let currentIndex = state.currentIndex

        // 找到所需要被删除的歌曲 对应的下标
        const sequenceIndex = findIndex(sequenceList, song)
        const playlistIndex = findIndex(playlist, song)

        // 找不到
        if (sequenceIndex < 0 || playlistIndex < 0) {
            return
        }
        //找到了
        //执行删除
        sequenceList.splice(sequenceIndex, 1)
        playlist.splice(playlistIndex, 1)
        // 被删除项在当前播放的前面
        if (sequenceIndex < currentIndex) {
            currentIndex--
        }
        // 被删除项目为当前播放项 且在最后一项 sequenceList 的最后一项
        if (sequenceList.length === currentIndex) {
            currentIndex = 0;
        }
        // 设置当前播放歌曲列表
        commit('setSequenceList', sequenceList);
        // 设置源歌曲列表
        commit('setPlaylist', playlist); 
        // 设置当前歌曲下标
        commit('setCurrentIndex', currentIndex);
        if(!playlist.length){
              // 设置播放状态 
        commit('setPlayingState', false);
        }

    },
    // 全部清空
    clearSongList({commit}){
        commit('setSequenceList',[])
        commit('setPlaylist',[])
        commit('setPlayingState',false)
        commit('setCurrentIndex',0)
    },
}


function findIndex(list, song) {
    // 返回 return 为 true 时的index 下标 如果不满足 -1
    return list.findIndex((item) => item.id === song.id)
}
function shuffle(list) {
    const arr = list.slice()
    arr.sort((a, b) => {
        return Math.random() - 0.5;
    })
    return arr
}
export default actions;
