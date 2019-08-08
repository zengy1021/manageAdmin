// import request from '@/utils/request'
import axios from 'axios'
const api = {
  getMusicList(params) {
    return axios.get('https://v1.itooi.cn/netease/songList/hot', params)
  }
}
export default api
