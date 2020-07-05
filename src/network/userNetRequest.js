// 用户管理
import { getRequest, postRequest, putRequest, deleteRequest } from '../network/baseNetRequest'

export default {
  // 登录
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      postRequest('login', { username, password })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 获取菜单
  getMenus: () => {
    return new Promise((resolve, reject) => {
      getRequest('menus')
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 获取用户列表及用户查询
  getUserList: params => {
    return new Promise((resolve, reject) => {
      getRequest('users', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 修改用户状态
  updateUserState: (uId, type) => {
    return new Promise((resolve, reject) => {
      putRequest(`users/${uId}/state/${type}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 新增用户
  addUser: (params) => {
    return new Promise((resolve, reject) => {
      postRequest('users', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 编辑用户信息
  editUserInfo: (id, params) => {
    return new Promise((resolve, reject) => {
      putRequest(`users/${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 删除用户
  deleteUser: id => {
    return new Promise((resolve, reject) => {
      deleteRequest(`users/${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 获取角色列表
  getRoleList: () => {
    return new Promise((resolve, reject) => {
      getRequest('roles')
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 分配角色
  setUserRole: (id, rid) => {
    return new Promise((resolve, reject) => {
      putRequest(`users/${id}/role`, { rid })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}
