<template>
  <div class="category-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加分类
          </el-button>
        </div>
      </template>

      <el-table
        :data="categoryList"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        v-loading="loading"
      >
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="code" label="分类编码" width="180" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleAddSub(row)">
                添加子分类
              </el-button>
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级分类">
          <el-cascader
            v-model="formData.parentId"
            :options="categoryOptions"
            :props="{ 
              checkStrictly: true,
              label: 'name',
              value: 'id',
              emitPath: false
            }"
            placeholder="请选择上级分类"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态变量
const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const submitting = ref(false)
const formRef = ref(null)
const currentParentId = ref(null)

// 计算属性
const dialogTitle = computed(() => {
  if (dialogType.value === 'add') {
    return '添加分类'
  } else if (dialogType.value === 'addSub') {
    return '添加子分类'
  } else {
    return '编辑分类'
  }
})

// 模拟分类数据
const categoryList = ref([
  {
    id: 1,
    name: '手机数码',
    code: 'digital',
    sort: 1,
    status: 1,
    children: [
      {
        id: 4,
        name: '手机',
        code: 'phone',
        sort: 1,
        status: 1
      },
      {
        id: 5,
        name: '平板电脑',
        code: 'tablet',
        sort: 2,
        status: 1
      }
    ]
  },
  {
    id: 2,
    name: '家用电器',
    code: 'appliance',
    sort: 2,
    status: 1
  },
  {
    id: 3,
    name: '服装服饰',
    code: 'clothing',
    sort: 3,
    status: 1
  }
])

// 用于级联选择器的选项
const categoryOptions = computed(() => {
  const formatData = (data) => {
    return data.map(item => {
      const node = {
        id: item.id,
        name: item.name
      }
      if (item.children) {
        node.children = formatData(item.children)
      }
      return node
    })
  }
  return formatData(categoryList.value)
})

// 表单数据
const formData = reactive({
  parentId: null,
  name: '',
  code: '',
  sort: 0,
  status: 1
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和横杠', trigger: 'blur' }
  ]
}

// 方法
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  currentParentId.value = null
  formRef.value?.resetFields()
}

const handleAddSub = (row) => {
  dialogType.value = 'addSub'
  dialogVisible.value = true
  currentParentId.value = row.id
  formRef.value?.resetFields()
  formData.parentId = row.id
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(formData, row)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该分类吗？如果包含子分类，子分类也会被删除。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // TODO: 实现提交逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(dialogType.value === 'edit' ? '修改成功' : '添加成功')
    dialogVisible.value = false
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.category-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 