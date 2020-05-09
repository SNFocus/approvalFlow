<template>
  <div>
    <div class="tags">
      <el-button size="small" @click="openTransfer">添加{{title}}</el-button>
      <div style="margin-top: 6px;">
        <template v-for="(tabKey) in tabList">
          <el-tag
            v-bind="tagConfig"
            class="org-tag"
            v-for="item in innerValue[tabKey]"
            :key="getKey(item, tabKey)"
            @close="onClose(item, tabKey)">
            {{getLabel(item, tabKey)}}
          </el-tag>
        </template>
      </div>
    </div>
    <fc-org-transfer v-model="innerValue" :title="title" :searchable="searchable" :maxNum="maxNum" :tabList="tabList" :show.sync="show" @confirm="onConfirm"></fc-org-transfer>
  </div>
</template>
<script>
const config = {
  dep: {
    keys: ['userId', 'deptId'],
    labels: ['userName', 'deptName']
  },
  role: {
    keys: ['userId', 'deptId'],
    labels: ['userName', 'deptName']
  }
}
export default {
  model:{
    prop: 'value',
    event: 'change'
  },
  name:'fc-org-select',
  props:{
    value:{
      type: Object | null,
      required: true
    },
    tabList: {
      type: Array,
      default: ()=>(['dep', 'role'])
    },
    title: {
      type: String,
      default: '组织机构'
    },
    searchable: {
      type: Boolean,
      default: true
    },
    maxNum: {
      type: Number,
      default: 99
    },
    tagConfig:{
      type: Object,
      default: () => ({
        type: 'info',
        closable: true,
        'disable-transitions': false,
        hit: false,
        color: undefined,
        size: 'small',
        effect: 'light'
      })
    },
  },
  data(){
    debugger
    let innerValue = {}
    this.tabList.forEach(key => {
      innerValue[key] = this.value ? this.value[key] : []
    })
    return {
      show: false,
      innerValue
    }
  },
  methods:{
    getKey(data, tabKey){
      for(let key of config[tabKey].keys){
        if(key in data){
          return data[key]
        }
      }
      return ''
    },
    getLabel(data, tabKey){
      for(let key of config[tabKey].labels){
        if(key in data){
          return data[key]
        }
      }
      return ''
    },
    onClose(item, tabKey){
      const list = this.innerValue[tabKey]
      const index = list.indexOf(item)
      if(index > -1){
        list.splice(index, 1)
      }
    },
    openTransfer(){
      this.show = true
    },
    onConfirm(data){
      console.log(data)
    }
  },
  watch:{
    innerValue(val){
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="stylus" scoped>
.tags {
  .org-tag{
    margin-right: 6px;
    max-width: 6rem;  
    overflow hidden
    text-overflow ellipsis
    position relative
    padding-right 1rem

    >>> .el-tag__close{
      position: absolute;
      right: 2px;
      top: 50%;
      margin-top: -7px;
    }
  }
}
</style>