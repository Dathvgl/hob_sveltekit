<script lang="ts">
  import { CheckCircleOutlined } from "svelte-ant-design-icons";

  export let limited = 150;

  let hidden = true;

  function goTop() {
    document.body.scrollIntoView();
  }

  function scrollContainer() {
    return document.documentElement || document.body;
  }

  function handleOnScroll() {
    if (!scrollContainer()) {
      return;
    }

    hidden = scrollContainer().scrollTop > limited ? false : true;
  }
</script>

<svelte:window on:scroll={handleOnScroll} />

<div class="back-to-top" class:hidden>
  <CheckCircleOutlined size="3rem" on:click={goTop} />
</div>

<style>
  .back-to-top {
    @apply right-5 bottom-5 z-50 opacity-100;
    @apply fixed select-none cursor-pointer;
    transition: opacity 0.5s, visibility 0.5s;
  }

  .back-to-top.hidden {
    @apply opacity-0;
    visibility: hidden;
  }
</style>
