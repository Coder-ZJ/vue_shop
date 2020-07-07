// 订单管理
import { getRequest } from '../network/baseNetRequest'

export default {

  // 获取订单列表
  getOrderList: params => {
    return new Promise((resolve, reject) => {
      getRequest('orders', params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },

  // 获取物流信息
  getLogisticsInfo: () => {
    return new Promise((resolve, reject) => {
      getRequest(`/kuaidi/${1106975712662}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}