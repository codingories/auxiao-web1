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
            :style="{paddingLeft:((item.level+1)*20+20)+'px'}"
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
import { getMenuList, saveMenu } from '@/api/AddMenu'
import store from '@/store'
export default {
  data() {
    return {
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
    classObject: function() {
      console.log(this.tree)
      const level = parseInt(this.tree.split('-').slice(1)[0])
      const flag = !level
      return {
        methodStyle: flag
      }
    }
  },
  watch: {

  },

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
          this.options.unshift({ 'id': 0, 'title': 'home', 'level': -1, 'title1': '0-0' },)
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
      const id = parseInt(this.tree.split('-').slice(0)[0])
      const obj = {
        access_token: this.access_token,
        id: this.form.MenuID,
        parent_id: id || "0",
        order: this.form.order,
        title: this.form.menuName,
        method: this.form.method,
        uri: this.form.link
      }
      if ((!obj.parent_id) || (!obj.title)) {
        this.$alert('<strong>父级编号和菜单名称为必填项，请填写!</strong>', {
          dangerouslyUseHTMLString: true
        })
      } else {
        console.log(obj)
        saveMenu(obj).then(
          () => {
            this.$alert('<strong>提交成功!</strong>', {
              dangerouslyUseHTMLString: true
            })
          }
        )
      }
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
