<script>
import FlowCard from "./FlowCard/index.vue";
import PropPanel from "./PropPanel/index.vue";
import { NodeUtils, getMockData } from "./FlowCard/util.js";

export default {
  name: 'Process',
  props:['tabName'],
  data() {
    return {
      data: getMockData(), // 流程图数据
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      updateId: 0, // key值 用于模拟$forceUpdate
      activeData: null, // 被激活的流程卡片数据，用于属性面板编辑
      isProcessCmp: true,
      verifyMode: false
    };
  },
  methods: {
    // 给父级组件提供的获取流程数据得方法
    getData(){
      this.verifyMode = true
      if(NodeUtils.checkAllNode(this.data)) {
        return Promise.resolve({formData: this.data})
      }else{
        return Promise.reject({target: this.tabName})
      }
    },
    /**
     * 接收所有FlowCard事件触发
     * @param { Object } data - 含有event(事件名称)/args(参数)两个属性
     */
    eventReciver({ event, args }) {
      if (event === "edit") {
        this.activeData = args[0]; // 打开属性面板
        return;
      }
      // 本实例只监听了第一层数据（startNode）变动
      // 为了实时更新  采用$forceUpdate刷新 但是由于某些条件下触发失效（未排除清除原因）
      // 使用key + 监听父组件updateId方式强制刷新
      NodeUtils[event](...args);
      this.forceUpdate();
    },

    forceUpdate() {
      this.updateId = this.updateId + 1;
    },
    /**
     * 控制流程图缩放
     * @param { Object } val - 缩放增量 是step的倍数 可正可负
     */
    changeScale(val) {
      if (this.scaleVal > 0 && this.scaleVal < 200) {
        // 缩放介于0%~200%
        this.scaleVal += val;
      }
    },
    /**
     * 属性面板提交事件
     * @param { Object } value - 被编辑的节点的properties属性对象
     */
    onPropEditConfirm(value, content) {
      this.activeData.content = content || '请设置条件'
      let oldProp = this.activeData.properties;
      this.activeData.properties = value;
      // 修改优先级
      if (NodeUtils.isConditionNode(this.activeData)) {
        value.priority !== oldProp.priority
        NodeUtils.resortPrioByCNode(
          this.activeData,
          oldProp.priority,
          this.data
        );
        NodeUtils.setDefaultCondition(this.activeData, this.data)
      }
      
      this.onClosePanel();
      this.forceUpdate();
    },
    /**
     * 属性面板取消事件
     */
    onClosePanel() {
      this.activeData = null;
    },
    doseUsedFormCondition ( formId ) {
      let res = false
      const loop = ( data, callback ) => {
        if(res) return
        if ( data && Array.isArray( data.conditionNodes ) ) {
            const hasFinded = data.conditionNodes.some( c => c.properties.conditions.some( item => item.formId == formId))
            if(hasFinded){
              callback()
            }else{
              data.conditionNodes.forEach(d => d.childNode && loop( d.childNode, callback ))
            }
        }
        data.childNode && loop( data.childNode, callback )
      }
      loop( this.data, () => res = true )
      return res
    }
  },
  render: function(h) {
    return (
      <div class="flow-container">
        <div class="scale-slider">
          <i
            class="btn  el-icon-minus"
            onClick={this.changeScale.bind(this, -this.step)}
          ></i>
          <span style="font-size:14px;">{this.scaleVal}%</span>
          <i
            class="btn  el-icon-plus "
            onClick={this.changeScale.bind(this, this.step)}
          ></i>
        </div>
        <FlowCard
          verifyMode={this.verifyMode}
          key={this.updateId}
          data={this.data}
          onEmits={this.eventReciver}
          style={{ transform: `scale(${this.scaleVal / 100})` }}
        />
        <PropPanel
          value={this.activeData}
          processData={this.data}
          onConfirm={this.onPropEditConfirm}
          onCancel={this.onClosePanel}
        />
      </div>
    );
  }
};
</script>

<style scoped lang="stylus">
$bg-color = #f5f5f7;

.flow-container {
  display: inline-block;
  background: $bg-color;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
}

.scale-slider {
  position: fixed;
  right: 0;
  z-index: 99;

  .btn {
    display: inline-block;
    padding: 4px;
    border: 1px solid #cacaca;
    border-radius: 3px;
    background: #FFF;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
