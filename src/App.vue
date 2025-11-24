<template>
  <div id="app">
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #409EFF; margin-bottom: 20px;">🎮 鲸舰电玩城管理系统</h1>
      <div style="background: #e6f7ff; border: 1px solid #91d5ff; padding: 10px; border-radius: 4px; margin: 10px 0;">
        <p>状态: <strong>Vue运行正常</strong></p>
        <p>时间: {{ currentTime }}</p>
      </div>
      <button @click="showMessage" style="background: #409EFF; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 10px 0;">
        测试按钮
      </button>
      <p v-if="message" style="color: #67C23A; margin: 10px 0; font-weight: bold;">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentTime: new Date().toLocaleString(),
      message: ''
    }
  },
  methods: {
    showMessage() {
      this.message = '✅ Vue应用工作正常！按钮点击成功！';
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  },
  mounted() {
    console.log('✅ Vue应用已成功挂载');
    setInterval(() => {
      this.currentTime = new Date().toLocaleString();
    }, 1000);
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
  margin: 0;
}
body {
  margin: 0;
  padding: 0;
}
</style>