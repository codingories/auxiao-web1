<template>
  <div class="app-container">
    <h2>角色管理</h2>
    <el-table ref="multipleTable" :data="roleTable" style="width: 100%" @selection-change="handleSelection">
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
      <el-table-column prop="assignUser" label="分配用户">
        <template slot-scope="scope">
          <div class="authorizeUser" @click="assignment(scope.$index, scope.row)">
            &nbsp{{ scope.row.assignUser }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="authorize(scope.$index, scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary">新增</el-button>
    <el-button type="success" @click="editRoles">编辑</el-button>
    <el-button type="info" @click="deleteUsers">删除</el-button>
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
      <el-button type="success" @click="cancelDiag('authorizeTableVisible')">取消</el-button>
      <el-button type="primary" @click="confirmAuthorizeTable">确认</el-button>
    </el-dialog>

    <el-dialog
      title="分配用户"
      :visible.sync="alignUserShow"
      width="30%"
      :before-close="handleClose"
    >
      <div class="treeContainer">
        <el-tree
          ref="alignTree"
          :data="alignUserTable"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
      </div>
      <el-button type="success" @click="cancelDiag('alignUserShow')">取消</el-button>
      <el-button type="primary" @click="confirmAlignUserTable">确认</el-button>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesShow"
      width="30%"
      :before-close="handleClose"
    >

      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="角色名">
          <el-input v-model="editForm.roleName" />
        </el-form-item>
      </el-form>
      <el-button type="success" @click="cancelDiag('editRolesShow')">取消</el-button>
      <el-button type="primary" @click="confirmEditRoles">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, getTotalMenuList, authorizeRoles, delRoles } from '@/api/RoleManagement.js'

import store from '@/store'
export default {
  data() {
    return {
      editForm: { roleName: '' },
      editRolesShow: false,
      alignUserTable: [{
        id: 1,
        title: '工程部',
        children: [{
          id: 4,
          title: '周杰伦'
        }, {
          id: 5,
          title: '江泽民'
        }, {
          id: 6,
          title: '邓小平'
        }]
      }, {
        id: 11,
        title: '教研部',
        children: [{
          id: 7,
          title: '奥巴马'
        }, {
          id: 8,
          title: '习近平'
        }, {
          id: 9,
          title: '周星驰'
        }]
      }, {
        id: 10,
        title: '售后部',
        children: [{
          id: 11,
          title: '姚明'
        }, {
          id: 12,
          title: '刘翔'
        }, {
          id: 13,
          title: '孙悟空'
        }, {
          id: 14,
          title: '漩涡鸣人'
        }, {
          id: 15,
          title: '路飞'
        }]
      },
      {
        id: 31,
        title: '客服部',
        children: [{
          id: 24,
          title: '迪丽热巴'
        }, {
          id: 25,
          title: '莫妮卡'
        }, {
          id: 27,
          title: '米歇尔'
        }]
      }
      ],
      alignUserShow: false,
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
      rowName: '',
      alignIndex: '',
      alignRow: '',
      checkedList: []
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
    handleSelection(val) {
      this.checkedList = val
    },
    // 以下是编辑按钮
    editRoles() {
      if (this.checkedList.length === 0) {
        this.$alert('未勾选，请选择一个选项').then(() => {}).catch(() => {})
      } else if (this.checkedList.length >= 2) {
        this.$alert('只能选择一个选项').then(() => {}).catch(() => {})
      } else {
        const obj = {
          access_token: this.access_token,
          id: this.checkedList[0].id,
          name: this.checkedList[0].name,
          menus: [25, 27]
        }
        this.sendRolesObj = obj
        this.editRolesShow = true
      }
    },
    confirmEditRoles() {
      this.$confirm('确认提交？')
        .then(_ => {
          if (!this.editForm.roleName) {
            this.$alert('名字不能为空!')
            return
          }
          this.sendRolesObj.name = this.editForm.roleName
          const obj = this.sendRolesObj
          this.checkedList[0].name = this.editForm.roleName
          authorizeRoles(obj).then(res => {
            this.$alert('编辑成功!')
            this.$set(this.roleTable, this.checkedList[0].id - 1, this.checkedList[0])
          })
        })
        .catch(_ => {})
      this.editRolesShow = false
    },
    // 以上是编辑按钮
    // 以下是删除按钮
    deleteUsers() {
      if (this.checkedList.length === 0) {
        this.$alert('未勾选，请选择一个选项').then(() => {}).catch(() => {})
      } else {
        this.$confirm('确认提交？')
          .then(_ => {
            console.log(this.checkedList)
            console.log(this.checkedList[0].assignUser)
            console.log('------------')
            let flag = 0
            for (const i of this.checkedList) {
              if (i.assignUser) {
                console.log('发送删除请求')
              } else {
                flag = 1
              }

              // if (flag = 1) {
              //   this.$alert('有选项尚未分配用户').then(() => {}).catch(() => {})
              // }
            }
            console.log('============')

            // delRoles()
            // /api/v1/admin-role/del
          })
          .catch(_ => { })
      }
    },
    confirmAuthorizeTable(done) {
      this.$confirm('确认提交？')
        .then(_ => {
          const menus = this.$refs.tree.getCheckedKeys().map(function(x) {
            return parseInt(x)
          })
          const obj = {
            access_token: this.access_token,
            id: this.rowId,
            name: this.rowName,
            menus: menus
          }
          authorizeRoles(obj).then(res => {
            console.log(obj)
            this.$alert('授权成功!')
          })
          this.authorizeTableVisible = false
        })
        .catch(_ => {})
    },
    cancelDiag(attr) {
      this.$confirm('确认取消？')
        .then(_ => {
          this[attr] = false
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
    },
    // 分配用户模块
    assignment(index, row) {
      console.log(index, row)
      this.alignIndex = index
      this.alignRow = row
      this.alignUserShow = true
    },
    confirmAlignUserTable() {
      this.$confirm('确认提交？')
        .then(_ => {
          const menus = this.$refs.alignTree.getCheckedNodes()
          let str = ''
          const section = { '工程部': '', '教研部': '', '售后部': '', '客服部': '' }
          for (const i of menus) {
            if (i.title in section) {
            } else {
              str += i.title + ','
            }
          }
          this.alignRow['assignUser'] = str
          this.$set(this.roleTable, this.alignIndex, this.alignRow)
          this.alignUserShow = false
          this.$refs.alignTree.setCheckedKeys([])
        })
        .catch(_ => {})
    }
  }
}
</script>

<style scoped>
  .treeContainer {
    height: 450px;
    overflow-y: scroll;
  }
  .authorizeUser {
    cursor: pointer;
  }
</style>
