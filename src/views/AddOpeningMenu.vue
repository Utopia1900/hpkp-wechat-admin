<template>
    <div>
        <v-flex xs12 sm12 class="my-1">
            <v-data-table
                    :headers="headers"
                    :items="desserts"
                    hide-actions
                    noDataText="暂无活动！"
                    class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td class="text-xs-center">{{ props.item.name}}</td>
                    <!--<td class="text-xs-center">{{ formatDate(props.item.createdAt) }}</td>-->
                    <td class="text-xs-center">{{ props.item.project}}</td>
                    <td class="text-xs-center">{{ props.item.isLimited ? '是':'否'}}</td>
                    <td class="text-xs-center">
                        <ul>
                            <li>{{props.item.formalTime.start}}&nbsp;&nbsp;至&nbsp;&nbsp;{{props.item.formalTime.end}}
                            </li>
                        </ul>
                    </td>
                    <td class="text-xs-center">
                        <ul v-for="(item, index) in props.item.testTime" :key="index">
                            <li>{{item.start}}&nbsp;&nbsp;至&nbsp;&nbsp;{{item.end}}</li>
                        </ul>
                    </td>
                    <td class="text-xs-center">
                        <v-btn color="error" @click="showActivity(props.item)">查看&nbsp;|&nbsp;修改</v-btn>
                        <v-btn color="info" @click="addOpeningMenu(props.item.id)">添加开盘菜单</v-btn>
                        <v-btn color="success" @click="queryCheckUrl(props.item.id)">获取开盘菜单URL</v-btn>
                        <v-btn color="warning" @click="goToManageActivity(props.item.id, props.item.name, props.item.type)">活动预览入口
                        </v-btn>
                    </td>
                </template>
            </v-data-table>
        </v-flex>
        <v-dialog v-model="dialog" max-width="750px">
            <v-card>
                <v-list>
                    <v-list-tile style="height: 30px">
                        <v-list-tile-title style="width: 50px">URL:</v-list-tile-title>
                        <v-list-tile-sub-title>{{url}}</v-list-tile-sub-title>
                    </v-list-tile>
                </v-list>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" flat @click.native="dialog = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addMenuDialog" max-width="600px">
            <v-card>
                <v-list>
                    <v-select
                            ref="select"
                            :items="items"
                            label="请选择菜单位置"
                            solo
                            :selectedItems="ddd"
                    ></v-select>
                </v-list>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" flat @click.native="addMenuDialog = false">取消</v-btn>
                    <v-btn color="primary" flat @click="submitAddOpeningMenu">确定添加</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="toastDialog" max-width="600px">
            <v-card style="padding-top: 30px;">
                {{errmsg}}
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" flat @click.native="toastDialog = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import config from '../utils/config'
    import '../utils/formatDate'
    import axios from 'axios'

    export default {
        name: "add-opening-menu",
        data: () => ({
            ddd: 2,
            dialog: false,
            valid: true,
            alert: false,
            timeType: null,
            headers: [
                {text: '活动名称', align: 'center', value: 'name', sortable: false},
                {text: '楼盘名称', align: 'center', value: 'createTime', sortable: false},
                {text: '是否限购', align: 'center', value: 'isLimited', sortable: false},
                {text: '正式时间', align: 'center', value: 'formalTime', sortable: false},
                {text: '公测时间', align: 'center', value: 'testTime', sortable: false},
                {text: '操作', align: 'center', value: 'id', sortable: false}
            ],
            desserts: [],
            id: null, // 活动ID
            url: null,
            addMenuDialog: false,
            items: [1, 2, 3],
            activityId: null,
            submitUpdateDialog: false,
            errmsg: '提示',
            toastDialog: false,
            typeItems: ['房源', '车位'],
//            activityType: '房源'
        }),
        computed: {
            activityType: {
                get() {
                    return this.activity.type == '0' ? '房源' : '车位'
                },
                set(val){
                    if (val == '房源') {
                        this.activity.type = 0
                    }
                    if (val == '车位') {
                        this.activity.type = 1
                    }
                }
            },
        },
        methods: {
            queryValidActivity() {
                let formData = {
                    token: sessionStorage.getItem('token')
                }
                let options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    data: JSON.stringify(formData),
                    url: config.preHttp + 'activity'
                }
                axios(options).then(response => {
                    let data = response.data
                    let tId = window.localStorage.getItem('successAddId') ? window.localStorage.getItem('successAddId') : null
                    for (let i = 0; i < data.length; i++) {
                        if (tId && tId == data[i].id) {
                            data[i].status = 'isAdded'
                            break
                        }
                    }
                    // console.log('df', data)
                    this.desserts = data
                }).catch(error => {
                    alert(error)
                })
            },
            formatDate(date) {
                let parseDate = Date.parse(date)
                let reqDate = (new Date(parseDate)).FormatDate('yyyy-MM-dd')
                return reqDate
            },
            addOpeningMenu(id) {
                this.addMenuDialog = true
                this.activityId = id
            },
            submitAddOpeningMenu() {
                let formData = {
                    token: sessionStorage.getItem('token'),
                    activityId: this.activityId
                }
                if (this.$refs.select.selectedItems[0]) {
                    formData.menuPos = this.$refs.select.selectedItems[0]
                    let options = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        data: JSON.stringify(formData),
                        url: config.preHttp + 'addOpeningMenu'
                    }
                    let value = confirm('确定要为该活动添加开盘菜单项吗？')
                    if (value) {
                        axios(options).then(response => {
                            let data = response.data
                            if (!data.errcode) {
                                window.localStorage.setItem('isAdd', 1)
                                window.localStorage.setItem('successAddId', id)
                                alert('添加成功')
                            } else {
                                alert(`${data.errmsg}`)
                            }
                        }).catch(error => {
                            alert(error)
                        })
                    }
                } else {
                    alert('请选择菜单位置')
                }
            },
            queryCheckUrl(id) {
                let formData = {
                    token: sessionStorage.getItem('token'),
                    activityId: id
                }
                let options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    data: JSON.stringify(formData),
                    url: config.preHttp + 'queryOpeningUrl'
                }
                let that = this
                axios(options).then(response => {
                    let data = response.data
                    if (data.url) {
                        that.dialog = true
                        that.url = data.url
                    } else {
                        alert(`${data.errmsg}`)
                    }
                }).catch(error => {
                    alert(error)
                })
            },
            showActivity (args) {
                window.sessionStorage.setItem('activity', JSON.stringify(args))
                this.$router.push('/home/editActivity')
            },
            updateActivity () {
                this.submitUpdateDialog = true
            },
            goToManageActivity (activityId, name, activityType) {
                let token = sessionStorage.getItem('token')
                window.open(`http://localhost:8088/#/?activityId=${activityId}&name=${name}&token=${token}&activityType=${activityType}`, '_blank')
 //               window.open(`/admin/manage/#/?activityId=${activityId}&name=${name}&token=${token}&activityType=${activityType}`, '_blank')
            }
        },
        mounted() {
            this.queryValidActivity()
        },
    }
</script>

<style scoped>
    input[type="text"] {
        height: 36px;
        border: 1px solid #ccc;
        width: 500px;
        text-indent: 10px;
        outline: none;
    }

    textarea {
        border: 1px solid #ccc;
        outline: none;
        resize: none;
        text-indent: 12px;
        width: 500px;
        display: inline-block;
    }
</style>
