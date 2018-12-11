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
                        <ul v-for="(item, index) in props.item.testTime">
                            <li>{{item.start}}&nbsp;&nbsp;至&nbsp;&nbsp;{{item.end}}</li>
                        </ul>
                    </td>
                    <td class="text-xs-center">
                        <v-btn color="error" @click="showActivity(props.item)">查看&nbsp;|&nbsp;修改</v-btn>
                        <v-btn color="info" @click="addOpeningMenu(props.item.id)">添加开盘菜单</v-btn>
                        <v-btn color="success" @click="queryCheckUrl(props.item.id)">获取开盘菜单URL</v-btn>
                        <v-btn color="warning" @click="goToManageActivity(props.item.id, props.item.name)">管理页面入口
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
        <v-dialog v-model="activityDialog" fullscreen hide-overlay max-width="650px" v-if="activity">
            <v-card style="padding-left: 100px">
                <h3 style="padding-top: 30px;">查看&nbsp;|&nbsp;修改 &nbsp;活动信息</h3>
                <v-list>
                    <v-list-tile><span style="width: 150px;text-align: left">活动名称: </span><input type="text"
                                                                                                 v-model="activity.name"
                                                                                                 ref="name">
                    </v-list-tile>
                    <v-list-tile><span style="width: 150px;text-align: left">活动标题: </span><input type="text"
                                                                                                 v-model="activity.title"
                                                                                                 ref="title">
                    </v-list-tile>
                    <v-list-tile><span style="width: 150px;text-align: left">楼盘所在城市: </span><input type="text"
                                                                                                   v-model="activity.city"
                                                                                                   ref="city">
                    </v-list-tile>
                    <v-list-tile><span style="width: 150px;text-align: left">楼盘名称: </span><input type="text"
                                                                                                 v-model="activity.project"
                                                                                                 ref="project">
                    </v-list-tile>
                    <v-list-tile style="height: 100px;margin-top:20px;"><span style="width: 150px;text-align: left">房源描述: </span>
                        <textarea name="" ref="roomDesc" v-model="activity.roomDesc" cols="30" rows="3"
                                  placeholder="在这里填写..."></textarea>
                    </v-list-tile>

                    <v-list-tile style="height: 150px;margin-top:45px;"><span style="width: 150px;text-align: left">签约描述: </span>
                        <textarea name="" ref="signDesc" v-model="activity.signDesc" cols="36" rows="6"
                                  placeholder="在这里填写..."></textarea>
                    </v-list-tile>
                    <v-list-tile><span style="width: 150px;text-align: left">创建时间: </span>
                        <ul>
                            <li>{{ formatDate(activity.createdAt) }}</li>
                        </ul>
                    </v-list-tile>
                    <!--<v-list-tile><span style="width: 120px;text-align: left">修改时间: </span>
                      <ul>
                        <li>{{ formatDate(activity.updatedAt) }}</li>
                      </ul>
                    </v-list-tile>-->
                    <v-list-tile>
                        <span style="width: 320px;text-align: left">是否限制一个账户只能购买一套房源: </span>
                        <v-switch
                                :label="activity.isLimited ? '是': '否'"
                                v-model="activity.isLimited"
                        ></v-switch>
                    </v-list-tile>
                    <v-list-tile>
                        <span style="width: 320px;text-align: left">是否需要发送短信: </span>
                        <v-switch
                                :label="activity.needSendSms ? '是': '否'"
                                v-model="activity.needSendSms"
                        ></v-switch>
                    </v-list-tile>
                </v-list>
                <v-list style="margin-top: 0px;">
                    <v-list-tile><span
                            style="width: 150px;text-align: center;border-left: 4px solid #ff7000">公测时间: </span>
                        <v-btn color="success" flat @click="showTimeUpdateDialog('testAdd')">点击新增</v-btn>
                    </v-list-tile>
                </v-list>
                <v-list style="margin-top: 0px;border-bottom: 1px solid #ccc;"
                        v-for="(item, index) in activity.testTime">
                    <v-list-tile>
                        <span>{{index + 1}}.&nbsp;</span>
                        <span style="display: inline-block;width: 100%;text-align: left;">
                                {{item.start}} 至 {{item.end}}
                            </span>

                    </v-list-tile>
                    <v-list-tile>
                        <v-btn color="success" @click="showTimeUpdateDialog('testUpdate', item.start, item.end, index)">
                            修改
                        </v-btn>
                        <v-btn color="warning" @click="showDelTestTimeDialog(index)">删除
                        </v-btn>
                    </v-list-tile>
                </v-list>
                <v-list style="border-top:1px solid #ccc;">
                    <v-list-tile><span
                            style="width: 150px;text-align: center; border-left: 4px solid #7fe27f">正式时间:</span>
                    </v-list-tile>
                </v-list>
                <v-list style="border-bottom: 1px solid #ccc;">
                    <v-list-tile>
                        <span style="width: 100%;text-align: left">
                              {{activity.formalTime.start}} 至 {{activity.formalTime.end}}
                          </span>
                    </v-list-tile>
                    <v-list-tile>
                        <v-btn color="success"
                               @click="showTimeUpdateDialog('formal', activity.formalTime.start, activity.formalTime.end)">
                            修改
                        </v-btn>
                    </v-list-tile>
                </v-list>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click.native="closeUpdateDialog">关闭</v-btn>
                    <v-btn color="primary" @click="updateActivity">确定修改</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="submitUpdateDialog" max-width="600px">
            <v-card style="padding-top: 30px;">
                确定要提交修改吗？
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" flat @click.native="submitUpdateDialog = false">取消</v-btn>
                    <v-btn color="primary" flat @click="submitUpdate">确定</v-btn>
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

        <v-dialog v-model="dateTimeDialog" persistent max-width="600px" style="background: #fff;max-height: 700px">
            <v-card style="padding-top: 30px;background: #fff;color: #000; height: 500px;">
                设置开始和结束时间
                <v-card-title style="height: 200px;margin: 20px auto;">
                    <div style="display: flex;flex-direction: column;width: 100%;">
                        <div style="margin-bottom: 8px;">
                            开始：
                            <date-picker :date="startTime" :option="startOption" :limit="startLimit"
                                         style="border: 1px solid #ccc;"></date-picker>
                        </div>
                        <div>结束：
                            <date-picker :date="endTime" :option="endOption" :limit="endLimit"
                                         style="border: 1px solid #ccc;"></date-picker>
                        </div>
                    </div>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="dateTimeDialog = false">取消</v-btn>
                    <v-btn color="info" flat @click="setTime">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="delTestTimeDialog" max-width="600px">
            <v-card style="padding-top: 30px;">
                确定要删除这个公测时间吗？
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" flat @click.native="delTestTimeDialog = false">取消</v-btn>
                    <v-btn color="primary" flat @click="delTestTime">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import config from '../utils/config'
    import '../utils/formatDate'
    import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
    import axios from 'axios'

    export default {
        name: "add-opening-menu",
        data: () => ({
            ddd: 2,
            dialog: false,
            valid: true,
            alert: false,
            dateTimeDialog: false,
            delTestTimeDialog: false,
            delTestTimeIndex: null,
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
            activityDialog: false,
            activity: null,
            submitUpdateDialog: false,
            errmsg: '提示',
            toastDialog: false,
            testTimeIndex: null,
            startTime: {
                time: ''
            },
            endTime: {
                time: ''
            },
            startLimit: [
                {
                    type: 'fromto',
                    from: '',
                    to: ''
                }
            ],
            endLimit: [
                {
                    type: 'fromto',
                    from: '',
                    to: ''
                }
            ]
        }),
        computed: {
            startOption () {
                let startOption = this.deepCopy()
                startOption.placeholder = '开始时间'
                return startOption
            },
            endOption () {
                let endOption = this.deepCopy()
                endOption.placeholder = '结束时间'
                return endOption
            }
        },
        components: {
            'date-picker': myDatepicker
        },
        methods: {
            deepCopy () {
                let origin = {
                    type: 'min',
                    week: ['一', '二', '三', '四', '五', '六', '日'],
                    month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    format: 'YYYY-MM-DD HH:mm',
                    placeholder: '选择时间',
                    inputStyle: {
                        'display': 'inline-block',
                        'padding': '6px',
                        'line-height': '22px',
                        'font-size': '15px',
                        'border': '0',
                        'border-radius': '0',
                        'color': '#666',
                        'width': '85%'
                    },
                    color: {
                        checkedDay: '#e50000',
                        header: '#e50000',
                        headerText: 'white'
                    },
                    buttons: {
                        ok: '确定',
                        cancel: '取消'
                    },
                    overlayOpacity: 0.5, // 0.5 as default
                    dismissible: true // as true as default
                }
                return JSON.parse(JSON.stringify(origin))
            },
            setTime () {
                let self = this
                let timeType = this.timeType
                let duration = (Date.parse(self.endTime.time) - Date.parse(self.startTime.time)) / 60000
                if (duration < config.duration) {
                    self.errmsg = `结束时间必须大于开始时间至少${config.duration}分钟, 请重新设置`
                    self.toastDialog = true
                    return false
                }
                if (timeType) {
                    switch (timeType) {
                        case 'formal':
                            let testTimeLength = self.activity.testTime.length
                            if (testTimeLength >= 1) {
                                let lastTestTimeEnd = self.activity.testTime[testTimeLength - 1].end // 最后一个公测的结束时间
                                console.log('lastend', lastTestTimeEnd)
                                let formalDurationTest = (Date.parse(self.startTime.time) - Date.parse(lastTestTimeEnd))/60000
                                if (formalDurationTest < config.testSeconds) {
                                    self.errmsg = `正式的开始时间和最后一个公测的结束时间必须相差至少${config.testSeconds}分钟,请重新设置！`
                                    self.toastDialog = true
                                    return false
                                } else {
                                    self.activity.formalTime.start = self.startTime.time
                                    self.activity.formalTime.end = self.endTime.time
                                    self.dateTimeDialog = false
                                }
                            }
                            break;
                        case 'testUpdate':
                            if (self.testTimeIndex >= 1) {
                                let preTestTimeEnd = self.activity.testTime[self.testTimeIndex - 1].end // 上一个公测的结束时间
                                let start = Date.parse(self.startTime.time)
                                let preEnd = Date.parse(preTestTimeEnd)
                                let seconds = (start - preEnd) / 60000
                                if (seconds < config.testSeconds) {
                                    self.errmsg = `开始时间和上个公测的结束时间必须相差至少${config.testSeconds}分钟,请重新设置！`
                                    self.toastDialog = true
                                    return false
                                } else {
                                    self.activity.testTime[self.testTimeIndex].start = self.startTime.time
                                }
                            }
                            self.activity.testTime[self.testTimeIndex].start = self.startTime.time
                            self.activity.testTime[self.testTimeIndex].end = self.endTime.time
                            self.dateTimeDialog = false
                            break;
                        case 'testAdd':
                            let start = self.startTime.time
                            let end = self.endTime.time
                            if (start == '' || end == '') {
                                alert('请设置起始终时间和结束时间')
                            } else {
                                self.activity.testTime.push({
                                    start: start,
                                    end: end
                                })
                                self.dateTimeDialog = false
                            }
                            break;
                    }
                }
            },
            showTimeUpdateDialog (args, start, end, index) {
                switch (args) {
                    case 'formal':
                        this.timeType = 'formal'
                        this.dateTimeDialog = true
                        this.startTime.time = start
                        this.endTime.time = end
                        break;
                    case 'testUpdate':
                        this.timeType = 'testUpdate'
                        this.dateTimeDialog = true
                        this.startTime.time = start
                        this.endTime.time = end
                        this.testTimeIndex = index
                        break;
                    case 'testAdd':
                        this.timeType = 'testAdd'
                        this.dateTimeDialog = true
                        this.startTime.time = ''
                        this.endTime.time = ''
                        break;
                }
            },
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
                this.activity = args
                this.activityDialog = true
                window.sessionStorage.setItem('activity', JSON.stringify(args))
            },
            updateActivity () {
                this.submitUpdateDialog = true
            },
            closeUpdateDialog () {
                this.activityDialog = false
                this.queryValidActivity()
            },
            delTestTime () {
                let that = this
                this.activity.testTime.splice(this.delTestTimeIndex, 1)
                window.setTimeout(function () {
                    that.delTestTimeDialog = false
                }, 500)
            },
            showDelTestTimeDialog (index) {
                this.delTestTimeIndex = index
                this.delTestTimeDialog = true
            },
            submitUpdate () {
                let formData = {
                    token: window.sessionStorage.getItem('token'),
                    id: this.activity.id
                }
                let name = JSON.parse(window.sessionStorage.getItem('activity')).name
                let city = JSON.parse(window.sessionStorage.getItem('activity')).city
                let title = JSON.parse(window.sessionStorage.getItem('activity')).title
                let project = JSON.parse(window.sessionStorage.getItem('activity')).project
                let roomDesc = JSON.parse(window.sessionStorage.getItem('activity')).roomDesc
                let signDesc = JSON.parse(window.sessionStorage.getItem('activity')).signDesc
                let isLimited = JSON.parse(window.sessionStorage.getItem('activity')).isLimited
                let needSendSms = JSON.parse(window.sessionStorage.getItem('activity')).needSendSms
                let formalStart = JSON.parse(window.sessionStorage.getItem('activity')).formalTime.start
                let formalEnd = JSON.parse(window.sessionStorage.getItem('activity')).formalTime.end
                if (name !== this.activity.name) {
                    formData.name = this.activity.name
                }
                if (city !== this.activity.city) {
                    formData.city = this.activity.city
                }
                if (title !== this.activity.title) {
                    formData.title = this.activity.title
                }
                if (project !== this.activity.project) {
                    formData.project = this.activity.project
                }
                if (roomDesc !== this.activity.roomDesc) {
                    formData.roomDesc = this.activity.roomDesc
                }
                if (signDesc !== this.activity.signDesc) {
                    formData.signDesc = this.activity.signDesc
                }
                if (isLimited !== this.activity.isLimited) {
                    formData.isLimited = this.activity.isLimited
                }
                if (needSendSms !== this.activity.needSendSms) {
                    formData.needSendSms = this.activity.needSendSms
                }

                if (formalStart !== this.activity.formalTime.start || formalEnd !== this.activity.formalTime.end) {
                    let formalTime = {
                        start: this.activity.formalTime.start,
                        end: this.activity.formalTime.end
                    }
                    formData.formalTime = JSON.stringify(formalTime)
                }

                let testTime = this.sortTestTime(this.activity.testTime)
                formData.testTime = JSON.stringify(testTime)

                console.log(formData)
                let self = this
                const options = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    data: JSON.stringify(formData),
                    url: config.preHttp + 'updateActivity'
                }
                axios(options).then(response => {
                    let data = response.data
                    if (!data.errcode) {
                        self.submitUpdateDialog = false
                        self.activityDialog = false
                        self.errmsg = '修改成功'
                        self.toastDialog = true
                    } else {
                        self.errmsg = `${data.errmsg}`
                        self.toastDialog = true
                    }
                })
            },
            sortTestTime (testTimes) { // 测试时间排序
                return testTimes.sort(function (a, b) {
                    return Date.parse(a.start) - Date.parse(b.start)
                })
            },
            goToManageActivity (activityId, name) {
                let token = sessionStorage.getItem('token')
//                window.open(`http://localhost:8088/#/?activityId=${activityId}&name=${name}&token=${token}&type=w-admin`, '_blank')
                window.open(`/suAdmin/manage/#/?activityId=${activityId}&name=${name}&token=${token}&type=w-admin`, '_blank')
            }
        },
        mounted() {
            this.queryValidActivity()
            let tmp = new Date()
            let today = ''
            let self = this
            today = this.endTime.time = this.startTime.time = this.formatDate(tmp)
            tmp.setDate(tmp.getDate() - 1)
            this.startLimit[0].from = this.endLimit[0].from = this.formatDate(tmp)
        }
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
