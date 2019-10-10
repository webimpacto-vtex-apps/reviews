import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import styles from './styles.css'

const ReviewForm: FunctionComponent = () => {
  return (
    <div id="review-form" className={`${styles['review-form-container']}`}>
      Review Form eh?
      <FormattedMessage id="review-form" />
    </div>
  )
}

export default ReviewForm
