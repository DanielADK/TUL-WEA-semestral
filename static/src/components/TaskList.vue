<template>
  <!-- TaskList -->
  <div class="list-group">
    <h1 class="text-center mb-4">Tasks</h1>

    <!-- TaskListFilter -->
    <div class="row">
      <div class="col-4 input-group text-center mb-4">
        <button class="btn btn-outline-primary" :class="{'active': currentFilter == 'all'}" @click="setFilter('all')">All</button>
        <button class="btn btn-outline-primary" :class="{'active': currentFilter == 'completed'}" @click="setFilter('completed')">Completed</button>
        <button class="btn btn-outline-primary" :class="{'active': currentFilter == 'uncompleted'}" @click="setFilter('uncompleted')">Uncompleted</button>
      </div>
    </div>

    <div class="list-group-item list-group-item-action" :class="{ 'list-group-item-success': task.completed }" v-for="task in filteredTasks" :key="task.id">
      <div class="d-flex justify-content-between align-items-center py-2 mx-2">

        <div class="btn-group">
          <input type="text" class="form-control" v-model="task.description" @blur="updateTask(task)" />
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
  data() {
    return {
      currentFilter: "all"
    };
  },
  computed: {
    ...mapState(["tasks"]),
    sortedTasks() {
      return this.tasks.sort((a: Task, b: Task) => {
        return (a.completed ? 1 : 0) - (b.completed ? 1 : 0) || a.id - b.id;
      });
    },
    filteredTasks() {
      return this.sortedTasks.filter((task: Task) => {
        if (this.currentFilter == "all") return true;
        if (this.currentFilter == "completed") return task.completed;
        if (this.currentFilter == "uncompleted") return !task.completed;
        return true;
      });
    }
  },
  methods: {
    ...mapActions(["fetchTasks", "createTask", "modifyTask", "removeTask"]),
    setFilter(filter: string) {
      this.currentFilter = filter;
    },
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