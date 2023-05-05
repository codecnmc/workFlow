<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 14:46:53
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 14:39:54
 * @Description: 审核表单
-->
<template>
  <el-form
    class="form"
    label-position="top"
  >
    <el-form-item label="审批类型">
      <el-radio-group v-model="setting.auditType">
        <el-radio :label="0">人工审批</el-radio>
        <el-radio :label="1">自动通过</el-radio>
        <el-radio :label="2">自动拒绝</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="!setting.auditType">
      <el-descriptions
        direction="vertical"
        :column="1"
        border
      >
        <el-descriptions-item label="审批人">
          <el-radio-group
            v-model="setting.approverType"
            @input="refreshSelect"
          >
            <el-radio
              v-for="(value,key) in typeOptions"
              :key="value"
              :label="value"
            >{{key}}</el-radio>
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item
          label="配置"
          v-if="setting.approverType&&refresh"
        >
          <el-form-item
            label="部门等级"
            v-if="setting.approverType==1"
          >
            <el-select
              v-model="setting.approverLevel"
              class="w-100"
            >
              <el-option
                v-for="(item,index) in levelOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="指定成员"
            v-if="setting.approverType==2"
          >
            <el-select
              v-model="setting.approverMember"
              multiple
              class="w-100"
              value-key="user_id"
            >
              <el-option
                v-for="(item,index) in memberOptions"
                :key="index"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-descriptions-item>
      </el-descriptions>
      <el-form-item label="多人审批时采用的审批方式">
        <el-radio-group v-model="setting.multipleMode">
          <div
            class="radio-item"
            v-for="(item,index) in multipleOptions"
            :key="index"
          >
            <el-radio :label="item.value">{{item.label}}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批人与提交人为同一人时">
        <el-radio-group v-model="setting.sameMode">
          <div
            class="radio-item"
            v-for="(item,index) in sameOptions"
            :key="index"
          >
            <el-radio :label="item.value">{{item.label}}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <carbon
        v-model="setting.carbonCopySetting"
        :memberOptions="memberOptions"
      ></carbon>
    </template>
  </el-form>
</template>

<script>
import carbon from "./components/carbon.vue";
import mixin from "./mixin";
export default {
  components: { carbon },
  mixins: [mixin],
  inject: ["levelOptions", "typeOptions"],
  data() {
    return {
      refresh: true,
      multipleOptions: [
        {
          value: 0,
          label: "会签（需所有审批人同意）",
        },
        {
          value: 1,
          label: "或签（一名审批人同意即可）",
        },
        {
          value: 2,
          label: "依次审批（按顺序依次审批）",
        },
      ],
      sameOptions: [
        {
          value: 0,
          label: "由提交人对自己审批",
        },
        {
          value: 1,
          label: "自动跳过",
        },
        {
          value: 2,
          label: "转交给直属上级审批",
        },
      ],
    };
  },
  methods: {
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
.el-descriptions /deep/ .el-descriptions-item__label {
  font-weight: 700;
}
.radio-item {
  margin-bottom: 10px;
}
</style>