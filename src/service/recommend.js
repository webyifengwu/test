import { get } from './base.js'

//请求轮播数据
export function getRecommend() {
    //直接定义 接口
    return get('/banner', {
        type: 2
    })
}
// 请求 歌单列表数据
export function getRecommendAlbum() {
    return get('/top/playlist', {
        limit: 30
    })
}
// 获取歌单详情
export async function getAlbum(album){
    let result = await get('/playlist/detail',{
        id:album.id
    })
    let albumListId = result.playlist.trackIds
    // 设置为 只有50个歌曲
    albumListId.length = Math.min(50,albumListId.length)
    let albumArr =[]
    let promiseArr = []
    albumListId.forEach(item => {
        promiseArr.push(new Promise((resolve,reject)=>{
            getAlbumDetail(item,albumArr,resolve)
        }))
    });
    return Promise.all(promiseArr).then(()=>{
        return {
            hotSongs:albumArr
        }
    })

}
function getAlbumDetail(item,albumArr,resolve){
    // 根据id 请求 完整的 歌曲对象
    get('/song/detail',{ids:item.id}).then(result=>{
        albumArr.push(result.songs[0])
        resolve()
    })
}