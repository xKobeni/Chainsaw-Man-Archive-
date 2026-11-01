import type { Volume } from "../types/archive";

// Explicit ranges replace the prototype's calculated approximation.
// Volumes 1–11 follow the publisher's chapter groupings; 24 is from Shueisha.
const verifiedChapters: Record<number, string> = {
  1: "1–7", 2: "8–16", 3: "17–25", 4: "26–34", 5: "35–43",
  6: "44–52", 7: "53–61", 8: "62–70", 9: "71–79",
  10: "80–88", 11: "89–97", 24: "223–232",
};

export const volumes: Volume[] = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;
  return {
    number,
    part: number <= 11 ? "1" : "2",
    chapters: verifiedChapters[number] ?? null,
    color: ["#CF262D", "#E48B36", "#76736F", "#F0EEE8"][index % 4],
    cover: null,
    ...(number === 1 ? {
      publishedInJapan: "4 March 2019",
      sourceUrl: "https://books.shueisha.co.jp/items/contents.html?jdcn=08881780881780315501",
    } : number === 24 ? {
      publishedInJapan: "4 June 2026",
      sourceUrl: "https://books.shueisha.co.jp/items/contents.html?jdcn=08X10000000071957700",
    } : {}),
  };
});
