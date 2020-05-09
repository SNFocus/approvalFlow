/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import {
  GET_DEPT_ROOT,
  GET_DEPT_TREE,
  GET_USER_BY_DEPT,
  GET_PAGE_EMPLOYEE
} from '@/api'

const toHump = name => name.replace( /\_(\w)/g, function ( all, letter ) {
  return letter.toUpperCase()
} )
let hasGetChild = false // 模拟数据 只请求一次
async function getDepChildNode ( orgId ) {
  if ( hasGetChild ) {
    return []
  }
  const promises = [GET_DEPT_TREE( { orgId } )]
  let res = []
  promises.push( GET_USER_BY_DEPT( { deptId: orgId } ) )
  try {
    res = await Promise.all( promises )
    hasGetChild = true
  } catch ( error ) {
    // this.$message.error('获取子节点数据出错')
  }

  const nodes = res.reduce( ( p, c ) => {
    return [...p, ...c.data]
  }, [] )

  return nodes.map( t => ( {
    nodeId: t.deptId || t.userId,
    ...t
  } ) )
}

// 获取组织结构根节点
async function getRootDept () {
  let res = []
  try {
    res = ( await GET_DEPT_ROOT() ).data
    res.nodeId = res.deptId
    hasGetChild = false
  } catch ( err ) {
    // this.$message.error((err && err.msg) || '获取组织结构根节点失败')
  }
  return res
}

export const DEP_CONFIG = {
  tabName: '部门',  // 选项卡名称

  tabKey: 'dep', //选项卡键值 传入的selected要和键值保持一致 eg: {dep: [], role: []}

  children: 'children', // 子节点标志

  // 生成每个节点的id 保证唯一
  getNodeId: function ( data ) {
    return data.hasOwnProperty( 'userId' ) ? data.userId : data.deptId
  },
  // 生成节点的名称 可选值 string | function
  label: function ( data, node ) {
    return data.hasOwnProperty( 'userId' ) ? data.userName : data.deptName
  },
  // 判断是否为叶子节点 可选值 string | function
  isLeaf: function ( data, node ) {
    return data.hasOwnProperty( 'userId' ) // 含有empID为人员  且为叶子节点
  },
  // 判断该节点是否可选 例如同时选择部门和部门下的人
  optionalNode: function ( data, node ) {
    // 可选择的节点 return Boolean
    return data.hasOwnProperty( 'userId' )
  },
  // 动态请求后台拿到节点数据
  onload: async function ( node, resolve ) {
    if ( node.level === 0 ) { // 根目录
      const test = await getRootDept()
      return resolve( [test] )
    }
    const nodeData = await getDepChildNode( node.data.deptId )
    return resolve( nodeData )
  },
  // 搜索节点方法 
  onsearch: function ( searchString, resolve, reject ) {
    const param = {
      page: 1,
      limit: 200,
      searchName: searchString
    }

    GET_PAGE_EMPLOYEE( param )
      .then( res => {
        const searchRes = res.map( t => {
          for ( const key in t ) {
            // 返回得数据是下划线名命  转为驼峰
            const humpKey = toHump( key )
            t[humpKey] = t[key]
            delete t[key]
          }
          return t
        } )
        resolve( searchRes )
      } )
      // eslint-disable-next-line handle-callback-err
      .catch( err => reject( err ) )
  }
}

export const ROLE_CONFIG = Object.assign( {}, DEP_CONFIG, { tabKey: 'role', tabName: '角色' } )
export const CONFIG_LIST = [DEP_CONFIG, ROLE_CONFIG]
