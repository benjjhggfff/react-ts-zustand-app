import React from 'react'
import NumberCard from '../../components/numberCard'
import styles from './classRoom.module.scss'
const ClassRoom: React.FC = () => {
  return (
    <>
      <div className={styles.classRoom}>
        <NumberCard></NumberCard>
      </div>
    </>
  )
}
export default ClassRoom
