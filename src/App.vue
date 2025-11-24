<template>
  <div id="app">
    <h1>鲸舰电玩城管理系统</h1>
    <el-button type="primary">测试按钮</el-button>
    <p>如果您看到这个页面，说明基础配置是正确的</p>
    <p>现在时间是: {{ currentTime }}</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentTime: new Date().toLocaleString()
    }
  },
  mounted() {
    console.log('Vue应用已挂载')
    setInterval(() => {
      this.currentTime = new Date().toLocaleString()
    }, 1000)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
}
</style>