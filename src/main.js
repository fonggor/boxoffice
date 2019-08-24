import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

Vue.prototype.$http = axios.create()

Vue.config.productionTip = false

Vue.filter('dateFormat', function (str,pattern) {
    var dt=new Date(str)
    var Y=dt.getFullYear()
    var M=dt.getMonth()+1 < 10?'0'+(dt.getMonth()+1) : dt.getMonth()+1
    var D=dt.getDate() < 10?'0'+dt.getDate() : dt.getDate()
    var h=dt.getHours() < 10?'0'+dt.getHours() : dt.getHours()
    var m=dt.getMinutes() < 10?'0'+dt.getMinutes() : dt.getMinutes()

    if (pattern==='dateWithCN') {
        return `${Y}年${M}月${D}日`
    } else if (pattern==='time') {
        return `${h}:${m}`
    } else if (pattern === 'dateWithDot') {
        return `${Y}.${M}.${D}`
    }

})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
