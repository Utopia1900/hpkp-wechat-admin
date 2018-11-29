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
              <li>{{props.item.formalTime.start}}&nbsp;&nbsp;至&nbsp;&nbsp;{{props.item.formalTime.end}}</li>
            </ul>
          </td>
          <!--<td class="text-xs-center">-->
          <!--<ul v-for="(item, index) in props.item.testTime">-->
          <!--<li>开始：{{item.start}}</li>-->
          <!--<li>结束：{{item.end}}</li>-->
          <!--</ul>-->
          <!--</td>-->
          <td class="text-xs-center">
            <v-btn color="error" @click="showActivity(props.item)">查看&nbsp;|&nbsp;修改</v-btn>
            <v-btn color="info" @click="addOpeningMenu(props.item.id)">添加开盘菜单</v-btn>
            <v-btn color="success" @click="queryCheckUrl(props.item.id)">获取开盘菜单URL</v-btn>
            <v-btn color="warning" @click="goToManageActivity(props.item.id, props.item.name)">管理页面入口</v-btn>
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
                                                                                       ref="name"></v-list-tile>
          <v-list-tile><span style="width: 150px;text-align: left">活动标题: </span><input type="text"
                                                                                       v-model="activity.title"
                                                                                       ref="title"></v-list-tile>
          <v-list-tile><span style="width: 150px;text-align: left">楼盘所在城市: </span><input type="text"
                                                                                         v-model="activity.city"
                                                                                         ref="city"></v-list-tile>
          <v-list-tile><span style="width: 150px;text-align: left">楼盘名称: </span><input type="text"
                                                                                       v-model="activity.project"
                                                                                       ref="project"></v-list-tile>
          <v-list-tile style="height: 100px;margin-top:20px;"><span style="width: 150px;text-align: left">房源描述: </span>
            <textarea name="" ref="roomDesc" v-model="activity.roomDesc" cols="30" rows="3"
                      placeholder="在这里填写..."></textarea>
          </v-list-tile>

          <v-list-tile style="height: 150px;margin-top:45px;"><span style="width: 150px;text-align: left">签约描述: </span>
            <textarea name="" ref="signDesc" v-model="activity.signDesc" cols="36" rows="8"
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
          <v-list-tile><span style="width: 120px;text-align: left">正式时间: </span>
            <ul>
              <li>
                {{activity.formalTime.start}} 至
                {{activity.formalTime.end}}
              </li>
            </ul>
          </v-list-tile>
        </v-list>
        <v-list>
          <v-list-tile><span style="width: 120px;text-align: left">公测时间: </span>
            <ul v-for="(item, index) in activity.testTime" :key="index">
              <li>{{item.start}} 至 {{item.end}}</li>
            </ul>
          </v-list-tile>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click.native="activityDialog = false">关闭</v-btn>
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
      errmsg: '错误提示',
      headers: [
        {text: '活动名称', align: 'center', value: 'name', sortable: false},
        {text: '楼盘名称', align: 'center', value: 'createTime', sortable: false},
        {text: '是否限购', align: 'center', value: 'isLimited', sortable: false},
        {text: '活动正式时间', align: 'center', value: 'formalTime', sortable: false},
//        {text: '测试时间', align: 'center', value: 'testTime', sortable: false},
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
      toastDialog: false
    }),
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
        this.activity = args
        this.activityDialog = true
        window.sessionStorage.setItem('activity', JSON.stringify(args))
      },
      updateActivity () {
        this.submitUpdateDialog = true
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
      goToManageActivity (activityId, name) {
        let token = sessionStorage.getItem('token')
        window.open(`http://localhost:8088/#/?activityId=${activityId}&name=${name}&token=${token}`, '_blank')
      }
    },
    mounted() {
      this.queryValidActivity()
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
    width: 800px;
    display: inline-block;
  }
</style>
