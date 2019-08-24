<template>
    <div id="app">

        <!-- 头部信息 -->
        <div class="header">
            <!-- 左边部分 -->
            <div class="header-left">
                <div class="logo">
                    <img src="./assets/logo.gif" alt="">
                    <span>实时票房</span>
                </div>
                <div class="time-date">{{dataList.serverTimestamp|dateFormat('dateWithCN')}}</div>
                <div class="time-clock">{{dataList.serverTimestamp|dateFormat('time')}}</div>
            </div>

            <!-- 中间按钮 -->
            <div class="header-button">
                <span :class="dataFlag===false?'active':''" @click="dataFlag=false">综合票房</span>
                <span :class="dataFlag===true?'active':''" @click="dataFlag=true">分账票房</span>
            </div>

            <!-- 右边部分 -->
            <div class="header-right" @click="fullscreen">
                <span v-if="!fullFlag">全屏</span>
                <span v-if="fullFlag">退出全屏</span>
            </div>
        </div>

        <!-- 中间容器 -->
        <div class="info-container">

            <!--左边信息容器-->
            <div class="info-left">

                <!-- 优先展示 -->
                <div class="info-box">

                    <!-- "点击※优先展示" 提示语 -->
                    <div class="box-tips" v-show="!boxFlag">
                        <p>点击<span class="el-icon-star-on"></span>优先展示</p>
                    </div>

                    <!-- 点击※后展示对应的票房信息 -->
                    <div class="box-info" v-show="boxFlag">
                        <div class="box-movie-info">
                            <p class="box-star-name">
                                <span class="el-icon-star-on"></span>
                                {{boxList.movieName}}
                            </p>
                            <p class="box-day-mon">{{boxList.releaseInfo}} {{boxList.sumBoxInfo}}</p>
                        </div>

                        <div class="box-office-info">
                            <p class="box-details-name" v-if="!dataFlag">综合票房</p>
                            <p class="box-details-name" v-if="dataFlag">分账票房</p>
                            <p class="box-office-num" v-if="!dataFlag">{{boxList.boxInfo}}万</p>
                            <p class="box-office-num" v-if="dataFlag">{{boxList.splitBoxInfo}}万</p>
                            <p class="box-office-rate" v-if="!dataFlag">票房占比{{boxList.boxRate}}</p>
                            <p class="box-office-rate" v-if="dataFlag">票房占比{{boxList.splitBoxRate}}</p>
                        </div>

                        <div class="box-view-info">
                            <div class="view-show">
                                <p>排片场次</p>
                                <p>{{boxList.showInfo}}</p>
                                <p>排片占比{{boxList.showRate}}</p>
                            </div>

                            <div class="view-avg">
                                <p>场均人次</p>
                                <p>{{boxList.avgShowView}}</p>
                                <p>上座率{{boxList.avgSeatView}}</p>
                            </div>

                        </div>
                    </div>

                </div>

                <!--今日票房总览-->
                <div class="info-today">
                    <div class="today-date">
                        <p>{{dataList.serverTimestamp|dateFormat('dateWithDot')}}<span
                                class="el-icon-caret-bottom"></span></p>
                    </div>
                    <div class="today-boxoffice">
                        <p v-if="!dataFlag">今日实时 <span>{{dataList.totalBox}}{{dataList.totalBoxUnit}}</span></p>
                        <p v-if="dataFlag">今日实时 <span>{{dataList.splitTotalBox}}{{dataList.splitTotalBoxUnit}}</span>
                        </p>
                    </div>
                    <div class="today-clock">
                        <p ref="clock">{{dataList.updateInfo}}</p>
                    </div>
                </div>

            </div>
            <!-- 右边电影票房列表 -->
            <div class="info-right">

                <!-- 列表头 -->
                <div class="table-head">
                    <thead>
                    <tr>
                        <td><p>影片<span class="click-star">(点击<span class="el-icon-star-on"></span>优先展示)</span></p></td>
                        <td v-if="!dataFlag">综合票房(万)</td>
                        <td v-if="dataFlag">分账票房(万)</td>
                        <td>票房占比</td>
                        <td>排片场次</td>
                        <td>排片占比</td>
                        <td>场均人次</td>
                        <td>上座率</td>
                    </tr>
                    </thead>
                </div>

                <!-- 列表信息 -->
                <div class="table-body">
                    <tbody id="tbody">
                    <tr v-for="(item,index) in dataList.list"
                        :key="dataList.list.movieID"
                        @click="checkDetails(index)">
                        <td>
                            <p class="movie-rank">
                                <span>{{(index+1)<10?'0'+(index+1) : (index+1)}}</span>
                                <span class="movie-rank-name">{{item.movieName}}</span>
                            </p>
                            <p class="movie-record">
                                <span class="el-icon-star-on"></span>
                                <span>{{item.releaseInfo}}</span>
                                <span>{{item.sumBoxInfo}}</span>
                            </p>
                        </td>
                        <td v-if="!dataFlag">{{item.boxInfo}}</td>
                        <td v-if="dataFlag">{{item.splitBoxInfo}}</td>
                        <td v-if="!dataFlag">{{item.boxRate}}</td>
                        <td v-if="dataFlag">{{item.splitBoxRate}}</td>
                        <td>{{item.showInfo}}</td>
                        <td>{{item.showRate}}</td>
                        <td>{{item.avgShowView}}</td>
                        <td>{{item.avgSeatView}}</td>
                    </tr>
                    </tbody>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
                dataList: {},
                boxFlag: false,
                dataFlag: false,
                fullFlag: false,
                boxList: {},
                indexSave: -1,
            }
        },
        methods: {
            getData() {
                setInterval(()=>{
                    this.$http.get('/api/box/second.json').then(res => {
                        this.dataList = res.data.data
                        this.letTimeGo()
                    })
                },5000)

                // this.$http.get('/api/box/second.json').then(res => {
                //     this.dataList = res.data.data
                //     this.letTimeGo()
                // })
            },
            letTimeGo() {
                let str = this.dataList.updateInfo.split(`北京时间 `)[1]
                let arr = str.split(':')
                let h = parseInt(arr[0])
                let m = parseInt(arr[1])
                let s = parseInt(arr[2])
                let that = this
                setInterval(function () {
                    if (s === 59) {
                        m++
                        s = 0
                    } else {
                        s++
                    }

                    if (m === 59 && s === 59) {
                        h++
                        m = 0
                        s = 0
                    }

                    if (h === 23 && m === 59 && s === 59) {
                        h = 0
                        m = 0
                        s = 0
                    }
                    h = h < 10 ? '0' + h.toString() : h.toString()
                    m = m < 10 ? '0' + m.toString() : m.toString()
                    s = s < 10 ? '0' + s.toString() : s.toString()

                    that.$refs.clock.innerText = `北京时间 ${h}:${m}:${s}`
                    h = parseInt(h)
                    m = parseInt(m)
                    s = parseInt(s)
                }, 1000)
            },
            checkDetails(index) {
                const parent = document.getElementById('tbody')
                const trObj = parent.getElementsByTagName('tr')
                for (let i = 0; i < trObj.length; i++) {
                    trObj[i].style.backgroundColor = ''
                    trObj[i].getElementsByClassName('el-icon-star-on')[0].style.color = ''
                }

                if (index === this.indexSave && this.boxFlag === false) {
                    this.boxFlag = !this.boxFlag
                    trObj[index].style.backgroundColor = '#535265'
                    trObj[index].getElementsByClassName('el-icon-star-on')[0].style.color = 'gold'
                } else if (index === this.indexSave && this.boxFlag === true) {
                    this.boxFlag = !this.boxFlag
                    trObj[index].style.backgroundColor = ''
                } else if (index !== this.indexSave && this.boxFlag === true) {
                    this.boxList = this.dataList.list[index]
                    trObj[index].style.backgroundColor = '#535265'
                    trObj[index].getElementsByClassName('el-icon-star-on')[0].style.color = 'gold'
                } else {
                    this.boxFlag = !this.boxFlag
                    this.boxList = this.dataList.list[index]
                    trObj[index].style.backgroundColor = '#535265'
                    trObj[index].getElementsByClassName('el-icon-star-on')[0].style.color = 'gold'
                }
                this.indexSave = index

            },
            fullscreen() {
                if (this.fullFlag === false) {
                    this.launchFullscreen(document.body)
                    this.fullFlag = true
                } else {
                    this.exitFullscreen()
                    this.fullFlag = false
                }

            },
            launchFullscreen(element) {
                //此方法不可以在異步任務中執行，否則火狐無法全屏
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.oRequestFullscreen) {
                    element.oRequestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullScreen();
                } else {

                    var docHtml = document.documentElement;
                    var docBody = document.body;
                    var videobox = document.getElementById('videobox');
                    var cssText = 'width:100%;height:100%;overflow:hidden;';
                    docHtml.style.cssText = cssText;
                    docBody.style.cssText = cssText;
                    videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
                    document.IsFullScreen = true;

                }
            },
            exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.oRequestFullscreen) {
                    document.oCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else {
                    var docHtml = document.documentElement;
                    var docBody = document.body;
                    var videobox = document.getElementById('videobox');
                    docHtml.style.cssText = "";
                    docBody.style.cssText = "";
                    videobox.style.cssText = "";
                    document.IsFullScreen = false;
                }
            }
        },
        created() {
            this.getData()
            this.$http.get('/api/box/second.json').then(res => {
                this.dataList = res.data.data
                this.letTimeGo()
            })
        },

    }
</script>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    html, body {
        background-color: #000000;
        height: 100%;
        cursor: default;
    }

    #app {
        display: flex;
        flex-direction: column;
        height: 100%;
    }


    .header {
        width: 100%;
        background-color: #373743;
        flex: 1;
        display: flex;
        color: #ffffff;
        font-size: 12px;
        align-items: center;
        position: relative;
        justify-content: space-between;
    }

    .logo img {
        height: 36px;
        vertical-align: middle;
    }

    .logo span {
        color: #ED1037;
        font-size: 18px;
        font-weight: bolder;
        line-height: 36px;
    }

    .header-left {
        display: flex;
        align-items: center;
        margin-left: 5px;
        cursor: default;
    }

    .time-date {
        margin: 0 10px;
    }

    .header-button {
        width: 140px;
        height: 25px;
        border-radius: 25px;
        line-height: 25px;
        position: absolute;
        left: 50%;
        margin-left: -70px;
        background-color: #000000;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        padding: 0 5px;
        align-items: center;
        cursor: pointer;
    }

    .header-button span {
        height: 20px;
        width: 75px;
        border-radius: 25px;
        text-align: center;
        line-height: 20px;
    }

    .header-button span.active {
        background-color: #30303B;
    }


    .header-right {
        height: 20px;
        margin-right: 20px;
        border: 1px solid #ffffff;
        text-align: center;
        border-radius: 25px;
    }

    .header-right:hover {
        background-color: #464556;
        cursor: pointer;
    }

    .header-right span {
        line-height: 20px;
        margin: 0 10px;
    }


    .info-container {
        width: 96%;
        flex: 15;
        margin: 30px auto;
        border-radius: 5px;
        display: flex;

    }

    .info-left {
        flex: 3;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
    }

    .info-box {
        flex: 7;
        margin-bottom: 20px;
        background-color: #373743;
        border-radius: 5px;
        height: 100%;
        white-space: nowrap;
    }

    .info-today {
        flex: 3;
        background-color: #373743;
        border-radius: 5px;
        white-space: nowrap;
    }

    .info-right {
        flex: 7;
        background-color: #373743;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .table-head {
        flex: 2;
        width: 100%;
        height: 100px;
        background-color: #373743;
        border-radius: 5px;
        line-height: 100px;
        font-size: 20px;
    }

    .table-head td {
        display: inline-block;
        width: 100px;
        text-align: center;
        margin: 0 10px;
        color: #989898;
    }

    .table-head td:first-child {
        width: 240px;
        color: #ffffff;
        text-align: left;
    }

    .table-head td:first-child p {
        margin-left: 20px;
    }

    .table-head td:nth-child(2) {
        width: 120px;
    }

    .click-star {
        font-size: 12px;
    }

    .click-star .el-icon-star-on {
        color: gold;
    }

    .table-body {
        flex: 10;
        width: 100%;
        border-radius: 5px;
        line-height: 100px;
        font-size: 20px;
        overflow: auto;
        height: 100%;
    }

    .table-body tr {
        display: inline-block;
        height: 100px;
        width: 100%;
        max-width: 100%;
        white-space: nowrap;
    }

    .table-body td {
        display: inline-block;
        width: 100px;
        text-align: center;
        margin: 0 10px;
        color: #ffffff;
        height: 100px;
        line-height: 100px;
    }

    .table-body td:first-child {
        width: 240px;
        text-align: left;
        white-space: nowrap;
    }

    .table-body td:first-child p {
        display: block;
        line-height: 30px;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .table-body td:first-child span {
        margin: 0 5px;
    }

    .table-body td:first-child .el-icon-star-on {
        cursor: pointer;
    }

    .movie-rank {
        margin-top: 20px;
    }

    .movie-record {
        font-size: 14px;
    }

    .table-body td:nth-child(2) {
        width: 120px;
        color: #FDAB1A;
    }

    .table-body tbody {
        display: table;
        width: 100%;
    }

    .table-body tr:nth-child(odd) {
        background-color: #3F3F4D;
    }

    .info-today {
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .today-date {
        border: 1px solid #ffffff;
        font-size: 22px;
        height: 40px;
        width: 180px;
        line-height: 44px;
        border-radius: 25px;
        margin: 20px auto;
        text-align: center;
        cursor: pointer;
    }

    .today-boxoffice {
        width: 100%;
        text-align: center;
        font-size: 30px;
    }

    .today-boxoffice span {
        color: #DE5725;
    }

    .today-clock {
        width: 100%;
        margin: 20px 0;
        text-align: center;
        font-size: 20px;
    }

    .box-tips {
        color: #ffffff;
        text-align: center;
        font-size: 36px;
        margin-top: 50px;
    }

    .box-tips span {
        color: gold;
    }

    .box-info {
        text-align: center;
        color: #ffffff;
    }

    .box-movie-info {
        font-size: 26px;
        margin-top: 50px;
    }

    .box-movie-info .el-icon-star-on {
        font-size: 22px;
        color: gold;
    }

    .box-office-info {
        margin-top: 10px;
    }

    .box-day-mon, .box-office-rate {
        font-size: 20px;
        color: #9B9BA1;
    }

    .box-details-name {
        font-size: 22px;
        color: #9B9BA1;
    }

    .box-office-num {
        font-size: 48px;
        color: #DE5725;
    }

    .box-view-info {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        font-size: 22px;
        padding: 0 30px;
    }

    .el-icon-star-on .active {
        background-color: gold;
    }
</style>
