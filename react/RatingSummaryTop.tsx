import React, { FunctionComponent, useContext} from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'
import RatingSummaryTopContent from './RatingSummaryTopContent'


interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

const RatingSummaryTop: VtexFunctionComponent = (props:any) => {
  const { product } = useContext(ProductContext)

  if (!product) {
    return null
  }
  
  return <RatingSummaryTopContent data-producto={product.productId} data-locale={props.runtime.culture.locale} />
}

export default (withRuntimeContext(RatingSummaryTop))
