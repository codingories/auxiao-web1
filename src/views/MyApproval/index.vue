<template>
  <div class="app-container">
    <div class="app-container">
      <h2>我的审批</h2>
      <el-button type="primary">刷新</el-button>
      <el-button type="success">筛选</el-button>
      <el-button type="info">新增</el-button>
      <el-button type="warning">导出</el-button>

      <el-table :data="myApplicationTable" style="width: 100%">
        <el-table-column prop="flowName" label="流程名"></el-table-column>
        <el-table-column prop="position" label="部门"></el-table-column>
        <el-table-column prop="name" label="申请人"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="createAt" label="申请日期" width="200px"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="查看" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">批复</el-button>
            <el-button
              size="mini"
              @click="handleProcess(scope.$index, scope.row)"
              type="danger"
            >进程明细</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="批复" :visible.sync="dialogTableVisible" width="400px">
        <h3>标题：{{ processTitle }}</h3>
        <el-table :data="gridData" style="width: 100%">
          <el-table-column property="name" label="字段名称" width="150"></el-table-column>
          <el-table-column property="value" label="字段值" width="200"></el-table-column>
        </el-table>
        <h3>批复意见</h3>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" class="textarea"></el-input>
        <el-button type="success" size="small">通过并进入下一步</el-button>
        <el-button type="danger" size="small">驳回</el-button>
      </el-dialog>

      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalTableNumber"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserFlowsApprovals, getEntryDetail } from "@/api/MyApproval.js";
// import { getTotalAttendance } from "@/api/totalAttendance";

import store from "@/store";
export default {
  data() {
    return {
      access_token: store.getters.token,
      myApprovalTable: [],
      initDataloding: false,
      currentPage: 1,
      pageSize: 10,
      myApplicationTable: [],
      dialogTableVisible: false,
      gridData: [],
      processTitle: "",
      textarea: ""
    };
  },
  watch: {},

  computed: {
    totalTableNumber() {
      return this.myApprovalTable.length;
    }
  },

  created() {
    this.initDataloding = true;
    this.getApprovals();
    this.initDataloding = false;
  },

  methods: {
    handleEdit(index, row) {
      console.log(index, row);
      console.log(row.id);
      // console.log(this.access_token);
      console.log({
        access_token: this.access_token,
        entry_id: row.id
      });
      this.dialogTableVisible = true;
      this.loading = true;
      getEntryDetail({
        access_token: this.access_token,
        entry_id: row.id
      }).then(res => {
        this.processTitle = row.title;
        console.log(res);
        // // this.initEntryDetailData = res.data.entry;
        // this.templateFormsData = [];
        // this.templateFormsData = res.data.template_forms;
        // this.gridData = [];
        // for (let i of this.templateFormsData) {
        //   let obj = {};
        //   obj.name = i.field_name;
        //   obj.value = i.field_value;
        //   this.gridData.push(obj);
        // }
        // this.loading = false;
        this.templateFormsData = [];
        this.templateFormsData = res.data.template_forms;
        this.gridData = [];
        for (let i of this.templateFormsData) {
          let obj = {};
          obj.name = i.field_name;
          obj.value = i.field_value;
          this.gridData.push(obj);
        }
        this.loading = false;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.myApplicationTable = this.myApprovalTable.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.myApplicationTable = this.myApprovalTable.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    },
    getApprovals() {
      getUserFlowsApprovals({ access_token: this.access_token }).then(res => {
        let list = res.data.procs;
        let statusMap = {
          "0": "进行中",
          "9": "通过",
          "-1": "驳回",
          "-2": "已撤销",
          "-9": "草稿"
        };
        for (let i of list) {
          let obj = {
            flowName: "",
            position: "",
            name: "",
            title: "",
            createAt: "",
            status: ""
          };

          obj.flowName = i.flow.flow_name;
          obj.position = i.entry.emp.position;
          obj.name = i.entry.emp.name;
          obj.title = i.entry.title;
          obj.createAt = i.created_at;
          obj.status = statusMap[i.status];
          obj.id = i.entry_id;
          this.myApprovalTable.push(obj);
        }
        this.myApplicationTable = this.myApprovalTable;
        this.loading = false;
      });
    }
  }
};
</script>

<style  scoped>
.textarea {
  margin-bottom: 20px;
}
</style>