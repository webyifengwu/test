import { get } from "./base.js"
export function getSingerList(nameArr) {
    let singerListArr = []//用于存放歌手数据的变量
    let promiseArr = [];//使用Promise.All的方法 等请求完数据后才返回数据
    for (let i = 0; i < nameArr.length; i++) {
        promiseArr.push(new Promise((resolve, reject) => {
            getSinger(nameArr[i], singerListArr, resolve)
        }))

    }
    // 成功请求拿到数据后 进行返回数据
    return Promise.all(promiseArr).then(() => {
        singerListArr.sort((a, b) => {
            return a.tag.charCodeAt() - b.tag.charCodeAt()
        })
        singerListArr.unshift(singerListArr.pop())
        return singerListArr

    })
}

function getSinger(keyWord, singerListArr, resolve) {
    if (keyWord === '热') { //热 与普通字母的请求路由 不同
        get('/top/artists', {
            limit: 15
        }).then((result) => {
            singerListArr.push({
                tag: keyWord,
                nameArr: result.artists
            })
            resolve()

        })


    } else {//普通字母的请求
        get('/artist/list', {
            initial: keyWord,//首字母
            type: -1,
            area: 7,
            limit: 15
        }).then((result) => {
            singerListArr.push({
                tag: keyWord,
                nameArr: result.artists
            })
            resolve()
        })

    }
}
// 获取歌手详情
export function getSingerDetail(singerItem){
    return get('/artists',{
        id:singerItem.id
    })
}