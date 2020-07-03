// 商品管理
import { getRequest, postRequest, putRequest, deleteRequest } from '../network/baseNetRequest'

export default {

  // 获取商品分类
  getGoodsCateList: params => {
    return new Promise((resolve, reject) => {
      getRequest('categories', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 添加分类
  addGoodsCate: params => {
    return new Promise((resolve, reject) => {
      postRequest('categories', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 编辑分类
  editGoodsCate: (id, catName) => {
    return new Promise((resolve, reject) => {
      putRequest(`categories/${id}`, { cat_name: catName })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 删除分类
  removeGoodsCate: id => {
    return new Promise((resolve, reject) => {
      deleteRequest(`categories/${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}