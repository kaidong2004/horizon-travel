import { egyptJournalNumber, egyptOverview } from "../egypt"
import { FullSlug, resolveRelative } from "../util/path"
import Content from "./pages/Content"
import styles from "./styles/egyptPilot.scss"
import { QuartzComponent } from "./types"

const chapters = [
  ["零", "前言"],
  ["一", "一路神游到开罗"],
  ["二", "开罗第一天：金字塔游"],
  ["三", "Saladin Citadel和埃及博物馆，飞阿斯旺。"],
  ["四", "阿斯旺高坝和阿布辛贝神庙"],
  ["五", "菲莱神庙，未完成的方尖碑，登上游轮"],
  ["六", "Felucca大帆船，努比亚村和Kom Ombo神庙"],
  ["七", "Edfu，Karnak，Luxor，Karnak神庙——神接着神，庙连着庙"],
  ["八", "看完了庙看坟墓，埃及之行结束"],
  ["九", "杰拉什古城，安曼城堡山（Citadel）"],
  ["十", "尼波山，死海"],
  ["十一", "佩特拉的日与夜"],
  ["十二", "从佩特拉到瓦迪拉姆"],
]
const title = (number: number) =>
  `穿越时间的长河（${chapters[number][0]}）${number === 0 ? "" : " "}——2024年3月埃及约旦西班牙三国游`

const MarkdownContent = Content()
export const EgyptPilot: QuartzComponent = (props) => {
  const { fileData, allFiles } = props
  const slug = fileData.slug!
  const number = egyptJournalNumber(slug)
  const overview = slug === egyptOverview

  if (!overview && (number === undefined || !chapters[number])) {
    return <MarkdownContent {...props} />
  }

  const href = (target: string) => resolveRelative(slug, target as FullSlug)
  const asset = (name: string) => href(`Images/egypt-covers/${name}`)
  const journals = new Map(allFiles.map((file) => [egyptJournalNumber(file.slug), file.slug!]))
  const journal = (n: number) => href(journals.get(n)!)

  return (
    <div class={`egypt-pilot ${overview ? "egypt-overview" : "egypt-journal"}`} lang="zh-Hans">
      <header class="egypt-header">
        <a class="egypt-brand" href={href("index")}>
          <img src={asset("logo.jpg")} width="60" height="48" alt="" />
          <span>Horizon Travel &amp; Photos</span>
        </a>
        <nav aria-label="站点导航">
          <a href={href("index")}>首页</a>
          <a href={href(egyptOverview)}>
            游记 <span aria-hidden="true">⌄</span>
          </a>
        </nav>
      </header>
      {overview ? (
        <main>
          <div class="egypt-hero">
            <picture>
              <source media="(max-width: 720px)" srcSet={asset("hero-small.webp")} />
              <img src={asset("hero.webp")} alt="吉萨金字塔和狮身人面像" fetchpriority="high" />
            </picture>
            <h1>穿越时间的长河</h1>
            <div class="egypt-rule" aria-hidden="true">
              ≋
            </div>
            <p>2024年3月埃及约旦西班牙游记</p>
          </div>
          <div class="egypt-grid">
            {chapters.map(([, description], n) => (
              <section class="egypt-card" key={n}>
                <a href={journal(n)} tabIndex={-1} aria-hidden="true">
                  <img src={asset(`${n}-small.webp`)} alt="" loading="lazy" decoding="async" />
                </a>
                <div>
                  <h2>
                    <a href={journal(n)}>{title(n)}</a>
                  </h2>
                  <p>{description}</p>
                  <a class="egypt-more" href={journal(n)} aria-label={`阅读 ${description}`}>
                    Read More
                  </a>
                </div>
              </section>
            ))}
          </div>
        </main>
      ) : (
        <main class="egypt-story-shell">
          <div class="egypt-story">
            <picture class="egypt-cover">
              <source media="(max-width: 650px)" srcSet={asset(`${number}-small.webp`)} />
              <img src={asset(`${number}.webp`)} alt={chapters[number!][1]} fetchpriority="high" />
            </picture>
            <div class="egypt-copy">
              <h1>{title(number!)}</h1>
              <MarkdownContent {...props} />
            </div>
          </div>
          <nav class="egypt-post-nav" aria-label="游记导航">
            {number! > 0 && (
              <a rel="prev" href={journal(number! - 1)}>
                ← 上一篇
              </a>
            )}
            <a href={href(egyptOverview)}>游记目录</a>
            {number! + 1 < chapters.length && (
              <a rel="next" href={journal(number! + 1)}>
                下一篇 →
              </a>
            )}
          </nav>
        </main>
      )}
      <footer class="egypt-footer">Horizon Travel &amp; Photos</footer>
    </div>
  )
}
EgyptPilot.css = styles
