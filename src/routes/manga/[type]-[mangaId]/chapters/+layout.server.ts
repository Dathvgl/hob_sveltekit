import { chapter } from "@db/mangaka";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
  const { type, mangaId, chapterId } = params;

  const content = (await chapter.find({ mangaId }).toArray()).map((item) => ({
    ...item,
    _id: item?._id.toString(),
  }));

  return {
    type,
    href: `${type}-${mangaId}`,
    current: chapterId || "",
    chapters: content.sort((a, b) => a.chap - b.chap).reverse(),
  };
};
