import { useEffect, useRef } from 'react'
import { WorkerMetronome } from './metronome'

export const useAudioMetronome = (tempo: number, playing: boolean): any => {
  const metronome = useRef(new WorkerMetronome(tempo))

  useEffect(() => {
    if (playing && !metronome.current.playing) {
      metronome.current.play()
    } else if (!playing && metronome.current.playing) {
      metronome.current.pause()
    }
  }, [playing])

  useEffect(() => {
    if (metronome.current.playing) {
      metronome.current.changeTempo(tempo)
    }
  }, [tempo])

  // Cleanup on dismount
  useEffect(() => {
    return () => {
      metronome.current.stop()
    }
  }, [])

  return null
}
