import { ServiceContext } from '@vtex/api'

export interface Review {
    id: String
    reviewId: Number
    approved: Boolean
    comment: String
    locale: String!
    name: String
    productId: String!
    score: Float!
}

export interface ReviewInput {
  id?: String
  reviewId?: Number
  approved?: Boolean
  comment?: Review['comment']
  locale?: Review['locale']
  name?: Review['name']
  productId?: Review['productId']
  score?: Review['score']
}

export interface ProductReviewFile {
  cont?: Int
  average?: Float
}

export type Maybe<T> = T | void