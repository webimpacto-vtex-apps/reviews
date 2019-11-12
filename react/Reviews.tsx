import React, { FunctionComponent, useContext , useState } from 'react'
import { ProductContext } from 'vtex.product-context'
import { Settings } from './components/withSettings'
import { DataProps } from 'react-apollo'
import ReviewsContent from './ReviewsContent'
import { withRuntimeContext } from 'vtex.render-runtime'
import { injectIntl } from 'react-intl'

const Reviews: FunctionComponent<Partial<DataProps<Settings>>> = (props: any) => {
  const { product } = useContext(ProductContext)
  const [locale, setLocale] = useState(props.runtime.culture.language);
  
  function handleChangeLocale (event:any) {
    setLocale(event.target.value)
  }
  if (!product) {
    return null
  }
  return (
    <div>
      <div className="flex justify-center">
      <div className="w-50"></div>
      <div className="w-50 ph5">
        <select onChange={handleChangeLocale}>
          <option value={props.runtime.culture.language}>{props.runtime.culture.language}</option>
          <option value={''}>{props.intl.formatMessage({id: "All langs"})}</option>
        </select>
      </div>
      </div>
      <ReviewsContent data-producto={product.productId} data-locale={locale} />
    </div>
  )
}

export default (withRuntimeContext(injectIntl(Reviews)))
