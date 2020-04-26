/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */
function loadScript ( src, callback ) {
  const cb = callback || ( () => { } )
  const $script = document.createElement( 'script' )
  $script.src = src
  $script.id = src
  document.body.appendChild( $script )
  const onEnd = 'onload' in $script ? stdOnEnd : ieOnEnd
  onEnd( $script )

  function stdOnEnd ( script ) {
    script.onload = () => {
      this.onerror = this.onload = null
      cb( null, script )
    }
    script.onerror = () => {
      this.onerror = this.onload = null
      cb( new Error( `Failed to load ${src}` ), script )
    }
  }

  function ieOnEnd ( script ) {
    script.onreadystatechange = () => {
      if ( this.readyState !== 'complete' && this.readyState !== 'loaded' ) return
      this.onreadystatechange = null
      cb( null, script )
    }
  }
}

export default loadScript
