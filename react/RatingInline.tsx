import React, { useContext, FunctionComponent } from 'react'
import { ProductSummaryContext } from 'vtex.product-summary'
import Stars from './components/Stars'

const RatingInline: FunctionComponent = () => {
  const { product } = useContext(ProductSummaryContext)

  return (
    <div title={product.name}>
       RATING INLINE
      <Stars rating={2} />
    </div>
  )
}

export default RatingInline
