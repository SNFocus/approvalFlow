<template>
  <div>
    <div class="tags">
      <el-button v-if="buttonType === 'button'" size="small" type="primary" icon="el-icon-plus" @click="show = true">添加{{title}}</el-button>
      <div v-if="buttonType === 'input'" class="input-box"  @click="show = true">{{selectedLabels || '点击选择' + title}}</div>
      
      <div v-if="buttonType === 'button'" style="margin-top: 6px;line-height: 1;">
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
    <fc-org-transfer 
      :value="innerValue" 
      :title="title" 
      :searchable="searchable" 
      :maxNum="maxNum"
      :tabList="tabList"
      :show.sync="show"
      @confirm="onConfirm" />
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
    buttonType: {
      type: String,
      default: 'input'
    }, // or input
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
    return {
      show: false,
      innerValue: null
    }
  },
  watch:{
    value: {
      handler:function (val) {
        this.innerValue = {}
        this.tabList.forEach(key => {
          this.innerValue[key] = val ? val[key] : []
        })
      },
      immediate: true
    }
  },
  computed:{
    selectedData(){
      return this.tabList.reduce((res, key) => {
        return res.concat(this.innerValue[key].map(t => ({
          tabKey: key,
          label: this.getLabel(t, key),
          key: this.getKey(t, key)
        })))
      }, [])
    },
    selectedLabels(){
      return this.selectedData.map(t => t.label).join(',')
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
    onClose (item, tabKey) {
      const list = this.innerValue[tabKey]
      const index = list.indexOf(item)
      index > -1 && list.splice(index, 1)
      this.$emit('change', this.innerValue)
    },
    onConfirm (data) {
      this.innerValue = data
      this.$emit('change', this.innerValue)
    }
  }
}
</script>
<style lang="stylus" scoped>
.tags {
  .input-box{
    border: 1px solid #DCDFE6;
    padding-left: 1rem;
    font-size: 12px;
    height: 32px;
    border-radius: 4px;
    background: white;
    color #606266
    cursor pointer
  }
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