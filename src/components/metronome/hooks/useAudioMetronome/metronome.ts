export class WorkerMetronome {
  private worker: Worker
  private started = false
  private audioCtx: AudioContext
  private tick: OscillatorNode
  private tickVolume: GainNode
  private tempo = 60
  static soundHz = 1000
  public playing = false

  constructor(tempo: number) {
    this.tempo = tempo
    this.audioCtx = new window.AudioContext()

    this.tickVolume = this.audioCtx.createGain()
    this.tickVolume.gain.value = 0
    this.tickVolume.connect(this.audioCtx.destination)

    this.tick = this.audioCtx.createOscillator()
    this.tick.type = 'sine'
    this.tick.frequency.value = WorkerMetronome.soundHz
    this.tick.connect(this.tickVolume)

    this.worker = new Worker('./metronome.worker.js')
    this.worker.onmessage = () => this.click()
  }

  private click(): void {
    const time = this.audioCtx.currentTime

    // Silence the click.
    this.tickVolume?.gain.cancelScheduledValues(time)
    this.tickVolume?.gain.setValueAtTime(0, time)

    // Audible click sound.
    this.tickVolume?.gain.linearRampToValueAtTime(1, time + 0.001)
    this.tickVolume?.gain.linearRampToValueAtTime(0, time + 0.001 + 0.01)
  }

  private start(): void {
    this.tick.start(0)
    this.started = true
  }

  public play(): void {
    if (!this.started) {
      this.start()
    }
    this.playing = true
    const timeoutDuration = (60 / this.tempo) * 1000
    this.worker.postMessage({ type: 'start', interval: timeoutDuration })
  }

  public stop(): void {
    if (!this.started) return

    this.pause()
    this.tick?.stop()
    this.audioCtx.close()
  }

  public pause(): void {
    this.playing = false
    this.worker.postMessage({ type: 'stop' })
  }

  public changeTempo(tempo: number): void {
    this.pause()
    this.tempo = tempo
    this.play()
  }
}
