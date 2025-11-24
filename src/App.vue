<template>
  <div id="app">
    <h1>鲸舰电玩城管理系统</h1>
    <p>如果您看到这个页面，说明Vue正在工作</p>
    <button onclick="alert('按钮点击正常!')">测试按钮</button>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}
h1 {
  color: #409EFF;
}
button {
  background: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
}
</style>