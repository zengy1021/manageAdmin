<template>
  <div>
    <div style="text-align:center" @click="drawerBtn">top</div>
    <el-drawer
      title="music"
      :visible.sync="drawer"
      :direction="direction"
    >
      <audio :src="src" controls autoplay>你的浏览器不支持audio标签</audio>
    </el-drawer>
    <!-- <audio :src="src" controls autoplay>你的浏览器不支持audio标签</audio> -->
  </div>
</template>
<script>
export default {
  name: 'MusicPlay',
  props: {
    src: {
      type: String,
      default: ''
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: false,
      direction: 'btt'
    }
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.drawer = val
      }
    },
    drawer(val) {
      if (!val) {
        this.$store.dispatch('music/closeDrawer')
      }
    }
  },
  methods: {
    drawerBtn() {
      this.drawer = !this.drawer
    }
  }
}
</script>
