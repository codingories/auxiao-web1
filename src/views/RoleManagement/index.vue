<template>
  <div class="app-container">
    <h2>角色管理</h2>
    <el-table ref="multipleTable" :data="roleTable" style="width: 100%">
      <el-table-column prop="choose" label="选择" type="selection" />
      <el-table-column prop="id" label="序号" width="180" />
      <el-table-column prop="name" label="角色名" width="180" />
      <el-table-column prop="roleDescription" label="角色描述" />
      <el-table-column prop="isActive" label="是否激活">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column prop="assignUser" label="分配用户" />
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini">授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary">新增</el-button>
    <el-button type="success">编辑</el-button>
    <el-button type="info">删除</el-button>
  </div>
</template>

<script>
import { getRoles } from '@/api/RoleManagement.js'
import { chooseAttendanceGroup } from '@/api/chooseAttendance'

import store from '@/store'
export default {
  data() {
    return {
      value: true,
      access_token: store.getters.token,
      getRolesLoading: false,
      RawGroupData: [],
      roleTable: [],
      addAttendance: [],
      multipleSelection: []
    }
  },

  computed: {
    tableHeader: function() {
      return this.getTableHeader(this.tableYear, this.tableMonth)
    }
  },
  watch: {},

  created() {
    this.fetchRoleData()
  },

  methods: {
    handleEdit(a,b){
      console.log(a,b)
    },
    fetchRoleData() {
      const access_token = this.access_token
      const access_token_obj = { access_token: this.access_token }
      this.getRolesLoading = true
      getRoles(access_token_obj).then(res => {
        this.getRolesLoading = false
        for (const i of res.data) {
          let obj = {}
          obj.id = i.id
          obj.name = i.name
          obj.isActive = false
          this.roleTable.push(obj)
        }
      })

    },

    chooseAttendance(arg) {
      console.log(arg)
      console.log('------')
      const temp_obj = {
        access_token: this.access_token,
        attendance_group_id: '',
        user_ids: ''
      }
      const user_id_list = []
      console.log(this.multipleSelection)
      for (const i of this.multipleSelection) {
        console.log(i.id)
        user_id_list.push(i.id)
        for (const k of this.addAttendance) {
          // console.log(k);
          if (k.id === i.id) {
            // user_id += k.id;
            if (arg === 3) {
              temp_obj.attendance_group_id = arg
              k.attendance_group_id = '非编'
            } else {
              temp_obj.attendance_group_id = arg
              k.attendance_group_id = '在编'
            }
          }
        }
        console.log(user_id_list)
        const user_id = user_id_list.join(',')
        // console.log(user_id);
        temp_obj.user_ids = user_id

        // if (arg === 3) {
        //   this.addAttendance[i.id - 1].attendance_group_id = "非编";
        // } else if (arg === 2) {
        //   this.addAttendance[i.id - 1].attendance_group_id = "在编";
        // }
      }
      console.log(temp_obj)
      if (temp_obj.attendance_group_id === '' || temp_obj.user_ids === '') {
        return
      } else {
        chooseAttendanceGroup(temp_obj)
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    }
  }
}
</script>

