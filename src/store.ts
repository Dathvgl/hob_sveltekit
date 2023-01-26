import type { ReadMangaka } from "@db/mangaka";
import { writable } from "svelte/store";

export const readMangaka = writable<ReadMangaka>({
  manga: 900,
  webtoon: 700,
});
