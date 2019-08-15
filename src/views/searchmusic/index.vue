<template>
  <div>
    <el-row :gutter="24" style="padding:15px">
      <el-col :span="12">
        <div>
          <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入歌曲名"
            :remote-method="remoteMethod"
            :loading="loading"
            :clearable="true"
            size="medium"
            @change="selectMusic"
            @clear="clearSearch"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>
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
          <div v-if="!!scope.row.ar" style="font-size:0">
            <img v-if="scope.row.al.picUrl" :src="scope.row.al.picUrl" alt="" class="picStyle">
            <span style="display:inline-block;font-size:14px;height:30px;line-height:30px"> {{ scope.row.ar[0].name }}</span>
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
            {{ fromatDate(scope.row.dt) }}
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
  name: 'Searchmusic',
  data() {
    return {
      value: '',
      options: [],
      loading: false,
      tableData: [],
      multipleSelection: []

    }
  },
  methods: {
    async selectMusic(val) {
    //   console.log()
      if (val.split(',')[0]) {
        const res = await api.searchMusicList(val.split(',')[0])
        if (res.data.code === 200) {
          this.tableData = res.data.data.songs
        }
      }
    },
    fromatDate(time) {
      return moment(time).format('mm:ss')
    },
    async remoteMethod(query) {
      if (query) {
        const res = await api.searchMusicList(query)
        // console.log(res)
        if (res.data.code === 200) {
          this.options = res.data.data.songs
          //   console.log(res.data.data.songs)
          this.options.map(item => {
            item.value = item.name + ',' + item.id
            item.label = item.name + ' ' + item.ar[0].name
          })
        }
      }
    },
    async playMusic(item) {
    //   console.log(item)
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
    clearSearch() {
      this.options = []
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
    .picStyle{
        width:30px;
        height:30px;
        vertical-align: top;
        margin-right:15px
    }
</style>
