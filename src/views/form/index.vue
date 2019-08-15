<template>
  <div class="app-container">
    <div>歌单列表</div>
    <!-- <audio :src="msrc" controls autoplay>你的浏览器不支持audio标签</audio> -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="歌手"
      >
        <template slot-scope="scope">
          <div v-if="!!scope.row.artists" class="singerStyle">
            <img :src="scope.row.album.blurPicUrl" alt="">
            <div>{{ scope.row.artists[0].name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="歌名"
      >
        <template slot-scope="scope">
          <div>
            <a @click="playMusic(scope.row)">{{ scope.row.name }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="lMusic"
        label="时长"
      >
        <template slot-scope="scope">
          <div>
            {{ fromatDate(scope.row.lMusic.playTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="歌曲id"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>

<script>
import api from '@/api'
import moment from 'moment'
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [],
      multipleSelection: [],
      msrc: ''
    }
  },
  created() {
    this.requestData()
  },
  methods: {
    fromatDate(time) {
      return moment(time).format('mm:ss')
    },
    async requestData() {
      const res = await api.getSongList('2795857062')
      // console.log(res)
      if (res.data.code === 200) {
        // console.log(res.data.data.tracks)
        this.tableData = res.data.data.tracks
      }
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val
    },
    async playMusic(item) {
      // console.log(item)
      const res = await api.getSongPlay({ id: item.id, quality: 'flac' })
      // console.log(res.request.responseURL, res.status)

      this.msrc = res.request.responseURL
      // if (res.status === 200) {
      //   this.$store.dispatch('music/changeSrc', { url: res.request.responseURL })
      //   this.$store.dispatch('music/openDrawer')
      // } else {
      //   this.$message(res.status)
      // }
      this.$store.dispatch('music/changeSrc', { url: res.request.responseURL })
      this.$store.dispatch('music/openDrawer')
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
.singerStyle{
  display: flex;
  &>div{
    line-height: 60px;
  }
  &>img{
    width: 60px;
    height: 60px;
    margin-right:15px;
  }
}
</style>

