<template>
  <div class="dashboard-container">
    <!-- <el-button type="primary" @click="changeStatus">编辑</el-button> -->
    <!-- <el-button type="success" @click="confirmData">确认</el-button> -->
    <!-- <el-input v-model="username" class="inputstyle" placeholder="用户名" size="medium" width="200px"></el-input> -->
    <!-- <h2>{{infoData}}</h2> -->
    <el-row>
      <el-col
        v-for="(item, i) in topContent"
        :key="i"
        :xl="1"
        :md="1"
        :sm="1"
        :xs="1"
        class="item-marign-right"
      >
        <div class="top-item" @click="fillFlowDetails(item.flowId,item.flowName)">
          <div>{{ item.flowName }}</div>
        </div>
      </el-col>
      <el-col :xl="1" :md="1" :sm="1" :xs="1" class="item-marign-right">
        <div class="top-item addStyle" @click="dialogVisible = true">
          <div>+</div>
        </div>
      </el-col>

      <el-dialog
        :title="flow_name"
        :visible.sync="processDialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <!-- <div v-for="(item,i) in addItemList" :key="i">
          <el-checkbox v-model="item.checked">{{item.flowName}}</el-checkbox>
        </div>-->
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题*">
            <el-input v-model="form.title" />
          </el-form-item>

          <el-form-item
            v-for="(item, i) in formList"
            v-if="item.field_type === 'text'"
            :key="i"
            :label="item.field_name"
          >
            <el-input v-model="form[item.field]" />
          </el-form-item>

          <el-form-item
            v-for="(item, i) in formList"
            v-if="item.field_type === 'date'"
            :key="i"
            :label="item.field_name"
          >
            <el-date-picker
              v-model="form[item.field]"
              type="dates"
              placeholder="选择日期时间"
              default-time="12:00:00"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd 00:00:00"
            />
          </el-form-item>
          <el-form-item
            v-for="(item, i) in formList"
            v-if="item.field_type !== 'text' && item.field_type !== 'date'"
            :key="i"
            :label="item.field_name"
          >
            <el-input v-model="form[item.field]" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="processDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="formConfirmStatus">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="添加流程" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div v-for="(item, i) in addItemList" :key="i">
          <el-checkbox v-model="item.checked">{{ item.flowName }}</el-checkbox>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmStatus">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <div class="status">
      <div class="status-first">
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :header-cell-style="{ background: 'rgba(253,112,116,50%)' }"
            :data="tableData"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px" />
          </el-table>
        </div>
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :header-cell-style="{ background: 'rgba(254,223,116,50%)' }"
            :data="applyTable"
            border
            style="width: 401px"
            class="mycell"
          >
            <el-table-column prop="applyInfo" label="我的申请" width="400px">
              <template slot="header" slot-scope="{ column, $index }">
                我的申请
                <a class="more" @click="myApplyDetail">更多>></a>
              </template>
              <template slot-scope="scope">
                <div class="myApplyDetail">
                  <div>{{scope.row["applyInfo"]}}</div>
                  <div>{{scope.row["applyStatus"]}}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="status-first">
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :data="tableData"
            :header-cell-style="{ background: 'rgba(99,211,133,50%)' }"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px" />
          </el-table>
        </div>
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :data="tableData"
            :header-cell-style="{ background: 'rgba(119,201,255,50%)' }"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPersonalInfo, editUserInfo } from "@/api/personalCenter";
import {
  getUserFlows,
  getFlowTemplate,
  createEntry,
  getEntries
} from "@/api/getUserFlows";
import store from "@/store";

export default {
  name: "Dashboard",
  data() {
    return {
      flow_id: "",
      flow_name: "",
      access_token: store.getters.token,
      checked: true,
      initDataloding: false,
      infoData: null,
      addItemList: [],
      formList: [],
      processDialogVisible: false,
      dialogVisible: false,
      topContent: [], // "待办事项", "通知提醒", "采购", "报损"
      span: "3",
      isDisable: true,
      username: "",
      email: "",
      personName: "",
      phone: "",
      sex: "",
      form: {},
      tableData: [
        {
          info: "[通知] xxxxxx (2019-xx-xx)"
        },
        {
          info: "[通知] xxxxxx (2019-xx-xx)"
        },
        {
          info: "[通知] xxxxxx (2019-xx-xx)"
        }
      ],
      applyTable: []
    };
  },
  computed: {
    ...mapGetters(["name", "userID", "token"])
  },
  created() {
    this.initDataloding = true;
    this.initData();
    this.getApplies();
    this.initDataloding = false;
  },

  methods: {
    getApplies() {
      getEntries({ access_token: this.access_token }).then(res => {
        console.log("===getEntries===");
        console.log(res.data.slice(0, 3));
        let list = res.data.slice(0, 3);
        let statusMap = { "0": "进行中", "9": "通过", "-1": "驳回" };
        for (let i of list) {
          let obj = {};
          let tempstr = "";
          tempstr += i.created_at.substring(5, 10) + "|" + i.title;
          obj.applyInfo = tempstr;

          obj.applyStatus = statusMap[i.status];
          this.applyTable.push(obj);
        }
      });
    },
    clearAll() {},
    myApplyDetail() {
      let host = window.location.host;
      let uri = "http://" + host + "/#/workflow/MyApplication";
      window.location = uri;
    },
    fillFlowDetails(item, name) {
      console.log(item, name);
      console.log("---");
      console.log(this.access_token);

      this.flow_id = item;
      this.flow_name = name;

      console.log({
        accessToken: this.access_token,
        flow_id: item,
        flow_name: name
      });
      console.log(item, this.form);
      console.log(item.length, name.length);
      console.log("===");
      // if (item.length === 0 || name.length === 0) {
      //   alert("错误");
      // } else {
      // }

      getFlowTemplate({ accessToken: this.access_token, flow_id: item }).then(
        success => {
          this.formList = [];
          this.form = {};
          // console.log(success.data.template_forms)
          for (const i of success.data.template_forms) {
            const tempObj = {};
            tempObj.field_name = i.field_name;
            tempObj.field = i.field;
            tempObj.field_type = i.field_type;
            this.formList.push(tempObj);
          }
        },
        fail => {
          console.log(fail);
        }
      );

      this.processDialogVisible = true;
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    formConfirmStatus() {
      console.log("access_token", this.access_token);
      console.log(this.flow_id);
      console.log(this.flow_name);
      console.log(this.form);
      let access_token = this.access_token;
      let flow_id = this.flow_id;
      let flow_name = this.flow_name;
      let tpl = this.form;
      let obj = { access_token, flow_id, flow_name, tpl };
      if (tpl["title"].trim()) {
        createEntry(obj).then(
          success => {
            console.log(success);
            this.$alert("<strong>请求成功</strong>", {
              dangerouslyUseHTMLString: true
            });
            this.applyTable = [];
            this.getApplies();
          },
          fail => {
            console.log(fail);
          }
        );
      } else {
        this.$alert("<strong>标题忘记填写了，请检查！</strong>", {
          dangerouslyUseHTMLString: true
        });
      }

      this.processDialogVisible = false;
    },
    confirmStatus() {
      this.dialogVisible = false;
      this.topContent = [];
      for (const i of this.addItemList) {
        if (i.checked === true) {
          this.topContent.push(i);
        } else {
          this.topContent = this.topContent.filter(
            item => item.flowId !== i.flowId
          );
        }
      }
    },
    initData() {
      getUserFlows({ access_token: this.accessToken }).then(res => {
        this.infoData = res.data;
        for (const i of this.infoData.flows) {
          const tempobj = {};
          tempobj.flowName = i.flow_name;
          tempobj.flowId = i.id;
          tempobj.checked = true;
          this.addItemList.push(tempobj);
          this.topContent.push({ flowName: i.flow_name, flowId: i.id });
        }
        // this.GET_USER_FLOWS(res.data.data);
        this.initDataloding = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.inputstyle {
  width: 330px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.top-item {
  cursor: pointer;
  border: 1px solid rgb(124, 184, 242);
  width: 60px;
  height: 60px;
  border-radius: 10px;
  font-size: 20px;
  color: rgb(124, 184, 242);
  display: flex;
  justify-content: center;
  align-items: center;
  // margin-right: 10px;
  box-shadow: 2px 2px 3px 3px rgba(0, 0, 0, 0.1);
}

.top-item > div {
  text-align: center;
}
.item-marign-right {
  margin-right: 20px;
}
.status {
  display: flex;
  // border: 1px solid black;
  flex-direction: column;
}
.status > .status-first {
  margin-right: 30px;
  margin-bottom: 30px;
  // border: 1px solid blue;
  display: flex;
  // flex-wrap: wrap;
}

.status-second {
  // border: 1px solid yellow;
  display: flex;
  margin-right: 30px;
}

.addStyle {
  cursor: pointer;
}

.more {
  margin-left: 250px;
}

.myApplyDetail {
  display: flex;
  justify-content: space-between;
}
</style>
