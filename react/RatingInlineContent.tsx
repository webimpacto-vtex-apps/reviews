import React, { useContext, FunctionComponent } from 'react'
import { ProductSummaryContext } from 'vtex.product-summary'
import Stars from './components/Stars'
import {flowRight as compose} from 'lodash';
import { graphql } from 'react-apollo'
import getProductReviewFile from './queries/getProductReviewFile.gql'

const RatingInlineContent: FunctionComponent = (props:any) => {
  const { product } = useContext(ProductSummaryContext)
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  console.log(props.data.getProductReviewFile);
  return (
    <div title={product.name}>
       RATING INLINE
      <Stars rating={(props.data.getProductReviewFile) ? props.data.getProductReviewFile.average : 0} />
    </div>
  )
}

export default compose(
  graphql( getProductReviewFile, {
    options: (props:any) => {
      return ({ variables: { 
        id: props['data-product'].productId
      }})
    }
  })//,
  //graphql(getProductReviewFile, { name: 'getProductReviewFile' })
)(RatingInlineContent)
