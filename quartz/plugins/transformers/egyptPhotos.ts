import type { Element, Root } from "hast"
import { toString } from "hast-util-to-string"
import { egyptImageVariant, egyptJournalNumber } from "../../egypt"
import type { QuartzTransformerPlugin } from "../types"
import reference from "./egyptPhotoLayout.json"

type PhotoLayout = { captions: Record<string, string>; groups: string[][] }
const layout: Record<string, PhotoLayout> = reference

const element = (
  tagName: string,
  children: Element["children"],
  properties: Element["properties"] = {},
): Element => ({ type: "element", tagName, properties, children })

const isElement = (node: Root["children"][number]): node is Element => node.type === "element"

export const EgyptPhotos: QuartzTransformerPlugin = () => ({
  name: "EgyptPhotos",
  htmlPlugins() {
    return [
      () => (tree: Root, file) => {
        const number = egyptJournalNumber(file.data.slug)
        if (number === undefined) return
        const { captions, groups } = layout[number] ?? { captions: {}, groups: [] }

        function isJournalPhoto(
          node: Root["children"][number],
        ): node is Element & { tagName: "img" } {
          return (
            isElement(node) &&
            node.tagName === "img" &&
            typeof node.properties.src === "string" &&
            node.properties.src.includes("Images/2024-03-Middle-East/")
          )
        }

        function format(parent: Root | Element) {
          if (parent.type === "element" && !["div", "blockquote"].includes(parent.tagName)) return

          const children = parent.children.flatMap((child) => {
            if (child.type === "text" && !child.value.trim()) return []
            if (
              !isElement(child) ||
              child.tagName !== "p" ||
              !child.children.some(isJournalPhoto)
            ) {
              return [child]
            }

            // An Obsidian embed and its caption can share a Markdown paragraph.
            const blocks: Element[] = []
            let prose: Element["children"] = []
            const flush = () => {
              const paragraph = element("p", prose, child.properties)
              if (toString(paragraph).trim() || prose.some(isElement)) blocks.push(paragraph)
              prose = []
            }
            for (const part of child.children) {
              if (isJournalPhoto(part)) {
                flush()
                blocks.push(part)
              } else {
                prose.push(part)
              }
            }
            flush()
            return blocks
          })

          const output: typeof parent.children = []
          const figureNames = new Map<Element, string>()
          for (let i = 0; i < children.length; i++) {
            const node = children[i]
            if (node.type === "doctype") continue
            if (!isJournalPhoto(node)) {
              if (isElement(node)) format(node)
              output.push(node)
              continue
            }

            const src = node.properties.src as string
            const name = decodeURI(src).split("/").at(-1)!
            const referenceCaption = captions[name]
            let caption = referenceCaption
            const next = children[i + 1]
            if (referenceCaption && next && isElement(next) && next.tagName === "p") {
              const vaultCaption = toString(next).trim()
              const normalized = (text: string) =>
                text.replace(/\s+/g, " ").replace(/↑$/, "").trim()
              if (normalized(vaultCaption) === normalized(referenceCaption)) {
                caption = vaultCaption
                i++
              }
            }

            const photo = element("img", [], {
              src: egyptImageVariant(src, 1600),
              alt: caption ?? "",
              loading: "lazy",
              decoding: "async",
            })
            const picture = element("picture", [
              element("source", [], {
                media: "(max-width: 720px)",
                srcSet: egyptImageVariant(src, 720),
              }),
              photo,
            ])
            const link = element("a", [picture], {
              href: src,
              "data-no-spa": true,
              ariaLabel: caption ? `查看原图：${caption}` : "查看原图",
            })
            const figure = element("figure", [link])
            if (caption)
              figure.children.push(element("figcaption", [{ type: "text", value: caption }]))
            figureNames.set(figure, name)
            output.push(figure)
          }

          parent.children = output
          for (const group of groups) {
            const start = parent.children.findIndex(
              (node) => isElement(node) && figureNames.get(node) === group[0],
            )
            if (start < 0) continue
            const figures = parent.children.slice(start, start + group.length)
            if (
              figures.length === group.length &&
              figures.every((node, i) => isElement(node) && figureNames.get(node) === group[i])
            ) {
              parent.children.splice(
                start,
                group.length,
                element("div", figures as Element[], { className: ["egypt-gallery"] }),
              )
            }
          }
        }

        format(tree)
      },
    ]
  },
})
