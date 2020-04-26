<script>
import { NodeUtils } from "./util.js";
const isCondition = data => data.type === "condition";
const notEmptyArray = arr => Array.isArray(arr) && arr.length > 0;
const hasBranch = data => notEmptyArray(data.conditionNodes);
const stopPro = ev => ev.stopPropagation();

function createNormalCard(ctx, conf, h) {
  let isStartNode = conf.type === "start";
  let classString = `flow-path-card ${isStartNode ? "start-node" : ""}`;
  return (
    <section
      class={classString}
      onClick={this.eventLancher.bind(ctx, "edit", conf)}
    >
      <header class="header">
        <div class="title-box" style="height: 100%;width:190px;">
          {!isStartNode && (
            <i
              class="iconfont iconshenpi"
              style="font-size:12px;color:white;margin-right:4px;"
            ></i>
          )}
          <span class="title-text">{conf.properties.title}</span>
          {!isStartNode && (
            <input
              vModel_trim={conf.properties.title}
              class="title-input"
              style="margin-top:3px;"
              onClick={stopPro}
            />
          )}
        </div>
        <div class="actions" style="margin-right:4px;">
          <i
            class="el-icon-close icon"
            onClick={this.eventLancher.bind(ctx, "deleteNode", conf, ctx.data)}
          ></i>
        </div>
      </header>
      <div class="body">
        <span class="text">{conf.content}</span>
        <div class="icon-wrapper right">
          <i class="el-icon-arrow-right icon right-arrow"></i>
        </div>
      </div>
    </section>
  );
}

let nodes = {
  start: function(ctx, data, h) {
    return createNormalCard.call(ctx, ctx, data, h);
  },
  approver: function(ctx, data, h) {
    return createNormalCard.call(ctx, ctx, data, h);
  },
  empty: function(ctx, data, h) {
    return "";
  },
  condition: function(ctx, conf, h) {
    return (
      <section
        class="flow-path-card condition"
        onClick={this.eventLancher.bind(ctx, "edit", conf)}
      >
        <header class="header">
          <div class="title-box" style="height: 20px;width:160px;">
            <span class="title-text">{conf.properties.title}</span>
            {
              <input
                vModel_trim={conf.properties.title}
                class="title-input"
                style="margin-top:1px;"
                onClick={stopPro}
              />
            }
          </div>
          <span class="priority">优先级{conf.properties.priority + 1}</span>
          <div class="actions">
            <i
              class="el-icon-document-copy icon"
              onClick={this.eventLancher.bind(ctx, "copyNode", conf, ctx.data)}
            ></i>
            <i
              class="el-icon-close icon"
              onClick={this.eventLancher.bind(
                ctx,
                "deleteNode",
                conf,
                ctx.data
              )}
            ></i>
          </div>
        </header>
        <div class="body">
          <pre class="text" >{conf.content}</pre>
        </div>
        <div
          class="icon-wrapper left"
          onClick={ctx.eventLancher.bind(
            ctx,
            "increasePriority",
            conf,
            ctx.data
          )}
        >
          <i class="el-icon-arrow-left icon left-arrow"></i>
        </div>
        <div
          class="icon-wrapper right"
          onClick={ctx.eventLancher.bind(
            ctx,
            "decreasePriority",
            conf,
            ctx.data
          )}
        >
          <i class="el-icon-arrow-right icon right-arrow"></i>
        </div>
      </section>
    );
  }
};

function addNodeButton(ctx, data, h, isBranch = false) {
  // 只有非条件节点和条件分支树下面的那个按钮 才能添加新分支树
  let couldAddBranch = !hasBranch(data) || isBranch;
  let isEmpty = data.type === "empty";
  if (isEmpty && !isBranch) {
    return "";
  }
  return (
    <div class="add-node-btn-box flex  justify-center">
      <div class="add-node-btn">
        <el-popover placement="right" trigger="click" width="220">
          <div class="condition-box">
            <div>
              <div
                class="condition-icon"
                onClick={ctx.eventLancher.bind(
                  ctx,
                  "addApprovalNode",
                  data,
                  isBranch
                )}
              >
                <i class="iconfont iconshenpi"></i>
              </div>
              审批人
            </div>
            <div>
              <div
                class="condition-icon"
                onClick={this.eventLancher.bind(
                  ctx,
                  "appendBranch",
                  data,
                  isBranch
                )}
              >
                <i class="iconfont iconcondition"></i>
              </div>
              条件分支
            </div>
          </div>

          <button class="btn" type="button" slot="reference">
            <i class="el-icon-plus icon"></i>
          </button>
        </el-popover>
      </div>
    </div>
  );
}

function NodeFactory(ctx, data, h) {
  if (!data) {
    return;
  }
  const showErrorTip = ctx.verifyMode && NodeUtils.checkNode(data) === false
  let res = [],
    branchNode = "",
    selfNode = (
      <div class="node-wrap">
        <div class={`node-wrap-box ${data.type} ${showErrorTip ? 'error' : ''}` }>
          <el-tooltip content="未设置条件" placement="top" effect="dark">
            <div class="error-tip" onClick={this.eventLancher.bind(ctx, "edit", data)}>!!!</div>
          </el-tooltip>
          {nodes[data.type].call(ctx, ctx, data, h)}
          {addNodeButton.call(ctx, ctx, data, h)}
        </div>
      </div>
    );

  if (hasBranch(data)) {
    // 如果节点是数组 一定为条件分支 添加分支样式包裹
    // {data.childNode && NodeFactory.call(ctx, ctx, data.childNode, h)}
    branchNode = (
      <div class="branch-wrap">
        <div class="branch-box-wrap">
          <div class="branch-box  flex justify-center relative">
            <button
              class="btn"
              onClick={this.eventLancher.bind(ctx, "appendConditionNode", data)}
            >
              添加条件
            </button>
            {data.conditionNodes.map(d => NodeFactory.call(ctx, ctx, d, h))}
          </div>
        </div>
        {addNodeButton.call(ctx, ctx, data, h, true)}
      </div>
    );
  }

  if (isCondition(data)) {
    return (
      <div class="col-box">
        <div class="center-line"></div>
        <div class="top-cover-line"></div>
        <div class="bottom-cover-line"></div>
        {selfNode}
        {branchNode}
        {NodeFactory.call(ctx, ctx, data.childNode, h)}
      </div>
    );
  }
  res.push(selfNode);
  branchNode && res.push(branchNode);
  data.childNode && res.push(NodeFactory.call(ctx, ctx, data.childNode, h));
  return res;
}

function addEndNode(h) {
  return <section class="end-node">流程结束</section>;
}

export default {
  props: {
    data: { type: Object, required: true },
    // 点击发布时需要校验节点数据完整性 此时打开校验模式
    verifyMode: {type: Boolean, default: true},
  },
  watch:{
    
  },
  methods: {
    /**
     *事件触发器 统筹本组件所有事件并转发到父组件中
     * @param { Object } 包含event（事件名）和args（事件参数）两个参数
     */
    eventLancher(event, ...args) {
      // args.slice(0,-1) vue 会注入MouseEvent到最后一个参数 去除事件对象
      let param = { event, args: args.slice(0, -1) };
      this.$emit("emits", param);
    }
  },
  render(h) {
    return (
      <div style="display: inline-flex; flex-direction: column; align-items: center;">
        {this.data && NodeFactory.call(this, this, this.data, h)}
        {addEndNode(h)}
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
@import 'index.styl';
</style>