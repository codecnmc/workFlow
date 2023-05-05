<!--
 * @Author: 羊驼
 * @Date: 2023-04-28 14:22:39
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 09:39:21
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
    <el-form-item
      label="抄送人设置"
      v-if="setting.allowCommit!='None'"
    >
      <el-descriptions
        :column="1"
        border
        v-for="(item,index) in setting.carbonCopySetting"
        :key="index"
        direction="vertical"
        class="mb-20"
      >
        <el-descriptions-item>
          <template slot="label">
            <div class="flex">
              <span> <i class="el-icon-user"></i>
                抄送人</span>
              <el-button
                type="text"
                icon="el-icon-delete"
                class="f-r"
                @click="removeCarbon(index)"
              ></el-button>
            </div>
          </template>
          <el-radio-group v-model="item.type">
            <el-radio
              v-for="(value,key) in typeOptions"
              :key="value*100"
              :label="value"
              @change="refreshSelect"
            >{{key}}</el-radio>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item
          label="配置"
          v-if="item.type&&refresh"
        >
          <el-form-item
            label="部门等级"
            v-if="item.type==1"
          >
            <el-select v-model="item.level">
              <el-option
                v-for="(item,index) in levelOptions"
                :key="index*1000"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="指定成员"
            v-else-if="item.type==2"
          >
            <el-select
              v-model="item.member"
              multiple
              value-key="user_id"
            >
              <el-option
                v-for="(item,index) in memberOptions"
                :key="index*1000"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-descriptions-item>
      </el-descriptions>
      <el-button
        v-if="setting.carbonCopySetting.length<1"
        @click="pushCarbon"
        icon="el-icon-plus"
        type="text"
      >添加抄送人</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      options: [
        { value: "All", label: "全员" },
        { value: "Assign", label: "指定成员" },
        { value: "None", label: "均不可提交" },
      ],
      typeOptions: {
        直属上级: 0,
        部门负责人: 1,
        指定成员: 2,
      },
      levelOptions: [
        {
          value: 1,
          label: "一级部门主管",
        },
        {
          value: 2,
          label: "二级部门主管",
        },
      ],
      memberOptions: [
        {
          user_id: "asdbc",
          name: "测试数据",
        },
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
      item: {
        type: 1, // 直属上级
        level: 1, // 如果为部门负责人 选择层级
        member: [],
      },
      refresh: true,
    };
  },
  methods: {
    pushCarbon() {
      this.setting.carbonCopySetting.push(
        JSON.parse(JSON.stringify(this.item))
      );
    },
    removeCarbon(index) {
      this.setting.carbonCopySetting.splice(index, 1);
    },
    refreshSelect() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  padding: 10px 20px;
  /deep/ .el-form-item__label {
    font-weight: 700;
  }
  .flex {
    display: flex;
    align-items: center;
    height: 30px;
    justify-content: space-between;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .w-100 {
    width: 100%;
  }
}
</style>