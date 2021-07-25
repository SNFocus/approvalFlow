/* eslint-disable max-len */

/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */


import { trigger } from './config'
import { isArray } from 'util'

let confGlobal
let someSpanIsNot24

export function dialogWrapper ( str ) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function vueTemplate ( str ) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript ( str ) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle ( cssStr ) {
  return `<style>
    ${cssStr}
  </style>`
}

function buildFormTemplate ( conf, child, type ) {
  let labelPosition = ''
  if ( conf.labelPosition !== 'right' ) {
    labelPosition = `label-position="${conf.labelPosition}"`
  }
  const disabled = conf.disabled ? `:disabled="${conf.disabled}"` : ''
  let str = `<el-form ref="${conf.formRef}" :model="formData" :rules="ruleList" size="${conf.size}" ${disabled} label-width="${conf.labelWidth}px" ${labelPosition}>
      ${child}
      ${buildFromBtns( conf, type )}
    </el-form>`
  if ( someSpanIsNot24 ) {
    str = `<el-row :gutter="${conf.gutter}">
        ${str}
      </el-row>`
  }
  return str
}

function buildFromBtns ( conf, type ) {
  let str = ''
  if ( conf.formBtns && type === 'file' ) {
    str = `<el-form-item  style="text-align:right;">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>`
    if ( someSpanIsNot24 ) {
      str = `<el-col :span="24">
          ${str}
        </el-col>`
    }
  }
  return str
}

// span不为24的用el-col包裹
function colWrapper ( element, str ) {
  if ( someSpanIsNot24 || element.span !== 24 ) {
    return `<el-col :span="${element.span}">
      ${str}
    </el-col>`
  }
  return str
}

const layouts = {
  colFormItem ( element, noFormItem = false ) {
    let labelWidth = ''
    if ( element.labelWidth && element.labelWidth !== confGlobal.labelWidth ) {
      labelWidth = `label-width="${element.labelWidth}px"`
    }

    let rules = '', label = `label="${noFormItem ? '' : element.label}"`, prop = `prop="${element.vModel}"`
    if ( noFormItem ) {
      labelWidth = `label-width="0px"`
    }
    const required = ( !trigger[element.tag] && element.required ) || element.tag === 'fc-org-select' ? 'required' : ''
    const tagDom = tags[element.tag] ? tags[element.tag]( element ) : null
    const tableTitle = noFormItem ? `<div style="font-size: 14px;padding:6px 0px;margin-bottom: 4px;border-bottom: 1px solid #e5e5e5;">${element.label}</div>` : ''
    let str = `${tableTitle}
      <el-form-item ${labelWidth} ${label} ${prop}  ${required} ${rules}>
        ${tagDom}
      </el-form-item>`
    str = colWrapper( element, str )
    return str
  },
  rowFormItem ( element ) {
    if ( element.rowType === 'table' ) {
      return this.colFormItem( element, element.type === 'list' )
    }
    const type = element.type === 'default' ? '' : `type="${element.type}"`
    const justify = element.type === 'default' ? '' : `justify="${element.justify}"`
    const align = element.type === 'default' ? '' : `align="${element.align}"`
    const gutter = element.gutter ? `:gutter="${element.gutter}"` : ''
    const children = element.children.map( ( el ) => layouts[el.layout]( el ) )
    const explain = element.cmpType === 'custom' && element.explain
      ? `
      <el-tooltip effect="dark" content="组件说明" placement="top">
        <i class="el-icon-info"   
          @click="showExplain(\`${element.explain}\`, '${element.label}')" 
          style="margin-right: 8px; color: #E6A23C;cursor: pointer;">
        </i>
      </el-tooltip>
      `
      : ''
    const divider = element.showDivider ? `<el-divider content-position="left" >${explain + element.label}</el-divider>` : ''
    const rowClass = `class="form-container ${element.showDivider ? 'showDivider' : ''}"`
    let str = `
    ${divider}
    <el-row ${rowClass} ${type} ${justify} ${align} ${gutter}>
      ${children.join( '\n' )}
    </el-row>
    `
    str = colWrapper( element, str )
    return str
  }
}

const createTagHTML = ( tag, ...props ) => {
  return `<${tag} ${props.join( ' ' )}></${tag}>`
}

const addPropToTag = ( tag, ...props ) => {
  const insetIndex = tag.search( />\s*<\// )

  if ( insetIndex > -1 ) {
    return tag.slice( 0, insetIndex ) + props.join( ' ' ) + tag.slice( insetIndex )
  } else {
    return tag
  }
}

const tags = {
  'el-input': el => {
    const {
      disabled, vModel, clearable, placeholder, width
    } = attrBuilder( el )
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
    const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : ''
    const readonly = el.readonly ? 'readonly' : ''
    const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : ''
    const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : ''
    const showPassword = el['show-password'] ? 'show-password' : ''
    const type = el.type ? `type="${el.type}"` : ''
    const autosize = el.autosize && el.autosize.minRows
      ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
      : ''
    let child = buildElInputChild( el )

    if ( child ) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${el.tag}>`
  },
  'el-input-number': el => {
    const { disabled, vModel, placeholder, width } = attrBuilder( el )
    const controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : ''
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const stepStrictly = el['step-strictly'] ? 'step-strictly' : ''
    const precision = el.precision ? `:precision='${el.precision}'` : ''

    return `<${el.tag} ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${width} ${disabled}></${el.tag}>`
  },
  'fc-org-select': function ( el ) {
    const { disabled, vModel, placeholder, width } = attrBuilder( el )
    const tabList = Array.isArray( el.tabList ) ? `:tabList='${JSON.stringify( el.tabList )}'` : ''
    const title = el.title ? `title="${el.title}"` : ''
    const searchable = el.searchable ? `:searchable="${el.searchable}"` : ''
    const maxNum = el.maxNum ? `:maxNum="${el.maxNum}"` : ''
    const tagConfig = el.tagConfig ? `:tagConfig='${JSON.stringify( el.tagConfig )}'` : ''
    const buttonType = el.buttonType ? `buttonType='${el.buttonType}'` : ''
    return createTagHTML( el.tag, vModel, tabList, title, searchable, maxNum, tagConfig, buttonType, disabled, placeholder, width )
  },
  'fc-amount': function ( el ) {
    const tag = this['el-input-number']( el )
    const showChinese = el.showChinese ? `:showChinese='${el.showChinese}'` : ''
    return addPropToTag( tag, showChinese )
  },
  'fc-calculate': function ( el ) {
    const { vModel } = attrBuilder( el )
    const showChinese = el.showChinese ? `:showChinese='${el.showChinese}'` : ''
    const formData = `:formData="formData"`
    const expression = `:expression="${el.vModel}Exps" `
    return createTagHTML( el.tag, vModel, showChinese, formData, expression )
  },
  'el-select': el => {
    const {
      disabled, vModel, clearable, placeholder, width
    } = attrBuilder( el )
    const filterable = el.filterable ? 'filterable' : ''
    const multiple = el.multiple ? 'multiple' : ''
    let child = buildElSelectChild( el )

    if ( child ) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${el.tag}>`
  },
  'el-radio-group': el => {
    const { disabled, vModel } = attrBuilder( el )
    const size = `size="${el.size}"`
    let child = buildElRadioGroupChild( el )

    if ( child ) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel} ${size} ${disabled}>${child}</${el.tag}>`
  },
  'el-checkbox-group': el => {
    const { disabled, vModel } = attrBuilder( el )
    const size = `size="${el.size}"`
    const min = el.min ? `:min="${el.min}"` : ''
    const max = el.max ? `:max="${el.max}"` : ''
    let child = buildElCheckboxGroupChild( el )

    if ( child ) child = `\n${child}\n` // 换行
    return `<${el.tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${el.tag}>`
  },
  'el-switch': el => {
    const { disabled, vModel } = attrBuilder( el )
    const activeText = el['active-text'] ? `active-text="${el['active-text']}"` : ''
    const inactiveText = el['inactive-text'] ? `inactive-text="${el['inactive-text']}"` : ''
    const activeColor = el['active-color'] ? `active-color="${el['active-color']}"` : ''
    const inactiveColor = el['inactive-color'] ? `inactive-color="${el['inactive-color']}"` : ''
    const activeValue = el['active-value'] !== true ? `:active-value='${JSON.stringify( el['active-value'] )}'` : ''
    const inactiveValue = el['inactive-value'] !== false ? `:inactive-value='${JSON.stringify( el['inactive-value'] )}'` : ''

    return `<${el.tag} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${el.tag}>`
  },
  'el-cascader': el => {
    const {
      disabled, vModel, clearable, placeholder, width
    } = attrBuilder( el )
    const options = el.options ? `:options="field${el.formId}Options"` : ''
    const props = el.props ? `:props="field${el.formId}Props"` : ''
    const showAllLevels = el['show-all-levels'] ? '' : ':show-all-levels="false"'
    const filterable = el.filterable ? 'filterable' : ''
    const separator = el.separator === '/' ? '' : `separator="${el.separator}"`

    return `<${el.tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></${el.tag}>`
  },
  'el-slider': el => {
    const { disabled, vModel } = attrBuilder( el )
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const range = el.range ? 'range' : ''
    const showStops = el['show-stops'] ? `:show-stops="${el['show-stops']}"` : ''

    return `<${el.tag} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${el.tag}>`
  },
  'el-time-picker': el => {
    const {
      disabled, vModel, clearable, placeholder, width
    } = attrBuilder( el )
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const isRange = el['is-range'] ? 'is-range' : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const pickerOptions = el['picker-options'] ? `:picker-options='${JSON.stringify( el['picker-options'] )}'` : ''
    return `<${el.tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${disabled}></${el.tag}>`
  },
  'fc-time-duration': function ( el ) {
    const tag = this['el-time-picker']( el )
    const showDuration = el.showDuration ? `:showDuration='${el.showDuration}'` : ''
    return addPropToTag( tag, showDuration )
  },
  'el-date-picker': el => {
    const {
      disabled, vModel, clearable, placeholder, width
    } = attrBuilder( el )
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const type = el.type === 'date' ? '' : `type="${el.type}"`
    const readonly = el.readonly ? 'readonly' : ''
    return `<${el.tag} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${el.tag}>`
  },
  'fc-date-duration': function ( el ) {
    const tag = this['el-date-picker']( el )
    const showDuration = el.showDuration ? `:showDuration='${el.showDuration}'` : ''
    return addPropToTag( tag, showDuration )
  },
  'el-rate': el => {
    const { disabled, vModel } = attrBuilder( el )
    const max = el.max ? `:max='${el.max}'` : ''
    const allowHalf = el['allow-half'] ? 'allow-half' : ''
    const showText = el['show-text'] ? 'show-text' : ''
    const showScore = el['show-score'] ? 'show-score' : ''

    return `<${el.tag} ${vModel} ${allowHalf} ${showText} ${showScore} ${disabled}></${el.tag}>`
  },
  'el-color-picker': el => {
    const { disabled, vModel } = attrBuilder( el )
    const size = `size="${el.size}"`
    const showAlpha = el['show-alpha'] ? 'show-alpha' : ''
    const colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : ''

    return `<${el.tag} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${el.tag}>`
  },
  'el-upload': el => {

    const disabled = el.disabled ? ':disabled=\'true\'' : ''
    const action = el.action ? `:action="field${el.formId}Action"` : ''
    const multiple = el.multiple ? 'multiple' : ''
    const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
    const accept = el.accept ? `accept="${el.accept}"` : ''
    const name = el.name !== 'file' ? `name="${el.name}"` : ''
    const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : ''
    const beforeUpload = `:before-upload="field${el.formId}BeforeUpload"`
    const fileList = `:file-list="field${el.formId}fileList"`
    const ref = `ref="${el.vModel}"`
    let child = buildElUploadChild( el )

    if ( child ) child = `\n${child}\n` // 换行
    return `<${el.tag} ${ref} ${fileList} ${action} ${autoUpload} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${disabled}>${child}</${el.tag}>`
  },
  'fc-input-table': el => {
    let labelWidth = '', formSize = ''
    if ( el.type == 'list' ) {
      labelWidth = `label-width="${el.labelWidth || confGlobal.labelWidth}px"`
      formSize = `form-size="${confGlobal.size}"`
    }
    const formData = `:formData="formData"`
    return `<${el.tag} ${formData} ref="${el.vModel}" ${formSize} ${labelWidth} :config="tableRefs['${el.vModel}']" v-model="formData.${el.vModel}"></${el.tag}>`
  }
}

function attrBuilder ( el ) {
  return {
    vModel: `v-model="formData.${el.vModel}"`,
    clearable: el.clearable ? 'clearable' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? `:style="{width: '${el.style.width}'}"` : '',
    disabled: el.disabled ? ':disabled=\'true\'' : ''
  }
}

// el-input innerHTML
function buildElInputChild ( conf ) {
  const children = []
  if ( conf.prepend ) {
    children.push( `<template slot="prepend">${conf.prepend}</template>` )
  }
  if ( conf.append ) {
    children.push( `<template slot="append">${conf.append}</template>` )
  }
  return children.join( '\n' )
}

function buildElSelectChild ( conf ) {
  const children = []
  if ( conf.options && conf.options.length ) {
    children.push( `<el-option v-for="(item, index) in field${conf.formId}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>` )
  }
  return children.join( '\n' )
}

function buildElRadioGroupChild ( conf ) {
  const children = []
  if ( conf.options && conf.options.length ) {
    const tag = conf.optionType === 'button' ? 'el-radio-button' : 'el-radio'
    const border = conf.border ? 'border' : ''
    children.push( `<${tag} v-for="(item, index) in field${conf.formId}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>` )
  }
  return children.join( '\n' )
}

function buildElCheckboxGroupChild ( conf ) {
  const children = []
  if ( conf.options && conf.options.length ) {
    const tag = conf.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox'
    const border = conf.border ? 'border' : ''
    children.push( `<${tag} v-for="(item, index) in field${conf.formId}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>` )
  }
  return children.join( '\n' )
}

function buildElUploadChild ( conf ) {
  const list = []
  if ( conf['list-type'] === 'picture-card' ) list.push( '<i class="el-icon-plus"></i>' )
  else list.push( `<el-button size="small" type="primary" icon="el-icon-upload">${conf.buttonText}</el-button>` )
  if ( conf.showTip ) list.push( `<div slot="tip" class="el-upload__tip">只能上传不超过 ${conf.fileSize}${conf.sizeUnit} 的${conf.accept}文件</div>` )
  return list.join( '\n' )
}

function buildDrawer () {
  return `
  <el-drawer
    :title="drawerTitle + '说明'"
    :visible.sync="drawerVisible">
    <pre style="padding-left: 1rem;">{{drawerText}}</pre>
  </el-drawer>
  `
}

export function makeUpHtml ( conf, type ) {
  const htmlList = []
  confGlobal = conf
  someSpanIsNot24 = conf.fields.some( item => item.span !== 24 )
  conf.fields.forEach( el => {
    htmlList.push( layouts[el.layout]( el ) )
  } )
  const htmlStr = htmlList.join( '\n' )

  let temp = buildFormTemplate( conf, htmlStr, type )
  if ( type === 'dialog' ) {
    temp = dialogWrapper( temp )
  }
  confGlobal = null
  return temp + buildDrawer()
}
