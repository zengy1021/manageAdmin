const state = {
  src: '',
  isOpen: false
}

const mutations = {
  CHANGE_SRC: (state, data) => {
    // console.log(state, data)
    state.src = data.url
  },
  OPEN_DRAWER: (state) => {
    state.isOpen = true
  },
  CLOSE_DRAWER: (state) => {
    state.isOpen = false
  }
}

const actions = {
  changeSrc({ commit }, data) {
    commit('CHANGE_SRC', data)
  },
  openDrawer({ commit }) {
    commit('OPEN_DRAWER')
  },
  closeDrawer({ commit }) {
    commit('CLOSE_DRAWER')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
