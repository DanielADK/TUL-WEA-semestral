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

<script lang="ts" setup>

</script>

<style scoped>

</style>