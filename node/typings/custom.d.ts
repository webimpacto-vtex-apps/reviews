import { ServiceContext } from '@vtex/api'

export interface Review {
    approved: Boolean
    comment: String
    locale: String!
    name: String
    productId: String!
    score: Float!
}

export interface ReviewInput {
  comment: Review['comment']
  locale: Review['locale']
  name: Review['name']
  productId: Review['productId']
  score: Review['score']
}

export type Maybe<T> = T | void