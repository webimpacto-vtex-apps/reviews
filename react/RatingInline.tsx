import React, { useContext, FunctionComponent } from 'react'
import { ProductSummaryContext } from 'vtex.product-summary'
import RatingInlineContent from './RatingInlineContent'

const RatingInline: FunctionComponent = () => {
  const { product } = useContext(ProductSummaryContext)

  return (
    <RatingInlineContent data-product={product}/>
  )
}

export default RatingInline
