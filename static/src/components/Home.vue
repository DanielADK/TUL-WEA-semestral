<template>
  <Dashboard v-if="isAuthenticated"/>
  <div v-else class="greetings">
    <p>
      Welcome to TODO App, a simple app to manage your tasks. Please login to show your tasks.
    </p>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import Dashboard from "@/components/Dashboard.vue";

export default {
  components: {Dashboard},
  computed: {
    ...mapGetters(["isAuthenticated"])
  },
}
</script>

<style scoped>
</style>
