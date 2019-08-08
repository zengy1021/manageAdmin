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
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
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
