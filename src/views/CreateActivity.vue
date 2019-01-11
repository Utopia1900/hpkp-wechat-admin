<template>
    <div>
        <h3 style="height: 40px; line-height: 40px; background-color: #fff;">创建活动</h3>
        <v-card>
            <div>
                <label for="name">1. 活动信息 <span style="color: red">&nbsp;&nbsp;必填*,&nbsp;注意：活动名称只能为字母或者数字的组合，例如 wkkp1、whld2</span></label>
                <div style="display: flex; flex-direction: row; margin-left: 5%; width: 90%">
                    <input type="text" id="name" v-model="name" placeholder="请填写活动名称" style="margin: 0 5px;">
                    <input type="text" id="title" v-model="title" placeholder="请填写活动标题" style="margin: 0 5px;">
                </div>
            </div>
            <div>
                <label for="name">2. 楼盘(或:车位)信息<span style="color: red">&nbsp;&nbsp;必填*</span> </label>
                <div style="display: flex; flex-direction: row; margin-left: 5%; width: 90%">
                    <input type="text" id="city" v-model="city" placeholder="请填写楼盘所在城市" style="margin: 0 5px;">
                    <input type="text" id="project" v-model="project" placeholder="请填写楼盘名称" style="margin: 0 5px;">
                </div>
            </div>
            <div>
                <label>3. 选择活动类型并设置列表的排列<span style="color: red">&nbsp;&nbsp;必选*</span></label>
            </div>
            <div style="margin-left: 5%">
                <v-flex xs4 sm2 d-flex style="margin-left: 30px;">
                    <v-select
                            :items="items"
                            label="① 选择活动类型"
                            v-model="type"
                    ></v-select>
                </v-flex>
                <div style="text-align: left;margin-left: 30px; " v-show="type!=''">
                    <div style="color:#1976d2 !important;">
                        ② 设置{{type=='房源' ? '房源':'车位'}}列表的排列
                    </div>
                    <div v-show="type!=''" style="display: flex; flex-direction: row;width: 90%">
                        <!--<v-radio-group v-model="bNo" :mandatory="false" row>-->
                        <!--<span>{{activityType=='房源' ? '楼栋' : '区域'}}:</span>-->
                        <!--<v-radio label="升序" value="1"></v-radio>-->
                        <!--<v-radio label="降序" value="0"></v-radio>-->
                        <!--</v-radio-group>-->
                        <v-flex xs2 sm3 d-flex>
                            <v-select
                                    :items="alignItems"
                                    :label="type=='房源' ? '楼栋' : '区域'"
                                    v-model="bNo"
                            ></v-select>
                        </v-flex>
                        <!--<v-radio-group v-model="uNo" :mandatory="false" row v-show="activityType == '房源'">-->
                        <!--<span>{{activityType=='房源' ? '单元' : ''}}:</span>-->
                        <!--<v-radio label="升序" value="1">1</v-radio>-->
                        <!--<v-radio label="降序" value="0">0</v-radio>-->
                        <!--</v-radio-group>-->
                        <v-flex xs2 sm3 d-flex v-if="type=='房源'">
                            <v-select
                                    :items="alignItems"
                                    :label="type=='房源' ? '单元' : ''"
                                    v-model="uNo"
                            ></v-select>
                        </v-flex>
                        <!--<v-radio-group v-model="floor" :mandatory="false" row>-->
                        <!--<span>{{activityType=='房源' ? '楼层' : '垂直排列'}}:</span>-->
                        <!--<v-radio label="升序" value="1"></v-radio>-->
                        <!--<v-radio label="降序" value="0"></v-radio>-->
                        <!--</v-radio-group>-->
                        <v-flex xs2 sm3 d-flex>
                            <v-select
                                    :items="alignItems"
                                    :label="type=='房源' ? '楼层' : '垂直排列'"
                                    v-model="floor"
                            ></v-select>
                        </v-flex>
                        <!--<v-radio-group v-model="horType" :mandatory="false" row>-->
                        <!--<span>水平排列:</span>-->
                        <!--<v-radio label="升序" value="1"></v-radio>-->
                        <!--<v-radio label="降序" value="0"></v-radio>-->
                        <!--</v-radio-group>-->
                        <v-flex xs2 sm3 d-flex>
                            <v-select
                                    :items="alignItems"
                                    label="水平排列"
                                    v-model="horType"
                            ></v-select>
                        </v-flex>


                    </div>
                </div>

            </div>
            <!--<div>-->
                <!--<label>4. 设置房源(或：车位)列表的排列<span style="color: red">&nbsp;&nbsp;必选*</span></label>-->
            <!--</div>-->

            <div>
                <label for="roomDesc">4. 房源(或:车位)描述<span style="color: green">&nbsp;&nbsp;非必填*</span></label>
                <textarea name="" id="roomDesc" v-model="roomDesc" cols="40" rows="5" placeholder="在这里填写..."></textarea>
            </div>
            <div>
                <label for="signDesc">5. 签约描述<span style="color: green">&nbsp;&nbsp;非必填*</span></label>
                <textarea name="" id="signDesc" v-model="signDesc" cols="40" rows="5" placeholder="在这里填写..."></textarea>
            </div>
            <div>
                <label>6. 是否限制一个账户只能购买一套房源(或：一个车位)</label>
            </div>
            <div style="margin-left: 5%">
                <v-switch
                        :label="isLimited ? '是': '否'"
                        v-model="isLimited"
                ></v-switch>
            </div>
            <div>
                <label>7. 是否需要发送短信</label>
            </div>
            <div style="margin-left: 5%">
                <v-switch
                        :label="needSendSms ? '是': '否'"
                        v-model="needSendSms"
                ></v-switch>
            </div>
            <div>
                <label>8. 是否需要签署协议</label>
            </div>
            <div style="margin-left: 5%">
                <v-switch
                        :label="needSign ? '是': '否'"
                        v-model="needSign"
                ></v-switch>
            </div>

            <label>9. 设置活动时间</label>
            <!--<h2>手风琴动画效果</h2>-->
            <div style="margin-left: 7%; text-align: left;margin-top: 15px;">
                <span style="display: inline-block;border-left: 4px solid #ff7000;padding-left: 5px;">公测时间：</span>
                <v-btn color="info" flat @click.native="addTestTime">点击新增</v-btn>
                <div v-show="showTest" style="margin-left: 0%;width:94%;border:1px solid #ccc; padding: 15px;"
                     v-for="(item, index) in testTime" :key="index">
                    开始：{{item.start}} &nbsp;&nbsp;结束：{{item.end}}
                </div>
            </div>
            <div style="margin-left: 7%; text-align: left;">

                <span style="display: inline-block;border-left: 4px solid #7fe27f;padding-left: 5px;">正式时间：</span>
                <v-btn color="info" flat @click.native="addFormal">点击创建</v-btn>
                <div v-show="showFormal" style="margin-left: 0%;width:94%;border:1px solid #ccc; padding: 15px;">
                    开始：{{formalTime.start}} &nbsp;&nbsp;结束：{{formalTime.end}}
                </div>
            </div>
            <div style="padding-top: 80px;">
                <v-btn color="primary" dark large @click="submitCreateActivity">确定</v-btn>
            </div>
        </v-card>
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
    </div>
</template>

<script>
    import config from '../utils/config'
    import axios from 'axios'
    import moment from 'moment'
    import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
    export default {
        name: "create-activity",
        data () {
            return {
                timeType: null,
                dateTimeDialog: false,
                showFormal: false,
                showTest: false,
                name: '',
                project: '',
                title: '',
                city: '',
                roomDesc: '',
                signDesc: '',
                isLimited: false,
                needSendSms: false,
                needSign: false,
                testTime: [],
                formalTime: {
                    start: '',
                    end: ''
                },
                toastDialog: false,
                errmsg: '提示',
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
                ],
                items: ['房源', '车位'],
                type: '',
                bNo: '',
                uNo: '',
                floor: '',
                horType: '',
                alignItems: ['升序', '降序']
            }
        },
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
            addTestTime () {
                this.timeType = 'test'
                this.dateTimeDialog = true
            },
            addFormal () {
                this.timeType = 'formal'
                this.dateTimeDialog = true
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
                let testTimeLength = self.testTime.length
                if (testTimeLength >= 1) {
                    let lastTestTimeEnd = self.testTime[testTimeLength - 1].end // 最后一个公测的结束时间
                    console.log('lastend', lastTestTimeEnd)
                    let formalDurationTest = (Date.parse(self.startTime.time) - Date.parse(lastTestTimeEnd)) / 60000
                    if (formalDurationTest < config.testSeconds) {
                        self.errmsg = `开始时间和上一个公测的结束时间必须相差至少${config.testSeconds}分钟,请重新设置！`
                        self.toastDialog = true
                        return false
                    }
                }
                if (timeType) {
                    switch (timeType) {
                        case 'formal':
                            self.formalTime.start = self.startTime.time
                            self.formalTime.end = self.endTime.time
                            self.showFormal = true
                            self.dateTimeDialog = false
                            break;
                        case 'test':
                            self.testTime.push({
                                start: self.startTime.time,
                                end: self.endTime.time
                            })
                            self.showTest = true
                            self.dateTimeDialog = false
                            break;
                    }
                }
            },
            submitCreateActivity () {
                if (this.name == '') {
                    this.toastDialog = true
                    this.errmsg = '请填写活动名称'
                } else if (this.city == '' || this.project == '' || this.title == '') {
                    this.toastDialog = true
                    this.errmsg = '请完整填写楼盘信息'
                } else if (this.type == '') {
                    this.toastDialog = true
                    this.errmsg = '请选择活动类型'
                }
                else {
                    if (this.type == '房源') {
                        if (this.bNo == '' || this.uNo == '' || this.floor == '' || this.horType == '') {
                            alert('请设置排列')
                        } else {
                            let align = {
                                bNo: this.bNo == '升序' ? 1 : 0,
                                uNo: this.uNo == '升序' ? 1 : 0,
                                floor: this.floor == '升序' ? 1 : 0,
                                horType: this.horType == '升序' ? 1 : 0
                            }
                            let formData = {
                                token: sessionStorage.getItem('token'),
                                name: this.name,
                                city: this.city,
                                project: this.project,
                                title: this.title,
                                isLimited: this.isLimited,
                                needSendSms: this.needSendSms,
                                needSign: this.needSign,
                                formalTime: JSON.stringify(this.formalTime),
                                testTime: JSON.stringify(this.testTime),
                                type: this.type == '房源' ? 0 : 1,
                                align: JSON.stringify(align)
                            }
                            if (this.roomDesc) {
                                formData.roomDesc = this.roomDesc
                            }
                            if (this.signDesc) {
                                formData.signDesc = this.signDesc
                            }
                            console.log(JSON.stringify(formData))
                            const options = {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                data: JSON.stringify(formData),
                                url: config.preHttp + 'createActivity'
                            }
                            let self = this
                            axios(options).then(response => {
                                let data = response.data
                                if (!data.errcode) {
                                    self.errmsg = '创建成功'
                                    self.toastDialog = true
                                    setTime(function () {
                                        self.toastDialog = false
                                        self.$router.push('/home/addOpeningMenu')
                                    }, 800)
                                } else {
                                    self.errmsg = `${data.errmsg}`
                                    self.toastDialog = true
                                }
                            }).catch(error => {
//              alert(error)
                            })

                        }
                    } else if (this.type=='车位') {
                        this.uNo = '升序'
                        if (this.bNo == '' || this.floor == '' || this.horType == '') {
                            alert('请设置排列')
                        } else {
                            let align = {
                                bNo: this.bNo == '升序' ? 1 : 0,
                                uNo: this.uNo == '升序' ? 1 : 0,
                                floor: this.floor == '升序' ? 1 : 0,
                                horType: this.horType == '升序' ? 1 : 0
                            }
                            let formData = {
                                token: sessionStorage.getItem('token'),
                                name: this.name,
                                city: this.city,
                                project: this.project,
                                title: this.title,
                                isLimited: this.isLimited,
                                needSendSms: this.needSendSms,
                                formalTime: JSON.stringify(this.formalTime),
                                testTime: JSON.stringify(this.testTime),
                                type: this.type == '房源' ? 0 : 1,
                                align: JSON.stringify(align)
                            }
                            if (this.roomDesc) {
                                formData.roomDesc = this.roomDesc
                            }
                            if (this.signDesc) {
                                formData.signDesc = this.signDesc
                            }
                            console.log(JSON.stringify(formData))
                            const options = {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json'
                                },
                                data: JSON.stringify(formData),
                                url: config.preHttp + 'createActivity'
                            }
                            let self = this
                            axios(options).then(response => {
                                let data = response.data
                                if (!data.errcode) {
                                    self.errmsg = '创建成功'
                                    self.toastDialog = true
                                    setTime(function () {
                                        self.toastDialog = false
                                        self.$router.push('/home/addOpeningMenu')
                                    }, 800)
                                } else {
                                    self.errmsg = `${data.errmsg}`
                                    self.toastDialog = true
                                }
                            }).catch(error => {
//              alert(error)
                            })

                        }
                    }

                }
            },
            formatDate(date) {
                let parseDate = Date.parse(date)
                let reqDate = (new Date(parseDate)).FormatDate('yyyy-MM-dd')
                return reqDate
            },
        },
        mounted () {
            let tmp = new Date()
            tmp.setDate(tmp.getDate() - 1)
            this.startLimit[0].from = this.endLimit[0].from = this.formatDate(tmp)
        },
        watch: {
            'type': function (newval, oldVal) {
                this.bNo = ''
                this.uNo = ''
                this.floor = ''
                this.horType = ''
            }
        }
    }
</script>

<style scoped>
    input[type='text'] {
        border: 1px solid #ccc;
        width: 90%;
        height: 40px;
        outline: none;
        display: inline-block;
        text-indent: 12px;
    }

    textarea {
        border: 1px solid #ccc;
        outline: none;
        resize: none;
        text-indent: 12px;
        width: 90%;
        display: inline-block;
    }

    label {
        width: 90%;
        margin-left: 5%;
        display: block;
        text-align: left;
        padding: 3px;
    }
</style>
<style>
    .statistic-div {
        width: 90%;
        height: auto;
        background-color: #e0e0e0;
        margin-left: 5%;
        padding: 10px 0;
    }

    .statistic-range {
        width: 90%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-items: center;
        background-color: white;
        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
        padding: 0 10px;
        margin: 0 auto;
    }
</style>
