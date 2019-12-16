<!--suppress ALL -->
<template>
  <div class="app-container">
    <div class="app-container">
      <h2>用户管理</h2>
      <!--<el-button type="primary">刷新</el-button>-->
      <!--<el-button type="success">筛选</el-button>-->
      <!--<el-button type="info">新增</el-button>-->
      <!--<el-button type="warning">导出</el-button>-->
      <el-table :data="usersInfoTable" style="width: 100%">
        <el-table-column :prop="item.prop" :label="item.label" v-for="(item,i) in userTableTitle" v-bind:key="i"></el-table-column>
      </el-table>
    </div>
    <!--<div class="block">-->
      <!--<el-pagination-->
        <!--@size-change="handleSizeChange1"-->
        <!--@current-change="handleCurrentChange1"-->
        <!--:current-page="currentPage1"-->
        <!--:page-sizes="[10, 20, 100]"-->
        <!--:page-size="pageSize1"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="finishedTableNumber"-->
      <!--&gt;</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>
import { getUsers } from "@/api/UserManagement.js";

import store from "@/store";
export default {
  data() {
    return {
      userTableTitle : [{label:"用户名", prop:"username"},{label:"姓名", prop:"name"},{label:"工号",prop:"workno"},
        {"label":"email",prop:"email"},{"label":"手机",prop:"mobile"},{"label":"微信",prop:"wechat"},{"label":"角色",prop:"role"}
        ,{"label":"部门/组室",prop:"dept"},{"label":"考勤组",prop:"attendance_group"},{"label":"是否在职",prop:"leave"}
        ],
      access_token: store.getters.token,
      getUsersLoading: false,
      usersInfoTable:[]
    };
  },
  watch: {},

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth);
    }
  },

  created() {
    this.fetchUsersData();
  },

  methods: {
    fetchUsersData() {
      let access_token = this.access_token;
      let access_token_obj = { access_token: this.access_token };
      this.getUsersLoading = true;


      let list = ["username","name",'workno','email','mobile','wechat','role','dept','attendance_group','leave']

      getUsers(access_token_obj).then(success => {

        console.log(success.data.list)
        for(let i of success.data.list){
          console.log(i)
          let obj = {
            username:'',
            name:'',
            workno:'',
            email:'',
            mobile:'',
            wechat:'',
            role:'',
            dept:'',
            attendance_group:'',
            leave:'',
          }
          for (let j of list){
            obj[j] = i[j]
            if(i["leave"]===0){
              obj["leave"] = '在职'
            }else{
              obj["leave"] = '离职'
            }
          }
          this.usersInfoTable.push(obj)

        }
        this.getUsersLoading = false;
      });


    },
  }
};
</script>

