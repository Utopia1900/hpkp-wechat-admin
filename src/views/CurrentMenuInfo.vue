<template>
  <div>
    <v-layout>
      <v-flex>
        <v-card style="box-shadow:none">
          <v-card-title primary-title>
            <div class="headline">{{title}}</div>
          </v-card-title>
          <v-layout row>
            <v-flex xs8 v-if="editAble">
              <textarea
                cols="120"
                rows="25"
                style="padding: 10px;border: 1px solid #ccc;"
                v-model="menuObj"
              ></textarea>
            </v-flex>
            <v-flex xs8 v-else>
              <pre style="padding: 20px" v-html="menuInfoHTML"></pre>
            </v-flex>
          </v-layout>
        </v-card>
        <div v-if="editAble">
          <v-btn color @click="cancelEdit">取消编辑</v-btn>
          <v-btn color="success" @click="setSelfMenu">确认提交</v-btn>
        </div>
        <div v-else>
          <v-btn color="info" @click="edit">编辑</v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-dialog v-model="addMenuDialog" max-width="600px">
      <v-card style="padding-top: 30px;">
        {{errmsg}}
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click.native="addMenuDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import config from "../utils/config";
import axios from "axios";

export default {
  name: "current-menu-info",
  data: () => ({
    menuInfoHTML: "",
    addMenuDialog: false,
    errmsg: "提示",
    menuObj: "",
    editAble: false,
    title: "当前菜单项如下："
  }),
  methods: {
    getCurrentMenuInfo: function() {
      let formData = {
        token: sessionStorage.getItem("token")
      };
      let options = {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify(formData),
        url: config.preHttp + "getCurrentMenuInfo"
      };
      axios(options)
        .then(response => {
          let data = response.data;
          console.log(typeof data);
          if (!data.errcode) {
            this.menuInfoHTML = this.syntaxHighlight(
              data.menuConfig.selfmenu_info
            );
            
            this.menuObj = JSON.stringify(data.menuConfig.selfmenu_info);
            // this.menuInfoHTML = JSON.stringify(data.menuConfig.selfmenu_info)
            // this.menuObj = JSON.stringify(data.menuConfig.selfmenu_info)
          } else {
            this.errmsg = `${data.errmsg}`;
            this.addMenuDialog = true;
          }
          // console.log(JSON.stringify(data))
        })
        .catch(error => {
          //          alert(error)
        });
    },
    syntaxHighlight(json) {
      if (typeof json != "string") {
        json = JSON.stringify(json, undefined, 2);
      }
      json = json
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function(match) {
          var cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        }
      );
    },
    setSelfMenu() {
      var value = confirm("确定要提交编辑吗？");
      if (value) {
        let menuObj =
          typeof this.menuObj != "string"
            ? JSON.stringify(this.menuObj)
            : this.menuObj;
        let token = sessionStorage.getItem("token");
        let formData = {
          token: token,
          menuObj: menuObj
        };
        let options = {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          data: JSON.stringify(formData),
          url: config.preHttp + "setSelfMenu"
        };
        axios(options)
          .then(response => {
            let data = response.data;
            if (!data.errcode) {
              console.log("ok");
              this.getCurrentMenuInfo()
              this.editAble = false
              this.errmsg = `编辑成功`;
              this.title = '当前菜单项如下：'
              this.addMenuDialog = true;
            } else {
              this.errmsg = `${data.errmsg}`;
              this.addMenuDialog = true;
            }
            // console.log(JSON.stringify(data))
          })
          .catch(error => {
            //          alert(error)
          });
      }
    },
    edit() {
      this.editAble = true;
      this.title = "编辑菜单项：";
    },
    cancelEdit() {
      this.editAble = false;
      this.title = "当前菜单项如下：";
    }
  },
  mounted() {
    this.getCurrentMenuInfo();
  }
};
</script>

<style>
pre {
  padding: 5px;
  margin: 5px;
  text-align: left;
}

.string {
  color: green;
}

.number {
  color: darkorange;
}

.boolean {
  color: blue;
}

.null {
  color: magenta;
}

.key {
  color: red;
}
</style>
