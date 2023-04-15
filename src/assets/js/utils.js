// export function formatTime(interval){
// // 00：00
//  let seconds =  Math.floor(interval)
// //  console.log(seconds);
// //  let one = seconds%10;
// //  let two = seconds%60/10%10;
// //  let three = seconds/60%10
// //  let four  = seconds/60/10%10
// let left=''
// let right = '';
// if(seconds%60<10){
//     right = '0'+seconds%60
// }else{
//     right = ''+Math.floor(seconds%60)
// }
// if(seconds/60<10){
//     left = `0${Math.floor(seconds/60)}`
// }else{
//     left = ''+Math.floor(seconds/60)
// }
// //  return `${four}||${three}:${two}||${one}`
// return `${left}:${right}`
// }

// 格式时间的函数
export function formatTime(interval){
    interval = interval | 0
    const minute = ((interval/60|0)+'').padStart(2,'0')
    // padStart 字符长度不够 2 在当前字符 前 补个0
    const second = ((interval%60|0)+'').padStart(2,'0')
    return `${minute}:${second}`
}

export function formatLyric(str){
return str.split('[').filter(item=>item !== '').reduce((prev,cur,index)=>{
    let obj= {};
    let arr = cur.split(']')
   obj.content  = arr[1]
    let time = arr[0].split(":")
    obj.time = Number(time[0])*60+Number(time[1])
    prev.push(obj)
    return prev
},[]).filter(item=>item.content.trim() !== '')
}