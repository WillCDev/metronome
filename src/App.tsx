import { FC } from 'react'
import { Metronome } from '@/components/Metronomee'
import styles from './App.module.scss'

const App: FC = () => (
  <main className={styles.app}>
    <Metronome />
  </main>
)

export default App
