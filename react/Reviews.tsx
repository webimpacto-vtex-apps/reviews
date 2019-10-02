import React, { FunctionComponent, useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import { Settings } from './components/withSettings'
import withReviews from './components/withReviews'
import { DataProps } from 'react-apollo'

const Reviews: FunctionComponent<Partial<DataProps<Settings>>> = (props) => {
  console.log(props)
  const { product } = useContext(ProductContext)

  if (!product) {
    return null
  }

  return (
    <div className="flex justify-center">
      <div className="w-100 ph3 ph5-m ph2-xl mw9">
        Reviewwws.tsx
      <FormattedMessage
          id="reviews"
          values={{
            name: product.productName,
          }}
        />
      </div>
    </div>
  )
}

export default withReviews(Reviews)
