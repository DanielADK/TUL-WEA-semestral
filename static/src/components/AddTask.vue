<template>
  <!-- AddTask -->
  <section>
    <h1 class="text-center mb-4">Add Task</h1>
    <form @submit.prevent="handleSubmit">
      <div class="input-group mb-3">
        <input type="text" class="form-control" id="taskDescription" placeholder="Task description" v-model="description" required>
        <button type="submit" class="btn btn-primary">Add Task</button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import {mapActions, mapGetters, useStore} from 'vuex';
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
    ...mapActions(["createTask"]),
    /**
     * Handles the form submission
     */
    async handleSubmit() {
      try {
        await this.createTask(this.description);
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