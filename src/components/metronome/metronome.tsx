import { FC, KeyboardEvent, useState } from 'react'
import { ControlWheel } from '../common/ControlWheel'
import { DEFAULT_BPM, MAX_BPM, METRONOME_ITEMS, MIN_BPM } from './Metronome.config'
import styles from './Metronome.module.scss'

export const Metronome: FC = () => {
  const [bpm, setBpm] = useState<number>(DEFAULT_BPM)

  const handleKeyBoardEvent = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      setBpm((bpm) => Math.max(bpm - 1, MIN_BPM))
    }
    if (event.key === 'ArrowUp') {
      setBpm((bpm) => Math.min(bpm + 1, MAX_BPM))
    }
  }

  return (
    <div className={styles.wrapper} onKeyUp={handleKeyBoardEvent} tabIndex={0}>
      <div className={styles.bpm} onKeyUp={handleKeyBoardEvent}>
        <div className={styles.bpmDisplay}>
          <ControlWheel items={METRONOME_ITEMS} selectedItem={bpm} onSelect={setBpm} />
        </div>
        <span>BPM</span>
      </div>
    </div>
  )
}
