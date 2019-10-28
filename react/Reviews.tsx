import React, { FunctionComponent, useContext , useState } from 'react'
import { ProductContext } from 'vtex.product-context'
import { Settings } from './components/withSettings'
import { DataProps } from 'react-apollo'
import ReviewsContent from './ReviewsContent'
import { withRuntimeContext } from 'vtex.render-runtime'

const Reviews: FunctionComponent<Partial<DataProps<Settings>>> = (props: any) => {
  const { product } = useContext(ProductContext)

  const [locale, setLocale] = useState(props.runtime.culture.locale);

  function handleChangeLocale (event:any) {
    setLocale(event.target.value)
  }

  if (!product) {
    return null
  }
  return (
    <div>
      <select onChange={handleChangeLocale}>
        <option value={props.runtime.culture.locale}>{props.runtime.culture.locale}</option>
        <option value={''}>All langs</option>
      </select>
      <ReviewsContent data-producto={product.productId} data-locale={locale} />
    </div>
  )
}

export default (withRuntimeContext(Reviews))
