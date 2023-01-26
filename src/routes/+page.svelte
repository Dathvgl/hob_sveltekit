<script lang="ts">
  import {
    CloseCircleTwotone,
    FolderOpenOutlined,
    FolderTwotone,
  } from "svelte-ant-design-icons";
  import z from "zod";

  const urlSchema = z.string().url();

  const input = {
    url: "",
    error: "",
    type: "manga",
  };

  async function mangaka() {
    const result = urlSchema.safeParse(input.url);
    if (!result.success) {
      input.error = result.error.format()._errors.join(", ") || "";
    } else {
      input.error = "";

      const res = await fetch("/api/mangas", {
        method: "POST",
        body: JSON.stringify({
          link: input.url,
          type: input.type,
        }),
      });
      console.log(`${res.status}: Add mangaka`);
    }
  }

  async function paste() {
    const url = await navigator.clipboard.readText();
    input.url = url;
  }

  function reset() {
    input.url = "";
    input.error = "";
  }
</script>

<!-- https://svelte-ant-design-icons.codewithshin.com/ -->
<div class="manga-container">
  <div class="m-auto">
    <div class="flex gap-1">
      <label class="label-text flex-1 dark:text-white" for="input-nettruyen">
        Url nettruyen truyện nào đó
      </label>
      <div class="flex-none">
        <FolderTwotone on:click={paste} size="2rem" />
      </div>
      <div class="flex-none">
        <CloseCircleTwotone on:click={reset} size="2rem" />
      </div>
    </div>
    <div class="input-container">
      <div class="input-icon">
        <FolderOpenOutlined />
      </div>
      <input
        bind:value={input.url}
        type="text"
        id="input-nettruyen"
        class="input-field focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="nettruyen/truyentranh/..."
      />
    </div>
    <div class="mb-3">
      <ul class="radio-container sm:flex">
        <li class="radio-item sm:border-b-0 sm:border-r dark:border-gray-600">
          <div class="flex items-center pl-3">
            <input
              id="manga"
              type="radio"
              value="manga"
              class="radio-input focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              bind:group={input.type}
            />
            <label for="manga" class="radio-label dark:text-gray-300">
              Manga
            </label>
          </div>
        </li>
        <li class="radio-item sm:border-b-0 sm:border-r dark:border-gray-600">
          <div class="flex items-center pl-3">
            <input
              id="webtoon"
              type="radio"
              value="webtoon"
              class="radio-input focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              bind:group={input.type}
            />
            <label for="webtoon" class="radio-label dark:text-gray-300">
              Webtoon
            </label>
          </div>
        </li>
      </ul>
    </div>
    {#if input.error}
      <div class="text-red-500">{input.error}</div>
    {/if}
    <button
      on:click={mangaka}
      class="input-button bg-blue-500 hover:bg-blue-70"
    >
      Thêm vào dữ liệu
    </button>
  </div>
</div>

<style>
  .manga-container {
    @apply flex h-screen absolute top-0 left-0 right-0 m-auto z-10;
  }

  .label-text {
    @apply block mb-2 text-lg font-medium text-gray-900;
  }

  .input-container {
    @apply relative mb-3 w-80;
  }

  .input-icon {
    @apply absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none;
  }

  .input-field {
    @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm;
    @apply block w-full pl-10 p-2.5 rounded-lg;
  }

  .input-button {
    @apply w-full mt-3 text-white font-bold py-2 px-4 rounded;
  }

  .radio-container {
    @apply items-center w-full text-sm font-medium rounded-lg;
    @apply text-gray-900 bg-white border border-gray-200;
  }

  .radio-item {
    @apply w-full border-b border-gray-200;
  }

  .radio-label {
    @apply w-full py-3 ml-2 text-sm font-medium text-gray-900;
  }

  .radio-input {
    @apply w-4 h-4 text-blue-600 bg-gray-100 border-gray-300;
  }
</style>
