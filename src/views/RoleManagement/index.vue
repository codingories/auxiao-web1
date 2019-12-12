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
          <el-button type="warning" size="mini" @click="authorize(scope.$index, scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary">新增</el-button>
    <el-button type="success">编辑</el-button>
    <el-button type="info">删除</el-button>
    <el-dialog
      title="菜单列表"
      :visible.sync="authorizeTableVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="treeContainer">
        <el-tree
          ref="tree"
          :data="authorizeTable"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
      </div>
      <el-button type="success" @click="cancelAuthorizeTable">取消</el-button>
      <el-button type="primary" @click="confirmAuthorizeTable">确认</el-button>
    </el-dialog>

  </div>
</template>

<script>
import { getRoles, getTotalMenuList, authorizeRoles } from '@/api/RoleManagement.js'
import { chooseAttendanceGroup } from '@/api/chooseAttendance'

import store from '@/store'
export default {
  data() {
    return {
      authorizeTableVisible: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      authorizeTable: [{
        id: 1,
        title: '一级 1',
        children: [{
          id: 4,
          title: '二级 1-1',
          children: [{
            id: 9,
            title: '三级 1-1-1'
          }, {
            id: 10,
            title: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      value: true,
      access_token: store.getters.token,
      getRolesLoading: false,
      RawGroupData: [],
      roleTable: [],
      addAttendance: [],
      multipleSelection: [],
      rowId: '',
      rowName: ''
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
    this.getAuthorizeTable()
  },

  methods: {
    confirmAuthorizeTable(done) {
      this.$confirm('确认提交？')
        .then(_ => {
          console.log('aaaaa')
          const menus = this.$refs.tree.getCheckedKeys().map(function(x) {
            return parseInt(x)
          })
          // let token = this.access_token
          const obj = {
            access_token: this.access_token,
            id: this.rowId,
            name: this.rowName,
            menus: menus
          }
          console.log(obj)
          authorizeRoles(obj).then(res=>{
            this.$alert("授权成功!")
          })
          this.authorizeTableVisible = false
        })
        .catch(_ => {})
    },
    cancelAuthorizeTable(done) {
      this.$confirm('确认取消？')
        .then(_ => {
          this.authorizeTableVisible = false
        })
        .catch(_ => {})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getAuthorizeTable() {
      const access_token = this.access_token
      const access_token_obj = { access_token: this.access_token }
      getTotalMenuList(access_token_obj).then(res => {
        this.authorizeTable = res.data
      })
    },
    authorize(index, row) {
      this.authorizeTableVisible = true
      this.rowId = row.id
      this.rowName = row.name
    },
    handleEdit(a, b) {
      console.log(a, b)
    },
    fetchRoleData() {
      const access_token = this.access_token
      const access_token_obj = { access_token: this.access_token }
      this.getRolesLoading = true
      getRoles(access_token_obj).then(res => {
        this.getRolesLoading = false
        for (const i of res.data) {
          const obj = {}
          obj.id = i.id
          obj.name = i.name
          obj.isActive = false
          this.roleTable.push(obj)
        }
      })
    }
  }
}
</script>

<style scoped>
  .treeContainer {
    height: 450px;
    overflow-y: scroll;
  }
</style>
