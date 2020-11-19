
<template>
  <section
    v-if="show" 
    class="h-transfer" 
    :class="[tabConfig.length == 1 ? 'single-tab' : '']" >
    <div class="mask"></div>
    <!-- 内容面板 -->
    <div class="transfer__content">
      <!-- 面板顶部标题 -->
      <header class="transfer__header">
        <i class="el-icon-monitor"></i>
        {{ title }}
        <i class="el-icon-close" @click="closeTransfer" ></i>
      </header>
      <!-- 穿梭框主要内容 -->
      <div class="transfer__body">
        <!-- 左边穿梭框 -->
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <el-input
              v-model="searchString"
              class="search-input"
              size="mini"
              style="width: 180px;"
              type="search"
              placeholder="搜索人员"
              :disabled="!searchable"
            ></el-input>
            <span>
              <span style="margin-right: 1rem;font-size: 14px;">{{ selectedNum }} / {{ maxNum }}</span>
              <el-tooltip placement="top" content="清空">
                <i class="el-icon-delete" @click="removeAll"></i>
              </el-tooltip>
            </span>
          </div>
          <el-scrollbar class="transfer-pane__body shadow right-pane">
            <template v-for="type in tabKeys">
              <div
                v-for="(item, index) in selectedData[type]"
                :key="type + index"
                class="selected-item"
              >
                <span>
                  <!-- <i v-if="item.deptName" class="iconfont iconbumen"></i>
                  <i v-else class="iconfont iconyuangong"></i> &nbsp; -->
                  <span>{{ getNodeProp(item, 'label') }}</span>
                </span>
                <i
                  class="el-icon-delete"
                  @click="removeData(item, type)"
                ></i>
              </div>
            </template>
            <template v-for="type in tabKeys">
             <div
                v-for="(item, index) in aloneCheckedData[type]"
                :key="'alone' + type + index"
                class="selected-item"
              >
                <span>
                  <!-- <i v-if="item.deptName" class="iconfont iconbumen"></i>
                  <i v-else class="iconfont iconyuangong"></i> &nbsp; -->
                  <span>{{ getNodeProp(item, 'label') }}</span>
                </span>
                <i
                  class="el-icon-delete"
                  @click="removeData(item, type, true)"
                ></i>
              </div>
            </template>
          </el-scrollbar>
          <footer class="transfer__footer">
            <el-button type="info" plain size="mini" @click="confirm" >确定</el-button >
            <el-button plain size="mini" @click="closeTransfer">取消</el-button>
          </footer>
        </div>
        <!-- 右边穿梭框 -->
        
        <div class="transfer-pane">
          <!-- 操作栏 -->
          <!-- <div class="transfer-pane__tools">
            
          </div> -->
          <!-- 穿梭框 -->
          <div class="transfer-pane__body" style="height: 370px;">
            <div class="enough-mask" v-show="isEnough">
              <span class="p-center">最多选择{{ maxNum }}项</span>
            </div>
            <div
              class="searchResPane"
              :class="{ active: searchMode }"
              v-loading="searchLoading" >
              <div class="hidden-tag" @click="searchString = ''">关闭</div>
              <div v-for="(item, index) in searchRes" :key="index" class="item">
                <div>
                  <div>{{ getNodeProp(item, 'label') }}</div>
                  <div class="text-ellipsis search-res-tip" >
                    {{ getNodeProp(item, 'searchResTip') }}
                  </div>
                </div>
                <el-checkbox @change="checked => checked ? addData(item) : removeData(item, activeTabName, true)"></el-checkbox>
              </div>
            </div>

            <el-scrollbar style="height:100%;">
              <el-tabs
                v-model="activeTabName"
                type="border-card"
                style="min-height: 370px;"
              >
                <el-tab-pane v-for="(tab_item, idx) in tabConfig" :name="tab_item.tabKey" :label="tab_item.tabName" :key="idx">
                  <el-tree
                    :ref="tab_item.tabKey"
                    lazy
                    show-checkbox
                    :props="{
                      children: tab_item.children,
                      label: tab_item.label,
                      isLeaf: tab_item.isLeaf,
                      disabled: tab_item.disabled
                    }"
                    :load="onLoad"
                    node-key="nodeId"
                    :check-strictly="true"
                    @check-change="(data, checked) => onCheckChange(data, checked, tab_item.tabKey)"
                  >
                  </el-tree>
                </el-tab-pane>
              </el-tabs>
            </el-scrollbar>
          </div>
        </div>
      </div>
      
    </div>
  </section>
</template>

<script>
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-debugger */
/* eslint-disable no-return-assign */
/* eslint-disable handle-callback-err */

import { DEP_CONFIG, ROLE_CONFIG, CONFIG_LIST } from './config.js'
import { debounce } from '@/utils/index.js'

export default {
  name: 'fc-org-transfer',
  props: {
    // v-model 已经选择过的数据 用于回显
    value: {
      type: Object,
      default: () => ({})
    },
    // 字符串数组使用配置文件的预设值
    // 对象数组需要包含 key/conf 两个属性 conf 会覆盖对应key的默认配置
    tabList: {
      type: Array,
      default: () => ['dep', 'role']
    },
    title: {
      type: String,
      default: '组织机构'
    },
    show: {
      type: Boolean,
      reuired: true
    },
    // 是否支持模糊查询
    searchable: {
      type: Boolean,
      default: true
    },
    // 可选择的最大数量
    maxNum: {
      type: Number,
      default: 99
    }
  },
  data () {
    
    return {
      searchRes: [],  // 搜索后的结果
      selectedData: [],   // 用户手动选择的节点(在tree里面已经显示的节点)
      aloneCheckedData: [], // 已有的 但是未在tree中渲染的数据 例如回显时的数据
      isEnough: false,  // 是否选择了足够的人数
      searchString: '',  
      searchMode: false,  // 是否展示搜索面板
      searchLoading: false, 
      activeTabName: '',
      tabConfig: [],
      tabKeys: []
    }
  },
  computed: {
    selectedNum () {
      let num = 0
      for (const key of this.tabKeys) {
        const data1 = this.selectedData[key]
        data1 && data1.length && (num += data1.length)
        const data2 = this.aloneCheckedData[key]
        data2 && data2.length && (num += data2.length)
      }
      return num
    }
  },
  mounted () {
    this.isNumEnough()
    this.debounceSearch = debounce(this.searchDepUser, 500)
  },
  methods: {
    onLoad (node, resolve) {
      const conf= this.tabConfig
      .find(t => t.tabKey === this.activeTabName)
      // load 方法返回一个promise
      conf.onload(node)
      .then(res => {
        const nodes = res.map( t => ( { nodeId: conf.nodeId(t), ...t } ) )
        resolve(nodes)
      })
      .then(res=>{
        for (const tabKey of this.tabKeys) {
         const tree = this.$refs[tabKey][0]
         this.aloneCheckedData[tabKey].forEach(data => {
          tree.setChecked(data.nodeId, true)
         })
        }
      })
    },

    searchDepUser () {
      if (!this.searchString) {
        this.searchRes = []
        return
      }
      this.searchLoading = true
      const activeConfig = this.getActiveConf()
      new Promise((resolve, reject) => {
        activeConfig.onsearch(this.searchString, resolve, reject)
      })
        .then(res => {
          this.searchRes = res.map(t => ({ nodeId: activeConfig.nodeId(t), ...t }))
        })
        .catch(err => console.warn(err))
        .finally(() => this.searchLoading = false)
    },

    onCheckChange (data, checked, tabKey) {
      this.activeTabName = tabKey
      const index = this.aloneCheckedData[tabKey].findIndex(t => t.nodeId === data.nodeId)
      if (index > -1) {
        this.aloneCheckedData[tabKey].splice(index, 1)
      }
      this.$nextTick(() => {
        const tree = this.$refs[tabKey][0]
        const nodes = tree.getCheckedNodes().map(t => {
          !t.nodeId && (t.nodeId = this.getNodeProp(t, 'nodeId', this.activeTabName))
          return t
        })
        this.$set(this.selectedData, this.activeTabName,nodes )
        this.isNumEnough()
        this.$forceUpdate()
      })
    },

    addData (data) {
      const tabKey = this.activeTabName
      const tree = this.$refs[tabKey][0]
      tree.setChecked(data.nodeId, true)
      !tree.getCheckedKeys(data).includes(data.nodeId)
      && !this.aloneCheckedData[tabKey].find(t => t.nodeId === data.nodeId)
      && this.aloneCheckedData[tabKey].push(data)
    },

    removeData (data, tabKey, fromAloneData = false) {
      if (fromAloneData) {
        const index = this.aloneCheckedData[tabKey].findIndex(t => t.nodeId === data.nodeId)
        index > -1 && this.aloneCheckedData[tabKey].splice(index, 1)
      } else {
        this.$refs[tabKey][0].setChecked(data.nodeId, false)  // 触发onCheckChange
      }
    },

    removeAll () {
      for (const type of this.tabKeys) {
        const tree = this.$refs[type][0]
        tree.getCheckedKeys().forEach(key => {
          tree.setCheckedKeys([])
        })
        this.selectedData[type] = []
        this.aloneCheckedData[type] = []
      }
    },

    isNumEnough () {
      let count = 0
      for (const type of this.tabKeys) {
        count += this.selectedData[type].length
        count += this.aloneCheckedData[type].length
      }
      this.isEnough = count >= this.maxNum
    },

    closeTransfer () {
      this.$emit('update:show', false)
      this.tabKeys = []
      this.isEnough = false
      this.searchString = ''
    },

    confirm () {
      const res = {}
      for (const type of this.tabKeys) {
        res[type] = this.selectedData[type].concat(this.aloneCheckedData[type])
      }
      this.$emit('confirm', res)
      this.closeTransfer()
    },

    getActiveConf(tabKey){
      const target = tabKey || this.activeTabName
      return this.tabConfig.find(t => t.tabKey === target)
    },

    getConfProp(propName, tabKey){
      const conf = this.getActiveConf(tabKey)
      return conf ? conf[propName] : null
    },

    getNodeProp(data, propName, tabKey){
      try{
        const prop = this.getConfProp(propName, tabKey)
        if(typeof prop === 'string'){
          return data[prop]
        }
        if(typeof prop === 'function'){
          return prop(data)
        }
      }catch(e){
        console.error(e)
        return '执行出错，可联系开发人员'
      }
    },

    dataInit(){
      this.aloneCheckedData = {}
      this.selectedData = {}
      this.tabConfig = []
      this.tabKeys = []
      const getTabProp = tabItem => typeof tabItem === 'object' ? [tabItem.key, tabItem.config] : [tabItem, {}]
      const initDefaultData = (key, mergedConfig) => {
        this.tabConfig.push(mergedConfig)
        this.tabKeys.push(key)
        let  data = this.value && this.value[key] ? this.value[key] : []
        data = data.map(t => ({ nodeId: mergedConfig.nodeId(t), ...t }))
        this.$set(this.aloneCheckedData, key, data)
      }
      this.tabList.forEach(item => {
        const [key, customConf] = getTabProp(item)
        this.$set(this.aloneCheckedData, key, [])
        this.$set(this.selectedData, key, [])
        const defaultConf = CONFIG_LIST.find(t => t.tabKey === key)
        defaultConf && initDefaultData(key, Object.assign({}, defaultConf, customConf))
      })
      this.activeTabName = this.tabKeys[0]
    }
  },
  watch: {
    searchString (newVal) {
      this.searchMode = !!newVal
      this.debounceSearch()
    },

    show: {
      handler: function (show) {
        if (show) {
          this.dataInit() 
          this.isNumEnough()
        }
      },
      immediate: true
    },

    tabList:{
      handler: function(val){
        this.dataInit() // tablist 比show 延后 
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="stylus">
.h-transfer{
  text-align: left;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 2999;
  line-height: 32px;

  > .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .el-tabs--border-card {
    box-shadow: none;
  }

  .el-tabs__content {
    overflow: visible;
    min-height: 250px;
  }

  .el-tabs__nav {
    width: 100%;
    display: flex;

    > .el-tabs__item {
      flex-grow: 1;
    }
  }

  &.single-tab .el-tabs__item {
    text-align: center;
    background: #f5f7fa !important;
    border-bottom: 1px solid #e4e7ed;
    border-right-width: 0px;
  }

  .el-tree-node__content > label.el-checkbox {
    // position: absolute;
    // right: 0;
  }

  .searchResPane{
    position: absolute;
    overflow-y: auto;
    z-index: 99;
    left: 0;
    top: 100%;
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid #dcdfe6;
    transition: top .5s;



    &.active{
        top: 0;
    }

    .hidden-tag{
        color:#999;
        font-size:12px;
        text-align:right;
        padding-top:4px;
        padding-right:12px;
        cursor pointer

        &:hover{
            color: #66b1ff;
        }
    }

    .item{
        padding: 4px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height 1.5
        &:hover{
            background-color: #ecf5ff;
            color: #66b1ff;
            cursor: pointer;
        }

        .search-res-tip{
          font-size:12px;
          color:#999;
          max-width: 280px;
        }
    }
  }

  .enough-mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: white;
    font-size: 16px;
    z-index: 100;
    height: 100%;
    background: rgba(0,0,0,0.5);
    letter-spacing: 4px;
  }

  .p-center{
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
  }

  .transfer__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  background: white;
  overflow: hidden;
  border-radius: 4px;
}

.transfer__header {
  margin-bottom: 6px;
  background: #565656;
  padding: 6px 24px;
  color: white;
  .el-icon-close{
    cursor:pointer;
    float: right;
    margin-top: 10px;
  }
}


.transfer__body {
  padding: 12px 0;
  display: flex;
  justify-content: space-around;
}

.transfer-pane {
  width: 360px;
}
  .search-input  input{
    border: 1px solid #DCDFE6 !important;
    &:focus{
      border-color:#409EFF !important;
    }
  }

.transfer-pane__tools {
  margin-bottom: 10px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;



  span:last-child {
    cursor: pointer;
  }
}

.transfer-pane__body {
  position relative
  width: 100%;
  height: 330px;
  overflow hidden
  font-size: 14px;

  >>> .el-scrollbar__view{
    height: 100%;
  }

  .el-tabs__item {
    height: 26px;
    line-height: 26px;
  }
}

.transfer-icons {
  display: flex;
  flex-direction: column;
  justify-content: center;

  i {
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    font-size: 20px;
    color: #696969;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .node-label {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  .node-checkbox {
    position: absolute;
    right: 0;
  }

  i {
    &:hover {
      color: #1485f8;
      cursor: pointer;
    }

    font-size: 10px;
  }
}

.right-pane {
  box-sizing: border-box;
  overflow-x: hidden;
  height: 290px;
  margin-bottom: 10px;

  .selected-item {
    padding: 0px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: #F5F7FA;
    }

    span {
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i {
      &:hover {
        color: #1485f8;
        cursor: pointer;
      }
    }
  }
}

.dot{
  width: 2px;
  height: 2px;
  display: inline-block;
  border-radius: 50%;
  background: #4caf50;
}

  .text-ellipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
