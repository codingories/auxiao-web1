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
            @change="switchActive(scope.row.isActive,scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="assignUser" label="分配用户">
        <template slot-scope="scope">
          <!--<div class="authorizeUser" @click="assignment(scope.$index, scope.row)">-->
          <!--&nbsp{{ scope.row.assignUser }}-->
          <!--</div>-->
          <el-button type="primary" size="small" @click="assignment(scope.$index, scope.row)">查看</el-button>

        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="authorize(scope.$index, scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="addRoles">新增</el-button>
    <el-button type="success" @click="editRoles">编辑</el-button>
    <el-button type="info" @click="deleteRoles">删除</el-button>
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
      width="60%"
      :before-close="handleClose"
    >

      <!--<el-transfer v-model="transfer" :data="transferData"></el-transfer>-->

      <tree-transfer :title="treeTransferTitle" :from_data="fromData" :to_data="toData" :default-props="{label:'label'}" :mode="mode" height="540px" filter open-all @addBtn="add" @removeBtn="remove" />
      <!--<div class="treeContainer">-->
      <!--<el-tree-->
      <!--ref="alignTree"-->
      <!--:data="alignUserTable"-->
      <!--show-checkbox-->
      <!--default-expand-all-->
      <!--node-key="id"-->
      <!--highlight-current-->
      <!--:props="defaultProps"-->
      <!--/>-->
      <!--</div>-->
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
    <el-dialog
      title="新增角色"
      :visible.sync="addRolesShow"
      width="30%"
      :before-close="handleClose"
    >

      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="角色名">
          <el-input v-model="editForm.roleName" />
        </el-form-item>
      </el-form>
      <el-button type="success" @click="cancelDiag('addRolesShow')">取消</el-button>
      <el-button type="primary" @click="confirmAddRoles">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, getTotalMenuList, authorizeRoles, delRoles, frozenRole, getRoleInfo, getUsers } from '@/api/RoleManagement.js'
import store from '@/store'
import treeTransfer from 'el-tree-transfer' // 引入
export default {
  components: { treeTransfer },
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }

    return {
      treeTransferTitle: ['全选', '全选'],
      mode: 'transfer', // transfer addressList
      fromData: [],
      toData: [],

      transferData: generateData(),
      transfer: [1, 4],
      editForm: { roleName: '' },
      addRolesShow: false,
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
      authorizeTable: [],
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

  },
  watch: {},

  created() {
    this.fetchRoleData()
    this.getAuthorizeTable()
  },

  methods: {
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    },
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    },
    switchActive(isactive, id) {
      const tempoobj = {
        access_token: this.access_token,
        id: id,
        type: 'users'
      }
      getRoleInfo(tempoobj).then(
        res => {
          console.log(res.data.user_list)
          console.log(!res.data.user_list)

          if (res.data.user_list.length === 0) {
            const obj = {
              access_token: this.access_token,
              id: id,
              is_active: isactive ? 1 : 0
            }
            frozenRole(obj).then(success => {
              console.log(success)
            })
          } else {
            // this.$alert('有用户了，无法进行激活操作')
          }
        }
      )

      // const obj = {
      //   access_token: this.access_token,
      //   id: id,
      //   is_active: isactive ? 1 : 0
      // }
      // // console.log(obj)
      // console.log('----')
      // console.log(frozenRole(obj))
      // frozenRole(obj).then(success => {
      //   console.log(success)
      // }).catch((err) => {
      //   console.log('---==进入roles错误==---')
      //   console.log(err)
      // })
      // then(success=>{
      //   console.log(success)
      // })
    },
    handleSelection(val) {
      this.checkedList = val
    },
    addRoles() {
      const obj =
          {
            access_token: this.access_token,
            name: '',
            menus: [
              25,
              27
            ]
          }
      this.addRolesObj = obj
      this.addRolesShow = true
      // authorizeRoles(obj).then(){
      //
      // }
    },
    confirmAddRoles() {
      this.$confirm('确认提交？')
        .then(_ => {
          if (!this.editForm.roleName) {
            this.$alert('名字不能为空!')
            return
          }
          this.addRolesObj.name = this.editForm.roleName
          const tempId = this.roleTable.slice(this.roleTable.length - 1, this.roleTable.length)[0].id + 1
          const obj = { 'id': tempId, 'name': this.addRolesObj.name, isActive: 'false' }
          authorizeRoles(this.addRolesObj).then(res => {
            this.$alert('编辑成功!')
            this.roleTable.push(obj)
            this.editForm.roleName = ''
          })
        })
        .catch(_ => { })
      this.addRolesShow = false
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
          })
          console.log('==-=-=-=编辑')
          // this.$set(this.roleTable, this.checkedList[0].id - 1, this.checkedList[0])
        })
        .catch(_ => {})
      this.editRolesShow = false
    },
    // 以上是编辑按钮
    // 以下是删除按钮
    deleteRoles() {
      if (this.checkedList.length === 0) {
        this.$alert('未勾选，请选择一个选项').then(() => {}).catch(() => {})
      } else {
        this.$confirm('确认提交？')
          .then(_ => {
            let flag = true
            for (const i of this.checkedList) {
              if (!i.assignUser) {
                continue
              } else {
                flag = false
                break
              }
            }

            const obj = {
              access_token: this.access_token
            }

            if (flag) {
              for (const i of this.checkedList) {
                obj.id = i.id
                console.log(obj)
                this.roleTable = this.roleTable.filter((item) => {
                  return item.id != obj.id
                })
                delRoles(obj).then(
                  () => {
                    console.log('--删除成功--')
                  }
                )
              }
              // console.log('开始发送删除请求')
            } else {
              this.$alert('有角色分配用户了，无法进行删除操作')
            }
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
          obj.isActive = i.is_active === 1
          this.roleTable.push(obj)
        }
      })
    },
    // 分配用户模块
    assignment(index, row) {
      // console.log(index, row)
      this.alignIndex = index
      this.alignRow = row
      this.getAllUsers()
      this.alignUserShow = true
    },
    getAllUsers() {
      const obj = {
        access_token: this.access_token
      }
      getUsers(obj).then(
        res => {
          const bbb = JSON.parse(JSON.stringify(res.data).replace(/name/g, 'label'))
          console.log(JSON.stringify(bbb).replace(/label: null/g, 'label: other'))
          // let ccc = JSON.parse(JSON.stringify(bbb).replace(/label: null/g, 'label: other'))
          // let ccc = JSON.parse(JSON.stringify(bbb).replace(/"label":null/g, '"label":other'))
          // console.log(ccc)
          this.fromData = bbb
        }
      )
    },
    confirmAlignUserTable() {
      this.$confirm('确认提交？')
        .then(_ => {
          this.alignUserShow = false

          // const menus = this.$refs.alignTree.getCheckedNodes()
          // let str = ''
          // const section = { '工程部': '', '教研部': '', '售后部': '', '客服部': '' }
          // for (const i of menus) {
          //   if (i.title in section) {
          //   } else {
          //     str += i.title + ','
          //   }
          // }
          // this.alignRow['assignUser'] = str
          // this.$set(this.roleTable, this.alignIndex, this.alignRow)
          // this.$refs.alignTree.setCheckedKeys([])
        })
        .catch(_ => {})
    }
  } // 注册
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
