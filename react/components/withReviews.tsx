import reviews from '../graphql/getReviews.graphql'
import { graphql } from 'react-apollo'

export interface Settings {
  storeId: string
  productBinding: string
}

const withReviews = graphql<{}, Settings>(reviews)

export default withReviews
