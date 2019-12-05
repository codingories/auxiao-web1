<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="父级编号*">
        <el-select v-model="tree" placeholder="请选择活动区域">
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.title"
            :value="item.title1"
            :style="{paddingLeft:(item.level*20+20)+'px'}"
            :class="item.level?'is-sub':''"
          />
        </el-select>
        <!--选择的是：{{ tree }}-->
      </el-form-item>

      <el-form-item label="菜单名称*">
        <el-input v-model="form.menuName" class="inputstyle" />
      </el-form-item>
      <el-form-item label="菜单编号">
        <el-input v-model="form.MenuID" class="inputstyle" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.order" class="inputstyle" />
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="form.link" class="inputstyle" />
      </el-form-item>
      <el-form-item label="方式" :class="classObject">
        <el-select v-model="form.method" placeholder="请选择">
          <el-option label="post" value="post" />
          <el-option label="get" value="get" />
          <el-option label="delete" value="delete" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveMenu">保存</el-button>
    <el-button type="success" @click="resetInfo">重置</el-button>
  </div>
</template>

<script>
import { getMenuList } from '@/api/AddMenu'
import store from '@/store'
export default {
  data() {
    return {
      tree: '',
      options: [],
      originData: [],

      //   [
      //   {
      //     label: '这是根一', id: 1, children: [
      //       { label: '这是茎一一', id: 2, children: [] },
      //       { label: '这是茎一二', id: 3, children: [] },
      //       {
      //         label: '这是茎一三', id: 4, children: [
      //           { label: '这是叶一三一', id: 6, children: [] },
      //           { label: '这是叶一三二', id: 7, children: [] }
      //         ]
      //       },
      //       { label: '这是茎一四', id: 5, children: [] }
      //     ]
      //   },
      //   {
      //     label: '这是根二', id: 8, children: []
      //   },
      //   {
      //     label: '这是根三', id: 9, children: [
      //       { label: '这是茎三一', id: 10, children: [] },
      //       {
      //         label: '这是茎三二', id: 11, children: [
      //           { label: '这是叶三二一', id: 12, children: [] }
      //         ]
      //       }
      //     ]
      //   }
      // ]

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
    classObject: function() {
      console.log(this.tree)
      const level = parseInt(this.tree.split('-').slice(1)[0])
      const flag = !!level
      return {
        methodStyle: flag
      }
    }
  },
  watch: {},

  created() {
    this.getMenus()
  },

  methods: {
    getMenus() {
      const obj = { access_token: this.access_token }
      getMenuList(obj).then(
        res => {
          console.log(res.data)
          this.originData = res.data
          this.options = this.decomposeTree(this.originData, 0)
        }
      )
    },
    resetInfo() {
      const Item = ['parentID', 'menuName', 'MenuID', 'order', 'link', 'method']
      for (const i of Item) {
        this.form[i] = ''
      }
    },
    saveMenu() {
    },
    decomposeTree(array, level) {
      const tmpArr = [];

      (function decompose(arr, lev) {
        for (let i = 0; i < arr.length; i++) {
          let tmpObj = {}
          const item = arr[i]
          item.level = lev
          item.title1 = item.id + '-' + item.level
          tmpObj = Object.assign({}, item)
          tmpArr.push(tmpObj)
          if (item.children) {
            decompose(item.children, lev + 1) // 递归
          }
          delete tmpObj.children // 删掉其 children，避免数据过大（不删也可以，也许后面有用呢）
        }
      })(array, level)

      return tmpArr
    }
  }
}
</script>
<style>
  .inputstyle{
    width:330px;
  }
  .methodStyle{
    display:none
  }
</style>
