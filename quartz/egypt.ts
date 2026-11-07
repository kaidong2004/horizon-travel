import { FullSlug } from "./util/path"

export const egyptOverview = "overview/egypt" as FullSlug
export const egyptImageDirectory = "Images/2024 03 Middle East/"

export function egyptJournalNumber(slug?: string) {
  const match = slug?.match(/^2024-03-Middle-East\/穿越时间的长河（(\d+)）/)
  return match ? Number(match[1]) : undefined
}

export function egyptImageVariant(src: string, width: number) {
  return `${src}.${width}.webp`
}
