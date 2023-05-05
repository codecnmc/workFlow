<!--
 * @Author: 羊驼
 * @Date: 2023-04-28 14:22:39
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 10:53:30
 * @Description: 提交人表单
-->
<template>
  <el-form
    class="form"
    label-position="top"
  >
    <el-form-item label="谁可以提交该审批">
      <el-select v-model="setting.allowCommit">
        <el-option
          v-for="(item,index) in options"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="成员指定"
      v-if="setting.allowCommit=='Assign'"
    >
      <el-radio-group v-model="setting.assignMode">
        <el-radio :label="0">指定部门</el-radio>
        <el-radio :label="1">指定成员</el-radio>
      </el-radio-group>
      <el-form-item
        label="部门"
        v-if="!setting.assignMode"
      >
        <el-select
          v-model="setting.department"
          multiple
          class="w-100"
          value-key="id"
        >
          <el-option
            v-for="item in departmentOptions"
            :key="item.id"
            :label="item.thirdDepartment"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="成员"
        v-else
      >
        <el-select
          v-model="setting.member"
          multiple
          value-key="user_id"
          class="w-100"
        >
          <el-option
            v-for="(item,index) in memberOptions"
            :key="index*1000"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form-item>
    <!-- 抄送人可以封装复用 -->
    <carbon
      v-if="setting.allowCommit!='None'"
      v-model="setting.carbonCopySetting"
      :memberOptions="memberOptions"
    ></carbon>
  </el-form>
</template>

<script>
import carbon from "./components/carbon.vue";
import mixin from "./mixin";
export default {
  components: { carbon },
  mixins: [mixin],
  data() {
    return {
      options: [
        { value: "All", label: "全员" },
        { value: "Assign", label: "指定成员" },
        { value: "None", label: "均不可提交" },
      ],
      departmentOptions: [
        {
          id: 1,
          firstDepartment: "研发部",
          firstDepartmentManager: "asd",
          secondDepartment: "web",
          secondDepartmentManager: "asd",
          thirdDepartment: "web",
          thirdDepartmentManager: "",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
</style>