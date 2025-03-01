<template>
  <div class="role-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加角色
          </el-button>
        </div>
      </template>

      <el-table :data="roleList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色标识" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="primary" link @click="handlePermission(row)">
                权限设置
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="3"
            placeholder="请输入角色描述"
          />
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

    <!-- 权限设置对话框 -->
    <el-dialog
      title="权限设置"
      v-model="permissionDialogVisible"
      width="600px"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTree"
        show-checkbox
        node-key="id"
        :props="{ label: 'name' }"
        :default-checked-keys="selectedPermissions"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态变量
const loading = ref(false)
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const dialogType = ref('add')
const submitting = ref(false)
const formRef = ref(null)
const permissionTreeRef = ref(null)
const selectedPermissions = ref([])

// 表单数据
const formData = reactive({
  name: '',
  code: '',
  description: '',
  status: 1
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '角色标识只能包含大写字母和下划线', trigger: 'blur' }
  ]
}

// 模拟角色数据
const roleList = ref([
  {
    id: 1,
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '系统最高权限角色',
    status: 1,
    createTime: '2024-02-28 10:00:00'
  },
  {
    id: 2,
    name: '普通管理员',
    code: 'ADMIN',
    description: '系统管理员角色',
    status: 1,
    createTime: '2024-02-28 10:00:00'
  },
  {
    id: 3,
    name: '普通用户',
    code: 'USER',
    description: '普通用户角色',
    status: 1,
    createTime: '2024-02-28 10:00:00'
  }
])

// 模拟权限树数据
const permissionTree = [
  {
    id: 1,
    name: '系统管理',
    children: [
      {
        id: 11,
        name: '用户管理',
        children: [
          { id: 111, name: '查看用户' },
          { id: 112, name: '添加用户' },
          { id: 113, name: '编辑用户' },
          { id: 114, name: '删除用户' }
        ]
      },
      {
        id: 12,
        name: '角色管理',
        children: [
          { id: 121, name: '查看角色' },
          { id: 122, name: '添加角色' },
          { id: 123, name: '编辑角色' },
          { id: 124, name: '删除角色' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '商品管理',
    children: [
      {
        id: 21,
        name: '商品列表',
        children: [
          { id: 211, name: '查看商品' },
          { id: 212, name: '添加商品' },
          { id: 213, name: '编辑商品' },
          { id: 214, name: '删除商品' }
        ]
      },
      {
        id: 22,
        name: '商品分类',
        children: [
          { id: 221, name: '查看分类' },
          { id: 222, name: '添加分类' },
          { id: 223, name: '编辑分类' },
          { id: 224, name: '删除分类' }
        ]
      }
    ]
  }
]

// 方法
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  formRef.value?.resetFields()
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(formData, row)
}

const handleDelete = (row) => {
  if (row.code === 'SUPER_ADMIN') {
    ElMessage.warning('超级管理员角色不能删除')
    return
  }
  
  ElMessageBox.confirm(
    '确定要删除该角色吗？',
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

const handleStatusChange = (row) => {
  if (row.code === 'SUPER_ADMIN' && row.status === 0) {
    ElMessage.warning('超级管理员角色不能禁用')
    row.status = 1
    return
  }
  
  const action = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`角色已${action}`)
}

const handlePermission = (row) => {
  // 模拟获取角色权限
  selectedPermissions.value = [111, 121, 211, 221]
  permissionDialogVisible.value = true
}

const handlePermissionSubmit = async () => {
  try {
    submitting.value = true
    const checkedKeys = permissionTreeRef.value.getCheckedKeys()
    const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
    const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]
    
    // TODO: 实现权限保存逻辑
    console.log('选中的权限:', allCheckedKeys)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('权限设置成功')
    permissionDialogVisible.value = false
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // TODO: 实现提交逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
    dialogVisible.value = false
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.role-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 