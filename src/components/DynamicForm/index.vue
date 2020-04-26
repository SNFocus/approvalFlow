/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */

<template>
  <div class="container">
    <div class="left-board">
      <!-- <div class="logo-wrapper">
        <div class="logo">创建表单</div>
      </div>-->
      <el-scrollbar class="left-scrollbar">
        <el-tabs v-model="activeName" :stretch="true">
          <el-tab-pane label="常用组件" name="common">
            <div class="components-list">
              <!-- <div class="components-title">
                <svg-icon icon-class="component" />输入型组件
              </div>-->
              <draggable
                class="components-draggable"
                :list="commonComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in commonComponents"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.tagIcon" />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
              <!-- <div class="components-title">
                <svg-icon icon-class="component" />选择型组件
              </div>-->
              <!-- <draggable
                class="components-draggable"
                :list="selectComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in selectComponents"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.tagIcon" />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>-->
              <!-- <div class="components-title">
                <svg-icon icon-class="component" />布局型组件
              </div>-->
              <!-- <draggable
                class="components-draggable"
                :list="layoutComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in layoutComponents"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.tagIcon" />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>-->
            </div>
          </el-tab-pane>
          <el-tab-pane label="定制组件" name="custom">
            <div class="components-list">
              <!-- <div class="components-title">
                <svg-icon icon-class="component" />布局型组件
              </div>-->
              <draggable
                class="components-draggable"
                :list="customMadeComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in customMadeComponents"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <svg-icon :icon-class="element.tagIcon" />
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <div class="action-bar">
        <!-- <el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button> -->
        <el-button
          class="copy-btn-main"
          icon="el-icon-success"
          type="text"
          @click="getData"
        >保存</el-button>
        <br>
        <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">清空</el-button>
      </div>
      <div id="ipad">
        <div class="outeripad">
          <div class="ipadbody">
            <div class="ipadscreen">
              <el-scrollbar class="center-scrollbar">
                <el-row class="center-board-row" :gutter="formConf.gutter">
                  <el-form
                    :size="formConf.size"
                    :label-position="formConf.labelPosition"
                    :disabled="formConf.disabled"
                    :label-width="formConf.labelWidth + 'px'"
                  >
                    <draggable
                      class="drawing-board"
                      :list="drawingList"
                      :animation="200"
                      group="componentsGroup"
                      @end="onMianDragEnd"
                    >
                      <draggable-item
                        v-for="(element, index) in drawingList"
                        :key="element.renderKey"
                        :drawing-list="drawingList"
                        :element="element"
                        :index="index"
                        :active-id="activeId"
                        :form-conf="formConf"
                        @activeItem="activeFormItem"
                        @copyItem="drawingItemCopy"
                        @deleteItem="drawingItemDelete"
                      />
                    </draggable>
                    <div v-show="!drawingList.length" class="empty-info">从左侧拖入或点选组件进行表单设计</div>
                  </el-form>
                </el-row>
              </el-scrollbar>
            </div>
            <div class="ipadcamera"></div>
            <div class="ipadhomebutton"></div>
          </div>
        </div>
      </div>
    </div>

    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      @tag-change="tagChange"
    />

    <!-- <form-drawer
      :visible.sync="drawerVisible"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />-->
    <!-- <code-type-dialog
      :visible.sync="dialogVisible"
      title="选择生成类型"
      :show-file-name="showFileName"
      @confirm="generate"
    />-->
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script>
import draggable from "vuedraggable";
// import { saveAs } from 'file-saver'
// import beautifier from 'beautifier'
// import ClipboardJS from 'clipboard'
import render from "./components/render";
// import FormDrawer from './FormDrawer'
import RightPanel from "./RightPanel";
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  customMadeComponents,
  commonComponents,
  formConf
} from "./components/generator/config";
import {
  exportDefault,
  beautifierConf,
  isNumberStr,
  titleCase
} from "./utils/index";
import {
  makeUpHtml,
  vueTemplate,
  vueScript,
  cssStyle
} from "./components/generator/html";
import { makeUpJs } from "./components/generator/js";
import { makeUpCss } from "./components/generator/css";
import drawingDefalut from "./components/generator/drawingDefalut";
// import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from "./DraggableItem";
import {
  getDrawingList,
  saveDrawingList,
  // getIdGlobal,
  // saveIdGlobal,
  getFormConf
} from "./utils/db";

const emptyActiveData = { style: {}, autosize: {} };
let oldActiveId;
let tempActiveData;
const drawingListInDB = getDrawingList();
const formConfInDB = getFormConf();
// const idGlobal = getIdGlobal();
// console.log("getID", idGlobal);
export default {
  components: {
    draggable,
    render,
    RightPanel,
    DraggableItem
    // FormDrawer,
    // CodeTypeDialog,
  },
  props:['tabName'],
  data() {
    return {
      // idGlobal,
      formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
      commonComponents,
      customMadeComponents,
      labelWidth: 100,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut ? drawingDefalut[0].formId : "",
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: drawingDefalut[0],
      activeName: "common"
    };
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    "activeData.label": function(val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.tag ||
        oldActiveId !== this.activeId
      ) {
        return;
      }
      this.activeData.placeholder =
        this.activeData.placeholder.replace(oldVal, "") + val;
    },
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        val.forEach(d => {
          // console.log(d, d.formId);
          d.proCondition &&
            d.required &&
            !d.multiple &&
            this.$store.commit("addPCondition", d);
        });
        saveDrawingList(val);
        this.$store.commit('updateFormItemList', val)
        // if (val.length === 0) this.idGlobal = 100;
      },
      deep: true
    },
    // idGlobal: {
    //   handler(val) {
    //     saveIdGlobal(val);
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
      this.drawingList = drawingListInDB;
    } else {
      this.drawingList = drawingDefalut;
    }
    this.activeFormItem(this.drawingList[0]);
    if (formConfInDB) {
      this.formConf = formConfInDB;
    }

    // const clipboard = new ClipboardJS('#copyNode', {
    //   text: trigger => {
    //     const codeStr = this.generateCode()
    //     this.$notify({
    //       title: '成功',
    //       message: '代码已复制到剪切板，可粘贴。',
    //       type: 'success'
    //     })
    //     return codeStr
    //   }
    // })
    // clipboard.on('error', e => {
    //   this.$message.error('代码复制失败')
    // })
  },
  methods: {
    activeFormItem(element) {
      this.activeData = element;
      this.activeId = element.formId;
    },
    onEnd(obj, a) {
      if (obj.from !== obj.to) {
        this.activeId = tempActiveData.formId;
        this.activeData = tempActiveData;
      }
    },
    onMianDragEnd(obj, a) {
      this.activeFormItem(this.drawingList[obj.newIndex]);
    },
    getSameTagCmpNum(tag){
      return this.drawingList.reduce((count, item) => {
        if(item.children){
          return count + item.children.reduce((c, t)=>{
            return t.tag === tag ? c + 1 : c
          }, 0)
        }
        return item.tag === tag ? count + 1 : count
      }, 0)
    },
    createCmpLabel(cmp){
      const len = this.getSameTagCmpNum(cmp.tag)
      return len ? cmp.label + len : cmp.label
    },
    addComponent(item) {
      const clone = this.cloneComponent(item);
      this.drawingList.push(clone);
      this.activeFormItem(clone);
    },
    getNextId(){
      if(this.drawingList.length){
        return this.drawingList.reduce((max, cur) => cur.formId > max ? cur.formId : max, 0) + 1
      }
      return 100
    },
    cloneComponent(origin) {
      const clone = JSON.parse(JSON.stringify(origin));
      clone.formId = this.getNextId();
      clone.span = formConf.span;
      clone.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
      if (!clone.layout) clone.layout = "colFormItem";
      if (clone.layout === "colFormItem") {
        clone.label = this.createCmpLabel(clone)
        clone.vModel = `field${clone.formId}`;
        clone.placeholder !== undefined && (clone.placeholder += clone.label);
        tempActiveData = clone;
      } else if (clone.layout === "rowFormItem") {
        // delete clone.label;
        clone.componentName = `row${clone.formId}`;
        clone.gutter = this.formConf.gutter;
        this.cloneChildrenOfRowFormItem(clone);
        tempActiveData = clone;
      }
      return tempActiveData;
    },
    cloneChildrenOfRowFormItem(rowFormItem) {
      if (rowFormItem.children && rowFormItem.children.length) {
        let children = rowFormItem.children;
        children.forEach(clone => {
          clone.formId = this.getNextId();
          clone.span = formConf.span;
          clone.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
          if (!clone.layout) clone.layout = "colFormItem";
          if (clone.layout === "colFormItem") {
            clone.vModel = `field${clone.formId}`;
            clone.placeholder !== undefined &&
              (clone.placeholder += clone.label);
          } else if (clone.layout === "rowFormItem") {
            delete clone.label;
            clone.componentName = `row${clone.formId}`;
            clone.gutter = this.formConf.gutter;
            this.cloneChildrenOfRowFormItem(clone);
          }
        });
      }
    },
    isEmptyRowContainer(){
      const rowContainer = this.drawingList.find(t => t.layout === 'rowFormItem')
      if(rowContainer){
        return rowContainer.children.length === 0
      }
    },
    AssembleFormData() {
        this.formData = {
          fields: JSON.parse(JSON.stringify(this.drawingList)),
          ...this.formConf
        };
    },
    getData() {
      return new Promise((resolve, reject) => {
        if(this.drawingList.length === 0){
          reject({ msg: '表单不允许为空', target: this.tabName})
          return
        }

        if(this.isEmptyRowContainer()){
          reject({ msg: '您得行容器中没有组件', target: this.tabName})
          return
        }
        this.AssembleFormData();
        resolve({ formData: this.formData, target: this.tabName})
      })
      
      
      // let htmlCode = makeUpHtml(this.formData, "file");
      // let jsCode = makeUpJs(this.formData, "file");
      // let cssCode = makeUpCss(this.formData);
      // this.$router.push({
      //   name: "preview",
      //   params: {
      //     formData: {
      //       htmlCode,
      //       jsCode,
      //       cssCode
      //     }
      //   }
      // });
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`];
      this.generateConf = data;
      func && func(data);
    },
    // execRun(data) {
    //   this.AssembleFormData()
    //   this.drawerVisible = true
    // },
    // execDownload(data) {
    //   const codeStr = this.generateCode()
    //   const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
    //   saveAs(blob, data.fileName)
    // },
    execCopy(data) {
      document.getElementById("copyNode").click();
    },
    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = [];
          // this.idGlobal = 100;
          this.$store.commit('clearPCondition')
        }
      );
    },
    drawingItemCopy(item, parent) {
      let clone = JSON.parse(JSON.stringify(item));
      clone = this.createIdAndKey(clone);
      parent.push(clone);
      this.activeFormItem(clone);
    },
    createIdAndKey(item) {
      item.formId = this.getNextId();
      item.renderKey = +new Date();
      if (item.layout === "colFormItem") {
        item.vModel = `field${item.formId}`;
      } else if (item.layout === "rowFormItem") {
        item.componentName = `row${item.formId}`;
      }
      if (Array.isArray(item.children)) {
        item.children = item.children.map(childItem =>
          this.createIdAndKey(childItem)
        );
      }
      return item;
    },
    // 判断是已否被流程图作为条件使用了
    hasUsedAsPCondition(cmp){
      return this.$store.state.processConditions.find(t => t.formId == cmp.formId) ? true : false
    },
    drawingItemDelete(index, parent) {
      // 首先判断是否是流程条件 再判断是否有节点使用过
      if (this.hasUsedAsPCondition(parent[index]) ) {
        const processCmp = this.$parent.$children.find(t => t.isProcessCmp)
        if(processCmp && processCmp.doseUsedFormCondition(parent[index].formId)) {
          this.$message.warning("该组件已作为流程判断条件，无法删除");
          return;
        }
      }
      this.$store.commit("delPCondition", parent[index].formId);
      parent.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
    },
    // generateCode() {
    //   const { type } = this.generateConf
    //   this.AssembleFormData()
    //   const script = vueScript(makeUpJs(this.formData, type))
    //   const html = vueTemplate(makeUpHtml(this.formData, type))
    //   const css = cssStyle(makeUpCss(this.formData))
    //   return beautifier.html(html + script + css, beautifierConf.html)
    // },
    // download() {
    //   this.dialogVisible = true
    //   this.showFileName = true
    //   this.operationType = 'download'
    // },
    run() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "run";
    },
    // copy() {
    //   this.dialogVisible = true
    //   this.showFileName = false
    //   this.operationType = 'copy'
    // },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag);
      newTag.vModel = this.activeData.vModel;
      newTag.formId = this.activeId;
      newTag.span = this.activeData.span;
      delete this.activeData.tag;
      delete this.activeData.tagIcon;
      //   delete this.activeData.document;
      Object.keys(newTag).forEach(key => {
        if (
          this.activeData[key] !== undefined &&
          typeof this.activeData[key] === typeof newTag[key]
        ) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      this.updateDrawingList(newTag, this.drawingList);
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.formId === this.activeId);
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach(item => {
          if (Array.isArray(item.children))
            this.updateDrawingList(newTag, item.children);
        });
      }
    }
  }
};
</script>

<style lang="stylus">

@import './styles/home';

#ipad {
  text-align: center;
  padding-top: 15px;

  .outeripad, .ipadbody, .ipadscreen {
    position: relative;
  }

  .ipadcamera, .ipadhomebutton {
    position: absolute;
  }
}

/* iPad */
.outeripad {
  box-shadow: 0 0 13px 3px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 45px 25px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;

  .ipadbody {
    background-color: white;
    border-radius: 10px;
  }

  .ipadscreen {
    background-color: rgba(239, 239, 239, 0.6);
  }

  .ipadcamera {
    top: -38px;
    left: 50%;
    background-color: #aeaeae;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    margin-top: 10px;
    margin-left: -5px;
  }

  .ipadhomebutton {
    background-color: #fff;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    border: 1px solid #a8a8a8;
    margin-top: 6px;
    margin-left: -15px;
    left: 50%;
  }

  .el-radio-group {
    line-height: 2.5;
  }
}
.el-date-editor .el-range-separator{
  box-sizing: content-box;
}
</style>

<style lang="stylus" scoped>
.svg-icon {
  float: right;
}

</style>
