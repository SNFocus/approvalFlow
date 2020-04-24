import nodeConfig from "./config.js";
export class NodeUtils {
  static globalID = 10000
  /**
   * 根据自增数生成六进制id
   * @returns 64进制id字符串
   */
  static idGenerator () {
    let qutient = ++this.globalID
    const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
    const charArr = chars.split( "" )
    const radix = chars.length;
    const res = []
    do {
      let mod = qutient % radix;
      qutient = ( qutient - mod ) / radix;
      res.push( charArr[mod] )
    } while ( qutient );
    return res.join( '' )
  }
  static isConditionNode ( node ) {
    return node.type === 'condition'
  }

  static isStartNode ( node ) {
    return node.type === 'start'
  }

  static isApproverNode ( node ) {
    return node.type === 'approver'
  }
  /**
   * 创建指定节点
   * @param { String } type - 节点类型
   * @param { Object } previousNodeId - 父节点id
   * @returns { Object } 节点数据
   */
  static createNode ( type, previousNodeId ) {
    let res = JSON.parse( JSON.stringify( nodeConfig[type] ) )
    res.nodeId = this.idGenerator()
    res.prevId = previousNodeId
    return res
  }
  /**
   * 获取指定节点的父节点（前一个节点）
   * @param { String } prevId - 父节点id
   * @param { Object } processData - 流程图全部数据
   * @returns { Object } 父节点
   */
  static getPreviousNode ( prevId, processData ) {
    if ( processData.nodeId === prevId ) {
      return processData
    }
    if ( processData.childNode ) {
      let r1 = this.getPreviousNode( prevId, processData.childNode )
      if ( r1 ) {
        return r1
      }
    }
    if ( processData.conditionNodes ) {
      for ( let c of processData.conditionNodes ) {
        let r2 = this.getPreviousNode( prevId, c )
        if ( r2 ) {
          return r2
        }
      }
    }
  }

  static resortPrioByCNode ( cnode, oldIndex, processData ) {
    let prevNode = this.getPreviousNode( cnode.prevId, processData )
    let newIndex = cnode.properties.priority
    let delNode = prevNode.conditionNodes.splice( newIndex, 1, cnode )[0]
    delNode.properties.priority = oldIndex
    prevNode.conditionNodes[oldIndex] = delNode

  }
  /**
   * 删除节点
   * @param { Object  } nodeData - 被删除节点的数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static deleteNode ( nodeData, processData ) {
    let prevNode = this.getPreviousNode( nodeData.prevId, processData )
    if ( prevNode.type === 'empty' ) {
      this.deleteNode( prevNode, processData );
      return;
    }
    let concatChild = ( prev, delNode ) => {
      prev.childNode = delNode.childNode
      prev.conditionNodes = delNode.conditionNodes
      prev.childNode && ( prev.childNode.prevId = prev.nodeId )
      prev.conditionNodes && prev.conditionNodes.forEach( c => {
        c.prevId = prev.nodeId
      } );
    }
    if ( this.isConditionNode( nodeData ) ) {
      let cons = prevNode.conditionNodes
      let index = cons.findIndex( c => c.nodeId === nodeData.nodeId )
      if ( cons.length > 2 ) {
        cons.splice( index, 1 )
      } else {
        let anotherCon = cons[+( !index )]
        delete prevNode.conditionNodes
        if ( prevNode.childNode ) {
          let endNode = anotherCon
          while ( endNode.childNode ) {
            endNode = endNode.childNode
          }
          endNode.childNode = prevNode.childNode
          endNode.childNode.prevId = endNode.nodeId
        }
        concatChild( prevNode, anotherCon )
      }
      // 重新编排优先级
      cons.forEach( ( c, i ) => {
        c.properties.priority = i
      } )
      return
    }
    concatChild( prevNode, nodeData )
  }
  // TODO:
  static copyNode ( nodeData, processData ) {
    let prevNode = this.getPreviousNode( nodeData.prevId, processData )
    let index = prevNode.conditionNodes.findIndex( c => c.nodeId === nodeData.nodeId )

  }
  /**
   * 添加审计节点（普通节点 approver）
   * @param { Object } data - 目标节点数据，在该数据节点之后添加审计节点
   * @param { Object } isBranchAction - 目标节点数据，是否是条件分支
   * @param { Object } newChildNode - 传入的新的节点 用户操作均为空  删除操作会传入该参数模拟添加节点
   */
  static addApprovalNode ( data, isBranchAction, newChildNode = undefined ) {
    let oldChildNode = data.childNode;
    newChildNode = newChildNode || this.createNode( "approver", data.nodeId )
    data.childNode = newChildNode
    oldChildNode && ( newChildNode.childNode = oldChildNode );
    let conditionNodes = data.conditionNodes
    if ( Array.isArray( conditionNodes ) && !isBranchAction && conditionNodes.length ) {
      newChildNode.conditionNodes = conditionNodes.map( c => {
        c.prevId = newChildNode.nodeId
        return c
      } )
      delete data.conditionNodes
    }
  }
  /**
   * 添加空节点
   * @param { Object } data - 空节点的父级节点
   * @return { Object } emptyNode - 空节点数据
   */
  static addEmptyNode ( data ) {
    let emptyNode = this.createNode( 'empty', data.nodeId )
    this.addApprovalNode( data, true, emptyNode )
    return emptyNode
  }
  /**
   * 添加条件节点 condition 通过点击添加条件进入该操作
   * @param { Object } data - 目标节点所在分支数据，在该分支最后添加条件节点
   */
  static appendConditionNode ( data ) {
    let node = this.createNode( 'condition', data.nodeId )
    node.properties.priority = data.conditionNodes.length
    data.conditionNodes.push( node )
  }
  /**
   * 添加条件分支 branch 
   * @param { Object } data - 目标节点所在节点数据，在该节点最后添加分支节点
   */
  static appendBranch ( data, isBottomBtnOfBranch ) {
    // isBottomBtnOfBranch 用户点击的是分支树下面的按钮
    let nodeData = data
    // 由于conditionNodes是数组 不能添加下级分支 故在两个分支树之间添加一个不会显示的正常节点 兼容此种情况
    if ( Array.isArray( data.conditionNodes ) && data.conditionNodes.length ) {
      if ( isBottomBtnOfBranch ) {
        // 添加一个模拟用的空白节点并返回这个节点，作为新分支的父节点
        nodeData = this.addEmptyNode( nodeData, true )
      } else {
        let emptyNode = this.addEmptyNode( nodeData, true )
        emptyNode.conditionNodes = nodeData.conditionNodes
        emptyNode.conditionNodes.forEach( n => {
          n.prevId = emptyNode.nodeId
        } )
      }
    }
    let conditionNodes = [
      this.createNode( "condition", nodeData.nodeId ),
      this.createNode( "condition", nodeData.nodeId )
    ].map( ( c, i ) => {
      c.properties.title += i + 1;
      c.properties.priority = i;
      return c
    } )
    nodeData.conditionNodes = conditionNodes
  }
  /**
   * 提升条件节点优先级——排序在前
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static increasePriority ( data, processData ) {
    // 分支节点数据 包含该分支所有的条件节点
    let prevNode = this.getPreviousNode( data.prevId, processData )
    let branchData = prevNode.conditionNodes
    let index = branchData.findIndex( c => c === data )
    if ( index ) {
      // 和前一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      branchData[index - 1].properties.priority = index
      branchData[index].properties.priority = index - 1
      branchData[index - 1] = branchData.splice( index, 1, branchData[index - 1] )[0]
    }
  }
  /**
   * 降低条件节点优先级——排序在后
   * @param { Object } data - 目标节点数据
   * @param { Object  } processData - 流程图的所有节点数据
   */
  static decreasePriority ( data, processData ) {
    // 分支节点数据 包含该分支所有的条件节点
    let prevNode = this.getPreviousNode( data.prevId, processData )
    let branchData = prevNode.conditionNodes
    let index = branchData.findIndex( c => c === data )
    if ( index < branchData.length - 1 ) {
      // 和后一个数组项交换位置 Array.prototype.splice会返回包含被删除的项的集合（数组）
      branchData[index + 1].properties.priority = index
      branchData[index].properties.priority = index + 1
      branchData[index + 1] = branchData.splice( index, 1, branchData[index + 1] )[0]
    }
  }
}
/**
 * 添模拟数据
 */
export function getMockData () {
  let startNode = NodeUtils.createNode( "start" );
  startNode.childNode = NodeUtils.createNode( "approver", startNode.nodeId )
  return startNode;
}