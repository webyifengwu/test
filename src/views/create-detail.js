import { ref,computed,onMounted } from "vue";
import {useRouter,useRoute} from "vue-router"
import storage from "@/assets/js/storage-api.js"
export default function createDetail(props,sessionkey,getApi){

const loading = ref(true)
const route = useRoute()
const router = useRouter()
// 歌曲
const songs = ref([])
// 背景图片
const picUrl = computed(()=>{
    return  computedData.value?computedData.value.picUrl:''
})
// 标题
const listTitle = computed(()=>{
    return computedData.value?computedData.value.name:""//采取三目表达式是为了防止错误造成阻塞进程
})
const computedData = computed(()=>{
  let result = null;
  const data = props.detailObj;
  if(data.id){//获取成功 没刷新前
  result=data
  }else{
    //props获取失败
    const cached = storage.getLocal(sessionkey,{});
    //存储的值 存在 和路由的 id 保持一致
    if(cached && cached.id === route.params.id/1){
      result=cached
    }
  }
  return result;
})
onMounted( async ()=>{
  const data = computedData.value;
  // props内 和 本地存储都没有数据
  if(!data){
    //返回 上一级
    router.push({path:route.matched[0].path});
    return;
  }
    const result  = await getApi(data);
    songs.value = result.hotSongs;
    // 请求到歌曲后就把 loading值置为 false
    loading.value = false;
})

return {
    picUrl,
    listTitle,
    songs,
    loading
}
}