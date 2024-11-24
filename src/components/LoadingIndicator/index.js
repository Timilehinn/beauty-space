import React from 'react'
import styles from './loader.module.css'

export default function LoadingIndicator() {
  return (
    <div className={styles.the_box}>
      <span className={styles.loader}></span>
    </div>
  )
}

export function CircularSpinner() {
  return <span className={styles.loader}></span>
}
