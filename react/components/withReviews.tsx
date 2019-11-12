//import reviews from '../graphql/getReviews.graphql'

import reviews from './../queries/getReviews.gql'
import { graphql } from 'react-apollo'

export interface Settings {
  storeId: string
  productBinding: string
  IconColor: string
}
const withReviews = graphql<{}, Settings>(reviews,{
  options: () => ({ variables: { productId: 1111 } })
})
export default withReviews
