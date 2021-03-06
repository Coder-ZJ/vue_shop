import axios from 'axios'

// axios 全局配置
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.timeout = 100000

// 请求拦截器,请求头添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.token
  return config
})

// get请求
export function getRequest(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

// post请求
export function postRequest(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

// put请求
export function putRequest(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

// delete请求
export function deleteRequest(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, { params })
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
