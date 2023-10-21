<script setup>

</script>

<template>
  <nav class="navbar bg-primary navbar-expand-lg mb-4" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">TODO LIST</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link class="nav-link" to="/login">Login</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
</style>