import { ObjectId } from "mongodb";
import { category, chapter, manga } from "@db/mangaka";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { mangaId } = params;
  const objId = new ObjectId(mangaId);

  const data = await manga
    .findOne({ _id: objId })
    .then((item) => ({ ...item, _id: item?._id.toString() }));

  const loop = data.info!.category.length;
  for (let index = 0; index < loop; index++) {
    const id = new ObjectId(data.info!.category[index]);
    const type = await category.findOne({ _id: id }).then((item) => item!.name);
    data.info!.category[index] = type;
  }

  const content = (await chapter.find({ mangaId }).toArray()).map((item) => ({
    ...item,
    _id: item?._id.toString(),
  }));

  return {
    mangaka: data,
    chapters: content.sort((a, b) => a.chap - b.chap).reverse(),
  };
};
