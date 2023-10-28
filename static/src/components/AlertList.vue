<template>
  <!-- AlertList -->
  <section class="col-12">
    <div v-for="(alert, index) in alerts" :key="index" class="alert alert-dismissible fade show" :class="alertClass(alert.type)">
      {{ alert.message }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["alerts"])
  },
  methods: {
    /**
     * Returns the class for the alert
     * @param type The type of the alert
     */
    alertClass(type) {
      return `alert-${type}`;
    },
    /**
     * Removes the alert from the store
     * @param index The index of the alert
     */
    removeAlert(index) {
      this.$emit("remove-alert", index);
    },
  }
}
</script>

<style scoped>
</style>