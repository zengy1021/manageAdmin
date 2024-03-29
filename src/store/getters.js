const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  src: state => state.music.src,
  musicList: state => state.music.musicList,
  isOpen: state => state.music.isOpen
}
export default getters
