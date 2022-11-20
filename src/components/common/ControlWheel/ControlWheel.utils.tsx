import { EmblaCarouselType } from 'embla-carousel-react'
import { CSSProperties } from 'react'

const WHEEL_ITEM_SIZE = 50
const WHEEL_ITEM_COUNT = 40
const WHEEL_ITEMS_IN_VIEW = 3

export const WHEEL_ITEM_RADIUS = 360 / WHEEL_ITEM_COUNT
export const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
export const WHEEL_RADIUS = Math.round(
  WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT)
)

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
  Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

export const getSlideCss = (
  index: number,
  totalRadius: number,
  wheelRotation: number,
  embla?: EmblaCarouselType
): CSSProperties => {
  if (!embla) return {}

  const wheelLocation = embla.scrollProgress() * totalRadius
  const positionDefault = embla.scrollSnapList()[index] * totalRadius

  if (isInView(wheelLocation, positionDefault)) {
    const angle = index * -WHEEL_ITEM_RADIUS
    return {
      opacity: 1,
      transform: `rotateX(${angle + wheelRotation}deg) translateZ(${WHEEL_RADIUS}px)`,
    }
  }

  return { opacity: 0, transform: 'none' }
}
