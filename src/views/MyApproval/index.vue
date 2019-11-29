<template>
  <div class="app-container">
    <div class="app-container">
      <h2>我的审批</h2>
      <!--<h2>{{initDataList}}</h2>-->
      <el-button type="primary">刷新</el-button>
      <el-button type="success">筛选</el-button>
      <el-button type="info">新增</el-button>
      <el-button type="warning">导出</el-button>

      <el-table :data="myApplicationTable" style="width: 100%">
        <el-table-column prop="flowName" label="流程名" />
        <el-table-column prop="position" label="部门" />
        <el-table-column prop="name" label="申请人" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="createAt" label="申请日期" width="200px" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="查看" width="200px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">批复</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleProcess(scope.$index, scope.row)"
            >进程明细</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="批复" :visible.sync="dialogTableVisible" width="400px">
        <h3>标题：{{ processTitle }}</h3>
        <el-table :data="gridData" style="width: 100%">
          <el-table-column property="name" label width="150" />
          <el-table-column property="value" label width="200" />
        </el-table>
        <h3>批复意见</h3>
        <el-input v-model="content" type="textarea" :rows="2" placeholder="请输入内容" class="textarea" />
        <el-button type="success" size="small" @click="nextStep()">通过并进入下一步</el-button>
        <el-button type="danger" size="small" @click="reject()">驳回</el-button>
      </el-dialog>

      <el-dialog title="审批进程" :visible.sync="dialogTableVisible1">
        <h3>标题：{{ processTitle }}</h3>
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(step, index) in processApprove"
              :key="index"
              timestamp
              placement="top"
            >
              <!-- <van-cell-group :title="'标题：' + entryDetailData.title" > -->
              <el-card>
                <h4>{{ step.process_name }}</h4>
                <p>
                  【当前状态】
                  <el-tag v-show="step.status == '0'" mark type="warning">进行中</el-tag>
                  <el-tag v-show="step.status == '9'" mark type="success">通过</el-tag>
                  <el-tag v-show="step.status == '-1'" mark type="danger">驳回</el-tag>
                  <el-tag v-show="step.status == '-2'" mark>已撤销</el-tag>
                  <el-tag v-show="step.status == '-9'" mark>草稿</el-tag>
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

      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalTableNumber">
        </el-pagination>
      </div>

      <!--<div class="block">-->
        <!--<span class="demonstration"></span>-->
        <!--<el-pagination-->
          <!--@size-change="handleSizeChange"-->
          <!--@current-change="handleCurrentChange"-->
          <!--:current-page="currentPage"-->
          <!--:page-sizes="[10, 20, 100]"-->
          <!--:page-size="10"-->
          <!--layout="total, sizes, prev, pager, next, jumper"-->
          <!--:total="totalTableNumber">-->
        <!--</el-pagination>-->
      <!--</div>-->

      <h2>已审批</h2>
      <el-table :data="myfinishApplicationTable" style="width: 100%">
        <el-table-column prop="flowName" label="流程名" />
        <el-table-column prop="position" label="部门" />
        <el-table-column prop="name" label="申请人" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="createAt" label="申请日期" width="200px" />
        <el-table-column prop="status" label="状态" />
        <!--<el-table-column label="查看" width="200px">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">批复</el-button>-->
        <!--<el-button-->
        <!--size="mini"-->
        <!--@click="handleProcess(scope.$index, scope.row)"-->
        <!--type="danger"-->
        <!--&gt;进程明细</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[10, 20, 100]"
          :page-size="pageSize1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="finishedTableNumber">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import {
  getUserFlowsApprovals,
  getEntryDetail,
  resolvedApproval,
  rejectedApproval,
  getUserFlows
} from '@/api/MyApproval.js'
// import { getTotalAttendance } from "@/api/totalAttendance";

import store from '@/store'
export default {
  data() {
    return {
      access_token: store.getters.token,
      ApprovalTable: [],
      myApplicationTable: [],
      finishApplicationTable: [],
      myfinishApplicationTable:[],
      initDataloding: false,
      currentPage: 1,
      currentPage1:1,
      finishedCurrentPage :1,
      finishedPagesize:[15,25,80],
      pageSize: 10,
      pageSize1: 10,
      dialogTableVisible: false,
      gridData: [],
      processTitle: '',
      content: '',
      processID: '',
      dialogTableVisible1: false,
      processApprove: [],
      initDataList: [],
      currentPage4:1
    }
  },

  computed: {
    totalTableNumber() {
      return this.ApprovalTable.length
    },
    finishedTableNumber() {
      return this.finishApplicationTable.length
    }
  },
  watch: {},

  created() {
    this.initDataloding = true
    this.getApprovals()
    this.initGetUserFlows()
    this.initDataloding = false
  },

  methods: {

    initGetUserFlows() {
      getUserFlows({ access_token: this.access_token }).then((res) => {
        const dataObj = res.data.handle_procs || null
        const arrayObj = []
        Object.values(dataObj).forEach((item) => {
          arrayObj.push(item)
        })
        const statusMap = {
          '0': '进行中',
          '9': '通过',
          '-1': '驳回',
          '-2': '已撤销',
          '-9': '草稿'
        }
        for (const i of arrayObj) {
          const obj = {
            flowName: '',
            position: '',
            name: '',
            title: '',
            createAt: '',
            status: ''
          }
          const emp = 'emp'
          obj.flowName = i[0].entry.title
          obj.position = i[0].entry[emp].position
          obj.name = i[0].entry[emp].name
          obj.title = i[0].entry.title
          obj.createAt = i[0].created_at
          obj.status = statusMap[i[0].status]
          this.finishApplicationTable.push(obj)
        }
        this.myfinishApplicationTable = this.finishApplicationTable
        this.loading = false
      })
    },

    nextStep() {
      this.$confirm('将通过进入下一步, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          const obj = {
            access_token: this.access_token,
            process_id: this.processID,
            content: this.content
          }
          resolvedApproval(obj).then(resolve => {
            // this.$alert("通过成功");
            this.$message({
              type: 'success',
              message: '通过成功!'
            })
          })
          this.dialogTableVisible = false
          location.reload()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    reject() {
      this.$confirm('将驳回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          const obj = {
            access_token: this.access_token,
            process_id: this.processID,
            content: this.content
          }
          console.log(obj)
          this.loading = true
          rejectedApproval(obj).then(resolve => {
            this.$alert('驳回成功')
            this.loading = false
          })
          this.dialogTableVisible = false
          location.reload()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleEdit(index, row) {
      this.processID = row.passid
      // console.log(this.access_token);
      console.log({
        access_token: this.access_token,
        entry_id: row.id
      })
      this.dialogTableVisible = true
      this.loading = true
      getEntryDetail({
        access_token: this.access_token,
        entry_id: row.id
      }).then(res => {
        this.processTitle = row.title
        console.log(res)
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
        this.templateFormsData = []
        this.templateFormsData = res.data.template_forms
        this.gridData = []
        for (const i of this.templateFormsData) {
          const obj = {}
          obj.name = i.field_name
          obj.value = i.field_value
          this.gridData.push(obj)
        }
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.myApplicationTable = this.ApprovalTable.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    },
    handleSizeChange1(val) {
      console.log("进入页面改变"+val)
      this.pageSize1 = val
      this.myfinishApplicationTable = this.finishApplicationTable.slice(
        (this.currentPage1 - 1) * this.pageSize1,
        this.currentPage1 * this.pageSize1
      )
      console.log(this.myfinishApplicationTable)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.myApplicationTable = this.ApprovalTable.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      )
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val
      this.myfinishApplicationTable = this.finishApplicationTable.slice(
        (val - 1) * this.pageSize1,
        val * this.pageSize1
      )
    },

    getApprovals() {
      getUserFlowsApprovals({ access_token: this.access_token }).then(res => {
        console.log(res)
        const list = res.data.procs
        const statusMap = {
          '0': '进行中',
          '9': '通过',
          '-1': '驳回',
          '-2': '已撤销',
          '-9': '草稿'
        }
        for (const i of list) {
          const obj = {
            flowName: '',
            position: '',
            name: '',
            title: '',
            createAt: '',
            status: ''
          }

          obj.flowName = i.flow.flow_name
          obj.position = i.entry.emp.position
          obj.name = i.entry.emp.name
          obj.title = i.entry.title
          obj.createAt = i.created_at
          obj.status = statusMap[i.status]
          obj.id = i.entry_id
          obj.passid = i.id
          this.ApprovalTable.push(obj)
        }
        this.myApplicationTable = this.ApprovalTable
        this.loading = false
      })
    },
    handleProcess(index, row) {
      console.log(index, row)
      this.dialogTableVisible1 = true
      this.loading = true
      this.processTitle = row.title
      getEntryDetail({
        access_token: this.accessToken,
        entry_id: row.id
      }).then(res => {
        console.log(res)
        // this.initEntryDetailData = res.data.entry;
        this.processApprove = []
        this.gridData1 = []
        for (const i of res.data.procs) {
          const obj = {}
          obj.process_name = i.process_name
          obj.status = i.status
          obj.emp_name = i.emp_name
          obj.auditor_name = i.auditor_name
          obj.content = i.content
          obj.updated_at = i.updated_at
          this.processApprove.push(obj)
        }
        this.processApprove = this.processApprove.reverse()
        this.loading = false
      })
      this.loading = false
    }
  }
}
</script>

<style  scoped>
.textarea {
  margin-bottom: 20px;
}
</style>
