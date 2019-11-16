<template>
  <div class="app-container">
    <div class="app-container">
      <h2>流程汇总</h2>
      <el-button type="primary">刷新</el-button>
      <el-button type="success">筛选</el-button>
      <el-button type="info">新增</el-button>
      <el-button type="warning">导出</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="ID" label="ID" width="180"></el-table-column>
        <el-table-column prop="label" label="标识" width="180"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="permission" label="权限"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="refreshTime" label="更新时间"></el-table-column>
        <el-table-column prop="operation" label="操作"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getGroups } from "@/api/AttendanceGroup";
// import { getTotalAttendance } from "@/api/totalAttendance";
import { chooseAttendanceGroup } from "@/api/chooseAttendance";

import store from "@/store";
export default {
  data() {
    return {
      access_token: store.getters.token,
      getGroupsLoading: false,
      RawGroupData: [],
      tableData: [],
      addAttendance: [],
      multipleSelection: []
      // this.getRulesName() || "保底"
    };
  },
  watch: {},

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth);
    }
  },

  created() {
    this.fetchGroupData();
  },

  methods: {
    fetchGroupData() {
      let access_token = this.access_token;
      let access_token_obj = { access_token: this.access_token };
      this.getGroupsLoading = true;
      getGroups(access_token_obj).then(success => {
        // console.log(success);
        this.RawGroupData = success.data;
        console.log("this.RawGroupData,this.RawGroupData");
        console.log(this.RawGroupData);
        console.log(typeof this.RawGroupData);
        // this.RawRuleData = success.data[0];
        let tempKeys0 = Object.keys(this.RawGroupData);
        console.log(tempKeys0);
        let dateMap = {
          1: "星期六",
          2: "星期日",
          3: "星期一",
          4: "星期二",
          5: "星期三",
          6: "星期四",
          7: "星期五"
        };
        let finalList = [];
        let index = 1;
        let AddAttendanceObjList = [];
        for (let i of tempKeys0) {
          let finalObj = { ID: "", ruleName: "", content: "" };
          let str = "";
          finalObj.ruleName = this.RawGroupData[i].rule.name;
          console.log(this.RawGroupData[i].users);
          // console.log(
          //   Object.prototype.toString.call(this.RawGroupData[i].users)
          // );

          let nameMap = { "2": "在编", "3": "非编" };
          if (this.RawGroupData[i].users !== null) {
            for (let k of this.RawGroupData[i].users) {
              let AddAttendanceObj = {};
              AddAttendanceObj.id = k.workno; // id改成
              AddAttendanceObj.name = k.name;
              AddAttendanceObj.attendance_group_id =
                nameMap[k.attendance_group_id];
              console.log("AddAttendanceObjAddAttendanceObjAddAttendanceObj");
              console.log(AddAttendanceObj);
              AddAttendanceObjList.push(AddAttendanceObj);
            }
            this.addAttendance = AddAttendanceObjList;
          }

          let tempKeys1 = Object.keys(this.RawGroupData[i].rule.items);
          let tempObj1 = {};
          let tempObj2 = {};
          for (let j of tempKeys1) {
            console.log("-------");
            // console.log(this.RawGroupData[i].rule.items[j].day);
            // console.log(this.RawGroupData[i].rule.items[j].end_time);
            // console.log(this.RawGroupData[i].rule.items[j].start_time);
            let tempStrKey = "";
            tempStrKey +=
              this.RawGroupData[i].rule.items[j].start_time +
              "-" +
              this.RawGroupData[i].rule.items[j].end_time;
            tempObj1[
              dateMap[this.RawGroupData[i].rule.items[j].day]
            ] = tempStrKey;
            tempObj2[tempStrKey] = "";

            // let tempKeys2 = Object.keys(this.RawGroupData[i].rule.items[j]);
            // for (let k of tempKeys2) {
            //   console.log(k);
            // }
          }
          for (let i of Object.keys(tempObj2)) {
            for (let j of Object.keys(tempObj1)) {
              if (tempObj1[j] === i) {
                tempObj2[i] += j + ",";
              }
            }
          }
          for (let k in tempObj2) {
            let value = tempObj2[k];
            tempObj2[value] = k;
            delete tempObj2[k];
          }
          let tempObj3 = Object.keys(tempObj2);
          for (let i of tempObj3) {
            str += i + tempObj2[i] + ";";
          }
          finalObj.content = str;
          finalObj.ID = index;
          finalList.push(finalObj);

          index++;
          console.log(finalObj);
        }
        this.tableData = finalList;
      });

      this.getGroupsLoading = false;
    },

    chooseAttendance(arg) {
      console.log(arg);
      console.log("------");
      let temp_obj = {
        access_token: this.access_token,
        attendance_group_id: "",
        user_ids: ""
      };
      let user_id_list = [];
      console.log(this.multipleSelection);
      for (let i of this.multipleSelection) {
        console.log(i.id);
        user_id_list.push(i.id);
        for (let k of this.addAttendance) {
          // console.log(k);
          if (k.id === i.id) {
            // user_id += k.id;
            if (arg === 3) {
              temp_obj.attendance_group_id = arg;
              k.attendance_group_id = "非编";
            } else {
              temp_obj.attendance_group_id = arg;
              k.attendance_group_id = "在编";
            }
          }
        }
        console.log(user_id_list);
        let user_id = user_id_list.join(",");
        // console.log(user_id);
        temp_obj.user_ids = user_id;

        // if (arg === 3) {
        //   this.addAttendance[i.id - 1].attendance_group_id = "非编";
        // } else if (arg === 2) {
        //   this.addAttendance[i.id - 1].attendance_group_id = "在编";
        // }
      }
      console.log(temp_obj);
      if (temp_obj.attendance_group_id === "" || temp_obj.user_ids === "") {
        return;
      } else {
        chooseAttendanceGroup(temp_obj);
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    }
  }
};
</script>

