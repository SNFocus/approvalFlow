const AttrList = 'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
  'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,type,usemap,value,width,wrap'

const makeMap = ( attrStr, expectsLowerCase ) => {
  const attrs = attrStr.split( ',' )
  const map = Object.create( null )
  attrs.forEach( t => map[t] = true )
  return expectsLowerCase ?
    val => map[val.toLowerCase()] :
    val => map[val]
}
const isAttr = makeMap( AttrList )
const vModel = ( self, vNode, value ) => {
  vNode.props.value = value.value
  vNode.on.input = val => {
    self.$emit( 'input', val )
  }
}
const componentChild = {
  'el-input': {
    prepend ( h, conf, key ) {
      return <template slot="prepend">{conf[key]}</template>
    },
    append ( h, conf, key ) {
      return <template slot="append">{conf[key]}</template>
    }
  },
  'el-select': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        list.push( <el-option label={item.label} value={item.value} disabled={item.disabled}></el-option> )
      } )
      return list
    }
  },
  'el-radio-group': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        if ( conf.optionType === 'button' ) list.push( <el-radio-button label={item.value}>{item.label}</el-radio-button> )
        else list.push( <el-radio label={item.value} border={conf.border}>{item.label}</el-radio> )
      } )
      return list
    }
  },
  'el-checkbox-group': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        if ( conf.optionType === 'button' ) {
          list.push( <el-checkbox-button label={item.value}>{item.label}</el-checkbox-button> )
        } else {
          list.push( <el-checkbox label={item.value} border={conf.border}>{item.label}</el-checkbox> )
        }
      } )
      return list
    }
  },
  'el-upload': {
    'list-type': ( h, conf, key ) => {
      const list = []
      if ( conf['list-type'] === 'picture-card' ) {
        list.push( <i class="el-icon-plus"></i> )
      } else {
        list.push( <el-button size="small" type="primary" icon="el-icon-upload">{conf.buttonText}</el-button> )
      }
      if ( conf.showTip ) {
        list.push( <div slot="tip" class="el-upload__tip">只能上传不超过 {conf.fileSize}{conf.sizeUnit} 的{conf.accept}文件</div> )
      }
      return list
    }
  }
}
export default {
  render ( h ) {
    const vNode = {
      // 与 `v-bind:class` 的 API 相同，
      // 接受一个字符串、对象或字符串和对象组成的数组
      class: {},
      // 与 `v-bind:style` 的 API 相同，
      // 接受一个字符串、对象，或对象组成的数组
      style: {},
      // 普通的 HTML attribute
      attrs: {},
      // 组件 prop
      props: {
        formData: this.formData
      },
      // 事件监听器在 `on` 内，
      // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
      // 需要在处理函数中手动检查 keyCode。
      on: {}
    }
    /***********      加载子节点       *************/
    const children = []
    const childHandler = componentChild[this.conf.tag]
    if ( childHandler ) {
      Object.keys( childHandler ).forEach( key => {
        this.conf[key] && children.push( childHandler[key]( h, this.conf, key ) )
      } )
    }
    /***********      整合节点属性       *************/
    Object.keys( this.conf ).forEach( key => {
      const val = this.conf[key]
      if ( key === 'vModel' ) {
        vModel( this, vNode, this.value )
      } else if ( vNode[key] ) {
        vNode[key] = val // style 
      } else if ( !isAttr( key ) ) {
        vNode.props[key] = val
      } else {
        vNode.attrs[key] = val
      }
    } )
    this.size && ( vNode.props.size = vNode.attrs.size = this.size )
    return h( this.conf.tag, vNode, children )
  },
  props: ['conf', 'value', 'size', 'formData']
}