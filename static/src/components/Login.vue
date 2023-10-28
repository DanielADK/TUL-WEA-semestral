<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4 col-sm-12">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Enter username" v-model="username" required>
          </div>
          <div class="mb-3">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Enter password" v-model="password" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import type { User } from "@/types";
import {login} from "@/api";

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    ...mapActions(["addAlert", "login", "setUser"]),
    loginAlert() {
      this.addAlert({
        message: "You have been logged in!",
        type: "success"
      })
    },
    errorAlert(message: string) {
      this.addAlert({
        message: message,
        type: "danger"
      })
    },
    async handleLogin() {
      try {
        const response = await login(this.username, this.password);

        if (response.data.success) {
          // Save token to Vuex store
          const userData: User = {
            id: response.data.userId,
            username: response.data.username,
            token: response.data.token
          };
          await this.login(userData);

          // Login alert
          this.loginAlert();

          // Redirect on logged dashboard
          this.$router.push("/dashboard");
        } else {
          console.error("Invalid username or password");
          this.errorAlert("Invalid username or password");
        }
      } catch (error) {
        this.errorAlert("An error occured while logging in. Please contact an administrator.");
        console.error("An error occured while logging in:", error);
      }
    }
  }
}
</script>

<style scoped>
button {
  width: 100%;
}
</style>