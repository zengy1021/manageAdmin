<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 2" />
    <Test />
  </div>
</template>
<script>
import Test from './test.vue'
export default {
  components: {
    Test
  },
  created() {
    this.$eventEmit.on('test', this.doSomeThing)
  },
  methods: {
    doSomeThing(arg) {
      console.log('test测试成功', arg)
    }
  }
}
</script>
