<template>
  <div class="col-12">
    <div v-for="(alert, index) in alerts" :key="index" class="alert" :class="alertClass(alert.type)">
      {{ alert.message }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["alerts"])
  },
  methods: {
    alertClass(type) {
      return `alert-${type}`;
    },
    removeAlert(index) {
      this.$emit("remove-alert", index);
    },
  }
}
</script>

<style scoped>

</style>