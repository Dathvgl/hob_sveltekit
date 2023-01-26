import { manga } from "@db/mangaka";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const data = await manga
    .find()
    .toArray()
    .then((list) =>
      list.map((item) => ({ ...item, _id: item?._id.toString() }))
    );
  return {
    mangaka: data.sort((a, b) => a.title.localeCompare(b.title)),
  };
};
