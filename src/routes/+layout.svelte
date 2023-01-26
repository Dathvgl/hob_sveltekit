<script lang="ts">
  import "../app.css";
</script>

<nav class="navbar-container">
  <a class="navbar-item mr-4" href="/">Home</a>
  <a class="navbar-item" href="/manga">Manga</a>
</nav>

<slot />

<style>
  .navbar-container {
    @apply p-10 bg-blue-600 z-50 relative;
  }

  .navbar-item {
    @apply p-3 bg-sky-500 rounded text-white font-bold;
  }
</style>
