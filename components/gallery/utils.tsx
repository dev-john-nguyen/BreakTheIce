import { windowWidth } from "../../utils/variables"
import { GalleryItemProps } from "../../services/user/types"

export const topAdjust = 15
export const padAdjust = 5
export const imageWidthAdjust = 70
export const imageRatio = 3 / 4

export const ImageWidth = (windowWidth - imageWidthAdjust)
const ImageHeight = (ImageWidth * (4 / 3))

export function getGalleryHeight(gallery: GalleryItemProps[]) {
    return ImageHeight + ((gallery.length - 1) * topAdjust)
}