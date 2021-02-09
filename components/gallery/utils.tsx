import { windowWidth, windowHeight } from "../../utils/variables"
import { GalleryItemProps } from "../../services/user/types"

export const topAdjust = 15
export const padAdjust = 5
export const imageWidthAdjust = Math.round(((3 * (windowHeight * .8)) / 4))
const heightPercent = windowHeight < 700 ? .6 : .55
export const imageRatio = 3 / 4

export const ImageWidth = Math.round(((3 * (windowHeight * heightPercent)) / 4))
export const ImageHeight = (ImageWidth * (4 / 3))

export function getGalleryHeight(gallery: GalleryItemProps[]) {
    return ImageHeight + ((gallery.length - 1) * topAdjust)
}