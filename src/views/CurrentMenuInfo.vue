<template>
  <div>
    <v-layout>
      <v-flex>
        <v-card style="box-shadow:none">
          <v-card-title primary-title>
            <div class="headline">当前菜单项如下:</div>
          </v-card-title>
          <v-layout row>
            <v-flex xs8>
              <pre style="padding: 20px" v-html="menuInfoHTML"></pre>
            </v-flex>
          </v-layout>
        </v-card>
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
  import config from '../utils/config'
  import axios from 'axios'

  export default {
    name: "current-menu-info",
    data: () => ({
      menuInfoHTML: '',
      addMenuDialog: false,
      errmsg: '提示'
    }),
    methods: {
      getCurrentMenuInfo: function () {
        let formData = {
          token: sessionStorage.getItem('token')
        }
        let options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify(formData),
          url: config.preHttp + 'getCurrentMenuInfo'
        }
        axios(options).then(response => {
          let data = response.data
          if (!data.errcode) {
            this.menuInfoHTML = this.syntaxHighlight(data)
          } else {
            this.errmsg = `${data.errmsg}`
            this.addMenuDialog = true
          }
          // console.log(JSON.stringify(data))
        }).catch(error => {
//          alert(error)
        })
      },
      syntaxHighlight(json) {
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      }
    },
    mounted() {
      this.getCurrentMenuInfo()
    }
  }
</script>

<style>
  pre {
    padding: 5px;
    margin: 5px;
    text-align: left
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
