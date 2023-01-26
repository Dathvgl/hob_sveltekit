<script lang="ts">
  import type { ReadMangaka } from "@db/mangaka";
  import { readMangaka } from "@src/store";
  import type { PageData } from "./$types";

  export let data: PageData;
  $: ({ index, type, images } = data);

  let read: ReadMangaka;

  readMangaka.subscribe((item) => {
    read = item;
  });
</script>

<div>
  {#if images.length == 0}
    <div class="manga-none">Chưa thêm vào</div>
  {/if}
  {#each images as image}
    <img
      class="m-auto"
      width={`${read[type]}px`}
      src={image.link}
      alt={`Image ${image.index}`}
    />
  {/each}
</div>

<div class="manga-current">Chap {index}</div>

<style>
  .manga-current {
    @apply fixed left-5 bottom-5 z-50 font-bold;
  }

  .manga-none {
    @apply font-medium leading-tight mt-0;
    @apply text-3xl text-justify;
    text-align-last: center;
  }
</style>
