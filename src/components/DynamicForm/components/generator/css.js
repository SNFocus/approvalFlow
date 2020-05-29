/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */
const defaultCss = `
.showDivider.form-container { margin-bottom: 2rem; }
`
const styles = {
  'el-rate': '.el-rate{ display: inline-block; vertical-align: text-top; }',
  'el-upload': '.el-upload__tip { line-height: 1.2; }'
}

function addCss ( cssList, el ) {
  const css = styles[el.tag]
  css && cssList.indexOf( css ) === -1 && cssList.push( css )
  if ( el.children ) {
    el.children.forEach( el2 => addCss( cssList, el2 ) )
  }
}

export function makeUpCss ( conf ) {
  const cssList = []
  conf.fields.forEach( el => addCss( cssList, el ) )
  return defaultCss + cssList.join( '\n' )
}
