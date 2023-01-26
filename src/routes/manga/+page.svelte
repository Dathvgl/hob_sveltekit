<script lang="ts">
  import { page } from "$app/stores";
  import type { PageData } from "./$types";

  export let data: PageData;
  $: ({ mangaka } = data);

  const href = $page.url.pathname;
</script>

<div class="p-8 flex flex-wrap justify-between gap-8">
  {#each mangaka as manga}
    <a href={`${href}/${manga.type}-${manga._id}`}>
      <figure class="table">
        <img class="w-48" src={manga.cover} alt={manga.title} />
        <figcaption class="table-caption" style="caption-side: bottom;">
          <div class="manga-title">
            {manga.title}
          </div>
        </figcaption>
      </figure>
    </a>
  {/each}
</div>

<style>
  .manga-title {
    @apply font-medium leading-tight mt-0 mb-2 overflow-clip;
    @apply text-ellipsis text-lg text-justify;
    --max-lines: 2;
    --line-height: 1.4;
    max-height: calc(var(--max-lines) * 1em * var(--line-height));
    line-height: var(--line-height);
  }
</style>
