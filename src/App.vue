<template>
  <div id="app">
    <router-view/>
  </div>
</template>

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
