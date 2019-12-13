<template>
    <div>
        <el-button @click="test">emit</el-button>
        <el-button @click="test2">emit2</el-button>
    </div>
</template>
<script>

export default {
  data() {
    return {

    }
  },
  methods: {
    test() {
      console.log(this.$eventEmit)
      this.$eventEmit.emit('test')
    },
    test2() {
      this.$eventEmit.emit('test', 'good')
    }
  }
}
</script>
