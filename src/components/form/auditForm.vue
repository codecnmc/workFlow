<!--
 * @Author: 羊驼
 * @Date: 2023-04-25 14:46:53
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-04-27 13:47:44
 * @Description: 审核表单
-->
<template>
  <div class="drawer-content">
    <el-tabs :is-hide-nav="true">
      <el-tab-pane label="节点类型">
        <el-radio-group
          v-model="approverConfig.examineMode"
          @change="setExamineModeRadio"
        >
          <el-radio
            v-for="item in examineModeList"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
            <span class="mark">({{ item.mark }})</span>
          </el-radio>
        </el-radio-group>
      </el-tab-pane>
      <el-tab-pane label="审批人类型">
        <div v-if="approverConfig.examineMode === '3'">
          <p style="margin-bottom:16px">
            连续多级部门主管<span style="color:#828282;margin-left:8px">(按照组织架构，发起人<span style="color:#4880FF;">向上的各级主管</span>依次审批)</span>
          </p>
          <el-radio-group v-model="approverConfig.nodeUserType.value">
            <el-radio :label="`m-${directorLevel}`">
              <span style="margin-right:8px">直到发起人向上的</span>
              <el-select
                style="width:140px"
                v-model="directorLevel"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in directorLevelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-radio>
            <el-radio :label="directorLevel">
              <span style="margin-right:8px">直到</span>
              <el-select
                style="width:140px"
                v-model="directorLevel"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in directorLevelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-radio>
          </el-radio-group>
        </div>
        <div v-else>
          <el-radio-group
            v-model="approverConfig.nodeUserType.type"
            @change="setTypeRadio"
          >
            <el-radio label="manager">部门主管</el-radio>
            <el-radio label="role">审批角色</el-radio>
            <el-radio label="user">指定用户</el-radio>
          </el-radio-group>
          <div v-if=" approverConfig.nodeUserType.type && approverConfig.nodeUserType.type !== 'manager' ">
            <el-form
              ref="form"
              label-width="90px"
            >
              <el-form-item :label="setTypeLabel">
                <div v-if="approverConfig.nodeUserType.type === 'user'">
                  <el-select
                    v-model="approverConfig.nodeUserType.valueList"
                    filterable
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in useroptions"
                      :key="item.id"
                      :label="item.userName"
                      :value="item.id"
                    > </el-option>
                  </el-select>
                </div>
                <div v-if="approverConfig.nodeUserType.type === 'role'">
                  <el-select
                    v-model="approverConfig.nodeUserType.valueList"
                    filterable
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in useroptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    > </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      // 节点类型
      examineModeList: [
        {
          value: "1",
          label: "会签审批",
          mark: "需要所有审批人同意，该审批节点才通过",
        },
        {
          value: "2",
          label: "或签审批",
          mark: "任意一名审批人同意，该审批节点即通过",
        },
        {
          value: "3",
          label: "逐级审批",
          mark: "按人事部门层级逐级依次审批后，该审批节点才通过",
        },
      ],
    };
  },

  methods: {
    //审批选择节点
    setExamineModeRadio(val) {
      this.$set(this.approverConfig.nodeUserType, "value", "");
      this.$set(this.approverConfig.nodeUserType, "valueList", []);
      if (val === "3") {
        this.approverConfig.nodeUserType.type = "manager";
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>