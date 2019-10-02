import React, { FunctionComponent, useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { ProductContext } from 'vtex.product-context'

const QnA: FunctionComponent<QnAProps> = () => {
  const { product } = useContext(ProductContext)

  if (!product) {
    return null
  }

  return (
    <div>
      <FormattedMessage
        id="qna"
        values={{
          name: product.productName,
        }}
      />
    </div>
  )
}

interface QnAProps {
  productQuery: any
}

export default QnA
