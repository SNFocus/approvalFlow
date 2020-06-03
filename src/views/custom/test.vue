<template>
  <div id="animation-box">
    <template v-if="animeUtil">
      <div 
        v-for="item in animeUtil.animationList"
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
import {Anime, Stack} from './Stack.js'
const genFrames = (target, offsets) => {
  const res = [], pos = offsets.split(/\s*,\s*/)
  for (let i = 0; i < pos.length; i++) {
    const [x, y] = pos[i].trim().split(/\s+/).map(Number)
    res.push({x: target.x + x, y: target.y + y})
  }
  return res
}
const diffH = (from, to) => {
  return (from.length() - 1) * from.th - to.length() * to.th
}
const setAnime = (target, frames, cb) => {
      const setAttr = conf => {
        target.x = conf.x
        target.y = conf.y
      }
      setAttr(frames[0])
      // frames.length + 1 是为了增加一次延迟 等动画结束后再执行cb
      for (let i = 1; i < frames.length + 1; i++) {
        setTimeout(() => {
          i === frames.length ? cb && cb() : setAttr(frames[i])
        }, i * 500)
      }
    }

export default {
  data () {
    return {
      data: [[1,2,3], [4,5,6]],
      stackList: [],
      animeUtil: null,
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
  computed: {
   
  },
  mounted () {
    this.initStackPos()
    this.pushStack(this.stackList[0], 8)
    this.popStack(this.stackList[0], 2)
    this.popTo(this.stackList[1], this.stackList[0])
    // this.merge(this.stackList[0], 2, 10, this.stackList[1])
  },
  methods: {
    addAction (action) {
      if (this[action] ) {
        const arg = arguments.slice(1)
        this.actions.push(this[actions])
      }
    },

    initStackPos () {
      this.stackList = []
      const eleList = []
      const box = document.getElementById('animation-box')
      const {stackWidth, stackHeight, stackGap} = this.config
      this.data.forEach((item, i) => {
        const x = i * stackWidth + (i + 1) * stackGap
        const y = box.clientHeight - 50 // 距离底部 20 (20 = 50 - 30)
        const stack = new Stack(x, y, stackWidth, stackHeight)
        const children = item.map((t, i) => stack.createItem(t, i))
        stack.setChildren(children)
        eleList.push(...JSON.parse(JSON.stringify(children)))
        this.stackList.push(stack)
      })
      this.animeUtil = new Anime(eleList)
    },

    popStack (stack) {
      if (stack.isEmpty()) return
      const cb = () => stack.pop() 
      const pos = `0 0, 0 -${stack.th}`
      this.animeUtil.addTask('pop', stack.getHead()._id, pos, cb)
    },

    popTo (from, to) {
      const topVal = from.getHead()
      if (!topVal) return
      const pos = '0 0,' + [to.sx - from.sx, diffH(from, to)].join(' ')
      const callback = () => to.push(from.pop()) 
      this.animeUtil.addTask('setPosAndRun', topVal._id, pos, callback)
    },

    pushStack (stack, val) {
      const newItem = stack.createItem(val, stack.length())
      const cb = () => stack.push(newItem)
      this.animeUtil.addTask('push', newItem, `0 -${stack.th} , 0 0`, cb)
    },

    merge (from, len, mergedVal, to) {
      const ids = []
      for (let i = 0; i < len; i++) {
        const id = from.getItemByIdx(from.length() - i - 1)._id
        ids.push(id)
        const endPos = `0 -${from.th * i}`
        let cb = null
        if (i === len - 1) {
          cb = () => {
            ids.forEach(id =>{
              this.animeUtil.addTask('pop', id, null, () => {
                from.pop()
              })
            })
            this.pushStack(from, mergedVal)
            to && this.popTo(from, to)
          }
        }
        this.animeUtil.addTask('setPosAndRun', id, '0 0, ' + endPos, cb)
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
