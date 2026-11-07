import { FilePath, joinSegments, slugifyFilePath } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import path from "path"
import fs from "fs"
import sharp from "sharp"
import { egyptImageDirectory, egyptImageVariant } from "../../egypt"
import { glob } from "../../util/glob"
import { Argv } from "../../util/ctx"
import { QuartzConfig } from "../../cfg"

const filesToCopy = async (argv: Argv, cfg: QuartzConfig) => {
  // glob all non MD files in content folder and copy it over
  return await glob("**", argv.directory, ["**/*.md", ...cfg.configuration.ignorePatterns])
}

const egyptWidths = (fp: FilePath) =>
  fp.startsWith(egyptImageDirectory) && /\.(jpg|jpeg|png|webp)$/i.test(fp) ? [720, 1600] : []

async function* copyFile(argv: Argv, fp: FilePath) {
  const src = joinSegments(argv.directory, fp) as FilePath

  const name = slugifyFilePath(fp)
  const dest = joinSegments(argv.output, name) as FilePath

  // ensure dir exists
  const dir = path.dirname(dest) as FilePath
  await fs.promises.mkdir(dir, { recursive: true })

  await fs.promises.copyFile(src, dest)
  yield dest
  for (const width of egyptWidths(fp)) {
    const variant = egyptImageVariant(dest, width) as FilePath
    await sharp(src)
      .autoOrient()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 87 })
      .toFile(variant)
    yield variant
  }
}

export const Assets: QuartzEmitterPlugin = () => {
  return {
    name: "Assets",
    async *emit({ argv, cfg }) {
      const fps = await filesToCopy(argv, cfg)
      for (let offset = 0; offset < fps.length; offset += 12) {
        const batch = await Promise.all(
          fps.slice(offset, offset + 12).map(async (fp) => {
            const paths: FilePath[] = []
            for await (const emitted of copyFile(argv, fp)) paths.push(emitted)
            return paths
          }),
        )
        for (const paths of batch) yield* paths
      }
    },
    async *partialEmit(ctx, _content, _resources, changeEvents) {
      for (const changeEvent of changeEvents) {
        const ext = path.extname(changeEvent.path)
        if (ext === ".md") continue

        if (changeEvent.type === "add" || changeEvent.type === "change") {
          yield* copyFile(ctx.argv, changeEvent.path)
        } else if (changeEvent.type === "delete") {
          const name = slugifyFilePath(changeEvent.path)
          const dest = joinSegments(ctx.argv.output, name) as FilePath
          await Promise.all(
            [
              dest,
              ...egyptWidths(changeEvent.path).map((width) => egyptImageVariant(dest, width)),
            ].map((file) => fs.promises.rm(file, { force: true })),
          )
        }
      }
    },
  }
}
