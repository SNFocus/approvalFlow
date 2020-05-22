import { get } from '@/axios'
// 获取组织机构根节点
export const GET_DEPT_ROOT = () => get( './depRoot.json' )

// 根据部门id获取分页人员信息
export const GET_PAGE_EMPLOYEE = data => get( './userData.json', data )

// 获取组织机构子节点
export const GET_DEPT_TREE = data => get( './depChild.json', data )

// 获取组织机构下人员信息
export const GET_USER_BY_DEPT = data => get( './userData.json', data )
