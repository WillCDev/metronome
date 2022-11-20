import { FC, KeyboardEvent, useState } from 'react'
import { joinClassNames } from '@/utils'
import { ControlWheel } from '@/components/common/ControlWheel'
import { DEFAULT_BPM, MAX_BPM, METRONOME_ITEMS, MIN_BPM } from './Metronome.config'
import { useTapTempoDetection } from './hooks/useTapTempoDetection'
import styles from './Metronome.module.scss'

export const Metronome: FC = () => {
  const [bpm, setBpm] = useState<number>(DEFAULT_BPM)
  const [playing, setPlaying] = useState(false)

  const { tap, detecting } = useTapTempoDetection({ onTempoDetection: setBpm })

  const togglePlaying = (): void => setPlaying(!playing)

  const setTempo = (targetBpm: number): void => {
    if (targetBpm >= MAX_BPM) setBpm(MAX_BPM)
    else if (targetBpm <= MIN_BPM) setBpm(MIN_BPM)
    else setBpm(targetBpm)
  }

  const handleKeyBoardEvent = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') setTempo(bpm - 1)
    else if (event.key === 'ArrowUp') setTempo(bpm + 1)
    else if (event.key === 'SpaceBar') togglePlaying()
  }

  return (
    <div className={styles.wrapper} onKeyDown={handleKeyBoardEvent} tabIndex={0}>
      <div>
        <div className={styles.bpm}>
          <div className={styles.bpmDisplay}>
            <ControlWheel items={METRONOME_ITEMS} selectedItem={bpm} onSelect={setBpm} />
          </div>
          <span>BPM</span>
        </div>
        <button
          className={joinClassNames([styles.playButton, playing && styles.playing])}
          onClick={togglePlaying}
        >
          {playing ? 'Stop' : 'Start'}
        </button>
      </div>

      <button onClick={tap} className={styles.beatButton}>
        <h4>Tap</h4>
        {detecting && 'Detecting...'}
      </button>
    </div>
  )
}
