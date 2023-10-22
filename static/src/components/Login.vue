<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3 row">
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Enter username" v-model="username" required>
          </div>
          <div class="mb-3 row">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Enter password" v-model="password" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(["addAlert"]),
    loginAlert() {
      this.addAlert({
        message: "You have been logged in!",
        type: "success"
      })
    },
    errorAlert(message) {
      this.addAlert({
        message: message,
        type: "danger"
      })
    },
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:5000/login", {
          username: this.username,
          password: this.password
        });

        if (response.data.success) {
          // Save token to localstorage
          localStorage.setItem("token", response.data.token);

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

</style>