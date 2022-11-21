export const MIN_BPM = 40
export const MAX_BPM = 200
export const DEFAULT_BPM = 120

export const METRONOME_ITEMS = [...Array(MAX_BPM - MIN_BPM + 1).keys()].map(
  (x) => x + MIN_BPM
)

export const ONE_MINUTE = 60000
export const NUM_OF_INTERVALS_FOR_DETECTION = 4
export const MAX_WAIT_AFTER_LAST_TAP = ONE_MINUTE / MIN_BPM
export const MAX_WAIT_BETWEEN_DETECTION_ATTEMPTS = (ONE_MINUTE / MIN_BPM) * 2.1
