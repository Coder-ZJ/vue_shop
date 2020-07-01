import axios from 'axios'

// axios 全局配置
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.timeout = 10000

// 请求拦截器,请求头添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.token
  return config
})

// get请求
export function getRequest(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, params)
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
