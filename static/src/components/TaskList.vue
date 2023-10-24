<template>
  <div class="row">
    <div class="col-lg-6 mx-auto mb-3">
      <h3 class="text-center">Add new task</h3>
      <input>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          {{ task.description }} - {{ task.completed ? 'Completed' : 'Pending' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">

</script>

<style scoped>

</style>