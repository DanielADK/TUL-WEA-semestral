<template>
  <div class="row">
    <h1 class="text-center">Add Task</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="taskDescription" class="form-label">Task Description</label>
        <input type="text" class="form-control" id="taskDescription" v-model="description" required>
      </div>
      <button type="submit" class="btn btn-primary">Add Task</button>
    </form>
  </div>
</template>

<script lang="ts">
import { mapGetters, useStore } from 'vuex';
import { addTask } from '@/api';

export default {
  data() {
    return {
      description: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    async handleSubmit() {
      try {
        const token = this.user.token;
        const response = await addTask(token, this.description);
        this.description = "";
      } catch (error) {
        console.error(error);
      }
    }
  }
}

</script>

<style scoped>

</style>