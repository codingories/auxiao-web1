<template>
  <div class="app-container">
    <h2>当前页面是出勤页面</h2>
    <el-date-picker v-model="choose_date" type="date" placeholder="选择日期" @change="setDate"></el-date-picker>
    <el-input class="name-entry" v-model="name" placeholder="请输入姓名"></el-input>
    <el-button type="primary">查询</el-button>

    <h2>今日考勤情况表</h2>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="user_total_count" label="当前人数" width="auto"></el-table-column>
      <el-table-column prop="not_punch_count" label="未考人数" width="auto"></el-table-column>
      <el-table-column prop="late_count" label="迟到人数" width="auto"></el-table-column>
      <el-table-column prop="leave_early_count" label="早退人数" width="auto"></el-table-column>
      <el-table-column prop="leave_count" label="请假人数" width="auto"></el-table-column>
      <el-table-column prop="public_out_count" label="公出人数" width="auto"></el-table-column>
    </el-table>
    <h2>考勤详情</h2>
    <el-table :data="tableDataDetail" style="width: 100%">
      <el-table-column prop="ID" label="工号" width="180" sortable></el-table-column>
      <el-table-column prop="name" label="姓名" width="auto"></el-table-column>
      <el-table-column prop="today_rule" label="今日规则" width="auto"></el-table-column>
      <el-table-column prop="attendance_status" label="考勤状态" width="auto"></el-table-column>
      <el-table-column prop="late_time" label="迟到时间" width="auto"></el-table-column>
      <el-table-column prop="absent_time" label="早退时间" width="auto"></el-table-column>
      <el-table-column prop="punch_record" label="打卡记录" width="auto"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, getMainDetail } from "@/api/table";
// import { getTotalAttendance } from "@/api/totalAttendance";

import store from "@/store";
import {
  TimestampToNormal,
  calculateMorning,
  calculateAfternoon,
  getDate,
  getStatus
} from "@/utils/dealTime";

export default {
  filters: {},
  data() {
    return {
      name: "",
      list: null,
      listLoading: false,
      MainDetailLoading: false,
      access_tocken: "",
      tableData: [],
      tableDataDetail: [],
      fetch_date: "",
      choose_date: new Date(),
      dayIndex: 1 // 决定展示哪一天
    };
  },
  created() {
    this.fetchData();
    // console.log(this.listLoading);
    this.fetchMainDetail();
  },
  computed: {},
  watch: {
    choose_date(newval, oldval) {
      console.log(12345);
      // console.log(getDate(newval), getDate(oldval), getDate(new Date()));
      // let newval = newval.split("-")
      // console.log(newval[0],newval[1],newval[2])
      // if (getDate(newval) === getDate(new Date())) {
      //   this.tableDataDetail = [];
      //   this.fetchMainDetail();
      // }
      this.tableDataDetail = [];
      this.fetchMainDetail();
    }
  },
  methods: {
    // calDays() {},
    setDate() {},
    fetchData() {
      this.listLoading = true;
      this.listLoading = false;
    },
    fetchMainDetail() {
      this.listLoading = true;
      this.access_token = store.getters.token;
      let date = getDate(this.choose_date);
      getMainDetail({
        access_token: this.access_token,
        date: date
      })
        .then(
          // 获取详细
          success => {
            let data = success.data;
            console.log("--------data--------");
            console.log(data);
            let tempTableDataDetail = [];
            for (let i of data) {
              let obj = {};
              if ("job_number" in i) {
                obj.ID = i.job_number;
              } else if ("workno" in i) {
                obj.ID = i.workno;
              }
              obj.name = i.name;
              obj.today_rule = i.rule_txt;
              obj.punch_record = i.kaoqin;
              // console.log(i);
              // console.log(i.kaoqin);
              tempTableDataDetail.push(obj);
              let rule = i.rule_txt;
              let record;
              if (i.kaoqin !== null) {
                record = i.kaoqin.trim();
              }

              let day = getDate(this.choose_date);
              let status = getStatus(rule, record, day);
              console.log(status);
              // console.log( )
              if (status instanceof Array) {
                obj.attendance_status = status[0];
                if (obj.attendance_status === "迟到") {
                  obj.late_time = status[1];
                } else {
                  obj.absent_time = status[1];
                }
              } else {
                obj.attendance_status = status;
              }
            }
            this.tableDataDetail = tempTableDataDetail;
            this.listLoading = false;
          },
          fail => {
            console.log(fail);
          }
        )
        .then(success => {
          // 对当日的数据进行计算
          if (getDate(this.choose_date) === getDate(new Date())) {
            console.log(getDate(this.choose_date), getDate(new Date()));
            let topList = [];
            let obj = {};
            obj.date = getDate(this.choose_date);
            let attendance_status = 0;
            let late_count = 0;
            let leave_early_count = 0;
            for (let i of this.tableDataDetail) {
              if (i.attendance_status === "缺勤") {
                attendance_status += 1;
              } else if (i.attendance_status === "迟到") {
                late_count += 1;
              } else if (i.attendance_status === "早退") {
                leave_early_count += 1;
              } else if (i.attendance_status === "迟到并早退") {
                late_count += 1;
                leave_early_count += 1;
              }
            }
            obj.leave_early_count = leave_early_count;
            obj.late_count = late_count;
            obj.not_punch_count = attendance_status;
            obj.user_total_count = this.tableDataDetail.length;
            topList.push(obj);
            this.tableData = topList;
          } else {
            // 这里对服务器进行状态请求

            getList({ access_token: this.access_token }) // 获取纵览
              .then(response => {
                this.listLoading = true;
                console.log(response.data);
                // console.log(typeof response.data);
                // let tempData = [];
                let topList = [];

                for (let key in response.data) {
                  let obj = {};
                  // tempData.push(response.data[key]);
                  if (getDate(this.choose_date) === key) {
                    obj.date = key; // 日期
                    obj.user_total_count = response.data[key].user_total_count; // 当前人数
                    obj.not_punch_count = response.data[key].absence_count; // 未考人数
                    obj.late_count = response.data[key].late_count; // 迟到人数
                    obj.leave_early_count =
                      response.data[key].leave_early_count; //早退人数
                    obj.leave_count = response.data[key].leave_count; // 请假人数
                    obj.public_out_count = response.data[key].public_out_count; // 公出人数
                    console.log("obj", obj);
                    topList.push(obj);
                  }
                }
                console.log("tableData", topList);

                this.tableData = topList;

                // console
                //   .log
                //   // this.tableData.push(tempData[tempData.length - this.dayIndex])
                //   (); // 决定展示哪一天
                // console.log("--------this.tableData--------");
                // console.log(this.tableData);
                // console.log(tempData);
                this.listLoading = false;
              });
          }
        });
    }
  }
};
</script>

<style scoped>
.name-entry {
  width: 200px;
}
</style>