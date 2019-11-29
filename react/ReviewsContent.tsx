import React, { FunctionComponent, useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { Settings } from './components/withSettings'
import { graphql } from 'react-apollo'
import getReviewsQuery from './queries/getReviews.gql'
import RatingSummary from './RatingSummary'
import { DataProps } from 'react-apollo'
import styles from './styles.css'
import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'

const ReviewsContent: FunctionComponent<Partial<DataProps<Settings>>> = (props:any) => {
  const { product } = useContext(ProductContext)
  const {data: {productReviews}} = props
  if (!product) {
    return null
  }

  let ratingDynamicProps:RatingComponentProps = {}
  const { colorStars, starsType } = props
  if(starsType == 'Custom Image'){
    let { imageStarsEmpty, imageStarsFilled } = props;

    // DEFAULT IMAGES if NOT EXISTS 
    if(!imageStarsEmpty) imageStarsEmpty = 'https://raw.githubusercontent.com/dreyescat/react-rating/master/assets/images/star-grey.png';
    if(!imageStarsFilled) imageStarsFilled = 'https://raw.githubusercontent.com/dreyescat/react-rating/master/assets/images/star-yellow.png';

    ratingDynamicProps.emptySymbol = <img src={imageStarsEmpty} className={`${styles.star} ${styles['star--empty']}`} />
    ratingDynamicProps.fullSymbol = <img src={imageStarsFilled} className={`${styles.star} ${styles['star--filled']}`} />
  } else{
    ratingDynamicProps.emptySymbol = `${styles.star} ${styles['star--empty']} ${fontAwesome.fa} ${fontAwesome['fa-star-o']}`
    ratingDynamicProps.fullSymbol = `${styles.star} ${styles['star--filled']} ${fontAwesome.fa} ${fontAwesome['fa-star']}`
  }

  return (
    <div className="flex justify-center">
      <RatingSummary/>
      {/* Listado de reviews */}
      <div className="w-100 w-50-ns w-30-l ph5 mw9 mb1 f6">
        {productReviews && productReviews.map((review:any, indice:any) =>
          <div key={indice} className="product-reviews-item mb4">
            <script type="application/ld+json" dangerouslySetInnerHTML={ { __html: `
            {
              "@context": "https://schema.org/",
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "`+review.name+`"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "` + review.score + `",
                "bestRating": "5"
              },
              "reviewBody": "` + review.comment + `"
            }`}} />
            <span className="product-reviews-name b mv1">{review.name}</span>
            <div className="product-reviews-score mv1">
              <div className={styles.stars} style={{ color: colorStars }}>
                <Rating
                  readonly
                  initialRating={review.score}
                  {...ratingDynamicProps}
                />
              </div>
            </div>
            <span className="product-reviews-comment mv1">{review.comment}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default graphql(getReviewsQuery, {
    options: (props:any) => {
      return (
        {
          variables: { 
            productId: props["data-producto"],
            approved: true,
            locale: (props["data-locale"] != '' ? props["data-locale"] : undefined)
          }
        }
      )      
    }
   })(ReviewsContent)
  