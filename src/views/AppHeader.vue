<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list dense>
        <v-list-tile @click="goToCreateActivity" :style="createActivityActived ? {color: '#e50000'} : ''">
          <v-list-tile-action>
            <v-icon :style="createActivityActived ? {color: '#e50000'} : ''" >add</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            创建活动
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="goToAddOpeningMenu" :style="openingMenuActived ? {color: '#e50000'} : ''">
          <v-list-tile-action>
            <v-icon :style="openingMenuActived ? {color: '#e50000'} : ''">event</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            查看活动信息
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="goToCurrentMenuInfo" :style="currentMenuActived ? {color: '#e50000'} : ''">
          <v-list-tile-action>
            <v-icon :style="currentMenuActived ? {color: '#e50000'} : ''">widgets</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            获取当前菜单项
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="grey darken-4" dark fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer">

      </v-toolbar-side-icon>
      <v-toolbar-title>在线选房后台</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="grey darken-4" @click='logout'>
        <v-icon>close</v-icon>
        退出登录
      </v-btn>
    </v-toolbar>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        drawer: null,
        currentMenuActived: true,
        openingMenuActived: false,
        createActivityActived: false
      }
    },
    methods: {
      goToCurrentMenuInfo() {
        this.currentMenuActived = true
        this.openingMenuActived = false
        this.createActivityActived = false
        this.$router.push('/home/currentMenuInfo')
      },
      goToAddOpeningMenu() {
        this.currentMenuActived = false
        this.openingMenuActived = true
        this.createActivityActived = false
        this.$router.push('/home/addOpeningMenu')
      },
      goToCreateActivity() {
        this.currentMenuActived = false
        this.openingMenuActived = false
        this.createActivityActived = true
        this.$router.push('/home/createActivity')
      },
      logout() {
        window.sessionStorage.removeItem('token')
        this.$router.push('/')
      }
    }
  }

</script>
