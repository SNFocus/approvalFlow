<template>
  <div>
    <div class="tags">
      <el-button v-if="buttonType === 'button'" size="small" type="primary" icon="el-icon-plus" @click="show = true">添加{{title}}</el-button>
      
      <div v-if="buttonType === 'input'" class="input-box"  @click="show = true">{{selectedLabels || '点击选择' + title}}</div>
      <div v-if="buttonType === 'button'" style="margin-top: 6px;line-height: 1;">
        <el-tag
          v-bind="tagConfig"
          class="org-tag"
          v-for="item in selectedData"
          :key="item.key"
          @close="onClose(item)">
          {{item.label}}
        </el-tag>
      </div>
    </div>
    <fc-org-transfer
      ref="transfer"
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
      default: ()=>(['dep'])
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
    const tabKeys = []
    this.tabList.forEach(t => {
      tabKeys.push(typeof t === 'string' ? t : t.key)
    })
    return {
      tabKeys,
      show: false,
      innerValue: null,
      selectedData: []
    }
  },
  watch:{
    value: {
      handler:function (val) {
        if(!val) return
        this.innerValue = {}
        this.tabKeys.forEach(key => {
          this.innerValue[key] = val && val[key] ? val[key] : []
        })
        // transfer 可能还未加载成功
        this.$nextTick(_ => {
          this.initSelectedData()
        })
      },
      immediate: true,
      deep: true
    }
  },
  computed:{
    selectedLabels(){
      return this.selectedData.map(t => t.label).join(',')
    }
  },
  methods:{
    initSelectedData(){
      this.selectedData = this.tabKeys.reduce((res, key) => {
        return res.concat(this.innerValue[key].map(t => ({
          tabKey: key,
          key: this.getKey(t, key),
          label: this.getLabel(t, key)
        })))
      }, [])
    },
    getPropByKey(data, tabKey, key){
      const transfer = this.$refs['transfer']
      if(transfer){
        return transfer.getNodeProp(data, key, tabKey)
      }else{
        return ''
      }
    },
    getKey(data, tabKey){
      return this.getPropByKey(data, tabKey, 'nodeId')
    },
    getLabel(data, tabKey){
      return this.getPropByKey(data, tabKey, 'label')
    },
    onClose (item) {
      const list = this.innerValue[item.tabKey]
      const index = list.findIndex(t => this.getKey(t, item.tabKey) === item.key)
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
    line-height: 32px;
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