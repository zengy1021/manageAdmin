// import request from '@/utils/request'
import axios from 'axios'
const api = {
  getMusicList(params) {
    return axios.get('https://v1.itooi.cn/netease/songList/hot', params)
  },
  getMusicDetail(uid) { // 根据用户id获取用户音乐列表
    return axios.get(`https://v1.itooi.cn/netease/songList/user?uid=${uid}`)
  },
  getSongList(id) {
    return axios.get(`https://v1.itooi.cn/netease/songList?id=${id}`)
  },
  getSongPlay(params) { // 获取音乐播放地址
    return axios.get(`https://v1.itooi.cn/netease/url?id=${params.id}&quality=${params.quality}`)
  },
  searchMusicList(key) { // 搜索音乐
    return axios.get(`https://v1.itooi.cn/netease/search?keyword=${key}&type=song&pageSize=20`)
  }

}
export default api
