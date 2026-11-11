import { egyptJournalNumber, egyptOverview } from "../egypt"
import { FullSlug, resolveRelative } from "../util/path"
import styles from "./styles/travelHome.scss"
import { QuartzComponent } from "./types"

const featuredJournals = [
  {
    number: 13,
    place: "约旦 · 阿卡巴",
    title: "从沙漠到红海",
    description: "瓦迪拉姆的火车、阿卡巴的海，以及去安曼路上的一顿开斋饭。",
    alt: "阿卡巴湾对岸的山脉与岸边的约旦国旗",
  },
  {
    number: 11,
    place: "约旦 · 佩特拉",
    title: "佩特拉的日与夜",
    description: "穿过蛇道，在峡谷尽头见到卡兹尼神殿，再等到烛光亮起。",
    alt: "玫瑰色岩壁间的卡兹尼神殿",
  },
  {
    number: 2,
    place: "埃及 · 吉萨",
    title: "开罗第一天，去看金字塔",
    description: "从吉萨的金字塔和狮身人面像，读起这段埃及之旅。",
    alt: "吉萨金字塔与狮身人面像",
  },
]

export const TravelHome: QuartzComponent = ({ fileData, allFiles }) => {
  const href = (target: FullSlug) => resolveRelative(fileData.slug!, target)
  const cover = (name: string) => href(`Images/egypt-covers/${name}` as FullSlug)
  const journals = new Map(allFiles.map((file) => [egyptJournalNumber(file.slug), file.slug]))
  const overview = href(egyptOverview)

  return (
    <div class="travel-home" id="home">
      <header class="site-header">
        <div class="wrap header-inner">
          <a class="brand" href="#home">
            <img src={cover("logo.jpg")} alt="" />
            <span>Horizon Travel &amp; Photos</span>
          </a>
          <nav aria-label="主导航">
            <a href="#home" aria-current="page">
              首页
            </a>
            <a href="#journals">游记</a>
          </nav>
        </div>
      </header>
      <main class="wrap">
        <section class="hero" aria-labelledby="home-title">
          <div class="hero-copy">
            <p class="overline">Kai 的旅行摄影与游记</p>
            <h1 id="home-title">
              <span>大叔的</span>
              <span>旅行日志</span>
            </h1>
            <p class="series">穿越时间的长河</p>
            <p class="subtitle">2024 年 3 月 · 埃及、约旦、西班牙</p>
            <a class="primary" href={overview}>
              阅读系列游记 <span aria-hidden="true">↗</span>
            </a>
          </div>
          <figure class="hero-photo">
            <picture>
              <source
                media="(max-width: 480px) and (max-resolution: 1dppx)"
                srcSet={cover("12-small.webp")}
              />
              <img
                src={cover("12.webp")}
                width="1600"
                height="1066"
                alt="落日下的瓦迪拉姆，驼队在沙地上投下长影"
                fetchpriority="high"
              />
            </picture>
            <figcaption>
              约旦 · 瓦迪拉姆<span lang="en">Wadi Rum</span>
            </figcaption>
          </figure>
        </section>
        <section class="stories" id="journals" aria-labelledby="stories-title">
          <div class="section-head">
            <h2 id="stories-title">精选游记</h2>
            <a class="text-link" href={overview}>
              查看完整目录<span aria-hidden="true">↗</span>
            </a>
          </div>
          <div class="story-grid">
            {featuredJournals.map(({ number, place, title, description, alt }) => {
              const slug = journals.get(number)
              if (!slug) return null

              return (
                <article key={number}>
                  <a class="story" href={href(slug)}>
                    <img
                      src={cover(`${number}-small.webp`)}
                      width="640"
                      height="426"
                      alt={alt}
                      decoding="async"
                    />
                    <div class="story-body">
                      <p class="story-meta">
                        {place}
                        <span>第 {String(number).padStart(2, "0")} 篇</span>
                      </p>
                      <h3>
                        {title}
                        <span aria-hidden="true">↗</span>
                      </h3>
                      <p class="description">{description}</p>
                    </div>
                  </a>
                </article>
              )
            })}
          </div>
        </section>
      </main>
      <footer>
        <div class="wrap footer-inner">
          <p>Horizon Travel &amp; Photos</p>
          <a class="text-link" href="#home">
            回到顶部 <span aria-hidden="true">↑</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

TravelHome.css = styles
