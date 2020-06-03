<template>
  <div id="animation-box">
    <template v-if="animeLoader">
      <div 
        v-for="item in animeLoader.animations"
        :key="item._id"
        class="anime-item"
        :class="{animate: item.animate}"
        :style="`left: ${item.x}px; top: ${item.y}px`">
        {{item.val}}
      </div>
    </template>
  </div>
</template>
<script>
import {AnimeLoader, Stack} from './Stack.js'


export default {
  data () {
    return {
      data: [[1,2,3], [4,5,6]],
      stackList: [],
      animeLoader: null,
      actions:[],
      config: {
        startX: 100,
        startY: 0,
        stackGap: 50,
        stackWidth: 30,
        stackHeight: 30
      }
    }
  },

  mounted () {
    this.initStackPos()
    const stack1 = this.stackList[0]
    const stack2 = this.stackList[1]
    stack1.addAction('push', 10)
    stack1.addAction('push', 12)
    stack1.addAction('push', 13)
    // stack1.addAction('pop')
    // stack1.addAction('merge',  stack1, 2)
    // stack1.addAction('push', 10)
    // stack1.addAction('exchange', stack1, stack2)
  },
  methods: {
    initStackPos () {
      this.stackList = []
      const box = document.getElementById('animation-box')
      const {stackWidth, stackHeight, stackGap} = this.config
      Stack.animeLoader = new AnimeLoader()
      this.data.forEach((item, i) => {
        const x = i * stackWidth + (i + 1) * stackGap
        const y = box.clientHeight - 50 // 距离底部 20 (20 = 50 - 30)
        const stack = new Stack(x, y, stackWidth, stackHeight)
        item.forEach((t, idx) => stack.createItem(t, idx, true))
        this.stackList.push(stack)
      })
      this.animeLoader = Stack.animeLoader
    },

    popStack (stack) {
      stack.pop()
    },

    popTo (from, to) {
      const topVal = from.getHead()
      if (!topVal) return
      const pos = '0 0,' + [to.sx - from.sx, diffH(from, to)].join(' ')
      const callback = () => to._push(from._pop()) 
      this.animeLoader.addTask('startAnime', topVal._id, pos, callback)
    },

    pushStack (stack, val) {
      stack.push(val)
    },

    merge (from, len, mergedVal, to) {
      const ids = []
      const fromLen = from.length()
      for (let i = 0; i < len; i++) {
        const id = from.getItemByIdx(fromLen - i - 1)._id
        ids.push(id)
        let cb = undefined
        if (i === len - 1) {
          cb = () => {
            ids.forEach(id =>{
              this.animeLoader.delItem(id)
              from._pop()
            })
            from.push(mergedVal)
            this.animeLoader.addTask('clearAnimeFlag')
            // to && this.popTo(from, to)
          }
        }
        this.animeLoader.addTask('startAnime', id, `0 0, 0 -${from.th * i}`, cb)
      }
    }
  }
}
</script>
<style lang="stylus" >
#animation-box
  width 100%
  height 100%
  min-width 300px
  min-height 300px
  position relative
  .anime-item
    position absolute
    border 1px solid #d5d5d5
    width 30px
    height 30px
    padding 10px
    display flex
    align-items center
    justify-content center
    transition left .5s, top .5s
    &.animate
      background #e6a23c
      color white
</style>
