<template>
  <div class="app-container">
    <el-table
      :data="menuTable"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
            @click="handleUp(scope.$index, scope.row)"
            circle
          >
            <i class="el-icon-arrow-up"></i>
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleDelete(scope.$index, scope.row)"
            circle
          >
            <i class="el-icon-arrow-down"></i>
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
    handleUp(a,b){
      console.log(a)
      console.log(b)
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
