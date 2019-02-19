import axios from 'axios'
import config from '../utils/config'

const API = {
    getBuildings(token, successCb) {
        let formData = {token}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'buildings'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // alert(error)
        })
    },
    queryRooms(token, bNo, uNo, successCb) {
        let formData = {token, bNo, uNo}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'rooms'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // alert(error)
        })
    },
    queryParkings (token, bNo, successCb) {
        let formData = {token, bNo}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'rooms'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // alert(error)
        })
    },
    handleQueryGuest(token, name, mobile, successCb){ // 获取客户信息
        let formData = {token}
        if (name) formData.name = name
        if (mobile) formData.mobile = mobile
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'queryGuest'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleResetPwd (token, guestIds, successCb) {
        let formData = {token, guestIds}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'resetPwd'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleSetLoginStatus (token,guestIds,allowLogin, successCb) {
        let formData = {token, guestIds, allowLogin}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'setLoginStatus'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    formatMoney (s, n) {
        n = n > 0 && n <= 20 ? n : 0
        s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
        var l = s.split('.')[0].split('').reverse()
        var r = s.split('.')[1]
        var t = ''
        for (var i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
        }
        if (n > 0) {
          return t.split('').reverse().join('') + '.' + r
        } else {
          return t.split('').reverse().join('')
        }
    }
}

export default API
