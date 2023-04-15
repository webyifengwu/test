import {get} from "./base"
// 获取默认 推荐歌曲
export function getDefaultKeys(){
    return get('/search/default')
}
// 获取热门 推荐歌曲
export function getHotKeys(){
    return get('/search/hot')
}
// 获取搜索结果 
export function getSearchResult(query){
    return get('/search',{
        keywords:query
    })
}
// 获取 搜索结果  单曲点击 详情对象 
export function getSearchDetail(item){
    return get('/song/detail',{
        ids:item.id
    })
}
