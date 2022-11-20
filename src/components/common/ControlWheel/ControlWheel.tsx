import { useState, useCallback, useEffect, FC } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { WHEEL_ITEM_RADIUS, getSlideCss } from './ControlWheel.utils'
import styles from './ControlWheel.module.scss'

interface Props {
  items: Array<number>
  selectedItem: number
  onSelect: (item: number) => void
}

export const ControlWheel: FC<Props> = ({ items, selectedItem, onSelect }) => {
  const [viewportRef, embla] = useEmblaCarousel({
    axis: 'y',
    dragFree: true,
  })

  const [wheelReady, setWheelReady] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const slideCount = items.length
  const totalRadius = slideCount * WHEEL_ITEM_RADIUS

  const rotateWheel = useCallback(() => {
    if (!embla) return

    const rotation = slideCount * WHEEL_ITEM_RADIUS - WHEEL_ITEM_RADIUS
    setWheelRotation(rotation * embla.scrollProgress())
  }, [slideCount, embla])

  // Initialisation
  useEffect(() => {
    if (!embla) return

    embla.internalEngine().translate.toggleActive(false)
    setWheelReady(true)

    embla.on('pointerUp', () => {
      const { scrollTo, target, location } = embla.internalEngine()
      scrollTo.distance((target.get() - location.get()) * 0.1, true)
    })

    embla.on('scroll', rotateWheel)
  }, [embla, rotateWheel, setWheelReady])

  // When Embla selects a new value, pass it up to the parent
  useEffect(() => {
    const handleSelect = (): void => {
      const index = embla?.internalEngine().index.get()
      if (index) onSelect(items[index])
    }
    embla?.on('select', handleSelect)

    return () => {
      embla?.off('select', handleSelect)
    }
  }, [onSelect, items, embla])

  // WHen the parent updated the selected item, update Embla
  useEffect(() => {
    const index = items.indexOf(selectedItem)
    if (index && index !== embla?.internalEngine().index.get()) {
      embla?.scrollTo(index)
    }
  }, [selectedItem, embla])

  return (
    <div className={styles.viewport} ref={viewportRef}>
      <div className={styles.container}>
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.slide}
            style={
              wheelReady
                ? getSlideCss(index, totalRadius, wheelRotation, embla)
                : { transform: 'none', position: 'static' }
            }
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
