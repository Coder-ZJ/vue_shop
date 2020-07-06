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
  },

  // 获取分类参数列表
  getCateParamsList(id, sel) {
    return new Promise((resolve, reject) => {
      getRequest(`categories/${id}/attributes`, { sel })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 添加动态参数或静态属性
  addParams(id, params) {
    return new Promise((resolve, reject) => {
      postRequest(`categories/${id}/attributes`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 编辑动态参数或静态属性
  editParams(id, attrId, params) {
    return new Promise((resolve, reject) => {
      putRequest(`categories/${id}/attributes/${attrId}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 删除动态参数或静态属性
  removeParams(id, attrId) {
    return new Promise((resolve, reject) => {
      deleteRequest(`categories/${id}/attributes/${attrId}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 获取商品列表
  getGoodsList(params) {
    return new Promise((resolve, reject) => {
      getRequest('goods', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 删除商品
  removeGoods(id) {
    return new Promise((resolve, reject) => {
      deleteRequest(`goods/${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 添加商品
  addGoods(params) {
    return new Promise((resolve, reject) => {
      postRequest('goods', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}