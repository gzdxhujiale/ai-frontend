<template>
  <div class="placeholder-view">
    <a-card :bordered="false">
      <a-result status="403" title="无权访问" subtitle="当前租户与角色没有访问这个页面的权限，请切换租户或联系管理员。">
        <template #extra><a-button type="primary" @click="$router.push('/workspace')">返回工作台</a-button></template>
      </a-result>
    </a-card>
  </div>
</template>
