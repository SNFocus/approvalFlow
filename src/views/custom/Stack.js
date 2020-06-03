const notEmptyArray = arr => Array.isArray( arr ) && arr.length > 0
const clone = target => Object.assign( {}, target )

export class Anime {
  constructor( animationList ) {
    this.animationList = animationList
    this.animeTask = []
    new Promise( ( resolve ) => {
      this.resolve = resolve
    } )
  }
  static genFrames ( target, pos ) {
    const res = [], frameStr = pos.split( /\s*,\s*/ )
    for ( let i = 0; i < frameStr.length; i++ ) {
      const [x, y] = frameStr[i].trim().split( /\s+/ ).map( Number )
      res.push( { x: target.x + x, y: target.y + y } )
    }
    return res
  }

  setPosAndRun ( id, pos, cb, gap ) {
    const { target } = this.getItem( id )
    target && this.startAnime( target, pos, cb, gap )
  }

  startAnime ( target, pos, cb, gap ) {
    const frames = Anime.genFrames( target, pos )
    const setAttr = conf => {
      target.x = conf.x
      target.y = conf.y
      target.animate = true
    }
    setAttr( frames[0] )
    // frames.length + 1 是为了增加一次延迟 等动画结束后再执行cb
    for ( let i = 1; i < frames.length + 1; i++ ) {
      setTimeout( () => {
        if ( i === frames.length ) {
          cb && cb()
          setTimeout( () => {
            target.animate = false
            this.animeTask.shift()
            this.animeTask[0] && this.animeTask[0]()
          }, 200 )

        } else {
          setAttr( frames[i] )
        }
      }, i * ( gap || 500 ) )
    }
  }

  // startAnime () {
  //   const func = this.runAnime.bind( this, ...arguments )
  //   this.animeTask.push( func )
  //   if ( this.animeTask.length === 1 ) {
  //     func()
  //   }
  // }

  addTask ( action ) {
    const func = this[action]
    if ( !func ) return
    const arg = Array.from( arguments ).slice( 1 )
    this.animeTask.push( func.bind( this, ...arg ) )
    if ( this.animeTask.length === 1 ) {
      this.animeTask[0]()
    }
  }

  push ( item, pos, cb ) {
    const temp = clone( item )
    pos && this.startAnime( temp, pos, cb )
    this.animationList.push( temp )
  }

  pop ( id, pos, cb ) {
    const after = () => {
      this.animationList.splice( this.getItem( id ).index, 1 )
      cb && cb()
    }
    this.setPosAndRun( id, pos || '0 0, 0 0', after )
  }

  getItem ( id ) {
    let target = null, index = null
    this.animationList.some( ( t, i ) => {
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

export class Stack {
  static id = 0
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

  updateItem ( target, index ) {
    target.x = this.sx
    target.y = this.sy - this.th * index
  }

  createItem ( val, index ) {
    const item = { _id: Stack.idIncrease(), val }
    this.updateItem( item, index )
    return item
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

  push ( child ) {
    return this.children.push( child )
  }

  pop () {
    return this.children.pop()
  }

  getItemByIdx ( idx ) {
    if ( this.isEmpty() ) return null
    if ( idx > this.length() - 1 ) return null
    return this.children[idx]
  }
}
