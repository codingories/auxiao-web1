<template>
  <div class="app-container">
    <datePicker
      :options="calendarArr"
      class="calendar"
      @handleClickDay="handleClickDay"
      @handlePrevMonth="handlePrevMonth"
      @handleNextMonth="handleNextMonth"
    />

    <el-calendar v-model="elDate">
    </el-calendar>

    <div class="switchDay" v-for="(item, index) in dayList" :key="index">
      <span>{{dayList[index].day}}</span>
      <el-switch v-model="dayList[index].ifWorkDay" active-text="工作日" inactive-text="休息日"></el-switch>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" width="180">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span style="margin-left: 10px">{{ scope.row.ID }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="考勤组" width="180">-->
        <!--<template slot-scope="scope">-->
          <!--<div slot="reference" class="name-wrapper">-->
            <!--<el-tag size="medium">{{ scope.row.group }}</el-tag>-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="是否考勤">
        <!-- <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>-->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.check" active-text inactive-text></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="考勤参照日">
        <template slot-scope="scope">
          <span>{{ scope.row.reference }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import datePicker from "../../components/date-picker";
import datePicker from "../../components/date-picker";

export default {
  name: "date-picker",
  data() {
    return {
      elDate: new Date(),
      value: true,
      calendarArr: {
        type: "combination",
        headStyle: {
          todayBtn: "right",
          combination: "center",
          checkBtn: "right"
        },
        viewStyle: {
          day: "right"
        },
        calendarData: []
      },
      tableData: [
        {
          ID: "1",
          group: "在编",
          check: true,
          reference:
            "星期一,星期二,星期三,星期四,07:45:00-16:20:00;星期五,07:45:00-15:30:00;"
        },
        // {
        //   ID: "2",
        //   group: "非编",
        //   check: true,
        //   reference:
        //     "星期一,星期二,星期三,星期四,07:45:00-16:20:00;星期五,07:45:00-15:30:00;"
        // }
      ],
      dayList: []
    };
  },
  components: {
    datePicker
  },
  methods: {
    handleClickDay(item) {
      let weekDayDict = {
        1: "周一",
        2: "周二",
        3: "周三",
        4: "周四",
        5: "周五",
        6: "周六",
        0: "周日"
      };
      let month = item.date.getMonth() + 1;
      let dateStr = "";

      dateStr =
        item.year +
        "年" +
        month +
        "月" +
        item.day +
        "日" +
        weekDayDict[item.weekday] +
        ":";

      let tempObj = { day: dateStr };
      if (item.weekday === 6 || item.weekday === 0) {
        tempObj.ifWorkDay = false;
      } else {
        tempObj.ifWorkDay = true;
      }
      this.dayList = [];
      this.dayList.push(tempObj);
      // for(let i=0;i<this.dayList.length;i++){
      //   if(this.dayList[i]!==tempObj)
      // }
      // console.log(dateStr);
      var obj = {};
      this.dayList = this.dayList.reduce(function(item, next) {
        obj[next.day] ? "" : (obj[next.day] = true && item.push(next)); // obj[next.day] = true 这句话会让obj变为 {2019-11-1:ture}
        return item;
      }, []);
    },
    handlePrevMonth() {},
    handleNextMonth() {},
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style scoped>
.switchDay {
  /* border: 1px solid red; */
  display: flex;
  align-items: baseline;
}
.switchDay span {
  line-height: 1;
  font-size: 14px;
  display: inline-block;
}
</style>
