<template>
  <!-- Navigation -->
  <Navigation/>
  <main class="container-fluid row">
    <AlertList/>

    <router-view/>
  </main>
</template>

<script lang="ts">
import Navigation from "@/components/Navigation.vue";
import AlertList from "@/components/AlertList.vue";
import store from "@/store";
import router from "@/router";

export default {
  components: {AlertList, Navigation},
  mounted() {
    const token = store.state.user?.token; // předpokládáme, že token je uložen ve Vuex state pod objektem 'user'

    /**
     * Function to check if token is expired
     * @param token
     */
    function isTokenExpired(token: string) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);

        if (!exp) {
          return false;
        }

        const currentUnixTime = Math.floor(new Date().getTime() / 1000);
        return currentUnixTime > exp;
      } catch (e) {
        return false;
      }
    }

    // If token is expired, logout user
    if (token && isTokenExpired(token)) {
      console.log("Token has expired, need to refresh or logout");
      store.dispatch("logout");
      store.dispatch("addAlert", { message: "Your session expired. Please login again", type: "warning" });
      router.push("/login");
    }
  },
}
</script>

<style scoped>
header {
  line-height: 1.5;
}
</style>
