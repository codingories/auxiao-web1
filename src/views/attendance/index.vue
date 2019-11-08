<template>
  <div class="app-container">
    <h2>当前是考勤汇总页面</h2>
    <el-button type="primary" @click="lastMonth">上一月</el-button>
    <el-button type="success" @click="nextMonth">下一月</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        :prop="tableHeader[i].prop"
        :label="tableHeader[i].label"
        width="60"
        v-for="(item,i) in tableHeader"
        :key="i"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTotalAttendance } from "@/api/totalAttendance";
import store from "@/store";
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
        { prop: "Name", label: "姓名" }
      );
      return daysList;
    },
    getData() {
      return this.TotalData;
    },
    lastMonth() {
      if (this.tableMonth > 1) {
        this.tableMonth -= 1;
      }
      this.$forceUpdate();
    },
    nextMonth() {
      if (this.tableMonth < 12) {
        this.tableMonth += 1;
      }
    },
    fetchTotalData() {
      this.listLoading = true;
      this.access_token = store.getters.token;
      console.log(this.access_token);
      getTotalAttendance({ access_token: this.access_token }).then(
        success => {
          let nameList = {};
          this.TotalRawData = success.data;
          let jobNumber = Object.keys(success.data); // 获得最外层所有工号
          let RawData = Object.values(success.data); // 数组，日期为键的obj
          let jobNumberMapName = [];
          for (let i = 0; i < RawData.length; i++) {
            jobNumberMapName.push(Object.values(RawData[i])[0].user.name); // 所有名字的列表
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
          for (let i = 0; i < jobNumber.length; i++) {
            // 遍历所有工号
            let tempobj = {};
            let innerDateKeys = Object.keys(success.data[jobNumber[i]]); // 一个人的全部打卡日期
            for (let j = 0; j < innerDateKeys.length; j++) {
              let Date = innerDateKeys[j].slice(0, 10);
              let Status =
                success.data[jobNumber[i]][innerDateKeys[j]].status_display;
              tempobj[Date] = Status;
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
    }
  }
};
</script>

