<template>
  <Navigation/>
  <main class="container">
    <AlertList :alerts="alerts" @remove-alert="removeAlert"/>

    <router-view/>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import HelloWorld from './components/Home.vue'
import LoginScreen from "@/components/Login.vue"
import Navigation from "@/components/Navigation.vue";
import AlertList from "@/components/AlertList.vue";

</script>

<style scoped>
header {
  line-height: 1.5;
}
</style>
