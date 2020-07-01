import { getRequest, postRequest } from '../network/baseNetRequest'

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
      getRequest('menus', {})
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}
