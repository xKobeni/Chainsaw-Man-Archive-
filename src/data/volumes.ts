import type { Volume } from "../types/archive";

const volumeChapters = [
  "1–7", "8–16", "17–25", "26–34", "35–43", "44–52",
  "53–61", "62–70", "71–79", "80–88", "89–97", "98–103",
  "104–112", "113–122", "123–133", "134–143", "144–153", "154–164",
  "165–175", "176–186", "187–198", "199–210", "211–222", "223–232",
];

export const volumes: Volume[] = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;
  return {
    number,
    part: number <= 11 ? "1" : "2",
    chapters: volumeChapters[index],
    color: ["#CF262D", "#E48B36", "#76736F", "#F0EEE8"][index % 4],
    cover: `/images/volumes/csm_volume_${number}.jpg`,
    ...(number === 1 ? {
      publishedInJapan: "4 March 2019",
      sourceUrl: "https://books.shueisha.co.jp/items/contents.html?jdcn=08881780881780315501",
    } : number === 24 ? {
      publishedInJapan: "4 June 2026",
      sourceUrl: "https://books.shueisha.co.jp/items/contents.html?jdcn=08X10000000071957700",
    } : {}),
  };
});
