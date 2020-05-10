/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */
import { isArray } from 'util'
import { exportDefault, titleCase } from '../../utils'
import { trigger } from './config'

const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}
let confGlobal
const inheritAttrs = {
  file: '',
  dialog: 'inheritAttrs: false,'
}

export function makeUpJs ( conf, type ) {
  confGlobal = conf = JSON.parse( JSON.stringify( conf ) )
  const dataList = []
  const ruleList = []
  const optionsList = []
  const propsList = []
  const methodList = mixinMethod( type )
  const uploadVarList = []
  const watchFuncList = []

  conf.fields.forEach( el => {
    buildAttributes( el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, watchFuncList )
  } )

  const script = buildexport(
    conf,
    type,
    dataList.join( '\n' ),
    ruleList.join( '\n' ),
    optionsList.join( '\n' ),
    uploadVarList.join( '\n' ),
    propsList.join( '\n' ),
    methodList.join( '\n' ),
    watchFuncList.join('\n')
  )
  confGlobal = null
  return script
}

function buildWatchInCreated (key,callbackStr, watchFuncList) {
  watchFuncList.push(`this.$watch(function () {
    return this.${confGlobal.formModel}.${key}
  }, ${callbackStr})`)
}
/**
 * fc-org-select v-model绑定的是一个对象 才疏学浅 需要添加多余的代码啊兼容此种情况
 * 针对fc-org-select 添加相应的表单验证
 * @param {*} conf - 控件数据
 * @param {*} watchFuncList - watch列表
 */
const setFcOrgSelectRule = (conf, watchFuncList) => {
  let rule = `{ validator: (rule, value, callback) => {
    debugger
    const val = eval('window._previewVm.vmFormData.' + rule.field)
    const tabList = ${JSON.stringify( conf.tabList )}
    let count = 0
    tabList.forEach(key => {
      val && Array.isArray(val[key]) && (count += val[key].length)
    })
    if(count > 0){
      callback()
    }else{
      callback(new Error('${conf.title}不能为空'))
    }
  }, trigger: '${trigger[conf.tag]}', type: 'object' }`
  const key = conf.isChild ? conf.vModel.replace('index', conf.childIndex): conf.vModel
  buildWatchInCreated(key,`function (newVal, oldVal) {
      this.$refs["elForm"].validateField("${key}",()=>{ })
  }`, watchFuncList)
  return rule
}

function buildAttributes ( el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, watchFuncList ) {
  buildData( el, dataList )
  buildRules( el, ruleList, watchFuncList )

  if ( el.options && el.options.length ) {
    buildOptions( el, optionsList )
    if ( el.dataType === 'dynamic' ) {
      const model = `${el.vModel}Options`
      const options = titleCase( model )
      buildOptionMethod( `get${options}`, model, methodList )
    }
  }

  if ( el.props && el.props.props ) {
    buildProps( el, propsList )
  }

  if ( el.action && el.tag === 'el-upload' ) {
    uploadVarList.push(
      `field${el.formId}Action: '${el.action}',
      field${el.formId}fileList: [],`
    )
    methodList.push( buildBeforeUpload( el ) )
    if ( !el['auto-upload'] ) {
      methodList.push( buildSubmitUpload( el ) )
    }
  }

  if ( el.children ) {
    el.children.forEach( (el2, index) => {
      el2.isChild = true  // 临时变量
      el2.childIndex = index  // 临时变量
      buildAttributes( el2, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, watchFuncList, true )
    } )
  }
}

function mixinMethod ( type ) {
  const list = []; const
    minxins = {
      file: confGlobal.formBtns ? {
        submitForm: `submitForm() {
          this.$refs['${confGlobal.formRef}'].validate(valid => {
            if(!valid) return
            console.log(this.${confGlobal.formModel})
            // TODO 提交表单
          })
        },`,
        resetForm: `resetForm() {
          this.$refs['${confGlobal.formRef}'].resetFields()
        },`,
        addRowComponent: `addRowComponent(rowCmpName) {
          const rowData = this.${confGlobal.formModel}[rowCmpName]
          rowData.push(Object.assign({}, rowData[0]))
      },`
      } : null,
      dialog: {
        onOpen: 'onOpen() {},',
        onClose: `onClose() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`,
        close: `close() {
        this.$emit('update:visible', false)
      },`,
        handelConfirm: `handelConfirm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
      }
    }

  const methods = minxins[type]
  if ( methods ) {
    Object.keys( methods ).forEach( key => {
      list.push( methods[key] )
    } )
  }

  return list
}

let list;

function buildData ( conf, dataList ) {
  // if ( conf.layout === "rowFormItem" ) {
  //   list = []
  //   // TODO
  //   dataList.push( conf.componentName + ': ' )
  // }
  if ( conf.vModel === undefined ) return

  let defaultValue
  if ( typeof ( conf.defaultValue ) === 'string' && !conf.multiple ) {
    defaultValue = `'${conf.defaultValue}'`
  } else {
    defaultValue = `${JSON.stringify( conf.defaultValue )}`
  }
  if ( conf.vModel.includes( '[index]' ) && list ) {
    const rowName = conf.vModel.replace( /\[index\].+/, '' )
    let key = eval( conf.vModel.replace( /\w+\[index\]/, '' ) )[0]
    list.push( `${key}: ${defaultValue}` )
    let listIndex = dataList.findIndex( item => item.includes( rowName ) )
    dataList[listIndex] = rowName + ': ' + `[{${list.join( ',' )}}],`
    return;
  }
  dataList.push( `${conf.vModel}: ${defaultValue},` )
}

function buildRules ( conf, ruleList, watchFuncList ) {
  if ( conf.vModel === undefined ) return
  const rules = []
  if ( trigger[conf.tag] ) {
    if ( conf.required ) {
      const type = isArray( conf.defaultValue ) ? 'type: \'array\',' : ''
      let message = isArray( conf.defaultValue ) ? `请至少选择一个` : conf.placeholder
      if ( message === undefined ) message = `${conf.label}不能为空`
      if ( conf.tag === 'fc-org-select' ) {
        rules.push( setFcOrgSelectRule(conf, watchFuncList) )
      } else {
        rules.push( `{ required: true, ${type} message: '${message}', trigger: '${trigger[conf.tag]}' }` )
      }
    }
    if ( conf.regList && isArray( conf.regList ) ) {
      conf.regList.forEach( item => {
        if ( item.pattern ) {
          rules.push( `{ pattern: ${eval( item.pattern )}, message: '${item.message}', trigger: '${trigger[conf.tag]}' }` )
        }
      } )
    }

    let key = conf.vModel
    // 判断是否是行容器下的组件
    if ( /\w+\[index\].+/.test( conf.vModel ) ) {
      // key = eval( conf.vModel.replace( /\w+\[index\]/, '' ) )[0]
      key = conf.vModel.replace('index', conf.childIndex)
    }
    ruleList.push( `"${key}": [${rules.join( ',' )}],` )
  }
}

function buildOptions ( conf, optionsList ) {
  if ( conf.vModel === undefined ) return
  if ( conf.dataType === 'dynamic' ) { conf.options = [] }
  const str = `field${conf.formId}Options: ${JSON.stringify( conf.options )},`
  optionsList.push( str )
}

function buildProps ( conf, propsList ) {
  if ( conf.dataType === 'dynamic' ) {
    conf.valueKey !== 'value' && ( conf.props.props.value = conf.valueKey )
    conf.labelKey !== 'label' && ( conf.props.props.label = conf.labelKey )
    conf.childrenKey !== 'children' && ( conf.props.props.children = conf.childrenKey )
  }
  const str = `field${conf.formId}Props: ${JSON.stringify( conf.props.props )},`
  propsList.push( str )
}

function buildBeforeUpload ( conf ) {
  const unitNum = units[conf.sizeUnit]; let rightSizeCode = ''; let acceptCode = ''; const
    returnList = []
  if ( conf.fileSize ) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${conf.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${conf.fileSize}${conf.sizeUnit}')
    }`
    returnList.push( 'isRightSize' )
  }
  if ( conf.accept ) {
    acceptCode = `let isAccept = new RegExp('${conf.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${conf.accept}类型的文件')
    }`
    returnList.push( 'isAccept' )
  }
  const str = `field${conf.formId}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join( '&&' )}
  },`
  return returnList.length ? str : ''
}

function buildSubmitUpload ( conf ) {
  const str = `submitUpload() {
    this.$refs['${conf.vModel}'].submit()
  },`
  return str
}

function buildOptionMethod ( methodName, model, methodList ) {
  const str = `${methodName}() {
    // TODO 发起请求获取数据
    this.${model}
  },`
  methodList.push( str )
}

function buildexport ( conf, type, data, rules, selectOptions, uploadVar, props, methods, watchFunc ) {
  const str = `${exportDefault}{
  ${inheritAttrs[type]}
  components: {},
  props: [],
  data () {
    return {
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${uploadVar}
      ${selectOptions}
      ${props}
    }
  },
  computed: {
    // 为了验证时能获取到表单数据
    vmFormData(){
      return this.${conf.formModel}
    }
  },
  watch: {},
  created () {
    window._previewVm = this
    ${watchFunc}
  },
  mounted () {},
  methods: {
    ${methods}
  }
}`
  return str
}
