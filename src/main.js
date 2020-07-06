import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入 element-ui 组件
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 导入 vue-table-with-tree-grid 插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

// 日期格式化的一个全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDate() + '').padStart(2, '0')
  const hour = (date.getHours() + '').padStart(2, '0')
  const min = (date.getMinutes() + '').padStart(2, '0')
  const second = (date.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${min}:${second}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
