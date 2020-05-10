
<template>
  <section
    class="h-transfer"
    :class="[tabConfig.length == 1 ? 'single-tab' : '']"
    v-if="show"
  >
    <div class="mask"></div>

    <!-- 内容面板 -->
    <div class="transfer__content">
      <!-- 面板顶部标题 -->
      <header class="transfer__header">
        <i class="el-icon-monitor"></i>
        {{ title }}
        <i
          class="el-icon-close"
          @click="closeTransfer"
        ></i>
      </header>
      <!-- 穿梭框主要内容 -->
      <div class="transfer__body">
        <!-- 左边穿梭框 -->
        <div class="transfer-pane">
          <!-- 操作栏 -->
          <div class="transfer-pane__tools">
            <el-input
              v-model="searchString"
              class="search-input"
              size="mini"
              type="search"
              placeholder="搜索人员"
              :disabled="!searchable"
            ></el-input>
          </div>
          <!-- 穿梭框 -->
          <div class="transfer-pane__body">
            <div class="enough-mask" v-show="isEnough">
              <span class="p-center">最多选择{{ maxNum }}项</span>
            </div>
            <div
              class="searchResPane"
              :class="{ active: searchMode }"
              v-loading="searchLoading"
            >
              <div class="hidden-tag" @click="searchString = ''">隐藏</div>
              <div v-for="(item, index) in searchRes" :key="index" class="item" @dblclick="addTransferData(item, activeTabName)">
                <div>
                  <div>{{ item.empName }}</div>
                  <div
                    style="font-size:12px;color:#999;max-width: 280px;"
                    class="text-ellipsis"
                  >
                    {{ item.branchOfficeName + '/' + item.deptName }}
                  </div>
                </div>
              </div>
            </div>

            <el-tabs
              v-model="activeTabName"
              type="border-card"
              style="height:100%;overflow:auto;"
            >
              <el-tab-pane v-for="tab_item in tabConfig" :name="tab_item.tabKey" :label="tab_item.tabName" :key="tab_item.tabKey">
                <el-tree
                  :ref="tab_item.tabKey"
                  lazy
                  show-checkbox
                  :props="{
                    children: tab_item.children,
                    label: tab_item.label,
                    isLeaf: tab_item.isLeaf
                  }"
                  :load="onLoad"
                  node-key="nodeId"
                  :check-strictly="true"
                  @check-change="(data, checked) => onCheckChange(data, checked, tab_item.tabKey)"
                >
                  <span class="tree-node" slot-scope="{ node }" >
                    <span class="node-label" :title="node.label">{{ node.label }}</span>
                  </span>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 右边穿梭框 -->
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <span>已选择数 ( {{ selectedNum }} / {{ maxNum }} )</span>
            <span @click="removeAll">清空列表</span>
          </div>
          <div class="transfer-pane__body shadow right-pane">
            <template v-for="type in tabList">
              <div
                v-for="(item) in selectedData[type]"
                :key="type+ item.nodeId"
                class="selected-item"
              >
                <span>
                  <!-- <i v-if="item.deptName" class="iconfont iconbumen"></i>
                  <i v-else class="iconfont iconyuangong"></i> &nbsp; -->
                  <span>{{ tabConfig.find(t => t.tabKey === activeTabName).label(item) }}</span>
                </span>
                <i
                  class="el-icon-delete"
                  @click="removeData(item, type)"
                ></i>
              </div>
            </template>
            <template v-for="type in tabList">
             <div
                v-for="item in aloneCheckedData[type]"
                :key="'alone' + type + item.nodeId"
                class="selected-item"
              >
                <span>
                  <!-- <i v-if="item.deptName" class="iconfont iconbumen"></i>
                  <i v-else class="iconfont iconyuangong"></i> &nbsp; -->
                  <span>{{ tabConfig.find(t => t.tabKey === activeTabName).label(item) }}</span>
                </span>
                <i
                  class="el-icon-delete"
                  @click="removeData(item, type, true)"
                ></i>
              </div>
            </template>
          </div>
        </div>
      </div>
      <footer class="transfer__footer">
        <el-button type="primary" plain size="small" @click="confirm" >确定</el-button >
        <el-button plain size="small" @click="closeTransfer">取消</el-button>
      </footer>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-debugger */
/* eslint-disable no-return-assign */
/* eslint-disable handle-callback-err */

import { DEP_CONFIG, ROLE_CONFIG, CONFIG_LIST } from './config.js'
import { debounce } from '@/assets/utils/index.js'

export default {
  name: 'fc-org-transfer',
  props: {
    tabList: {
      type: Array,
      default: () => ['dep', 'role']
    },
    title: {
      type: String,
      default: '组织机构'
      // reuired: true
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
    // v-model 已经选择过的数据 用于回显
    value: {
      type: Object,
      default: () => ({})
    },
    // 可选择的最大数量
    maxNum: {
      type: Number,
      default: 99
    }
  },
  data () {
    const aloneCheckedData = {}
    const selectedData = {}
    const tabConfig = []
    this.tabList.forEach(key => {
      aloneCheckedData[key] = []
      selectedData[key] = []
      const data = CONFIG_LIST.find(t => t.tabKey === key)
      data && tabConfig.push(data)
    })
    return {
      searchRes: [],  // 搜索后的结果
      selectedData,   // 用户手动选择的节点(在tree里面已经显示的节点)
      aloneCheckedData, // 已有的 但是未在tree中渲染的数据 例如回显时的数据
      isEnough: false,  // 是否选择了足够的人数
      searchString: '',  
      searchMode: false,  // 是否展示搜索面板
      searchLoading: false, 
      activeTabName: this.tabList[0],
      tabConfig
    }
  },
  computed: {
    selectedNum () {
      let num = 0
      for (const key of this.tabList) {
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
      this.tabConfig
      .find(t => t.tabKey === this.activeTabName)
      .onload(node, resolve)
      .then(res=>{
        for (const tabKey of this.tabList) {
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
      const activeConfig = this.tabConfig.find(t => t.tabKey === this.activeTabName)
      new Promise((resolve, reject) => {
        activeConfig.onsearch(this.searchString, resolve, reject)
      })
        .then(res => {
          this.searchRes = res.map(t => ({ nodeId: activeConfig.getNodeId(t), ...t }))
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
        this.selectedData[this.activeTabName] = tree.getCheckedNodes()
        this.isNumEnough()
        this.$forceUpdate()
      })
    },

    addTransferData (data, tabKey) {
      const tree = this.$refs[tabKey][0]
      tree.setChecked(data.nodeId, true)
      if (!tree.getCheckedKeys(data).includes(data.nodeId)) {
        this.aloneCheckedData[tabKey].push(data)
      }
    },

    isNumEnough () {
      let count = 0
      for (const type of this.tabList) {
        count += this.selectedData[type].length
        count += this.aloneCheckedData[type].length
      }
      this.isEnough = count >= this.maxNum
    },

    removeAll () {
      for (const type of this.tabList) {
        const tree = this.$refs[type][0]
        tree.getCheckedKeys().forEach(key => {
          tree.setCheckedKeys([])
        })
        this.selectedData[type] = []
        this.aloneCheckedData[type] = []
      }
    },

    removeData (data, tabKey, fromAloneData = false) {
      if (fromAloneData) {
        const index = this.aloneCheckedData[tabKey].findIndex(t => t.nodeId === data.nodeId)
        if (index > -1) {
          this.aloneCheckedData[tabKey].splice(index, 1)
        }
      } else {
        this.$refs[tabKey][0].setChecked(data.nodeId, false)
      }
    },

    closeTransfer () {
      this.$emit('update:show', false)
      Object.keys(this.selectedData).forEach(key => {
        this.selectedData = {}
        this.aloneCheckedData = {}
      })
      this.isEnough = false
      this.searchString = ''
    },

    confirm () {
      const res = {}
      for (const type of this.tabList) {
        res[type] = this.selectedData[type].concat(this.aloneCheckedData[type])
      }
      this.$emit('confirm', res)
      this.closeTransfer()
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
          this.tabConfig.forEach(c => {
            this.selectedData[c.tabKey] = []
            const data = (this.value[c.tabKey] || [])
              .map(t => ({ nodeId: c.getNodeId(t), ...t }))
            this.$set(this.aloneCheckedData, c.tabKey, data)
          })
          this.isNumEnough()
        }
      },
      immediate: true
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
        padding: 8px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:hover{
            background-color: #ecf5ff;
            color: #66b1ff;
            cursor: pointer;
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
  background: #409efe;
  padding: 6px 24px;
  color: white;
  .el-icon-close{
    cursor:pointer;
    float: right;
    margin-top: 10px;
  }
}

.transfer__footer {
  text-align: right;
  padding: 6px 18px 12px;
}

.transfer__body {
  padding: 4px 12px;
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
  margin-bottom: 8px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;



  span:last-child {
    color: #409efe;
    cursor: pointer;
  }
}

.transfer-pane__body {
  position relative
  width: 100%;
  height: 330px;
  overflow hidden
  font-size: 14px;

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
  overflow: auto;
  border: 1px solid #DCDFE6;

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
