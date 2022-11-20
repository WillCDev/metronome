import { FC } from 'react'
import { Metronome } from '@/components/Metronome'
import styles from './App.module.scss'

const App: FC = () => (
  <main className={styles.app}>
    <Metronome />
  </main>
)

export default App
