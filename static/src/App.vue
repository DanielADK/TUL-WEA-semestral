<template>
  <Navigation/>
  <main class="container">
    <AlertList/>

    <router-view/>
  </main>
</template>

<script lang="ts">
import { mapState } from "vuex";
import Navigation from "@/components/Navigation.vue";
import AlertList from "@/components/AlertList.vue";
export default {
  components: {AlertList, Navigation},
}
</script>

<style scoped>
header {
  line-height: 1.5;
}
</style>
