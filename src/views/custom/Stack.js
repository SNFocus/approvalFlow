export class AnimeLoader {
  constructor( ) {
    this.animations = []
    this.animeTask = []
  }
  
  addTask ( action ) {
    const func = this[action]
    if ( !func ) return
    const arg = Array.from( arguments ).slice( 1 )
    this.animeTask.push( func.bind( this, ...arg ) )
    if ( this.animeTask.length === 1 ) {
      this.animeTask[0]()
    }
  }

  static genFrames ( target, pos ) {
    const res = [], frameStr = pos.split( /\s*,\s*/ )
    for ( let i = 0; i < frameStr.length; i++ ) {
      const [x, y] = frameStr[i].trim().split( /\s+/ ).map( Number )
      res.push( { x: target.x + x, y: target.y + y } )
    }
    return res
  }

  startAnime ( id, pos, cb, gap ) {
    const target = this.getItem(id).target
    const frames = AnimeLoader.genFrames( target, pos )
    const setAttr = conf => {
      target.x = conf.x
      target.y = conf.y
      target.animate = true
    }
    setAttr( frames[0] )
    // frames.length + 1 是为了增加一次延迟 等动画完全结束后再执行cb
    for ( let i = 1; i < frames.length + 1; i++ ) {
      setTimeout( () => {
        if ( i === frames.length ) {
          cb && cb()
          this.animeTask.shift()
          this.animeTask[0] && this.animeTask[0]()
        } else {
          setAttr( frames[i] )
        }
      }, i * ( gap || 500 ) )
    }
  }

  addItem (id, val, x, y) {
    const item =  {_id: id, x, y, val, animate: false}
    this.animations.push(item)
  }

  delItem (id) {
    const index = this.getItem( id ).index
    if (index > -1) {
      this.animations.splice(index, 1)
    }
  }

  clearAnimeFlag () {
    this.animations.forEach(t => t.animate = false)
  }

  getItem ( id ) {
    let target = null, index = null
    this.animations.some( ( t, i ) => {
      if ( t._id === id ) {
        target = t
        index = i
        return true
      }
      return false
    } )
    return { target, index }
  }
}
const actionTask = []

const diffH = (from, to) => {
  return (from.length() - 1) * from.th - to.length() * to.th
}

export class Stack {
  static id = 0
  static animeLoader = null
  /**
   * @constructor
   * @param {Number} sx - 栈容器横坐标
   * @param {Number} sy - 栈容器竖坐标
   * @param {Number} tw - 栈元素宽度
   * @param {Number} th - 栈元素高度
   */
  constructor( sx = 0, sy = 0, tw = 0, th = 0, children = [] ) {
    this.sx = sx
    this.sy = sy
    this.tw = tw
    this.th = th
    this.children = children
  }

  static idIncrease () {
    return ++this.id
  }

  setSx ( sx ) { this.sx = sx }
  setSy ( sy ) { this.sy = sy }
  setTw ( tw ) { this.tw = tw }
  setTh ( th ) { this.th = th }
  setChildren ( children ) { this.children = children }

  addAction (action) {
    const func = this[action]
    if ( !func ) return
    const arg = Array.from( arguments ).slice( 1 )
    actionTask.push( func.bind( this, ...arg ) )
    console.log(action, actionTask.length)
    if (actionTask.length === 1) {
      actionTask[0]()
    }
  }

  loopAction (shift = false) {
    shift && actionTask.shift()
    console.log('do loop', actionTask.length, Stack.animeLoader)
    if ( actionTask.length > 0 ) {
      actionTask[0]()
    }
  }

  afterAction (cb) {
    return () => {
      cb && cb()
      Stack.animeLoader.addTask('clearAnimeFlag')
      console.log('do afterAction')
      this.loopAction(true)
    }
  }

  getHead () {
    return this.isEmpty() ?
      null :
      this.children[this.children.length - 1]
  }

  isEmpty () {
    return this.children.length === 0
  }

  length () {
    return this.children.length
  }

  createItem ( val, index, push = false ) {
    const item = { _id: Stack.idIncrease() , val }
    const x = this.sx
    const y = this.sy - this.th * index
    Stack.animeLoader.addItem(item._id, val, x, y)
    push && this.children.push(item)
    return item
  }

  push ( val ) {
    const item = this.createItem(val, this.length())
    Stack.animeLoader.addTask('startAnime', item._id, `0 -${this.th} , 0 0`,
    this.afterAction(() => {
      console.log('end push')
      this.children.push( item )
    }))
  }

  pop () {
    const headItem = this.getHead()
    if (!headItem) return
    const pos = `0 0, 0 -${this.th}`
    Stack.animeLoader.addTask('startAnime', headItem._id, pos,
    this.afterAction(() => {
      console.log('end pop')
      Stack.animeLoader.delItem(this.children.pop()._id)
    }))
  }

  exchange (from, to) {
    const topVal = from.getHead()
    if (!topVal) return
    const pos = '0 0,' + [to.sx - from.sx, diffH(from, to)].join(' ')
    Stack.animeLoader.addTask(
      'startAnime',
      topVal._id,
      pos,
      this.afterAction(()=>{
        to._push(from._pop()) 
      }))
  }

  merge (from, len) {
    const ids = []
      const fromLen = from.length()
      for (let i = 0; i < len; i++) {
        const id = from.getItemByIdx(fromLen - i - 1)._id
        ids.push(id)
        let cb = undefined
        if (i === len - 1) {
          const temp = () => {
            ids.forEach(id =>{
              Stack.animeLoader.delItem(id)
              from._pop()
            })
            setTimeout(() => {
              this.addAction('push', 10)
              this.addAction('push', 11)
            }, 500);
            console.log('end merge')
          }
          cb = this.afterAction(temp)
        }
        Stack.animeLoader.addTask('startAnime', id, `0 0, 0 -${from.th * i}`, cb)
      }
  }

  _push (item) {
    return this.children.push(item)
  }

  _pop () { return this.children.pop()}

  getItemByIdx ( idx ) {
    if ( this.isEmpty() ) return null
    if ( idx > this.length() - 1 ) return null
    return this.children[idx]
  }
}
