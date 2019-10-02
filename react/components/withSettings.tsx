import settings from '../graphql/appSettings.graphql'
import { graphql } from 'react-apollo'

export interface Settings {
  storeId: string
  productBinding: string
}

const withSettings = graphql<{}, Settings>(settings)

export default withSettings
