<template>
  <div class="row">
    <h1 class="text-center mb-4">Tasks</h1>
    <div class="col-12" v-for="task in sortedTasks" :key="task.id">
      <div class="d-flex justify-content-between align-items-center border-bottom py-2 mx-2 bg-opacity-50"
          :class="{ 'bg-success': task.completed }">
        <input type="text" class="form-control mx-2" v-model="task.description" @blur="updateTask(task)" />

        <div class="btn-group mx-2">
          <button v-if="task.completed" class="btn btn-danger" @click="toggleCompletion(task)">Uncheck</button>
          <button v-else class="btn btn-success" @click="toggleCompletion(task)">Check</button>

          <button class="btn btn-danger" @click="deleteTask(task.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { deleteTask, updateTask } from "@/api";
import { defineComponent, computed } from "vue";
import { mapActions, mapState } from "vuex";
import type { Task } from "@/types";

export default defineComponent({
  computed: {
    ...mapState(["tasks"]),
    sortedTasks() {
      return this.tasks.sort((a: Task, b: Task) => {
        return (a.completed ? 1 : 0) - (b.completed ? 1 : 0) || a.id - b.id;
      });
    }
  },
  methods: {
    ...mapActions(["fetchTasks", "createTask", "modifyTask", "removeTask"]),
    updateTask(task: Task) {
      this.modifyTask({ id: task.id, data: { description: task.description } });
    },
    toggleCompletion(task: Task) {
      this.modifyTask({ id: task.id, data: { completed: !task.completed } });
    },
    deleteTask(id: number) {
      this.removeTask(id);
    }
  },
  mounted() {
    this.fetchTasks();
  }
})

</script>

<style scoped>

</style>