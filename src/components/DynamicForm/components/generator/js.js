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
  const tableRefs = {}

  conf.fields.forEach( el => {
    buildAttributes( el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, watchFuncList, tableRefs )
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
    watchFuncList.join( '\n' ),
    JSON.stringify( tableRefs )
  )
  confGlobal = null
  return script
}

function buildWatchInHook ( key, callbackStr, watchFuncList ) {
  watchFuncList.push( `this.$watch(function () {
    return this.formData.${key}
  }, ${callbackStr})` )
}
/**
 * fc-org-select v-model绑定的是一个对象 才疏学浅 需要添加多余的代码啊兼容此种情况
 * 针对fc-org-select 添加相应的表单验证
 * @param {*} conf - 控件数据
 * @param {*} watchFuncList - watch列表
 */
const setFcOrgSelectRule = ( conf, watchFuncList ) => {
  let rule = `{ validator: (rule, value, callback) => {
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
  buildWatchInHook( conf.vModel, `function (newVal, oldVal) {
      this.$refs["elForm"].validateField("${conf.vModel}",()=>{ })
  }`, watchFuncList )
  return rule
}

function buildAttributes ( el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, watchFuncList, tableRefs ) {
  buildData( el, dataList, tableRefs )
  buildRules( el, ruleList, watchFuncList )

  if ( el.options && el.options.length ) {
    buildOptions( el, optionsList )
    if ( el.dataType === 'dynamic' ) {
      const model = `${el.vModel}Options`
      const options = titleCase( model )
      buildOptionMethod( `get${options}`, model, methodList )
    }
  }

  if ( el.expression ) {
    buildExps( el, optionsList )
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
    el.children.forEach( el2 => {
      el2.isChild = true  // 临时变量
      el2.isTableChild = el.rowType === 'table'
      buildAttributes( el2, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, watchFuncList, tableRefs )
    } )
  }
}

function mixinMethod ( type ) {
  const list = [];
  const minxins = {
    file: confGlobal.formBtns ? {
      submitForm: `submitForm () {
          const isTableValid = this.checkTableData()
          this.$refs['${confGlobal.formRef}'].validate(valid => {
            if(!valid) return
            if (!isTableValid) return
            this.$notify({
              title: '表单数据',
              message: '请在控制台中查看数据输出',
              position: 'bottom-right'
            });
            console.log('表单数据', this.formData)
            // TODO 提交表单
          })
        },`,
      resetForm: `resetForm() {
          this.$refs['${confGlobal.formRef}'].resetFields()
          this.resetTableData()
        },`,
      resetTableData: `resetTableData(){
        Object.keys(this.tableRefs).forEach(vModel => {
          const res = this.$refs[vModel].reset()
        })
      },`,
      // fc-input-table 需要单独进行表单校验
      checkTableData: `checkTableData () {
          let valid = true
          Object.keys(this.tableRefs).forEach(vModel => {
            const res = this.$refs[vModel].submit()  // 返回false或表单数据
            res ? (this.formData[vModel] = res) : (valid = false)
          })
          return valid
        },`,
      // 使用drawer抽屉 显示定制组件 说明
      showExplain: `showExplain (explainText, title) {
        if(!explainText) return
        this.drawerTitle = title
        this.drawerText = explainText
        this.drawerVisible = true
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

function buildData ( conf, dataList, tableRefs ) {
  if ( conf.vModel === undefined || conf.isTableChild ) return
  let defaultValue
  if ( conf.rowType === 'table' ) {
    defaultValue = {}
    conf.children.forEach( t => ( defaultValue[t.vModel] = t.defaultValue === undefined ? null : t.defaultValue ) )
    defaultValue = JSON.stringify( [defaultValue] )
    tableRefs[conf.vModel] = conf
  } else if ( typeof ( conf.defaultValue ) === 'string' && !conf.multiple ) {
    defaultValue = `'${conf.defaultValue}'`
  } else {
    defaultValue = `${JSON.stringify( conf.defaultValue )}`
  }
  dataList.push( `${conf.vModel}: ${defaultValue},` )
}

function buildRules ( conf, ruleList, watchFuncList ) {
  if ( conf.vModel === undefined ) return
  const rules = []
  if ( trigger[conf.tag] && !conf.isTableChild ) {
    if ( conf.required ) {
      const type = isArray( conf.defaultValue ) ? 'type: \'array\',' : ''
      let message = isArray( conf.defaultValue ) ? `请至少选择一个` : conf.placeholder
      if ( message === undefined ) message = `${conf.label}不能为空`
      conf.tag === 'fc-org-select'
        ? rules.push( setFcOrgSelectRule( conf, watchFuncList ) )
        : rules.push( `{ required: true, ${type} message: '${message}', trigger: '${trigger[conf.tag]}' }` )
    }
    if ( conf.regList && isArray( conf.regList ) ) {
      conf.regList.forEach( item => {
        if ( item.pattern ) {
          rules.push( `{ pattern: ${eval( item.pattern )}, message: '${item.message}', trigger: '${trigger[conf.tag]}' }` )
        }
      } )
    }
    ruleList.push( `"${conf.vModel}": [${rules.join( ',' )}],` )
  }
}

function buildOptions ( conf, optionsList ) {
  if ( conf.vModel === undefined ) return
  if ( conf.dataType === 'dynamic' ) { conf.options = [] }
  const str = `field${conf.formId}Options: ${JSON.stringify( conf.options )},`
  optionsList.push( str )
}

function buildExps ( conf, optionsList ) {
  optionsList.push( `${conf.vModel}Exps: ${JSON.stringify( conf.expression )},` )
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

function buildexport ( conf, type, data, rules, selectOptions, uploadVar, props, methods, watchFunc, tableRefs ) {
  const str = `${exportDefault}{
  ${inheritAttrs[type]}
  components: {},
  props: [],
  data () {
    return {
      tableRefs: ${tableRefs},
      drawerVisible: false,
      drawerTitle: '',
      drawerText: '',
      formData: {
        ${data}
      },
      ruleList: {
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
      return this.formData
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
