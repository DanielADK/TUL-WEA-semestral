<template>
  <nav class="navbar bg-primary navbar-expand-lg mb-4" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="/"><i class="bi bi-journal-text"></i> TODO LIST</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul class="navbar-nav me-auto">
          <router-link v-if="isAuthenticated" class="nav-item nav-link" to="/">Dashboard</router-link>
          <router-link v-else class="nav-item nav-link" to="/">Home</router-link>
        </ul>
        <router-link v-if="!isAuthenticated" to="/login" class="btn btn-light nav-item">Login</router-link>
        <div v-else class="btn-group">
          <a class="btn btn-primary active" href="#">{{ user.username }}</a>
          <button @click="handleLogout" class="btn btn-danger nav-item">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "user"])
  },
  methods: {
    ...mapActions(["addAlert", "logout"]),
    /**
     * Handles the logout
     */
    async handleLogout() {
      await this.logout();
      await this.addAlert({
        message: "You successfully logout.",
        type: "success"
      });
      this.$router.push("/");
    }
  }
}
</script>

<style scoped lang="scss">
.navbar {
  box-shadow: 0 0 10px #B5B5B5;
}
.navbar-brand {
  font-weight: bold;
}

</style>