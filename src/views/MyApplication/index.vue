<template>
  <div class="app-container">
    <div class="app-container">
      <h2>我的申请</h2>
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
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
            <el-button
              size="mini"
              @click="handleProcess(scope.$index, scope.row)"
              type="danger"
            >进程明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="详细信息" :visible.sync="dialogTableVisible" width="400px">
        <el-table :data="gridData" style="width: 100%">
          <el-table-column property="name" label="字段名称" width="150"></el-table-column>
          <el-table-column property="value" label="字段值" width="200"></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="审批进程" :visible.sync="dialogTableVisible1">
        <h3>标题：{{ processTitle }}</h3>
        <div class="block">
          <el-timeline>
            <el-timeline-item
              timestamp
              placement="top"
              v-for="(step, index) in processApprove"
              :key="index"
            >
              <!-- <van-cell-group :title="'标题：' + entryDetailData.title" > -->
              <el-card>
                <h4>{{ step.process_name }}</h4>
                <p>
                  【当前状态】
                  <el-tag mark type="warning" v-show="step.status == '0'">进行中</el-tag>
                  <el-tag mark type="success" v-show="step.status == '9'">通过</el-tag>
                  <el-tag mark type="danger" v-show="step.status == '-1'">驳回</el-tag>
                  <el-tag mark v-show="step.status == '-2'">已撤销</el-tag>
                  <el-tag mark v-show="step.status == '-9'">草稿</el-tag>
                </p>
                <p>【发起人】{{ step.emp_name }}</p>
                <p>【审核人】{{ step.emp_name }}</p>
                <p>
                  【操作人】{{
                  step.auditor_name ? step.auditor_name : "等待审核"
                  }}
                </p>
                <p>【批复内容】{{ step.content }}</p>
                <p>【操作时间】{{ step.updated_at }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-dialog>
    </div>
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
</template>

<script>
import { getEntries, getEntryDetail } from "@/api/myApplication";

import store from "@/store";
export default {
  data() {
    return {
      access_token: store.getters.token,
      tableData: [],
      initDataloding: false,
      gridData: [],
      gridData1: [],
      dialogTableVisible: false,
      dialogTableVisible1: false,
      loading: false,
      templateFormsData: [],
      processApprove: [],
      processTitle: "",
      pageSize: 10,
      currentPage: 1,
      myApplicationTable: []
      // total: totalTableNumber()
    };
  },
  watch: {},

  computed: {
    totalTableNumber() {
      return this.tableData.length;
    }
  },

  created() {
    this.initDataloding = true;
    this.getApplies();
    this.initDataloding = false;
  },

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.myApplicationTable = this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.myApplicationTable = this.tableData.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      );
    },
    getApplies() {
      getEntries({ access_token: this.access_token }).then(res => {
        // console.log(res.data.slice(0, 3));
        // let list = res.data.slice(0, 3);
        let list = res.data;
        let statusMap = { "0": "进行中", "9": "通过", "-1": "驳回" };
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
          obj.position = i.emp.position;
          obj.name = i.emp.name;
          obj.title = i.title;
          obj.createAt = i.created_at;
          obj.status = statusMap[i.status];
          obj.id = i.id;
          this.tableData.push(obj);
        }
        if (this.tableData.length >= 10) {
          this.myApplicationTable = this.tableData.slice(0, 10);
        } else {
          this.myApplicationTable = this.tableData;
        }
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
      console.log(row.id);
      console.log(this.access_token);
      this.dialogTableVisible = true;

      this.loading = true;
      getEntryDetail({
        access_token: this.accessToken,
        entry_id: row.id
      }).then(res => {
        console.log(res);
        // this.initEntryDetailData = res.data.entry;
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
    handleProcess(index, row) {
      console.log(index, row);
      this.dialogTableVisible1 = true;
      this.loading = true;
      this.processTitle = row.title;
      getEntryDetail({
        access_token: this.accessToken,
        entry_id: row.id
      }).then(res => {
        console.log(res);
        // this.initEntryDetailData = res.data.entry;
        this.processApprove = [];
        this.gridData1 = [];
        for (let i of res.data.procs) {
          let obj = {};
          obj.process_name = i.process_name;
          obj.status = i.status;
          obj.emp_name = i.emp_name;
          obj.auditor_name = i.auditor_name;
          obj.content = i.content;
          obj.updated_at = i.updated_at;
          this.processApprove.push(obj);
        }
        this.processApprove = this.processApprove.reverse();
        this.loading = false;
      });
      this.loading = false;
    }
  }
};
</script>
