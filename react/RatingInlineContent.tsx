import React, { useContext, FunctionComponent } from 'react'
import { ProductSummaryContext } from 'vtex.product-summary'
import Stars from './components/Stars'
import {flowRight as compose} from 'lodash';
import { graphql } from 'react-apollo'
import getProductReviewFile from './queries/getProductReviewFile.gql'
import styles from './styles.css'

const RatingInlineContent: FunctionComponent = (props:any) => {
  const { product } = useContext(ProductSummaryContext)
  if(props.data.getProductReviewFile && props.data.getProductReviewFile.average) {  
    return (
      <div className={styles.children_di} title={product.name}>
        <Stars rating={(props.data.getProductReviewFile) ? props.data.getProductReviewFile.average : 0} /><span className="f7"> ({props.data.getProductReviewFile.cont})</span>
      </div>
    ) 
  } else {
    return <div></div>
  }  
}

export default compose(
  graphql( getProductReviewFile, {
    options: (props:any) => {
      return ({ variables: { 
        id: props['data-product'].productId
      }})
    }
  })
)(RatingInlineContent)
