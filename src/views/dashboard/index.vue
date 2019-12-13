<template>
  <div class="dashboard-container">
    <div class="dashboard-text">热门歌单</div>
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
        label="图片"
        width="120"
      >
        <template slot-scope="scope">
          <div>
            <img class="photoSize" :src="scope.row.coverImgUrl" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌单名"
      />
      <el-table-column
        prop="description"
        label="简介"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        prop="id"
        label="歌单id"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api'
export default {
  name: 'Dashboard',
  data() {
    return {
      multipleSelection: [],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.requestData()
  },
  methods: {
    async requestData() {
      const res = await api.getMusicList({ cat: '全部', pageSize: 20, page: 1 })
      console.log(res)
      if (res.data.code === 200) {
        this.tableData = res.data.data
      }
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.photoSize{
  width: 60px;
  height: 60px;
}
</style>
