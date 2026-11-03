# Volume and arc metadata sources

`volumes.ts` lists the chapter ranges for all 24 covers. The ranges were checked against the [volume chapter list](https://en.wikipedia.org/wiki/List_of_Chainsaw_Man_chapters) and [Chainsaw Man Wiki's volume pages](https://chainsaw-man.fandom.com/wiki/Volume_12). [Comic Vine's volume index](https://comicvine.gamespot.com/chainsaw-man/4050-117318/) confirms the cover order and Japanese volume titles; it does not supply the chapter boundaries.

`arcs.ts` uses [Chainsaw Man Wiki's story arc index](https://chainsaw-man.fandom.com/wiki/Story_Arcs) for chapter boundaries. `arcsForVolume()` links an arc when its chapter span overlaps the selected volume. This matters at transitions such as volumes 5, 15, 18, and 21, which each contain chapters from two arcs. The Arc page's volume labels follow those overlaps.

Arc names are community classifications, not publisher-defined subdivisions. Each arc's short summary is paraphrased from the linked VIZ or Shueisha volume page in `arcs.ts`, checked against the chapter span. The publisher volume can contain chapters from a neighboring arc, so it supports the story context rather than defining the arc boundary.

[Volume 1](https://books.shueisha.co.jp/items/contents.html?jdcn=08881780881780315501) and [Volume 24](https://books.shueisha.co.jp/items/contents.html?jdcn=08X10000000071957700) retain their verified Japanese print dates. Dates for other volumes are intentionally unset.
