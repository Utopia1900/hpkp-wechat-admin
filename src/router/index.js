import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import AppHome from '@/views/AppHome'
import CreateActivity from '@/views/CreateActivity'
import CurrentMenuInfo from '@/views/CurrentMenuInfo'
import AddOpeningMenu from '@/views/AddOpeningMenu'
import EditActivity from '@/views/EditActivity'
import Manage from '@/views/Manage'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: '首页',
            component: AppHome,
            redirect: '/home/addOpeningMenu',
            children: [
                {
                    path: '/home/currentMenuInfo',
                    name: '当前菜单项',
                    component: CurrentMenuInfo
                },
                {
                    path: '/home/addOpeningMenu',
                    name: '添加开盘菜单',
                    component: AddOpeningMenu
                },
                {
                    path: '/home/createActivity',
                    name: '创建活动',
                    component: CreateActivity
                },
                {
                    path: '/home/editActivity',
                    name: '修改活动',
                    component: EditActivity
                }
            ]
        },
        {
            path: '/manage',
            name: 'manage',
            component: Manage
        }
    ]
})
