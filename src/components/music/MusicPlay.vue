<template>
  <div>
    <div style="text-align:center;height:30px;" @click="drawerBtn">
      <i v-if="!drawer" class="el-icon-service" />
    </div>
    <el-drawer
      title="music"
      :visible.sync="drawer"
      :direction="direction"
    >
      <audio ref="audio" style="display:none" :src="src" controls autoplay @canplay="canplay" @timeupdate="updateTime">你的浏览器不支持audio标签</audio>
      <div class="wrap">
        <div class="btns">
          <svg-icon icon-class="last" class="icon" />
          <svg-icon :icon-class="hasPlay?'suspend':'play'" class="icon" @click="onPlayType" />
          <svg-icon icon-class="next" class="icon" />
        </div>
        <div class="line-wrap" ref="progress">
          <div class="bg-line"></div>
          <div class="cache-line" :style="{width:cache+'px'}"></div>
          <div class="real-line" :style="{width:percentage+'px'}"></div>
          <svg-icon v-drag icon-class="circle" :style="{left:circleLeft+'px'}" class="icon-circle"/>
          <span class="time">{{currentTime | formatDuring}}/{{totalTime | formatDuring}}</span>
        </div>
        <div class="other">

        </div>
      </div>
    </el-drawer>
    <!-- <audio :src="src" controls autoplay>你的浏览器不支持audio标签</audio> -->
  </div>
</template>
<script>
let $this;
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
      direction: 'btt',
      hasPlay:false,
      currentTime:0,
      totalTime:0,
      percentage:0,
      cache:0,
      circleLeft:0
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
  created() {
    $this = this
  },
  methods: {
    updateTime(e){
      const buffered = e.target.buffered.end(e.target.buffered.length -1);
      this.currentTime = e.target.currentTime;
      const width = this.$refs.progress.offsetWidth;
      const scale = parseInt(e.target.currentTime) / parseInt(e.target.duration);
      const cacheScale = parseInt(buffered) / parseInt(e.target.duration);
      this.percentage = scale*width;
      this.circleLeft = scale*width-8;
      this.cache = cacheScale*width;
      if(this.percentage == 100){
        this.hasPlay = false;
      }
    },
    onPlayType() {
      if (this.hasPlay) {
        this.$refs.audio.pause()
      } else {
        this.$refs.audio.play()
      }
      this.hasPlay = !this.hasPlay
    },
    drawerBtn() {
      this.drawer = !this.drawer
    },
    canplay(e){
      this.hasPlay = true;
      this.totalTime = e.target.duration;
    },
  },
  filters:{
    formatDuring(mss) {
        var minutes = parseInt((parseInt(mss) % (60 * 60)) / 60);
        var seconds = parseInt(parseInt(mss) % 60);
        let str = '';
        str += minutes?minutes+ ":":'0' + ":";
        str += seconds?seconds>10?seconds:'0'+seconds:'00';
        return str;
    },
  },
  directives:{
    drag(el, bindings){
      if(!$this.totalTime) return;
        el.onmousedown = function(e){
            $this.$refs.audio.pause();
            const width = e.path[2].offsetWidth;
            const widthLeft = e.path[2].offsetLeft;
            document.onmousemove = function (e){
                if(e.pageX - widthLeft <= 0){
                  $this.circleLeft = 0;
                }else if(e.pageX - widthLeft >= width){
                  $this.circleLeft = width-5;
                }else{
                  $this.circleLeft = e.pageX - widthLeft-5;
                }
                const scale = $this.circleLeft/width;
                $this.percentage = width*scale;
                $this.currentTime = $this.totalTime*scale;
            }
            document.onmouseup = function(){
              $this.$refs.audio.currentTime = $this.currentTime;
              $this.$refs.audio.play();
              document.onmousemove = document.onmouseup = null;
            }
        }
    }
  }
}
</script>

<style lang="scss" scoped>
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
        .icon:hover{
          color: #1AAD19;
        }
      }
      .line-wrap{
        flex: 1;
        margin:0 15px;
        position: relative;
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
          cursor: pointer;
          z-index: 99;
        }
        .time{
          position: absolute;
          top: 10px;
        }
      }
      .other{
        width: 50px;
        background: #1AAD19;
        height: 32px;
      }
    }
</style>