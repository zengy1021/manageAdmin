<template>
  <div>
    <div style="text-align:center;height:30px;" @click="drawerBtn">
      <i v-if="!drawer" class="el-icon-service" />
    </div>
    <el-drawer
      title="music"
      :visible.sync="drawer"
      :direction="direction"
      size="20%"
    >
      <audio ref="audio" style="display:none" :src="src" controls autoplay @canplay="canplay" @timeupdate="updateTime">你的浏览器不支持audio标签</audio>
      <div class="wrap">
        <div class="btns">
          <svg-icon icon-class="last" class="icon" @click="lastSong" />
          <svg-icon v-show="loading" icon-class="loading" class="icon rotate" />
          <svg-icon v-show="!loading" :icon-class="hasPlay?'suspend':'play'" class="icon" @click="onPlayType" />
          <svg-icon icon-class="next" class="icon" @click="nextSong" />
        </div>
        <div ref="progress" class="line-wrap">
          <div class="bg-line" @click="changeCurrentTime" />
          <div class="cache-line" :style="{width:cache+'%'}" @click="changeCurrentTime" />
          <div class="real-line" :style="{width:percentage+'%'}" @click="changeCurrentTime" />
          <svg-icon v-drag icon-class="circle" :style="{left:circleLeft+'%'}" class="icon-circle" />
          <span class="time">{{ currentTime | formatDuring }}/{{ totalTime | formatDuring }}</span>
        </div>
        <div class="other">
          <el-popover
            popper-class="volume"
            placement="top"
            trigger="hover"
            :open-delay="100"
          >
            <el-slider
              v-model="volume"
              vertical
              height="100px"
              @change="changeVolume"
            />
            <svg-icon slot="reference" :icon-class="volumeIcon" class="icon" />
          </el-popover>
          <svg-icon :title="playType?'随机播放':'循环播放'" :icon-class="playType?'random':'loop'" class="icon" @click="changePalyType" />
          <svg-icon title="播放列表" icon-class="play-list" class="icon" />
        </div>
      </div>
      <div>
        musicList
      </div>
    </el-drawer>
    <!-- <audio :src="src" controls autoplay>你的浏览器不支持audio标签</audio> -->
  </div>
</template>
<script>
import api from '@/api'

let $this
export default {
  name: 'MusicPlay',
  filters: {
    formatDuring(mss) {
      var minutes = parseInt((parseInt(mss) % (60 * 60)) / 60)
      var seconds = parseInt(parseInt(mss) % 60)
      let str = ''
      str += minutes ? minutes + ':' : '0' + ':'
      str += seconds ? seconds > 9 ? seconds : '0' + seconds : '00'
      return str
    }
  },
  directives: {
    drag(el, bindings) {
      if (!$this.totalTime) return
      el.onmousedown = function(e) {
        $this.$refs.audio.pause()
        const width = e.path[2].offsetWidth
        const widthLeft = e.path[2].offsetLeft
        document.onmousemove = function(e) {
          if (e.pageX - widthLeft <= 0) {
            $this.circleLeft = 0
          } else if (e.pageX - widthLeft >= width) {
            $this.circleLeft = width - 5
          } else {
            $this.circleLeft = e.pageX - widthLeft - 5
          }
          const scale = $this.circleLeft / width
          $this.circleLeft = scale * 100
          $this.percentage = scale * 100
          $this.currentTime = $this.totalTime * scale
        }
        document.onmouseup = function() {
          $this.$refs.audio.currentTime = $this.currentTime
          $this.$refs.audio.play()
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: false,
      direction: 'btt',
      hasPlay: false,
      currentTime: 0,
      totalTime: 0,
      percentage: 0,
      cache: 0,
      circleLeft: 0,
      volume: 0,
      playType: false,
      src: '',
      index: 0,
      loading: false
    }
  },
  computed: {
    volumeIcon() {
      if (this.volume > 0 && this.volume < 50) {
        return 'lowVolume'
      } else if (this.volume >= 50) {
        return 'highVolume'
      }
      return 'mute'
    },
    musicList() {
      return this.$store.getters.musicList
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
    },
    musicList(val) {
      // 先播放第一首
      this.index = 0
      this.playMusic(val[this.index])
    }
  },
  created() {
    $this = this
  },
  methods: {
    // 切换播放形式
    changePalyType() {
      this.playType = !this.playType
    },
    // 修改音量
    changeVolume(value) {
      this.$refs.audio.volume = value / 100
    },
    // 修改播放时间
    changeCurrentTime(e) {
      if (!this.totalTime) return
      const width = this.$refs.progress.offsetWidth
      const scale = parseInt(e.offsetX) / parseInt(width)
      this.percentage = scale * 100
      this.circleLeft = scale * 100
      this.currentTime = this.totalTime * scale
      this.$refs.audio.currentTime = this.currentTime
    },
    // 播放时间更新
    updateTime(e) {
      if (e.target.buffered.length) {
        const buffered = e.target.buffered.end(e.target.buffered.length - 1)
        const cacheScale = parseInt(buffered) / parseInt(e.target.duration)
        this.cache = cacheScale * 100
      }
      this.currentTime = e.target.currentTime
      const scale = parseInt(e.target.currentTime) / parseInt(e.target.duration)
      this.percentage = scale * 100
      this.circleLeft = scale * 100
      if (this.percentage === 100 && this.length === 0) {
        this.hasPlay = false
      } else if (this.percentage === 100) {
        this.nextSong()
      }
    },
    // 下一首
    nextSong() {
      this.handleMusic('next')
    },
    // 上一首
    lastSong() {
      this.handleMusic('last')
    },
    // 处理播放歌曲
    handleMusic(type) {
      if (this.playType) { // 随机的
        const i = Math.floor(Math.random() * this.musicList.length)
        if (i === this.index) { // 重来
          this.handleMusic()
          return
        } else {
          this.index = i
        }
      } else { // 正常的
        if (type === 'last') {
          this.index -= 1
        } else {
          this.index += 1
        }
        if (this.index === this.musicList.length) { // 从头再来
          this.index = 0
        } else if (this.index < 0) {
          this.index = this.musicList.length - 1
        }
      }
      this.playMusic(this.musicList[this.index])
    },
    async playMusic(item) {
      this.loading = true
      const res = await api.getSongPlay({ id: item.id, quality: 'flac' })
      this.loading = false
      this.src = res.request.responseURL
    },
    // 播放 or 暂停
    onPlayType() {
      if (!this.totalTime) return
      if (this.hasPlay) {
        this.$refs.audio.pause()
      } else {
        this.$refs.audio.play()
      }
      this.hasPlay = !this.hasPlay
    },
    // - -！
    drawerBtn() {
      this.drawer = !this.drawer
    },
    // 可以开始播放了
    canplay(e) {
      this.hasPlay = true
      this.volume = e.target.volume * 100
      this.totalTime = e.target.duration
    }
  }
}
</script>

<style lang="scss" scoped>
    @keyframes loading{
      0%{transform:rotateZ(0deg)}
      100%{transform:rotateZ(360deg)}
    }
    .wrap{
      width: 80%;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      -o-user-select: none;
      -moz-user-select: none; /*火狐 firefox*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10+*/
      -khtml-user-select :none; /*早期的浏览器*/
      user-select: none;
      .btns{
        .icon{
          font-size: 32px;
          color: #999;
          cursor: pointer;
        }
        .rotate{
          animation: loading 1s linear infinite;
        }
        .icon:hover{
          color: #1AAD19;
        }
      }
      .line-wrap{
        flex: 1;
        margin:0 15px;
        position: relative;
        height: 6px;
        cursor: pointer;
        .bg-line,.cache-line,.real-line{
          width: 100%;
          height: 6px;
          border-radius: 100px;
          position: absolute;
          background-color: #ebeef5;
          z-index: 1;
        }
        .cache-line{
          background-color: #909399;
          z-index: 2;
        }
        .real-line{
          background-color: #1AAD19;
          z-index: 3;
        }
        .icon-circle{
          position: absolute;
          left: 0;
          top: -5px;
          font-size: 16px;
          color: #409eff;
          // cursor: pointer;
          z-index: 99;
          margin-left: -8px;
        }
        .time{
          position: absolute;
          top: 10px;
        }
      }
      .other{
        display: flex;
        align-items: center;
        .icon{
          font-size: 22px;
          margin-right: 10px;
        }
      }
    }
</style>
