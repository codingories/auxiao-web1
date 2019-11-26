<template>
  <div class="app-container">
    <h2>当前是考勤汇总页面</h2>
    <!-- {{tableYear}}+{{tableMonth}} -->
    <el-button type="primary" @click="lastMonth">上一月</el-button>
    <el-button type="success" @click="nextMonth">下一月</el-button>
    <el-button type="warning" @click="exportExcel">导出</el-button>
    <!-- {{tableData}} -->
    <el-table :data="tableData" style="width: 100%" id="out-table">
      <el-table-column
        :prop="tableHeader[i].prop"
        :label="tableHeader[i].label"
        min-width="150"
        v-for="(item,i) in tableHeader"
        :key="i"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTotalAttendance } from "@/api/totalAttendance";
import store from "@/store";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  data() {
    return {
      tableMonth: new Date().getMonth() + 1,
      tableYear: new Date().getFullYear(),
      listLoading: false,
      TotalRawData: {},
      TotalData: [],
      jobNumberName: {}
    };
  },
  watch: {},

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth);
    },
    tableData: function() {
      return this.getData();
    }
  },

  created() {
    this.fetchTotalData();
  },

  methods: {
    getMonth(y, m, d) {
      let M = [];
      // M.push(m + "月");
      // 创建当前时间对象
      let nowDate = new Date(y, m - 1, d);
      console.log(nowDate);
      // 获取当前月份
      let month = nowDate.getMonth() + 1;
      // 获取当前年份
      let year = nowDate.getFullYear();
      console.log(year, month);
      // 创建当前年的当前月份的第一天对象
      let firstDate = new Date(year, month - 1, 1);
      let weekDay = firstDate.getDay();
      // 创建当前年的当前月份的最后一天对象
      let lastDate = new Date(new Date(year, month, 1).getTime() - 100);
      console.log(lastDate);
      let firstDateDay = firstDate.getDate();
      console.log(firstDateDay);
      let lastDateDay = lastDate.getDate();
      console.log(lastDateDay);
      //  接下去两个相减，计算出有几天
      let monthTotalDays = lastDateDay - firstDateDay + 1;
      for (let i = 0; i < monthTotalDays; i++) {
        let hashDay = {
          0: "日",
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六"
        };
        // M.push(month + "月" + (i + 1) + "日" + "星期" + hashDay[(weekDay + i) % 7]);
        M.push(i + 1 + "(" + hashDay[(weekDay + i) % 7] + ")");
      }
      return M;
    },
    getTableHeader(y, m) {
      let days = this.getMonth(y, m, 1);
      let daysList = [];
      let tempObj = {};
      let propValue;
      for (let i = 0; i < days.length; i++) {
        if (i < 9 && m >= 10) {
          propValue = y + "-" + m + "-" + "0" + (i + 1);
        } else if (i < 9 && m < 10) {
          propValue = y + "-" + "0" + m + "-" + "0" + (i + 1);
        } else if (i > 10 && m < 10) {
          propValue = y + "-" + "0" + m + "-" + (i + 1);
        } else {
          propValue = y + "-" + m + "-" + (i + 1);
        }
        daysList[i] = { prop: propValue, label: days[i] };
      }
      let TempMonth = m + "月";
      daysList.unshift(
        { prop: "Month", label: TempMonth },
        { prop: "jobNumber", label: "工号" },
        { prop: "group", label: "组室" },
        { prop: "Name", label: "姓名" }
      );
      return daysList;
    },
    getData() {
      return this.TotalData;
    },
    lastMonth() {
      if (this.tableMonth >= 1) {
        this.tableMonth -= 1;
        if (this.tableMonth === 0) {
          this.tableMonth = 12;
          this.tableYear -= 1;
        }
      }
      this.TotalData = [];
      this.fetchTotalData();
    },
    nextMonth() {
      if (this.tableMonth <= 12) {
        this.tableMonth += 1;
        if (this.tableMonth === 13) {
          this.tableMonth = 1;
          this.tableYear += 1;
        }
      }
      this.TotalData = [];
      this.fetchTotalData();
    },
    fetchTotalData() {
      this.listLoading = true;
      this.access_token = store.getters.token;
      let dayList = {};
      if (this.tableYear % 4 !== 0) {
        dayList = {
          1: [1, 31],
          2: [1, 28],
          3: [1, 31],
          4: [1, 30],
          5: [1, 31],
          6: [1, 30],
          7: [1, 31],
          8: [1, 31],
          9: [1, 30],
          10: [1, 31],
          11: [1, 30],
          12: [1, 31]
        };
      } else {
        dayList = {
          1: [1, 31],
          2: [1, 29],
          3: [1, 31],
          4: [1, 30],
          5: [1, 31],
          6: [1, 30],
          7: [1, 31],
          8: [1, 31],
          9: [1, 30],
          10: [1, 31],
          11: [1, 30],
          12: [1, 31]
        };
      }
      let start_date =
        this.tableYear +
        "-" +
        this.tableMonth +
        "-" +
        dayList[this.tableMonth][0];
      let end_date =
        this.tableYear +
        "-" +
        this.tableMonth +
        "-" +
        dayList[this.tableMonth][1];
      console.log(this.access_token);
      console.log(start_date, end_date);
      getTotalAttendance({
        access_token: this.access_token,
        start_date: start_date,
        end_date: end_date
      }).then(
        success => {
          console.log(success);
          let nameList = {};
          this.TotalRawData = success.data;
          let jobNumber = Object.keys(success.data); // 获得最外层所有工号
          let RawData = Object.values(success.data); // 数组，日期为键的obj
          let jobNumberMapName = [];
          for (let i = 0; i < RawData.length; i++) {
            // console.log(Object.values(RawData[i])[0].user); // 这里数据又一个user为空
            if (Object.values(RawData[i])[0].user) {
              jobNumberMapName.push(Object.values(RawData[i])[0].user.name); // 所有名字的列表
            }
          }
          let jobNumberName = {};
          jobNumber.forEach(function(element, i) {
            jobNumberName[element] = jobNumberMapName[i];
          });
          console.log(jobNumberName); // 工号和姓名对应的列表
          this.jobNumberName = jobNumberName;
          // 以上获取了工号，姓名对应表
          console.log("-----------------------");
          let TotalData = [];
          let TempObj = [];
          console.log(jobNumber);
          let status_map = {
            1: "正常",
            2: "迟到",
            3: "早退",
            4: "下午缺勤",
            5: "缺勤",
            6: "迟到并早退",
            7: "因公外出",
            8: "请假"
          };

          for (let i = 0; i < jobNumber.length; i++) {
            // 遍历所有工号
            let tempobj = {};
            let innerDateKeys = Object.keys(success.data[jobNumber[i]]); // 一个人的全部打卡日期
            for (let j = 0; j < innerDateKeys.length; j++) {
              let Date = innerDateKeys[j].slice(0, 10);
              let tempData = success.data[jobNumber[i]][innerDateKeys[j]];
              let lateTime = "";
              let leaveEarlyTime = "";
              lateTime = Math.abs(parseInt(tempData.late_time));
              leaveEarlyTime = tempData.leave_early_time;
              let statusNumber = tempData.status;
              let status;
              if (statusNumber === 1) {
                status = status_map[statusNumber];
              } else if (statusNumber === 2) {
                status = status_map[statusNumber] + ":" + lateTime + "分钟";
              } else if (statusNumber === 3) {
                status =
                  status_map[statstatusNumberus] +
                  ":" +
                  leaveEarlyTime +
                  "分钟";
              } else if (statusNumber === 4) {
                status = status_map[statusNumber];
              } else if (statusNumber === 5) {
                status = status_map[statusNumber];
              } else if (statusNumber === 6) {
                status =
                  "迟到:" +
                  lateTime +
                  "分钟" +
                  "|" +
                  "早退:" +
                  leaveEarlyTime +
                  "分钟";
              } else if (statusNumber === 7) {
                status = status_map[statusNumber];
              } else if (statusNumber === 8) {
                status = status_map[statusNumber];
              }

              tempobj[Date] = status;
            }
            tempobj.jobNumber = jobNumber[i];
            tempobj.Name = jobNumberName[jobNumber[i]];
            TotalData.push(tempobj);
          }
          console.log(TotalData);
          this.TotalData = TotalData;
        },
        fail => {
          console.log(fail);
        }
      );
      this.listLoading = false;
    },
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "sheetjs.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
</script>

