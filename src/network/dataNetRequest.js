import { getRequest } from './baseNetRequest'

export default {

  // 获取图表数据
  getReportData: () => {
    return new Promise((resolve, reject) => {
      getRequest('reports/type/1')
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}