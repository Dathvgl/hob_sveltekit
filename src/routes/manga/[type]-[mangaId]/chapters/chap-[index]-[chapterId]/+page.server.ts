import { image, updateMangaLast } from '@db/mangaka';
import type { PageServerLoad } from './$types';

type typeMangaka = 'manga' | 'webtoon';

export const load: PageServerLoad = async ({ params }) => {
	const { type, index, chapterId, mangaId } = params;

	const data = await image
		.find({ chapterId: chapterId })
		.toArray()
		.then((list) => list.map((item) => ({ ...item, _id: item._id.toString() })));

	await updateMangaLast(mangaId, chapterId);

	return {
		index,
		type: type as typeMangaka,
		images: data.sort((a, b) => a.index - b.index)
	};
};
