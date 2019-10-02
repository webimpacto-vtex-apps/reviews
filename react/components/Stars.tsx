import React, { FunctionComponent, useMemo } from 'react'
import Star from './Star'
import styles from '../styles.css'

const Stars: FunctionComponent<StarsProps> = ({ rating }) => {
  const stars = useMemo(
    () => [null, null, null, null, null].map((_, index) => index < rating),
    [rating]
  )

  return (
    <div className={`${styles.stars} c-on-base`}>
      {stars.map((value, index) => (
        <Star key={index} filled={value} />
      ))}
    </div>
  )
}

interface StarsProps {
  rating: number
}

export default Stars
