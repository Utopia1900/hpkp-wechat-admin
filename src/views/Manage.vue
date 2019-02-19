<template>
    <div>
        <title>{{activityTitle}}</title>
        <div>
            <h2>{{activityTitle}}</h2>
            <h2 style="text-align: center; padding: 8px;">{{activityType=='0'? '房源':'车位'}}列表</h2>
            <div style="height: 35px;line-height: 35px;text-align: left; padding-left: 15px; ">
        <span
                style="display: inline-block; height: 20px;line-height:20px; width: 20px;background-color: #e50000;color: #e50000"
        >1</span>
                已选 &nbsp;
                <span
                        style="display: inline-block; height: 18px;width: 18px;line-height:18px;border: 1px solid #ccc; background-color: #ffffff; color:#ffffff"
                >1</span>
                未选
            </div>
            <div style="width: 100%; z-index: 999;background-color: #fff;">
                <div
                        style="display: flex; flex-direction: row;border: 1px solid #ddd;"
                        v-if="activityType=='0'"
                >
                    <div v-for="(item, index) in formatbuidlingInfo" :key="index">
                        <div
                                style="flex: 1; height: 45px;width:80px; line-height: 45px;"
                                :class="{activebuilding: activeBuidlingIndex === index}"
                                @click="choosebuilding(index)"
                        >{{item.building}}栋</div>
                    </div>
                </div>
                <div
                        style="display: flex; flex-direction: row;border: 1px solid #ddd;"
                        v-else-if="activityType=='1'"
                >
                    <div v-for="(item, index) in formatbuidlingInfo" :key="index">
                        <div
                                style="flex: 1; height: 45px;width:80px; line-height: 45px;"
                                :class="{activebuilding: activeBuidlingIndex === index}"
                                @click="choosebuilding(index)"
                        >{{item.building}}区</div>
                    </div>
                </div>
                <div
                        style="display: flex; flex-direction: row;border: 1px solid #ddd;border-top:none;"
                        v-if="activityType=='0'"
                >
                    <div v-for="(item, index) in formatbuidlingInfo" :key="index" v-show="item.unit">
            <span
                    v-show="activeBuidlingIndex === index"
                    v-for="(list, key) in item.unit"
                    style="display: inline-block; height: 35px;width:50px;line-height: 35px;margin: 10px;"
                    :class="{activeUnit: activeUNoIndex === key}"
                    @click="handleChooseUnit(key)"
                    :key="key"
            >{{list}}单元</span>
                    </div>
                </div>
            </div>
            <div class="content" style="width: 30%; margin-bottom: 75px;">
                <div
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        style="margin-top: 10px;margin-bottom: 20px;display: flex;"
                >
                    <ul
                            v-for="(item, index) in roomLists"
                            style="padding: 0; flex:1; display: flex; flex-direction: column"
                            :key="index"
                    >
                        <li
                                style="
              display:inline-block;
              border: 1px solid #ccc;
              width: 100%;
              height: 45px;
              line-height: 45px;
              background-color: #fff;
              "
                                v-for="(room, rindex) in item"
                                :key="rindex"
                        >
              <span v-if="room != null">
              <span
                      :class="{activeRoom: room.status === 2}"
                      style="display: inline-block; width: 100%;height: 100%"
              >{{room.rNo}}</span>
                  </span>
                            <span v-else>
<span style="background-color: #e9ecef;display: inline-block;width: 100%;height: 100%;">

              </span>
                </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="room-page-footer">
                <v-btn color="green darken-1" style="color: #fff;" @click="queryGuest">客户管理</v-btn>
            </div>
        </div>

        <v-dialog v-model="updatePsdDialog" max-width="300px">
            <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">确定为选定的客户执行【重置密码】吗？
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="updatePsdDialog = false">取消</v-btn>
                    <v-btn color="info" flat @click="resetPwd">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="allowLoginDialog"  max-width="300px">
            <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">确定将选定的客户设置为【允许登录】吗？
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="allowLoginDialog = false">取消</v-btn>
                    <v-btn color="info" flat @click="setLoginStatus(true)">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="notAllowLoginDialog"  max-width="300px">
            <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">确定将选定的客户设置为【禁止登录】吗？
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="notAllowLoginDialog = false">取消</v-btn>
                    <v-btn color="info" flat @click="setLoginStatus(false)">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="guestDialog"  persistent scrollable max-width="600px">
            <!--<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>-->
            <v-card>
                <v-card-title>
                    <h3 style="text-align: center">{{guestDialogTitle}}</h3>
                </v-card-title>
                <!-- <v-text-field style="width: 460px;margin-left: 20px;" label="输入客户姓名快捷检索" v-model="search"></v-text-field> -->
                <div style="display:flex; padding-left:20px;">
                    <v-text-field v-model="name" label="输入客户姓名" style="padding-right:8px;"></v-text-field>
                    <v-text-field v-model="mobile" label="输入手机号" style></v-text-field>
                    <v-btn color="green darken-1" style="color: #fff;" @click.native="searchGuest">查询客户</v-btn>
                </div>

                <v-card-text style="height: 400px;padding: 0">
                    <v-list v-show="guestList.length !=0">
                        <v-list-tile style="color:#858585;border-bottom:1px solid #858585">
                            <span style="width: 10%; display: inline-block;text-align: center; height: 24px;" :class="{guestDefault: !isActive, guestSelected: isActive}" @click="allChoose()"></span>
                            <span style="width: 20%; display: inline-block;text-align: left">账号</span>
                            <span style="width: 20%; display: inline-block;text-align: left">客户姓名</span>
                            <span style="width: 30%; display: inline-block;">手机号</span>
                            <span style="width: 20%; display: inline-block;">状态</span>
                        </v-list-tile>
                    </v-list>
                    <v-list v-for="(item, index) in guestList" style="padding: 0" :key="index">
                        <v-list-tile
                                style="width: 100%; border-bottom: 1px solid #ccc;height: 40px;"
                        >
              <span style="width: 10%; display: inline-block;text-align: center; height: 24px;"
                    @click="chooseGuest(item.id, $event, index)"
                    :class="{guestDefault: !isActive, guestSelected: isActive}"
              ></span>
                            <span style="width: 20%; display: inline-block;text-align: left">{{item.account}}</span>
                            <span style="width: 20%; display: inline-block;text-align: left">{{item.name}}</span>
                            <span style="width: 30%;display: inline-block">{{item.mobile}}</span>
                            <span style="width: 20%;display: inline-block" :style="{color:item.disabled?'#E53935': '#512DA8'}">{{formatStatus(item.disabled)}}</span>
                        </v-list-tile>
                    </v-list>
                    <h4 v-show="hasGuest" style="color: #888;height: 300px; line-height: 300px;">未检索到符合条件的信息</h4>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="red darken-1" flat @click="closeGuestDialog">取消</v-btn>
                    <div>
                        <v-btn
                                color="green darken-1"
                                style="color:#fff;"
                                @click="updatePsdDialog = true"
                                :disabled="clickedGuestIds.length == 0"
                        > 重置密码</v-btn>
                        <v-btn
                                color="deep-purple darken-2"
                                style="color:#fff;"
                                @click="allowLoginDialog = true"
                                :disabled="clickedGuestIds.length == 0"
                        > 设置为允许登录</v-btn>
                        <v-btn
                                color="red darken-1"
                                style="color:#fff;"
                                @click="notAllowLoginDialog = true"
                                :disabled="clickedGuestIds.length == 0"
                        > 设置为禁止登录</v-btn>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="errorDialog"  max-width="300px">
            <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
                {{errmsg}}
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" flat @click.native="errorDialog = false">关闭</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import config from "../utils/config";
    import axios from "axios";
    import API from "../api";

    export default {
        data() {
            return {
                msg: "Rooms",
                buidlingInfo: {},
                activeBuidlingIndex: 0,
                activeUNoIndex: 0,
                roomLists: [[]],
                selectedBuidling: null,
                selectedUNo: null,
                selectedUNoIndex: null,
                clickedRoomId: null,
                clickedGuestIds: [],
                guestDialog: false,
                guestList: [],
                errorDialog: false,
                errmsg: "",
                timer: null,
                getBuildingsInterval: null,
                search: "",
                roomInfoDialog: false,
                clickedRoomInfo: {},
                guestDialogTitle: "",
                name: null,
                mobile: null,
                hasGuest: false,
                isActive: false,
                updatePsdDialog:false,
                allowLoginDialog: false,
                notAllowLoginDialog: false,
                gIndexs: []
            };
        },
        computed: {
            formatbuidlingInfo: function() {
                let buidlingInfo = this.buidlingInfo;
                let tmp = [];
                for (var key in buidlingInfo) {
                    if (buidlingInfo[key].uNo) {
                        tmp.push({
                            building: buidlingInfo[key].bNo,
                            unit: buidlingInfo[key].uNo
                        });
                    } else {
                        tmp.push({
                            building: buidlingInfo[key].bNo
                        });
                    }
                }
                return tmp;
            },
            btnDisable: function() {
                return this.clickedRoomId == null ? true : false;
            },
            guestSearchFilter() {
                let self = this;
                return this.guestList.filter(args => {
                    return args.name.indexOf(self.search) >= 0;
                });
            },
            activityType: function() {
                let activityType = window.sessionStorage.getItem("activityType");
                if (activityType) {
                    return activityType;
                } else {
                    return this.$store.state.activityType;
                }
            },
            activityTitle: function () {
                let activityTitle = window.sessionStorage.getItem("activityTitle");
                return activityTitle;
            }
        },
        methods: {
            getBuildings() {
                let self = this;
                let token = window.sessionStorage.getItem("activityToken");
                if (token) {
                    API.getBuildings(token, data => {
                        if (!data.errcode) {
                            self.buidlingInfo = data;
                            self.choosebuilding(0);
                        } else {
                            self.$store.commit("hideCover");
                            self.errmsg = `${data.errmsg}`;
                            self.errorDialog = true;
                        }
                    });
                }
            },
            choosebuilding(index) {
                let activityType = this.activityType;
                switch (activityType) {
                    case "0":
                        this.clickedRoomId = null; // 清除已选中房源
                        this.activeBuidlingIndex = index;
                        this.activeUNoIndex = 0;
                        this.selectedBuidling = this.formatbuidlingInfo[index].building;
                        this.chooseUnit(0);
                        this.selectedUNoIndex = 0;
                        break;
                    case "1":
                        this.clickedRoomId = null; // 清除已选中房源
                        this.activeBuidlingIndex = index;
                        this.selectedBuidling = this.formatbuidlingInfo[index].building;
                        this.chooseParking();
                        break;
                }
            },
            handleChooseUnit(index) {
                this.clickedRoomId = null; // 清除已选中房源
                this.chooseUnit(index);
            },
            chooseUnit(index) {
                let self = this;
                let token = window.sessionStorage.getItem("activityToken");
                let uNo = this.formatbuidlingInfo[this.activeBuidlingIndex].unit[index];
                let bNo = this.selectedBuidling;
                this.selectedUNoIndex = index;
                this.activeUNoIndex = index;
                this.selectedUNo = uNo;
                if (token) {
                    API.queryRooms(token, bNo, uNo, data => {
                        if (!data.errcode) {
                            self.roomLists = data;
                            self.$store.commit("hideCover");
                        } else {
                            self.errmsg = `${data.errmsg}`;
                            self.errorDialog = true;
                        }
                    });
                }
            },
            chooseParking() {
                let self = this;
                let token = window.sessionStorage.getItem("activityToken");
                let bNo = this.selectedBuidling;
                if (token) {
                    API.queryParkings(token, bNo, data => {
                        if (!data.errcode) {
                            self.roomLists = data;
                            self.$store.commit("hideCover");
                        } else {
                            self.errmsg = `${data.errmsg}`;
                            self.errorDialog = true;
                        }
                    });
                }
            },
            closeGuestDialog() {
                this.guestDialog = false;
                this.clickedGuestIds = [];
                this.guestList = [];
                this.mobile = null
                this.name = null
                this.hasGuest = false
            },
            queryGuest() {
                this.guestDialog = true;
            },
            searchGuest() {
                let self = this;
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                } else {
                    this.timer = setTimeout(function() {
                        let token = window.sessionStorage.getItem("activityToken");
                        let name = self.name;
                        let mobile = self.mobile;
                        if (token) {
                            API.handleQueryGuest(token, name, mobile, data => {
                                if (!data.errcode) {
                                    if (data.length == 0) {
                                        self.hasGuest = true;
                                    } else {
                                        self.hasGuest = false;
                                    }
                                    self.guestDialog = true;
                                    self.guestList = data;
                                    self.timer = null;
                                } else {
                                    self.errmsg = data.errmsg;
                                    self.errorDialog = true;
                                }
                            });
                        }
                    }, 200);
                }
            },
            allChoose () {
                if (this.guestList.length > 0) {
                    let tmp = []
                    let tmpIndex = []
                    for (var i=0; i<this.guestList.length; i++) {
                        tmp.push(this.guestList[i].id)
                        tmpIndex.push(i)
                    }
                    this.isActive = !this.isActive
                    if (this.isActive) {
                        this.clickedGuestIds = tmp
                        this.gIndexs = tmpIndex
                    } else {
                        this.clickedGuestIds = []
                        this.gIndexs = []
                    }
                }
            },
            chooseGuest(guestId, e, argIndex) {
                let className =e.target.className
                if (className == 'guestSelected') {
                    if(this.clickedGuestIds.indexOf(guestId))
                        var index = this.clickedGuestIds.indexOf(guestId)
                    var gIndex = this.gIndexs.indexOf(argIndex)
                    this.clickedGuestIds.splice(index, 1);
                    this.gIndexs.splice(gIndex, 1);
                    e.target.className = 'guestDefault'
                }
                if (className == 'guestDefault') {
                    this.clickedGuestIds.push(guestId);
                    this.gIndexs.push(argIndex)
                    e.target.className = 'guestSelected'
                }
            },
            resetPwd() {
                let self = this;
                let token = window.sessionStorage.getItem("activityToken");
                let guestIds = this.clickedGuestIds;
                API.handleResetPwd(token, guestIds, data => {
                    if (!data.errcode) {
                        self.errmsg = "【重置客户密码】成功";
                        let guestSelectedObj = window.document.getElementsByClassName('guestSelected')
                        while(guestSelectedObj.length > 0) {
                            guestSelectedObj[0].setAttribute('class', 'guestDefault');
                        }
                        self.errorDialog = true;
                        setTimeout(function() {
                            self.errorDialog = false;
                        }, 500);
                        self.clickedGuestIds = [];
                        self.gIndexs = []
                        self.isActive = false;
                        self.updatePsdDialog = false;
                    } else {
                        self.errmsg = data.errmsg;
                        self.errorDialog = true;
                    }
                });
            },
            setLoginStatus (arg) {
                var allowLogin
                let self = this
                let token = window.sessionStorage.getItem("activityToken");
                let guestIds = this.clickedGuestIds;
                if (arg) {
                    allowLogin = true
                } else {
                    allowLogin = false
                }
                API.handleSetLoginStatus(token, guestIds, allowLogin, data => {
                    if (!data.errcode) {
                        self.errmsg = "【设置】成功";
                        let guestSelectedObj = window.document.getElementsByClassName('guestSelected')
                        while(guestSelectedObj.length > 0) {
                            guestSelectedObj[0].setAttribute('class', 'guestDefault');
                        }
                        self.errorDialog = true;
                        setTimeout(function() {
                            self.errorDialog = false;
                        }, 500);
                        let gIndexs = self.gIndexs;
                        let guestList = self.guestList
                        for (let i=0; i<gIndexs.length; i++) {
                            if (arg) {
                                guestList[gIndexs[i]].disabled = false
                            } else {
                                guestList[gIndexs[i]].disabled = true
                            }
                        }
                        if (arg) {
                            self.allowLoginDialog = false
                        } else {
                            self.notAllowLoginDialog = false
                        }
                        self.clickedGuestIds = []
                        self.gIndexs = []
                        self.isActive = false
                    } else {
                        self.errmsg = data.errmsg;
                        self.errorDialog = true;
                    }
                })

            },
            formatStatus(disabled) {
                if (disabled) {
                    return '禁止登录'
                } else {
                    return '允许登录'
                }
            }
        },
        mounted() {
            let self = this;
            let activityType = this.activityType;
            window.setTimeout(function() {
                self.getBuildings();
            }, 500);

            window.setInterval(() => {
                // 查询房源信息的定时器
                if (activityType == "0") {
                    self.chooseUnit(self.selectedUNoIndex);
                } else if (activityType == "1") {
                    self.chooseParking();
                }
            }, 3000);
        }
    };
</script>
<style>
    .activebuilding {
        border-bottom: 2px solid #e50000;
        color: #e50000;
        font-weight: bold;
    }

    .activeUnit {
        background-color: rgba(216, 94, 94, 0.9);
        color: #fff;
        border-radius: 5px;
    }

    .activeRoom {
        background-color: #c30303;
        color: #ffffff;
    }

    .assignRoom {
        background-color: #ffee58;
        color: #000000;
    }

    .clickedRoom {
        border: 2px solid orange;
    }

    .directBuy {
        background-color: #1e88e5;
        color: #ffffff;
    }

    .room-page-footer {
        position: fixed;
        height: 50px;
        bottom: 0;
        background-color: #fff;
        border-top: 1px solid #ccc;
        width: 100%;
        text-align: left;
    }

    .activedGuest {
        background-color: #d2c9b9;
    }
    .guestSelected {
        background: url('../assets/check_active.png') center center no-repeat;
    }
    .guestDefault {
        background: url('../assets/check_default.png') center center no-repeat;
    }
</style>
