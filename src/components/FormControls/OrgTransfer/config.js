/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import { GET_DEPT_ROOT, GET_DEPT_TREE, GET_USER_BY_DEPT, GET_PAGE_EMPLOYEE } from '@/api'

const toHump = name => name.replace( /\_(\w)/g, function ( all, letter ) {
  return letter.toUpperCase()
} )
// 需要自行设置nodeID  重要！！！
async function getDepChildNode ( orgId ) {
  const promises = [GET_DEPT_TREE( { orgId } )]
  let res = []
  // loadUser && promises.push( GET_USER_BY_DEPT( { deptId: orgId } ) )
  try {
    res = await Promise.all( promises )
  } catch ( error ) {/* this.$message.error('获取子节点数据出错')*/ }
  const nodes = res.reduce( ( p, c ) => {
    return [...p, ...c.data]
  }, [] )
  return nodes
}
// 需要返回一个promise
async function loadDepOrUser ( node, loadDep = true ) {
  let nodeData = []
  if ( node.level === 0 ) { // 根目录
    const test = await getRootDept()  // 获取根节点
    nodeData = [test]
  } else if ( node.level === 1 ) {
    nodeData = await getDepChildNode( node.data.deptId )  // 获取部门节点
  } else if ( !loadDep && node.level === 2 ) {
    nodeData = ( await GET_PAGE_EMPLOYEE() ).data  // 获取部门下人员
  }
  return nodeData
}
// 获取组织结构根节点
// 需要自行设置nodeID  重要！！！
async function getRootDept () {
  let res = []
  try {
    res = ( await GET_DEPT_ROOT() ).data
  } catch ( err ) { }
  return res
}

function loadDepData ( node ) {
  return loadDepOrUser( node ) // 返回的promise
}

function loadUserData ( node ) {
  return loadDepOrUser( node, false )  // 返回的promise
}

const defaultOption = {
  tabName: '部门',  // 选项卡名称
  tabKey: 'dep', //选项卡键值 传入的selected要和键值保持一致 eg: {dep: [], role: []}
  children: 'children', // 子节点标志
  // 生成每个节点的id 保证唯一
  nodeId: function ( data ) {
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
  // 搜索后的结果如果需要展示一些提示文字 例如搜索人员 提示人员所属部门  可以使用该属性
  // function
  searchResTip: function ( data ) {
    return '部门：' + data.deptId
  },
  // 判断该节点是否可选 例如同时选择部门和部门下的人
  disabled: function ( data, node ) {
    return false
  },
  // 动态请求后台拿到节点数据 返回一个promise
  onload: loadDepData,
  // 搜索节点方法 
  onsearch: async function ( searchString, resolve, reject ) {
    // const param = { page: 1, limit: 200, searchName: searchString }
    resolve( ( await GET_PAGE_EMPLOYEE() ).data )
  }
}

export const DEP_CONFIG = Object.assign( {}, defaultOption )
export const ROLE_CONFIG = Object.assign( {}, defaultOption, { tabKey: 'role', tabName: '角色' } )
export const USER_CONFIG = Object.assign( {}, defaultOption, { tabKey: 'user', tabName: '指定人员', onload: loadUserData, disabled: ( data, node ) => !data.hasOwnProperty( 'userId' ) } )
const DEP_USER_CONFIG = Object.assign( {}, defaultOption, { tabKey: 'dep&user', tabName: '部门和人员', onload: loadUserData, disabled: () => false } )
const POSITION_CONFIG = Object.assign( {}, defaultOption, { tabKey: 'position', tabName: '岗位' } )
export const CONFIG_LIST = [DEP_CONFIG, ROLE_CONFIG, USER_CONFIG, DEP_USER_CONFIG, POSITION_CONFIG]
