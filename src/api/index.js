import { get } from '@/axios'
const BASE_URL = process.env.BASE_URL
// 获取组织机构根节点
export const GET_DEPT_ROOT = () => get( BASE_URL + 'depRoot.json' )

// 根据部门id获取分页人员信息
export const GET_PAGE_EMPLOYEE = data => get( BASE_URL + 'userData.json', data )

// 获取组织机构子节点
export const GET_DEPT_TREE = data => get( BASE_URL + 'depChild.json', data )

// 获取组织机构下人员信息
export const GET_USER_BY_DEPT = data => get( BASE_URL + 'userData.json', data )

// 获取Mock数据
export const GET_MOCK_CONF = () => get(BASE_URL + 'mockConf.json')
