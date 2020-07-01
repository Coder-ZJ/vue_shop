<template>
  <div>
    <el-button type='info' @click='logoutBtn'>退出</el-button>
  </div>
</template>
<script>
export default {
  name: 'Home',
  methods: {
    logoutBtn () {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
