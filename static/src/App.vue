<template>
  <Navigation/>
  <main class="container">
    <AlertList :alerts="alerts" @remove-alert="removeAlert"/>

    <router-view/>
  </main>
</template>

<script setup>
import Navigation from "@/components/Navigation.vue";
import AlertList from "@/components/AlertList.vue";

</script>

<style scoped>
header {
  line-height: 1.5;
}
</style>
