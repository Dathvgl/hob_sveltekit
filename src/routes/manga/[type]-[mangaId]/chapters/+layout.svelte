<script lang="ts">
  import type { ReadMangaka } from "@db/mangaka";
  import { readMangaka } from "@src/store";
  import { writable } from "svelte/store";
  import type { LayoutData } from "./$types";
  import BackToTop from "./BackToTop.svelte";
  import SelectChapter from "./SelectChapter.svelte";

  export let data: LayoutData;
  $: ({ type, href, current, chapters } = data);

  let resize = false;

  function keyUp(event: KeyboardEvent) {
    const keyBoard = event.code;

    if (keyBoard == "ArrowDown" && resize) {
      resize = false;
    }
  }

  function keyDown(event: KeyboardEvent) {
    const keyBoard = event.code;

    const sizable = {
      ArrowRight: 100,
      ArrowLeft: -100,
    };

    if (resize) {
      if (keyBoard == "ArrowLeft" || keyBoard == "ArrowRight") {
        readMangaka.update((item) => ({
          ...item,
          [type]: item[type] + sizable[keyBoard],
        }));
      }
    }

    if (keyBoard == "ArrowDown") {
      resize = true;
    }
  }
</script>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<SelectChapter {href} {current} {chapters} />
<slot />
<BackToTop />
