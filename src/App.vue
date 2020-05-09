<template>
  <div id="app">
    <fc-dep-transfer v-model="value" title="test" :show.sync="show" @confirm="con"></fc-dep-transfer>
    <router-view/>
  </div>
</template>
<script>
export default {
  data(){
    return{
      show: true,
      value: {
        dep: [{
          "deptId": 9,
          "deptName": "子节点8",
          "parentDeptId": 1
        }],
        role: []
      }
    }
  },
  methods:{
    con(arg){console.log(arg)}
  }
}
</script>
<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

div,section
  &:focus
    outline 0
*, *::before, *::after 
  box-sizing border-box
</style>
