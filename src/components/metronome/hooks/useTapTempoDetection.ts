import { useEffect, useRef, useState } from 'react'
import {
  MAX_WAIT_AFTER_LAST_TAP,
  MAX_WAIT_BETWEEN_DETECTION_ATTEMPTS,
  NUM_OF_INTERVALS_FOR_DETECTION,
  ONE_MINUTE,
} from '../Metronome.config'

interface Args {
  onTempoDetection: (tempo: number) => void
}

interface ReturnType {
  tap: () => void
  detecting: boolean
}

const calculateTempo = (events: number[]): number => {
  const [start] = events.slice(0, 1)
  const [end] = events.slice(-1)
  const meanInterval = (end - start) / (events.length - 1)

  return Math.round(ONE_MINUTE / meanInterval)
}

export const useTapTempoDetection = ({ onTempoDetection }: Args): ReturnType => {
  const [detecting, setDetecting] = useState(false)
  const timestamps = useRef<number[]>([])
  const lastTapTimer = useRef<number>()
  const timeElapsedSinceDetection = useRef<number>()

  const detectTempo = (): void => {
    // Taking the last "N" events means the if the user has been clicking
    // for a while and possibly changing speed, we're able to base our detection
    // on the most recent events and make a more reliable estimate of the users intention
    const lastNTimestamps = timestamps.current.slice(-NUM_OF_INTERVALS_FOR_DETECTION)

    if (lastNTimestamps.length > 1) {
      onTempoDetection(calculateTempo(lastNTimestamps))
    }
  }

  const reset = (): void => {
    timestamps.current = []
    setDetecting(false)
  }

  const tap = (): void => {
    if (!detecting) setDetecting(true)

    timestamps.current.push(Date.now())

    // We can't indefinitely wait for the user to stop tapping before detecting
    // If we have enough info to detect we should, but allow the user to keep clicking
    if (timestamps.current.length >= NUM_OF_INTERVALS_FOR_DETECTION) {
      detectTempo()
    }

    // Reset/set a timer to detect if the user stops clicking
    // and make sure we detect, even if we don't have the ideal number of events
    if (lastTapTimer.current) clearTimeout(lastTapTimer.current)
    lastTapTimer.current = window.setTimeout(() => {
      detectTempo()
      reset()
    }, MAX_WAIT_AFTER_LAST_TAP)

    // We should also track "time since last detection" so we don't wait
    // too long to detect if the user is tapping a very slow tempo
    if (!timeElapsedSinceDetection.current) {
      timeElapsedSinceDetection.current = window.setTimeout(() => {
        detectTempo()
        clearTimeout(timeElapsedSinceDetection.current)
      }, MAX_WAIT_BETWEEN_DETECTION_ATTEMPTS)
    }
  }

  useEffect(() => {
    // Cleanup any timers on dismount
    return () => {
      if (lastTapTimer.current) clearTimeout(lastTapTimer.current)
      if (timeElapsedSinceDetection.current) {
        clearTimeout(timeElapsedSinceDetection.current)
      }
    }
  }, [])

  return { tap, detecting }
}
