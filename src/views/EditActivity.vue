<template>
  <div>
    <v-card style="padding-left: 40px">
      <h2
        style="padding: 30px;text-align:left;border-bottom:1px solid #eeeeee;padd"
      >查看&nbsp;|&nbsp;修改 &nbsp;活动信息</h2>
      <div style="display:flex;flex-direction:row;max-width:1360px;">
        <div
          style="flex:1;margin:20px 0 20px 0; padding-right: 50px;border-right: 1px solid #eeeeee;"
        >
          <v-list>
            <v-list-tile>
              <span class="label">活动名称:</span>
              <input type="text" v-model="activity.name" ref="name" />
            </v-list-tile>
            <v-list-tile>
              <span class="label">活动标题:</span>
              <input type="text" v-model="activity.title" ref="title" />
            </v-list-tile>
            <v-list-tile>
              <span class="label">活动类型:</span>
              <v-flex xs6 sm4 d-flex>
                <v-select :items="typeItems" label="选择活动类型" v-model="activityType"></v-select>
              </v-flex>
            </v-list-tile>
            <v-list-tile v-if="activity.align != null ">
              <span class="label" style>设置{{activityType=='房源' ? '房源':'车位'}}列表的排列:</span>
              <div style="display: flex; flex-direction: row;width:400px;">
                <v-flex xs2 sm3 d-flex>
                  <v-select
                    :items="alignItems"
                    :label="activityType=='房源' ? '楼栋' : '区域'"
                    v-model="bNo"
                  ></v-select>
                </v-flex>
                <v-flex xs2 sm3 d-flex v-if="activityType == '房源'">
                  <v-select
                    :items="alignItems"
                    :label="activityType=='房源' ? '单元' : ''"
                    v-model="uNo"
                  ></v-select>
                </v-flex>
                <v-flex xs2 sm3 d-flex>
                  <v-select
                    :items="alignItems"
                    :label="activityType=='房源' ? '楼层' : '垂直排列'"
                    v-model="floor"
                  ></v-select>
                </v-flex>
                <v-flex xs2 sm3 d-flex>
                  <v-select :items="alignItems" label="水平排列" v-model="horType"></v-select>
                </v-flex>
              </div>
            </v-list-tile>
            <v-list-tile v-else>
              <span style="width: 180px;text-align: left">设置{{activityType=='房源' ? '房源':'车位'}}列表的排列:</span>
              <div style="display: flex; flex-direction: row;width: 75%">
                <v-flex xs2 sm3 d-flex>
                  <v-select
                    :items="alignItems"
                    :label="activityType=='房源' ? '楼栋' : '区域'"
                    v-model="default_bNo"
                  ></v-select>
                </v-flex>
                <v-flex xs2 sm3 d-flex v-if="activityType == '房源'">
                  <v-select
                    :items="alignItems"
                    :label="activityType=='房源' ? '单元' : ''"
                    v-model="default_uNo"
                  ></v-select>
                </v-flex>
                <v-flex xs2 sm3 d-flex>
                  <v-select
                    :items="alignItems"
                    :label="activityType=='房源' ? '楼层' : '垂直排列'"
                    v-model="default_floor"
                  ></v-select>
                </v-flex>
                <v-flex xs2 sm3 d-flex>
                  <v-select :items="alignItems" label="水平排列" v-model="default_horType"></v-select>
                </v-flex>
              </div>
            </v-list-tile>

            <v-list-tile>
              <span class="label">楼盘所在城市:</span>
              <input type="text" v-model="activity.city" ref="city" />
            </v-list-tile>
            <v-list-tile>
              <span class="label">楼盘名称:</span>
              <input type="text" v-model="activity.project" ref="project" />
            </v-list-tile>
            <v-list-tile style="height: 100px;margin-top:20px;">
              <span class="label">房源描述:</span>
              <textarea
                name
                ref="roomDesc"
                v-model="activity.roomDesc"
                cols="30"
                rows="3"
                placeholder="在这里填写..."
              ></textarea>
            </v-list-tile>

            <v-list-tile style="height: 150px;margin-top:25px;">
              <span class="label">签约描述:</span>
              <textarea
                name
                ref="signDesc"
                v-model="activity.signDesc"
                cols="36"
                rows="6"
                placeholder="在这里填写..."
              ></textarea>
            </v-list-tile>
            <v-list-tile>
              <span class="label">价格名称:</span>
              <div style="display:flex;flex-direction:row; width:540px; padding: 5px;flex-wrap: wrap;">
                 <div v-for="(item, index) in priceNameArr" :key="index">
                   <div style="font-size:13px;">
                     {{item.key}}: 
                     <input type="text" style="width:90px;font-size:12px;margin:10px" v-model="item.value" placeholder="这里填写..."/></div>
                   <!-- <div>{{item}}</div> -->
                   <!-- <input type="text" style="width:120px;font-size:12px;margin:10px" v-model="item.value"/> -->
                   <!-- <v-btn color="#ff7000" flat @click="editPriceName(value,)">修改</v-btn> -->
                   </div>  
              </div>
            </v-list-tile>
          </v-list>
        </div>
        <div style="flex:1;margin:20px autpriceNameo;margin-left:45px">
          <v-list>
            <v-list-tile>
              <span class="label">创建时间:</span>
              <ul>
                <li>{{ formatDate(activity.createdAt) }}</li>
              </ul>
            </v-list-tile>
            <v-list-tile>
              <span class="label">
                是否限制一个账户
                <br />只能购买一套房源:
              </span>
              <v-switch :label="activity.isLimited ? '是': '否'" v-model="activity.isLimited"></v-switch>
            </v-list-tile>
            <v-list-tile>
              <span class="label">是否需要发送短信:</span>
              <v-switch :label="activity.needSendSms ? '是': '否'" v-model="activity.needSendSms"></v-switch>
            </v-list-tile>
            <v-list-tile v-if="activity.needSign != null">
              <span class="label">是否需要签署协议:</span>
              <v-switch :label="activity.needSign ? '是': '否'" v-model="activity.needSign"></v-switch>
            </v-list-tile>
            <v-list-tile v-else>
              <span class="label">是否需要签署协议:</span>
              <v-switch :label="needSign ? '是': '否'" v-model="needSign"></v-switch>
            </v-list-tile>
          </v-list>
          <v-list style="margin-top: 0px;">
            <v-list-tile>
              <span class="label">公测时间:</span>
              <v-btn color="#ff7000" flat @click="showTimeUpdateDialog('testAdd')">新增公测时间</v-btn>
            </v-list-tile>
          </v-list>
          <v-list
            style="margin-top: 0px;border: 1px solid #ff7000;"
            v-for="(item, index) in activity.testTime"
            :key="index"
          >
            <v-list-tile>
              <span style="color:#ff7000;">{{index + 1}}.&nbsp;&nbsp;&nbsp;</span>
              <span
                style="display: inline-block;width: 100%;text-align: left;"
              >{{item.start}} 至 {{item.end}}</span>
            </v-list-tile>
            <v-list-tile>
              <v-btn
                color="success"
                @click="showTimeUpdateDialog('testUpdate', item.start, item.end, index)"
              >修改</v-btn>
              <v-btn color="warning" @click="showDelTestTimeDialog(index)">删除</v-btn>
            </v-list-tile>
          </v-list>
          <v-list>
            <v-list-tile>
              <span class="label">正式时间:</span>
            </v-list-tile>
          </v-list>
          <v-list style="border: 1px solid #7fe27f;">
            <v-list-tile>
              <span
                style="width: 100%;text-align: left"
              >{{activity.formalTime.start}} 至 {{activity.formalTime.end}}</span>
            </v-list-tile>
            <v-list-tile>
              <v-btn
                color="success"
                @click="showTimeUpdateDialog('formal', activity.formalTime.start, activity.formalTime.end)"
              >修改</v-btn>
            </v-list-tile>
          </v-list>
        </div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click.native="closeUpdateDialog">取消</v-btn>
        <v-btn color="primary" @click="updateActivity">提交修改</v-btn>
      </v-card-actions>
    </v-card>
    <!--</v-dialog>-->
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

    <v-dialog
      v-model="dateTimeDialog"
      persistent
      max-width="600px"
      style="background: #fff;max-height: 700px"
    >
      <v-card style="padding-top: 30px;background: #fff;color: #000; height: 500px;">
        设置开始和结束时间
        <v-card-title style="height: 200px;margin: 20px auto;">
          <div style="display: flex;flex-direction: column;width: 100%;">
            <div style="margin-bottom: 8px;">
              开始：
              <date-picker
                :date="startTime"
                :option="startOption"
                :limit="startLimit"
                style="border: 1px solid #ccc;"
              ></date-picker>
            </div>
            <div>
              结束：
              <date-picker
                :date="endTime"
                :option="endOption"
                :limit="endLimit"
                style="border: 1px solid #ccc;"
              ></date-picker>
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
import config from "../utils/config";
import "../utils/formatDate";
import transformPriceName from '../utils/transformPriceName.js'
import myDatepicker from "vue-datepicker/vue-datepicker-es6.vue";
import axios from "axios";

export default {
  name: "edit-activity",
  data: () => ({
    //            dialog: false,
    //            valid: true,
    //            alert: false,
    priceValue:'',
    needSign: false,
    dateTimeDialog: false,
    delTestTimeDialog: false,
    delTestTimeIndex: null,
    timeType: null,
    id: null, // 活动ID
    url: null,
    items: [1, 2, 3],
    activityId: null,
    activityDialog: false,
    activity: null,
    submitUpdateDialog: false,
    errmsg: "提示",
    toastDialog: false,
    testTimeIndex: null,
    startTime: {
      time: ""
    },
    endTime: {
      time: ""
    },
    startLimit: [
      {
        type: "fromto",
        from: "",
        to: ""
      }
    ],
    endLimit: [
      {
        type: "fromto",
        from: "",
        to: ""
      }
    ],
    typeItems: ["房源", "车位"],
    alignItems: ["升序", "降序"],
    default_bNo: "升序",
    default_uNo: "升序",
    default_floor: "升序",
    default_horType: "升序",
    //            activityType: '房源'
  }),
  computed: {
    startOption() {
      let startOption = this.deepCopy();
      startOption.placeholder = "开始时间";
      return startOption;
    },
    endOption() {
      let endOption = this.deepCopy();
      endOption.placeholder = "结束时间";
      return endOption;
    },
    activityType: {
      get() {
        return this.activity.type == "0" ? "房源" : "车位";
      },
      set(val) {
        if (val == "房源") {
          this.activity.type = 0;
        }
        if (val == "车位") {
          this.activity.type = 1;
        }
      }
    },
    bNo: {
      get() {
        if (this.activity.align) {
          return this.activity.align.bNo == 1 ? "升序" : "降序";
        } else {
          return "升序";
        }
      },
      set(val) {
        this.activity.align.bNo = val == "升序" ? 1 : 0;
      }
    },
    uNo: {
      get() {
        if (this.activity.align) {
          return this.activity.align.uNo == 1 ? "升序" : "降序";
        } else {
          return "升序";
        }
      },
      set(val) {
        this.activity.align.uNo = val == "升序" ? 1 : 0;
      }
    },
    floor: {
      get() {
        if (this.activity.align) {
          return this.activity.align.floor == 1 ? "升序" : "降序";
        } else {
          return "升序";
        }
      },
      set(val) {
        this.activity.align.floor = val == "升序" ? 1 : 0;
      }
    },
    horType: {
      get() {
        if (this.activity.align) {
          return this.activity.align.horType == 1 ? "升序" : "降序";
        } else {
          return "升序";
        }
      },
      set(val) {
        this.activity.align.horType = val == "升序" ? 1 : 0;
      }
    },
    priceNameArr(){
      let result = []
      let priceName = this.activity.priceName
      Object.keys(priceName).map(key => {
        result.push({key:key,value:priceName[key]})
      })
      return result
    }
  },
  components: {
    "date-picker": myDatepicker
  },
  methods: {
    deepCopy() {
      let origin = {
        type: "min",
        week: ["一", "二", "三", "四", "五", "六", "日"],
        month: [
          "一月",
          "二月",
          "三月",
          "四月",
          "五月",
          "六月",
          "七月",
          "八月",
          "九月",
          "十月",
          "十一月",
          "十二月"
        ],
        format: "YYYY-MM-DD HH:mm",
        placeholder: "选择时间",
        inputStyle: {
          display: "inline-block",
          padding: "6px",
          "line-height": "22px",
          "font-size": "15px",
          border: "0",
          "border-radius": "0",
          color: "#666",
          width: "85%"
        },
        color: {
          checkedDay: "#e50000",
          header: "#e50000",
          headerText: "white"
        },
        buttons: {
          ok: "确定",
          cancel: "取消"
        },
        overlayOpacity: 0.5, // 0.5 as default
        dismissible: true // as true as default
      };
      return JSON.parse(JSON.stringify(origin));
    },
    setTime() {
      let self = this;
      let timeType = this.timeType;
      let duration =
        (Date.parse(self.endTime.time) - Date.parse(self.startTime.time)) /
        60000;
      if (duration < config.duration) {
        self.errmsg = `结束时间必须大于开始时间至少${config.duration}分钟, 请重新设置`;
        self.toastDialog = true;
        return false;
      }
      if (timeType) {
        switch (timeType) {
          case "formal":
            let testTimeLength = self.activity.testTime.length;
            if (testTimeLength >= 1) {
              let lastTestTimeEnd =
                self.activity.testTime[testTimeLength - 1].end; // 最后一个公测的结束时间
              console.log("lastend", lastTestTimeEnd);
              let formalDurationTest =
                (Date.parse(self.startTime.time) -
                  Date.parse(lastTestTimeEnd)) /
                60000;
              if (formalDurationTest < config.testSeconds) {
                self.errmsg = `正式的开始时间和最后一个公测的结束时间必须相差至少${config.testSeconds}分钟,请重新设置！`;
                self.toastDialog = true;
                return false;
              } else {
                self.activity.formalTime.start = self.startTime.time;
                self.activity.formalTime.end = self.endTime.time;
                self.dateTimeDialog = false;
              }
            }
            break;
          case "testUpdate":
            if (self.testTimeIndex >= 1) {
              let preTestTimeEnd =
                self.activity.testTime[self.testTimeIndex - 1].end; // 上一个公测的结束时间
              let start = Date.parse(self.startTime.time);
              let preEnd = Date.parse(preTestTimeEnd);
              let seconds = (start - preEnd) / 60000;
              if (seconds < config.testSeconds) {
                self.errmsg = `开始时间和上个公测的结束时间必须相差至少${config.testSeconds}分钟,请重新设置！`;
                self.toastDialog = true;
                return false;
              } else {
                self.activity.testTime[self.testTimeIndex].start =
                  self.startTime.time;
              }
            }
            self.activity.testTime[self.testTimeIndex].start =
              self.startTime.time;
            self.activity.testTime[self.testTimeIndex].end = self.endTime.time;
            self.dateTimeDialog = false;
            break;
          case "testAdd":
            let start = self.startTime.time;
            let end = self.endTime.time;
            if (start == "" || end == "") {
              alert("请设置起始终时间和结束时间");
            } else {
              self.activity.testTime.push({
                start: start,
                end: end
              });
              self.dateTimeDialog = false;
            }
            break;
        }
      }
    },
    showTimeUpdateDialog(args, start, end, index) {
      switch (args) {
        case "formal":
          this.timeType = "formal";
          this.dateTimeDialog = true;
          this.startTime.time = start;
          this.endTime.time = end;
          break;
        case "testUpdate":
          this.timeType = "testUpdate";
          this.dateTimeDialog = true;
          this.startTime.time = start;
          this.endTime.time = end;
          this.testTimeIndex = index;
          break;
        case "testAdd":
          this.timeType = "testAdd";
          this.dateTimeDialog = true;
          this.startTime.time = "";
          this.endTime.time = "";
          break;
      }
    },
    formatDate(date) {
      let parseDate = Date.parse(date);
      let reqDate = new Date(parseDate).FormatDate("yyyy-MM-dd");
      return reqDate;
    },
    updateActivity() {
      this.submitUpdateDialog = true;
    },
    closeUpdateDialog() {
      //                this.activityDialog = false
      //                this.queryValidActivity()
      this.$router.go(-1);
    },
    delTestTime() {
      let that = this;
      this.activity.testTime.splice(this.delTestTimeIndex, 1);
      window.setTimeout(function() {
        that.delTestTimeDialog = false;
      }, 500);
    },
    showDelTestTimeDialog(index) {
      this.delTestTimeIndex = index;
      this.delTestTimeDialog = true;
    },
    submitUpdate() {
      let formData = {
        token: window.sessionStorage.getItem("token"),
        id: this.activity.id
      };
      let {
        name,
        city,
        title,
        project,
        roomDesc,
        signDesc,
        isLimited,
        needSendSms,
        formalStart,
        formalEnd,
        type
      } = JSON.parse(window.sessionStorage.getItem("activity"));
      if (name !== this.activity.name) {
        formData.name = this.activity.name;
      }
      if (city !== this.activity.city) {
        formData.city = this.activity.city;
      }
      if (title !== this.activity.title) {
        formData.title = this.activity.title;
      }
      if (project !== this.activity.project) {
        formData.project = this.activity.project;
      }
      if (roomDesc !== this.activity.roomDesc) {
        formData.roomDesc = this.activity.roomDesc;
      }
      if (signDesc !== this.activity.signDesc) {
        formData.signDesc = this.activity.signDesc;
      }
      if (isLimited !== this.activity.isLimited) {
        formData.isLimited = this.activity.isLimited;
      }
      if (needSendSms !== this.activity.needSendSms) {
        formData.needSendSms = this.activity.needSendSms;
      }
      if (type !== this.activity.type) {
        formData.type = this.activity.type;
      }
      if (
        formalStart !== this.activity.formalTime.start ||
        formalEnd !== this.activity.formalTime.end
      ) {
        let formalTime = {
          start: this.activity.formalTime.start,
          end: this.activity.formalTime.end
        };
        formData.formalTime = JSON.stringify(formalTime);
      }

      let testTime = this.sortTestTime(this.activity.testTime);
      formData.testTime = JSON.stringify(testTime);
      if (this.activity.align != null) {
        formData.align = {
          bNo: this.activity.align.bNo,
          uNo: this.activity.align.uNo,
          floor: this.activity.align.floor,
          horType: this.activity.align.horType
        };
      } else {
        formData.align = {
          bNo: this.default_bNo == "升序" ? 1 : 0,
          uNo: this.default_uNo == "升序" ? 1 : 0,
          floor: this.default_floor == "升序" ? 1 : 0,
          horType: this.default_horType == "升序" ? 1 : 0
        };
      }

      if (this.activity.needSign != null) {
        formData.needSign = this.activity.needSign;
      } else {
        formData.needSign = this.needSign;
      }

      formData.priceName = transformPriceName(this.priceNameArr) 

      console.log(formData);
      let self = this;
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify(formData),
        url: config.preHttp + "updateActivity"
      };
      axios(options).then(response => {
        let data = response.data;
        if (!data.errcode) {
          self.submitUpdateDialog = false;
          self.activityDialog = false;
          self.errmsg = "修改成功";
          self.toastDialog = true;
          setTimeout(function() {
            self.toastDialog = false;
            self.$router.go(-1);
          }, 800);
        } else {
          self.errmsg = `${data.errmsg}`;
          self.toastDialog = true;
        }
      });
    },
    sortTestTime(testTimes) {
      // 测试时间排序
      return testTimes.sort(function(a, b) {
        return Date.parse(a.start) - Date.parse(b.start);
      });
    },
    formatType(args) {
      switch (args) {
        case 0:
          this.activity.type = "房源";
          break;
        case 1:
          this.activity.type = "车位";
          break;
      }
    },
    editPriceName(arg) {
      console.log(arg)
    }
  },
  created() {
    this.activity = JSON.parse(window.sessionStorage.getItem("activity"));
    let tmp = new Date();
    let today = "";
    let self = this;
    today = this.endTime.time = this.startTime.time = this.formatDate(tmp);
    tmp.setDate(tmp.getDate() - 1);
    this.startLimit[0].from = this.endLimit[0].from = this.formatDate(tmp);
  },
  watch: {
    "activity.type": function(newVal, oldVal) {
      if (oldVal != undefined) {
        this.default_bNo = "升序";
        this.default_uNo = "升序";
        this.default_floor = "升序";
        this.default_horType = "升序";
      }
    }
  }
};
</script>

<style scoped>
.v-select__slot {
  width: 120px;
}
.label {
  width: 160px;
  text-align: left;
  font-size: 14px;
  color: #999;
  font-weight: 400;
}
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
