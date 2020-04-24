export default {
  start: {
    type: "start",
    content: "所有人",
    properties: {
      title: '发起人'
    }
  },
  approver: {
    type: "approver",
    content: "请设置审批人",
    properties: { title: '审批人', formOperates: [] }
  },
  condition: {
    type: "condition",
    content: "请设置条件",
    properties: { title: '条件', conditions: [] }
  },
  empty: { type: "empty" }
}


export const approverConf = {
  specified: {
    label: '指定成员',
    value: []
  },
  selfSelection: {
    label: '自选',
    value: [],
  }
}