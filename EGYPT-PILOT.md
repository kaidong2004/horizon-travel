# Egypt and Jordan Quartz pilot

The pilot uses the existing Quartz repository and journal routes. The overview is at `/overview/egypt`. It links to the prologue (零) followed by journals 1–12. The WordPress overview ends at journal 11. The Wadi Rum entry and its cover come from the vault.

## Local preview

Use Node.js 22 or newer. From this checkout, install the lockfile dependencies if needed, then start Quartz.

```sh
npm ci
QUARTZ_OFFLINE=1 npm run quartz -- build --serve --port 8091
```

Open [the overview](http://localhost:8091/overview/egypt). The offline switch skips the existing social-card generator, which fetches fonts at build time. The reading layouts and photographs still build. To simulate a GitHub Pages project path, add `--baseDir /horizon-travel` and open `/horizon-travel/overview/egypt`.

## Comparison

| Area | Pilot and reference |
| --- | --- |
| Overview | Same Sphinx panorama, logo, published cover subjects, Chinese card order, and four-column desktop layout. The pilot adds the Wadi Rum card and collapses to two columns on tablet and one on narrow phones. |
| Journals | Reuses the twelve published covers from their matching vault originals, the gray page background, the left-aligned desktop reading column, blue headings, and the Chinese Markdown. Journal 12 has a vault-selected sunset cover and no WordPress counterpart. |
| Photos and captions | All 773 vault photo embeds resolve in source order across the prologue and twelve journals. The 29 WordPress figure captions were matched to their vault photos. The pilot keeps the vault's own photo groupings and reproduces the published galleries when their photos are adjacent in the same sequence. |
| Gallery differences | Some WordPress galleries, including sets in journals 3, 5, 8, and 11, use different image selections or grouping. The pilot retains the vault sequence and keeps intervening prose in place. WordPress-only imagery and duplicate crops were outside the vault comparison. |
| Typography and navigation | The pilot uses a local serif fallback for the WordPress wordmark and system Chinese fonts. The header links to the Quartz home and trip overview, and article navigation provides previous, overview, and next links. The WordPress trip dropdown and theme-specific footer are simplified. |
| Image delivery | Narrow and wide screens get lazy-loaded WebP copies for the article body. Each photo links to the untouched source file. Cover and hero copies are also local WebP files. No referenced vault image was missing. |

The table counts body image elements. Covers and WordPress emoji are excluded. The count difference includes images that WordPress groups or crops separately and does not indicate broken Quartz links.

| Entry | WordPress images | Quartz images | WordPress galleries |
| --- | ---: | ---: | ---: |
| Prologue | 3 | 3 | 1 |
| 1 | 50 | 49 | 1 |
| 2 | 62 | 61 | 2 |
| 3 | 81 | 75 | 2 |
| 4 | 66 | 65 | 1 |
| 5 | 62 | 55 | 4 |
| 6 | 94 | 94 | 0 |
| 7 | 90 | 87 | 3 |
| 8 | 62 | 56 | 5 |
| 9 | 56 | 55 | 1 |
| 10 | 63 | 59 | 2 |
| 11 | 64 | 60 | 3 |
| 12 | — | 54 | — |

[WordPress overview](https://horizontravelphotos.com/overview/egypt/) · [WordPress pyramid journal](https://horizontravelphotos.com/egypt2/)

## Deployment after approval

1. Review the branch and the local overview, journal sequence, and mobile layout.
2. Confirm the repository's Pages source is GitHub Actions and which release branch it uses. The existing workflow runs when changes reach `v4` or `main`.
3. Confirm the intended GitHub Pages URL and replace the existing Quartz placeholder `baseUrl` with its host and any project path, without a protocol. This affects canonical metadata and the sitemap.
4. After approval, push `codex/egypt-jordan-pilot` and open a pull request into the release branch. Merge only with approval to publish. Check the Pages deployment and recheck the overview, the final journal, and several image URLs at the deployed project path.
