import { ServiceContext } from '@vtex/api'

export interface Review {
    reviewId: Number
    approved: Boolean
    comment: String
    locale: String!
    name: String
    productId: String!
    score: Float!
}

export interface ReviewInput {
  reviewId?: Number
  approved?: Boolean
  comment?: Review['comment']
  locale?: Review['locale']
  name?: Review['name']
  productId?: Review['productId']
  score?: Review['score']
}

export type Maybe<T> = T | void