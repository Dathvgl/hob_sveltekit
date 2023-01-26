import { ObjectId } from 'mongodb';
import { HTMLElement, parse } from 'node-html-parser';
import UrlParse from 'url-parse';
import db from './mongodb';

export const category = db.collection<CategoryManga>('category');
export const manga = db.collection<DisplayManga>('manga');
export const chapter = db.collection<ChapterManga>('chapter');
export const image = db.collection<ImageManga>('image');

export interface ReadMangaka {
	manga: number;
	webtoon: number;
}

export interface CategoryManga {
	name: string;
}

export interface InfoManga {
	name: string;
	author: string;
	state: string;
	category: string[];
}

export interface ChapterManga {
	mangaId?: string;
	chap: number;
	link: string;
	state: boolean;
}

export interface DisplayManga {
	title: string;
	cover: string;
	link: string;
	type: string;
	info: InfoManga;
	detail: string;
	last: string;
}

export interface ImageManga {
	chapterId: string;
	index: number;
	link: string;
}

export const MangaBase = {
	init,
	initial,
	title,
	cover,
	images,
	info,
	detail,
	chapters
};

// Trang xem thông tin truyện và chapter
function init(html: string) {
	const root = parse(html);
	return root.querySelector('article#item-detail')!;
}

// Trang xem truyện có các ảnh
function initial(html: string) {
	const root = parse(html);
	return root.querySelector('div.reading-detail.box_doc')!;
}

function title(html: HTMLElement) {
	return html.querySelector('h1.title-detail')!.innerText.trim();
}

function cover(html: HTMLElement) {
	return `https:${html.querySelector('img')!.getAttribute('src')}`;
}

function images(html: HTMLElement) {
	const images: string[] = [];
	const list = html.querySelectorAll('img');
	for (const item of list) {
		images.push(`https:${item!.getAttribute('src')}` || '');
	}
	return images;
}

function info(html: HTMLElement) {
	const thongTin: InfoManga = {
		name: html.querySelector('li.othername h2')?.innerText.trim() || 'Đang cập nhật',
		author: html.querySelector('li.author p a')?.innerText.trim() || 'Đang cập nhật',
		state: html.querySelector('li.status p.col-xs-8')?.innerText.trim() || 'Đang cập nhật',
		category: []
	};

	const types = html.querySelectorAll('li.kind a');
	for (const item of types) {
		thongTin.category.push(item.innerText.trim());
	}

	return thongTin;
}

function detail(html: HTMLElement) {
	return html.querySelector('div.detail-content > p')!.innerText.trim();
}

function chapters(html: HTMLElement, last: number = -1) {
	const regex = /\d*\.?\d*$/;
	const chapters: ChapterManga[] = [];
	const list = html.querySelectorAll('div#nt_listchapter a');

	for (const item of list) {
		const url = new UrlParse(item.getAttribute('href') || '');
		const chap = Number.parseFloat(item.innerText.split(' ')[1].split(':')[0].match(regex)![0]);

		if (chap == last || !chap) {
			break;
		}

		chapters.push({
			chap,
			link: url.pathname,
			state: false
		});
	}
	return chapters.sort((a, b) => a.chap - b.chap);
}

export async function addManga(obj: DisplayManga, root: ChapterManga[]) {
	const loop = obj.info.category.length;
	for (let index = 0; index < loop; index++) {
		const name = obj.info.category[index];
		const root = await category.findOne({ name });
		obj.info.category[index] = root?._id.toString() || '';
	}
	await manga.insertOne(obj);
	await addChapters(root, obj.title);
}

export async function updateMangaLast(mangaId: string, last: string) {
	await manga.updateOne({ _id: new ObjectId(mangaId) }, { $set: { last } });
}

export async function deleteManga(mangaId: string, chaptersId: string[]) {
	for (const chapterId of chaptersId) {
		await image.deleteMany({ chapterId });
	}

	await chapter.deleteMany({ mangaId });
	await manga.deleteOne({ _id: new ObjectId(mangaId) });
}

export async function addChapters(obj: ChapterManga[], title: string) {
	const root = await manga.findOne({ title });
	const mangaId = root?._id.toString();
	await chapter.insertMany(obj.map((item) => ({ ...item, mangaId })));
}

export async function updateChapters(obj: ChapterManga[], mangaId: string) {
	if (obj.length != 0) {
		await chapter.insertMany(obj.map((item) => ({ ...item, mangaId })));
	}
}

export async function addImages(obj: ImageManga[], chapterId: string) {
	await image.insertMany(obj);
	await chapter.updateOne({ _id: new ObjectId(chapterId) }, { $set: { state: true } });
}
