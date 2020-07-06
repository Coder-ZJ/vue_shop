// 按需引入 element-ui 组件

import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Footer, Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Pagination, Switch, Tooltip, Dialog, MessageBox, Select, Option, Tag, Tree, Cascader, Alert, Tabs, TabPane, Steps, Step, Checkbox, CheckboxGroup, Upload } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm