// 权限管理
import { getRequest, deleteRequest, postRequest, putRequest } from '../network/baseNetRequest'

export default {

  // 获取权限列表
  getRightsList: (type) => {
    return new Promise((resolve, reject) => {
      getRequest(`rights/${type}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 删除权限
  removeRoleRights: (roleId, rightId) => {
    return new Promise((resolve, reject) => {
      deleteRequest(`roles/${roleId}/rights/${rightId}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 添加角色
  addRole: params => {
    return new Promise((resolve, reject) => {
      postRequest('roles', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 编辑角色
  editRole: (roleId, params) => {
    return new Promise((resolve, reject) => {
      putRequest(`roles/${roleId}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 删除角色
  removeRole: roleId => {
    return new Promise((resolve, reject) => {
      deleteRequest(`roles/${roleId}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 分配权限
  setRights: (roleId, rids) => {
    return new Promise((resolve, reject) => {
      postRequest(`roles/${roleId}/rights`, { rids })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}