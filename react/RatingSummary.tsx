import React, { FunctionComponent, useContext} from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'
import RatingSummaryList from './RatingSummaryList'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

const RatingSummary: VtexFunctionComponent = (props:any) => {
  const { product } = useContext(ProductContext)
   
  if (!product) {
    return null
  } 

  return <RatingSummaryList data-producto={product.productId} data-locale={props.runtime.culture.language} />
}

export default (withRuntimeContext(RatingSummary))
