<script lang="ts">
	import {
		CheckCircleOutlined,
		CloseCircleTwotone,
		FolderOpenOutlined,
		FolderTwotone
	} from 'svelte-ant-design-icons';
	import UrlParse from 'url-parse';
	import type { PageData } from './$types';
	import z from 'zod';
	import { page } from '$app/stores';
	import { goto, invalidate, invalidateAll } from '$app/navigation';

	export let data: PageData;
	$: ({ mangaka, chapters } = data);

	const href = $page.url.pathname;
	const urlSchema = z.string().url();

	const input = {
		url: '',
		error: ''
	};

	$: allSelected = chapters.length == selected.length;

	let multi = false;
	let selected: string[] = [];

	async function paste() {
		const url = await navigator.clipboard.readText();
		const base = new UrlParse(url);
		input.url = base.origin;
	}

	function reset() {
		input.url = '';
		input.error = '';
	}

	async function update() {
		if (confirm('Cập nhật tới chap mới nhất từ chap lớn nhất?')) {
			const result = urlSchema.safeParse(input.url);
			if (!result.success) {
				input.error = result.error.format()._errors.join(', ') || '';
			} else {
				input.error = '';

				const res = await fetch('/api/mangas', {
					method: 'PUT',
					body: JSON.stringify({
						link: input.url + mangaka.link,
						last: chapters[0].chap,
						mangaId: mangaka._id
					})
				});
				await invalidateAll();
				console.log(`${res.status}: Update chapter`);
			}
		}
	}

	async function image() {
		const result = urlSchema.safeParse(input.url);
		if (!result.success) {
			input.error = result.error.format()._errors.join(', ') || '';
		} else {
			input.error = '';

			const loop = selected.length;
			if (loop != 0) {
				for (let index = 0; index < loop; index++) {
					const obj = chapters.find((item) => item._id == selected[index]);
					const link = input.url + obj?.link;
					const res = await fetch('/api/images', {
						method: 'POST',
						body: JSON.stringify({
							link,
							chapterId: obj?._id
						})
					});
					console.log(`${res.status}: Chapter ${obj?.chap}`);
				}
			}
		}
		await invalidateAll();
	}

	function selectAll() {
		selected = allSelected ? [] : [...chapters.map((item) => item._id)];
	}

	async function destroy() {
		if (confirm('Xóa tất cả những gì liên quan tới truyện này?')) {
			const res = await fetch('/api/mangas', {
				method: 'DELETE',
				body: JSON.stringify({
					mangaId: mangaka._id,
					chaptersId: chapters.map((item) => item._id)
				})
			});

			goto('/manga');
			console.log(`${res.status}: Xóa truyện ${mangaka.title}`);
		}
	}

	function keyUp(event: KeyboardEvent) {
		const keyBoard = event.key;

		if (keyBoard == 'Alt') {
			multi = false;
		}
	}

	function keyDown(event: KeyboardEvent) {
		const keyBoard = event.key;

		if (keyBoard == 'Alt') {
			multi = true;
		}
	}

	function boxes(event: Event) {
		const { value } = event.target as HTMLInputElement;

		if (selected.length == 1 && multi) {
			const base = selected[0];

			const x = chapters.findIndex((item) => item._id == base);
			const y = chapters.findIndex((item) => item._id == value);

			if (x < y) {
				for (let index = x + 1; index < y + 1; index++) {
					selected = [...selected, chapters[index]._id];
				}
			} else {
				for (let index = y; index < x + 1; index++) {
					selected = [...selected, chapters[index]._id];
				}
			}
		}
	}

	function redirectChap(num: number) {
		const { _id: chapterId, chap } = chapters[num];
		goto(`${href}/chapters/chap-${chap}-${chapterId}`);
	}
</script>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<div class="manga-container">
	<div class="w-8/12">
		<div class="flex flex-col md:flex-row mt-8">
			<img class="w-80" src={mangaka.cover} alt={mangaka.title} />
			<div class="manga-info md:ml-12 mt-4 md:mt-0">
				<div class="manga-info-title">Tên khác:</div>
				<div class="manga-info-name-alt">{mangaka.info?.name}</div>
				<div class="manga-info-title">Tác giả:</div>
				<div>{mangaka.info?.author}</div>
				<div class="manga-info-title">Tình trạng:</div>
				<div>{mangaka.info?.state}</div>
				<div class="manga-info-title">Thể loại:</div>
				<div>{mangaka.info?.category.join(' - ')}</div>
			</div>
		</div>
		<div class="mt-12">
			<div class="flex flex-wrap justify-between mb-2 gap-4">
				<div class="manga-desc">Nội dung</div>
				<button
					on:click={() => redirectChap(chapters.length - 1)}
					class="input-button bg-blue-500 hover:bg-blue-70"
					>Đọc từ đầu
				</button>
				{#if mangaka.last}
					<button
						on:click={() => redirectChap(chapters.findIndex((item) => item._id == mangaka.last))}
						class="input-button bg-blue-500 hover:bg-blue-70"
						>Đọc tiếp
					</button>
				{/if}
				<button on:click={() => redirectChap(0)} class="input-button bg-blue-500 hover:bg-blue-70"
					>Đọc mới nhất
				</button>
				<button on:click={destroy} class="input-button bg-blue-500 hover:bg-blue-70"
					>Xóa truyện
				</button>
				<button on:click={update} class="input-button bg-blue-500 hover:bg-blue-70"
					>Cập nhật
				</button>
			</div>
			<div class="manga-description">{mangaka.detail}</div>
		</div>
	</div>
	<div class="flex-1 sm:pl-8 flex flex-col">
		<div class="mb-3">
			<div class="flex gap-1">
				<label class="label-text flex-1 dark:text-white" for="input-nettruyen">
					Domain nettruyen
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
					placeholder="nettruyen-domain-.com"
				/>
			</div>
			{#if input.error}
				<div class="text-red-500">{input.error}</div>
			{/if}
			<button on:click={image} class="input-button mt-3 w-full bg-blue-500 hover:bg-blue-70">
				Tải ảnh
			</button>
		</div>
		<div class="relative flex-1">
			<input type="checkbox" on:click={selectAll} checked={allSelected} />
			Tất cả chapter
			<ui class="manga-chapters h-64 sm:h-full">
				{#each chapters as chapter}
					<li class="mt-2">
						<div class="flex gap-4">
							<input
								on:click={boxes}
								bind:group={selected}
								type="checkbox"
								name={chapter._id}
								value={chapter._id}
							/>
							<a
								style={`color: ${mangaka.last == chapter._id ? 'red' : 'black'};`}
								class="flex-1 self-center"
								href={`${href}/chapters/chap-${chapter.chap}-${chapter._id}`}
							>
								Chapter: {chapter.chap}
							</a>
							{#if chapter.state}
								<CheckCircleOutlined size="2rem" />
							{/if}
						</div>
					</li>
				{/each}
			</ui>
		</div>
	</div>
</div>

<style>
	.manga-container {
		@apply flex flex-col mt-8 items-center;
	}

	@media (min-width: 640px) {
		.manga-container {
			align-items: inherit;
			flex-direction: row;
		}
	}

	.manga-info {
		@apply grid gap-x-8 gap-y-4 text-lg;
		grid-template-columns: min-content auto;
		grid-template-rows: min-content min-content min-content min-content;
	}

	.manga-info-title {
		@apply whitespace-nowrap;
	}

	.manga-info-name-alt {
		@apply overflow-hidden;
		--max-lines: 2;
		--line-height: 1.4;
		max-height: calc(var(--max-lines) * 1em * var(--line-height));
		line-height: var(--line-height);
	}

	.manga-desc {
		@apply flex-1 font-bold leading-tight text-3xl mt-0 text-blue-600;
	}

	.manga-description {
		@apply leading-tight mt-0 mb-2 overflow-y-scroll;
		@apply font-medium text-lg text-justify;
		--max-lines: 3;
		--line-height: 1.4;
		max-height: calc(var(--max-lines) * 1em * var(--line-height));
		line-height: var(--line-height);
	}

	.label-text {
		@apply block mb-2 text-lg font-medium text-gray-900;
	}

	.input-container {
		@apply relative mb-3 w-full;
	}

	.input-icon {
		@apply absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none;
	}

	.input-field {
		@apply bg-gray-50 border border-gray-300 text-gray-900 text-sm;
		@apply block w-full pl-10 p-2.5 rounded-lg;
	}

	.input-button {
		@apply text-white font-bold py-2 px-4 rounded;
	}

	.manga-chapters {
		@apply m-0 p-0 list-none w-full block absolute;
		@apply overflow-hidden overflow-y-scroll;
	}
</style>
