import { manga } from "@db/mangaka";
import { ObjectId } from "mongodb";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
  const { type, mangaId } = params;
  const objId = new ObjectId(mangaId);

  const data = await manga
    .findOne({ _id: objId })
    .then((item) => ({ ...item, _id: item?._id.toString() }));

  return {
    href: `${type}-${mangaId}`,
    title: data.title,
  };
};
