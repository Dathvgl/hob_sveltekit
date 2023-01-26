<script lang="ts">
  import { goto } from "$app/navigation";
  import type { ChapterManga } from "@db/mangaka";

  interface Chapterist extends ChapterManga {
    _id: string;
  }

  export let href: string;
  export let current: string;
  export let chapters: Chapterist[];

  const last = chapters[0]._id;
  const first = chapters[chapters.length - 1]._id;

  let resize = false;
  let selected = current;

  $: selectChapter(selected);

  function selectChapter(chapterId: string) {
    if (!chapterId || chapterId == current) {
      return;
    }

    const chap = chapters.find((item) => item._id == selected)!.chap;
    goto(`/manga/${href}/chapters/chap-${chap}-${chapterId}`);
  }

  function keyUp(event: KeyboardEvent) {
    const keyBoard = event.code;

    if (keyBoard == "ArrowDown" && resize) {
      resize = false;
    }
  }

  function keyDown(event: KeyboardEvent) {
    const keyBoard = event.code;

    const message = {
      ArrowLeft: "Hiện đang chap đầu tiên",
      ArrowRight: "Hiện đang chap mới nhất",
    };

    const resist = {
      ArrowLeft: first,
      ArrowRight: last,
    };

    const variation = {
      ArrowLeft: 1,
      ArrowRight: -1,
    };

    if (!resize) {
      if (keyBoard == "ArrowLeft" || keyBoard == "ArrowRight") {
        moveChap(resist[keyBoard], variation[keyBoard], message[keyBoard]);
      }
    }

    if (keyBoard == "ArrowDown") {
      resize = true;
    }
  }

  function moveChap(resist: string, variation: number, message: string) {
    if (current != resist) {
      const num = chapters.findIndex((item) => item._id == current) + variation;
      const index = chapters[num]!.chap;
      const altChap = chapters[num]._id;

      current = altChap;
      selected = altChap;
      goto(`/manga/${href}/chapters/chap-${index}-${altChap}`);
    } else {
      alert(message);
    }
  }
</script>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<div class="flex gap-2 justify-center mt-4 mb-4">
  <button class="chapter-move-btn" disabled={current == first}>Prev</button>
  <select class="border-2 border-black rounded" bind:value={selected}>
    {#each chapters as chapter}
      <option value={chapter._id}>
        Chap {chapter.chap}
      </option>
    {/each}
  </select>
  <button class="chapter-move-btn" disabled={current == last}>Next</button>
</div>

<style>
  .chapter-move-btn {
    @apply bg-lime-500 text-white font-bold py-2 px-4 rounded;
  }

  .chapter-move-btn:disabled {
    @apply bg-gray-500 text-white font-bold py-2 px-4 rounded;
  }

  .chapter-move-btn:hover:not(:disabled) {
    @apply bg-lime-700;
  }
</style>
