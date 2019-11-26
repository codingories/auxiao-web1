<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">userID: {{ userID }}</div>
    <div class="dashboard-text">token: {{ token }}</div>-->
    <!-- <h2>{{username}}</h2>
    <h2>{{email}}</h2>
    <h2>{{personName}}</h2>
    <h2>{{phone}}</h2>
    <h2>{{sex}}</h2>-->
    <!-- ref="form" :model="form" -->
    <el-form>
      <el-form-item label="账号">
        <el-input
          v-model="username"
          :disabled="true"
          class="inputstyle"
          size="medium"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="邮箱">
        <el-input v-model="email" class="inputstyle" size="medium"></el-input>
      </el-form-item>-->
      <el-form-item label="姓名">
        <el-input
          v-model="personName"
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input
          v-model="phone"
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="旧密码">
        <el-input
          type="password"
          v-model="oldPassword"
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input
          type="password"
          v-model="newPassword"
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="重复密码">
        <el-input
          type="password"
          v-model="repeatPassword"
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="微信">
        <el-input
          :disabled="isDisable"
          class="inputstyle"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <!-- <el-input v-model="sex" :disabled="isDisable" class="inputstyle" size="medium"></el-input> -->
        <el-radio-group v-model="sex" :disabled="isDisable">
          <el-radio label="1">男</el-radio>
          <el-radio label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="changeStatus">编辑</el-button>
    <el-button type="success" @click="confirmData">确认</el-button>
    <el-button type="warning" @click="cancelData">取消</el-button>

    <!-- <el-input v-model="username" class="inputstyle" placeholder="用户名" size="medium" width="200px"></el-input> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getPersonalInfo,
  editUserInfo,
  changePassword
} from "@/api/personalCenter";

export default {
  data() {
    return {
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
      oldPassword: "",
      newPassword: "",
      repeatPassword: ""
    };
  },
  name: "dashboard",
  computed: {
    ...mapGetters(["name", "userID", "token"])
  },
  created() {
    this.fetchPersonal();
  },
  methods: {
    fetchPersonal() {
      let user_id = this.userID;
      let access_token = this.token;
      getPersonalInfo(user_id, access_token).then(
        success => {
          console.log(success);
          this.username = success.data.username;
          this.email = success.data.email;
          this.personName = success.data.name;
          this.sex = success.data.gender;
          this.phone = success.data.mobile;
        },
        err => {
          console.log(err);
        }
      );
    },
    changeStatus() {
      this.isDisable = false;
    },
    confirmData() {
      this.isDisable = true;
      console.log(this.token);
      console.log(this.username);
      console.log(this.phone);
      console.log(this.sex);
      let obj = {
        access_token: this.token,
        name: this.personName,
        mobile: this.phone,
        gender: this.sex
      };
      editUserInfo(obj).then(
        success => {
          console.log(success);
        },
        fail => {
          console.log(fail);
        }
      );
      let obj1 = {
        access_token: this.token,
        old_password: this.oldPassword,
        new_password: this.newPassword
      };
      if (this.repeatPassword !== this.newPassword) {
        alert("两次密码不同");
      } else {
        changePassword(obj1).then(
          resolve => {
            alert("修改成功");
          },
          reject => {
            alert("出错，请重新输入");
          }
        );
      }
    },
    cancelData() {
      this.isDisable = true;
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
</style>
