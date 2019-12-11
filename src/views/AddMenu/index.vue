<template>
  <div class="app-container">
    <!--{{editTable}}-->
<!--{{idLayer}}-->
    <el-table
      :data="menuTable"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :default-expand-all="true"
    >
      <el-table-column
        prop="title"
        label="菜单名称"
        width="180"
      />
      <el-table-column
        prop="uri"
        label="链接"
        width="240"
      />
      <el-table-column
        prop="icon"
        label="icon"
        width="100"
      />
      <el-table-column
        prop="address"
        label="备注"
      />
      <el-table-column
        prop="address"
        label="操作"
        width="230"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="addMenus(scope.$index, scope.row)"
          >增加</el-button>
          <el-button
            size="mini"
            type="success"
            @click="EditMenu(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="调整顺序"
      >
        <template slot-scope="scope" width="150">
          <el-button
            size="mini"
            type="primary"
            circle
            @click="handleUp(scope.$index, scope.row)"
          >
            <i class="el-icon-arrow-up" />
          </el-button>
          <el-button
            size="mini"
            type="success"
            circle
            @click="handleDown(scope.$index, scope.row)"
          >
            <i class="el-icon-arrow-down" />
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog
      title="增加菜单"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >

      <el-table
        :data="editTable"
        style="width: 100%"
      >
        <el-table-column
          prop="menuName"
          label="菜单名称"
          width="180"
        >
          <template slot-scope="scope">
            <el-input v-model="editTable[0].menuName" />
          </template>
        </el-table-column>
        <el-table-column
          prop="link"
          label="链接"
          width="180"
        >
          <template slot-scope="scope">
            <el-input v-model="editTable[0].link" />
          </template>
        </el-table-column>
        <el-table-column
          prop="props"
          label="icon"
        >
          <template slot-scope="scope">
            <el-select v-model="editTable[0].icon" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px; line-height:34px">
                  <svg class="icon">
                    <use :xlink:href="'#'+item.icon" />
                  </svg>
                </span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        >
          <template slot-scope="scope">
            <el-input v-model="editTable[0].remark" />
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改菜单"
      :visible.sync="EditVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getMenus, saveMenu } from '@/api/AddMenu'
import store from '@/store'

export default {
  data() {
    return {
      options1: [{
        value: 'calendar',
        label: 'calendar',
        icon: 'el-calendar'
      }, {
        value: 'dashboard',
        label: 'dashboard',
        icon: 'el-dashboard'
      }, {
        value: 'example',
        label: 'example',
        icon: 'el-example'
      }, {
        value: 'eye-open',
        label: 'eye-open',
        icon: 'el-eye-open'
      }, {
        value: 'eye',
        label: 'eye',
        icon: 'el-eye'
      }, {
        value: 'form',
        label: 'form',
        icon: 'el-form'
      }, {
        value: 'link',
        label: 'link',
        icon: 'el-link'
      }, {
        value: 'nested',
        label: 'nested',
        icon: 'el-nested'
      }, {
        value: 'password',
        label: 'password',
        icon: 'el-password'
      }, {
        value: 'table',
        label: 'table',
        icon: 'el-table'
      }, {
        value: 'tree',
        label: 'tree',
        icon: 'el-tree'
      }, {
        value: 'user',
        label: 'user',
        icon: 'el-user'
      }],
      value1: '',
      editTable: [{
        menuName: '',
        link: '',
        icon: '',
        remark: ''
      }],
      model: {

      },
      Expand: true,
      menuTable: [],
      tree: 'home',
      options: [],
      originData: [],
      form: {
        parentID: '',
        menuName: '',
        MenuID: '',
        order: '',
        link: '',
        method: ''
      },
      access_token: store.getters.token,
      dialogVisible: false,
      EditVisible: false,
      idLayer: []
    }
  },

  computed: {

  },
  watch: {},

  created() {
    this.getTableMenus()
  },

  methods: {
    EditMenu(index, row) {
      console.log(index, row)
      this.EditVisible = true;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    findLayer(title) { // 找到点的是第几层的第几个
      const index = this.menuTable.findIndex((e) => { return e['title'] === title })
      if (index !== -1) {
        return [index, -1]
      } else {
        for (let i = 0; i < this.menuTable.length; i++) {
          for (let j = 0; j < this.menuTable[i].children.length; j++) {
            if (this.menuTable[i].children[j].title === title) {
              return ([i, j, this.menuTable[i].children.length])
            }
          }
        }
      }
    },
    upDown(a, b, upBorder, downBorder, step) {
      const title = b.title
      const TemperMenuTable = this.menuTable
      const Layer = this.findLayer(title)
      const layerIndex1 = Layer.slice(0, 1)[0]
      const layerIndex2 = Layer.slice(1, 2)[0]
      if ((layerIndex1 !== upBorder) && (layerIndex2 === -1)) {
        const index1 = layerIndex1
        const index2 = layerIndex1 + step
        TemperMenuTable.splice(index2, 1, ...TemperMenuTable.splice(index1, 1, TemperMenuTable[index2]))
      } else if ((layerIndex2 !== -1) && (layerIndex2 !== downBorder)) { // (layerIndex1 !== 0) &&
        const index0 = layerIndex1
        const index1 = layerIndex2
        const index2 = layerIndex2 + step
        const TempList = TemperMenuTable.slice(index0, index0 + 1)[0].children
        TempList.splice(index2, 1, ...TempList.splice(index1, 1, TempList[index2]))
        const tempTable = this.menuTable[index0]
        tempTable.children = TempList
        this.$set(this.menuTable, index0, tempTable)
      }
    },
    handleUp(a, b) {
      console.log(a, b)
      this.upDown(a, b, 0, 0, -1)
    },
    handleDown(a, b) {
      const title1 = b.title
      const length = this.findLayer(title1).slice(2, 3)[0]
      const upBorder = this.menuTable.length - 1
      let downBorder
      if (length === undefined) {
        downBorder = -1
      } else if (length === 1) {
        downBorder = 0
      } else {
        downBorder = (length - 1)
      }
      this.upDown(a, b, upBorder, downBorder, 1)
    },
    getTableMenus() {
      const obj = { access_token: this.access_token }
      getMenus(obj).then(
        res => {
          // console.log(res.data)
          this.menuTable = res.data
          for (const i of this.menuTable) {
            const str = i.id + '-0'
            this.idLayer.push(str)
            for (const j of i.children) {
              console.log(j.id)
              this.idLayer.push(i.id + '-' + j.id)
            }
          }
        }
      )
    },
    addMenus(index, row) {
      console.log('aaaaa')
      console.log(index, row)
      console.log('bbbbb')
      this.dialogVisible = true
    },
    cancelAdd() {
      this.$confirm('确认取消？')
        .then(_ => {
          this.dialogVisible = false
          console.log(this.editTable)
          console.log(this.editTable[0])
          console.log(this.editTable[0].menuName)
          this.editTable[0].menuName = ''
          this.editTable[0].link = ''
          this.editTable[0].icon = ''
          this.editTable[0].remark = ''
          // this.editTable.pop()
          // this.editTable.push({ 'menuName': '', 'link': '', 'icon': '', 'remark': '' })
        })
        .catch(_ => {
          this.editTable[0].menuName = ''
          this.editTable[0].link = ''
          this.editTable[0].icon = ''
          this.editTable[0].remark = ''
        })
    },
    confirmAdd() {
      this.$confirm('确认增加？')
        .then(_ => {
          console.log('------')
          console.log(this.editTable)
          console.log(this.editTable[0])
          // this.editTable[0].menuName = ''
          // this.editTable[0].link = ''
          // this.editTable[0].icon = ''
          // this.editTable[0].remark = ''
          this.dialogVisible = false
        })
        .catch(_ => {
          this.editTable[0].menuName = ''
          this.editTable[0].link = ''
          this.editTable[0].icon = ''
          this.editTable[0].remark = ''
        })
    }
  }
}
</script>
<style>
  .inputstyle {
    width: 330px;
  }

  .methodStyle {
    display: none
  }
</style>
