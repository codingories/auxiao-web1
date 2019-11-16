<template>
  <div class="dashboard-container">
    <!-- <el-button type="primary" @click="changeStatus">编辑</el-button> -->
    <!-- <el-button type="success" @click="confirmData">确认</el-button> -->
    <!-- <el-input v-model="username" class="inputstyle" placeholder="用户名" size="medium" width="200px"></el-input> -->
    <el-row>
      <el-col
        :xl="1"
        :md="2"
        :sm="1"
        :xs="1"
        class="item-marign-right"
        v-for="(item,i) in topContent"
        :key="i"
      >
        <div class="top-item">
          <div>{{item}}</div>
        </div>
      </el-col>
      <el-col :xl="1" :md="1" :sm="1" :xs="1" class="item-marign-right">
        <div class="top-item addStyle" @click="dialogVisible = true">
          <div>+</div>
        </div>
      </el-col>

      <el-dialog title="添加流程" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div v-for="(item,i) in addItemList" :key="i">
          <el-checkbox v-model="item.checked">{{item.itemName}}</el-checkbox>
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
            :header-cell-style="{background:'rgba(253,112,116,50%)'}"
            :data="tableData"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px"></el-table-column>
          </el-table>
        </div>
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :header-cell-style="{background:'rgba(254,223,116,50%)'}"
            :data="tableData"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="status-first">
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :data="tableData"
            :header-cell-style="{background:'rgba(99,211,133,50%)'}"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px"></el-table-column>
          </el-table>
        </div>
        <div class="status-second">
          <!-- style="width: 100%" -->
          <el-table
            :data="tableData"
            :header-cell-style="{background:'rgba(119,201,255,50%)'}"
            border
            style="width: 401px"
          >
            <el-table-column prop="info" label="通知公告" width="400px"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPersonalInfo, editUserInfo } from "@/api/personalCenter";

export default {
  data() {
    return {
      checked: true,
      addItemList: [
        { itemName: "待办事项", checked: true },
        { itemName: "通知提醒", checked: true },
        { itemName: "我的申请", checked: false }
      ],
      dialogVisible: false,
      topContent: ["待办事项", "通知提醒"],
      span: "3",
      isDisable: true,
      username: "",
      email: "",
      personName: "",
      phone: "",
      sex: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
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
      ]
    };
  },
  name: "dashboard",
  computed: {
    ...mapGetters(["name", "userID", "token"])
  },
  created() {},
  methods: {
    addBox() {
      console.log(123);
      this.topContent.push("1");
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    confirmStatus() {
      this.dialogVisible = false;
      for (let i of this.addItemList) {
        if (i.checked === true) {
          console.log(i.itemName);
          // let item = i.itemName;
          console.log(this.topContent);
          // let itemList = this.topContent;
          // console.log(itemList.indexOf(item));
          if (this.topContent.indexOf(i.itemName) !== -1) {
          } else {
            this.topContent.push(i.itemName);
          }
        } else {
          if (this.topContent.indexOf(i.itemName) !== -1) {
            this.topContent.shift(i.itemName);
          } else {
          }
        }
      }
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
</style>
