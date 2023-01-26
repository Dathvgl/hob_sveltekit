import type { RequestHandler } from '@api/manga/$types';
import { addManga, deleteManga, MangaBase, updateChapters, type DisplayManga } from '@db/mangaka';
import puppeteer from 'puppeteer';
import UrlParse from 'url-parse';
import userAgent from 'user-agents';

interface PostManga {
	link: string;
	type: string;
}

interface PutManga {
	link: string;
	last: number;
	mangaId: string;
}

interface DeleteManga {
	mangaId: string;
	chaptersId: string[];
}

export async function POST({ request }: RequestHandler) {
	const body: PostManga | null = await request.json();

	if (!body || !body.link) {
		return new Response(JSON.stringify({ message: 'Fail' }));
	}

	const { link, type } = body;
	const browser = await puppeteer.launch();
	const user = new userAgent();
	const page = await browser.newPage();

	await page.setUserAgent(user.random().toString());
	await page.goto(link, { waitUntil: 'networkidle0' });

	const data = await page.evaluate(() => document.querySelector('*')!.outerHTML);

	await browser.close();

	const init = MangaBase.init(data);
	const title = MangaBase.title(init);
	const cover = MangaBase.cover(init);
	const info = MangaBase.info(init);
	const detail = MangaBase.detail(init);
	const chapters = MangaBase.chapters(init);

	const base: DisplayManga = {
		title,
		cover,
		link: new UrlParse(link).pathname,
		type,
		info,
		detail,
		last: ''
	};

	await addManga(base, chapters);
	return new Response(JSON.stringify({ message: 'Success' }));
}

export async function PUT({ request }: RequestHandler) {
	const body: PutManga | null = await request.json();

	if (!body || !body.link) {
		return new Response(JSON.stringify({ message: 'Fail' }));
	}

	const { link, last, mangaId } = body;
	const browser = await puppeteer.launch();
	const user = new userAgent();
	const page = await browser.newPage();

	await page.setUserAgent(user.random().toString());
	await page.goto(link, { waitUntil: 'networkidle0' });

	const data = await page.evaluate(() => document.querySelector('*')!.outerHTML);

	await browser.close();

	const init = MangaBase.init(data);
	const chapters = MangaBase.chapters(init, last);

	await updateChapters(chapters, mangaId);
	return new Response(JSON.stringify({ message: 'Success' }));
}

export async function DELETE({ request }: RequestHandler) {
	const body: DeleteManga | null = await request.json();

	if (!body || !body.mangaId) {
		return new Response(JSON.stringify({ message: 'Fail' }));
	}

	const { chaptersId, mangaId } = body;

	await deleteManga(mangaId, chaptersId);
	return new Response(JSON.stringify({ message: 'Success' }));
}
