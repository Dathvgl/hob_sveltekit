import type { RequestHandler } from "@api/image/$types";
import { addImages, MangaBase, type ImageManga } from "@db/mangaka";
import puppeteer from "puppeteer";
import userAgent from "user-agents";

interface PostManga {
  link: string;
  chapterId: string;
}

export async function POST({ request }: RequestHandler) {
  const body: PostManga | null = await request.json();

  if (!body || !body.link || !body.chapterId) {
    return new Response(JSON.stringify({ message: "Fail" }));
  }

  const { link, chapterId } = body;
  const browser = await puppeteer.launch();
  const user = new userAgent();
  const page = await browser.newPage();

  await page.setUserAgent(user.random().toString());
  await page.goto(link, { waitUntil: "networkidle0" });

  const data = await page.evaluate(
    () => document.querySelector("*")!.outerHTML
  );

  await browser.close();

  const base: ImageManga[] = [];
  const initial = MangaBase.initial(data);
  const images = MangaBase.images(initial);

  const loop = images.length;
  for (let index = 0; index < loop; index++) {
    base.push({
      index,
      link: images[index],
      chapterId,
    });
  }

  await addImages(base, chapterId);
  return new Response(JSON.stringify({ message: "Success" }));
}
