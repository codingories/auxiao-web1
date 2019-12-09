<template>
  <div class="app-container">
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
            @click="handleEdit(scope.$index, scope.row)"
          >增加</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleDelete(scope.$index, scope.row)"
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
  </div>
</template>

<script>
import { getMenus } from '@/api/AddMenu'
import store from '@/store'

export default {
  data() {
    return {
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
      access_token: store.getters.token
    }
  },

  computed: {
  },
  watch: {},

  created() {
    this.getTableMenus()
  },

  methods: {
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
    handleUp(a, b) {
      const title = b.title
      const TemperMenuTable = this.menuTable
      const Layer = this.findLayer(title)
      const layerIndex1 = Layer.slice(0, 1)[0]
      const layerIndex2 = Layer.slice(1, 2)[0]
      if ((layerIndex1 !== 0) && (layerIndex2 === -1)) {
        const index1 = layerIndex1
        const index2 = layerIndex1 - 1
        TemperMenuTable.splice(index2, 1, ...TemperMenuTable.splice(index1, 1, TemperMenuTable[index2]))
      } else if ((layerIndex2 !== -1) && (layerIndex2 !== 0)) { // (layerIndex1 !== 0) &&
        const index0 = layerIndex1
        const index1 = layerIndex2
        const index2 = layerIndex2 - 1
        const TempList = TemperMenuTable.slice(index0, index0 + 1)[0].children
        TempList.splice(index2, 1, ...TempList.splice(index1, 1, TempList[index2]))
        const tempTable = this.menuTable[index0]
        tempTable.children = TempList
        this.$set(this.menuTable, index0, tempTable)
      }
    },
    handleDown(a, b) {
      const title = b.title
      const TemperMenuTable = this.menuTable
      const Layer = this.findLayer(title)
      const layerIndex1 = Layer.slice(0, 1)[0]
      const layerIndex2 = Layer.slice(1, 2)[0]
      const length = Layer.slice(2, 3)[0]
      if ((layerIndex1 !== this.menuTable.length - 1) && (layerIndex2 === -1)) {
        const index1 = layerIndex1
        const index2 = layerIndex1 + 1
        TemperMenuTable.splice(index2, 1, ...TemperMenuTable.splice(index1, 1, TemperMenuTable[index2]))
      } else if ((layerIndex2 !== -1) && (layerIndex2 < length - 1)) { // (layerIndex1 !== 0) &&
        const index0 = layerIndex1
        const index1 = layerIndex2
        const index2 = layerIndex2 + 1
        const TempList = TemperMenuTable.slice(index0, index0 + 1)[0].children
        TempList.splice(index2, 1, ...TempList.splice(index1, 1, TempList[index2]))
        const tempTable = this.menuTable[index0]
        tempTable.children = TempList
        this.$set(this.menuTable, index0, tempTable)
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          return type === 'prev'
        }
      } else {
        // 不同级进行处理
      }
    },
    getTableMenus() {
      const obj = { access_token: this.access_token }
      getMenus(obj).then(
        res => {
          // console.log(res.data)
          this.menuTable = res.data
        }
      )
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
