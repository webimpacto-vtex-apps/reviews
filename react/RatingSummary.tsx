import React, { FunctionComponent, useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { ProductContext } from 'vtex.product-context'

import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}



//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'

const RatingSummary: VtexFunctionComponent = (props: any) => {
  const { product } = useContext(ProductContext)
  if (!product) {
    return null
  }

  const { colorStars, starsType } = props

  let ratingDynamicProps:RatingComponentProps = {}
  if(starsType == 'Custom Image'){
    let { imageStarsEmpty, imageStarsFilled } = props;

    // DEFAULT IMAGES if NOT EXISTS 
    if(!imageStarsEmpty) imageStarsEmpty = 'https://raw.githubusercontent.com/dreyescat/react-rating/master/assets/images/star-grey.png';
    if(!imageStarsFilled) imageStarsFilled = 'https://raw.githubusercontent.com/dreyescat/react-rating/master/assets/images/star-yellow.png';

    ratingDynamicProps.emptySymbol = <img src={imageStarsEmpty} className={`${styles.star} ${styles['star--empty']}`} />
    ratingDynamicProps.fullSymbol = <img src={imageStarsFilled} className={`${styles.star} ${styles['star--filled']}`} />
  }
  else{
    ratingDynamicProps.emptySymbol = `${styles.star} ${styles['star--empty']} ${fontAwesome.fa} ${fontAwesome['fa-star-o']}`
    ratingDynamicProps.fullSymbol = `${styles.star} ${styles['star--filled']} ${fontAwesome.fa} ${fontAwesome['fa-star']}`
  }

  return (
    <div title={product.productName}>
      <div className={styles.stars} style={{ color: colorStars }}>
        <Rating
          readonly
          initialRating={2.5}
          {...ratingDynamicProps}
        />
      </div>
      <FormattedMessage
        id="rating-summary"
        values={{
          name: product.productName,
        }}
      />
    </div>
  )
}

RatingSummary.getSchema = ({ starsType }) => {

  let dynamicSchema: any = {}

  if (starsType == "Custom Image") {
    dynamicSchema.imageStarsFilled = {
      title: 'admin/editor.rating.imageStarsFilled.title',
      description: 'admin/editor.rating.imageStarsFilled.description',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    }
    dynamicSchema.imageStarsEmpty = {
      title: 'admin/editor.rating.imageStarsEmpty.title',
      description: 'admin/editor.rating.imageStarsEmpty.description',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    }
  }
  else {
    dynamicSchema.colorStars = {
      title: 'admin/editor.rating.colorStars.title',
      description: 'admin/editor.rating.colorStars.description',
      type: 'string',
      default: '#ffcc1d',
      widget: {
        'ui:widget': 'ColorPickerWidget',
      },
    };
  }


  return {
    title: 'admin/editor.rating.title',
    description: 'admin/editor.rating.description',
    type: 'object',
    properties: {
      starsType: {
        title: 'admin/editor.rating.starsType.title',
        description: 'admin/editor.rating.starsType.description',
        type: 'string',
        default: 'FontAwesome',
        enum: ['FontAwesome', 'Custom Image'],
        widget: {
          'ui:widget': 'RadioWidget',
        },
      },

      ...dynamicSchema,

      textRatings: {
        title: 'admin/editor.rating.textRatings.title',
        description: 'admin/editor.rating.textRatings.description',
        type: 'string',
      },
    },
  }
}

export default RatingSummary
