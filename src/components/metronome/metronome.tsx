import { FC, useState } from 'react'
import { ControlWheel } from '../common/ControlWheel'
import { DEFAULT_BPM, METRONOME_ITEMS } from './Metronome.config'
import styles from './Metronome.module.scss'

export const Metronome: FC = () => {
  const [bpm, setBpm] = useState<number>(DEFAULT_BPM)

  return (
    <div className={styles.wrapper}>
      <div className={styles.bpm}>
        <div className={styles.bpmDisplay}>
          <ControlWheel items={METRONOME_ITEMS} selectedItem={bpm} onSelect={setBpm} />
        </div>
        <span>BPM</span>
      </div>
    </div>
  )
}
