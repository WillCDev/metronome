export const MIN_BPM = 40
export const MAX_BPM = 200
export const DEFAULT_BPM = 120

export const METRONOME_ITEMS = [...Array(MAX_BPM - MIN_BPM + 1).keys()].map(
  (x) => x + MIN_BPM
)
