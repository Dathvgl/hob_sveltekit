<script lang="ts">
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
  $: ({ href, title } = data);
</script>

<div class="p-8">
  <div class="manga-title">
    <a href={`/manga/${href}`}>
      {title}
    </a>
  </div>
  <slot />
</div>

<style>
  .manga-title {
    @apply font-medium leading-tight mt-0;
    @apply text-3xl text-justify;
    text-align-last: center;
  }
</style>
