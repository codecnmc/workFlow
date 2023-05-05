<!--
 * @Author: 羊驼
 * @Date: 2023-05-05 10:31:28
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-05-05 11:14:14
 * @Description: 可以复用的抄送人组件
-->
<template>
  <el-form-item label="抄送人设置">
    <el-descriptions
      :column="1"
      border
      v-for="(item,index) in modal"
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
            class="w-100"
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
      v-if="modal.length<1"
      @click="pushCarbon"
      icon="el-icon-plus"
      type="text"
    >添加抄送人</el-button>
  </el-form-item>
</template>

<script>
export default {
  props: ["value", "memberOptions"],
  model: {
    prop: "value",
    event: "input",
  },
  computed: {
    modal: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      item: {
        type: 1, // 直属上级
        level: 1, // 如果为部门负责人 选择层级
        member: [],
      },
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
      refresh: true,
    };
  },
  methods: {
    pushCarbon() {
      this.modal.push(JSON.parse(JSON.stringify(this.item)));
    },
    removeCarbon(index) {
      this.modal.splice(index, 1);
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
.flex {
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: space-between;
}
</style>