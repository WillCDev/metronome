import { FC, KeyboardEvent, useState } from 'react'
import { joinClassNames } from '@/utils'
import { ControlWheel } from '@/components/common/ControlWheel'
import { DEFAULT_BPM, MAX_BPM, METRONOME_ITEMS, MIN_BPM } from './Metronome.config'
import { useTapTempoDetection } from './hooks/useTapTempoDetection'
import styles from './Metronome.module.scss'
import { useAudioMetronome } from './hooks/useAudioMetronome'

export const Metronome: FC = () => {
  const [playing, setPlaying] = useState(false)
  const togglePlaying = (): void => setPlaying((playing) => !playing)

  const [bpm, setBpm] = useState<number>(DEFAULT_BPM)
  const setTempo = (targetBpm: number): void => {
    if (targetBpm >= MAX_BPM) setBpm(MAX_BPM)
    else if (targetBpm <= MIN_BPM) setBpm(MIN_BPM)
    else setBpm(targetBpm)
  }

  const { tap, detecting } = useTapTempoDetection({ onTempoDetection: setTempo })
  useAudioMetronome(bpm, playing)

  const handleKeyBoardEvent = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') setTempo(bpm - 1)
    else if (event.key === 'ArrowUp') setTempo(bpm + 1)
    else if (event.code === 'Space') togglePlaying()
  }

  return (
    <div className={styles.wrapper} onKeyDown={handleKeyBoardEvent} tabIndex={0}>
      <div>
        <div className={styles.bpm}>
          <div className={styles.bpmDisplay}>
            <ControlWheel items={METRONOME_ITEMS} selectedItem={bpm} onSelect={setBpm} />
            {detecting && <div className={styles.detectingIndicator}>Detecting...</div>}
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
      </button>
    </div>
  )
}
