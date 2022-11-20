import { FC } from 'react'
import { Metronome } from '@/components/metronome'
import styles from './App.module.scss'

const App: FC = () => {
  return (
    <main className={styles.wrapper}>
      <Metronome />
    </main>
  )
}

export default App
