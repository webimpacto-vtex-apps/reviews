import React, { FunctionComponent, useContext , useState, useEffect} from 'react'
import { FormattedMessage } from 'react-intl'
import { ProductContext } from 'vtex.product-context'

import getReviewsQuery from './queries/getReviews.gql'

import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import { graphql } from 'react-apollo'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'
const RatingSummaryTopContent: VtexFunctionComponent = (props: any) => {
  const { product } = useContext(ProductContext)
  const {data: {productReviews}} = props

  if (!product || !productReviews) {
    return null
  }
  
  const [scoreAverage,setScoreAverage] = useState();
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

  function calculateAverageScore(){
    let cont = productReviews.length;
    let totalScore = 0;
    productReviews.map(function(review:any){
      totalScore+= review['score'];
    })
    let averageScore = totalScore/cont;        
    if(isNaN(averageScore)){
      setScoreAverage('');
    }else{
      setScoreAverage( Math.round( averageScore * 10) / 10 );
    }
  }
  
 
  useEffect(() => {
    // Actualiza el título del documento usando la API del navegador
    //  let _reviews = getReviews();
   // setReviews(_reviews);
    calculateAverageScore()
  });

  return (
    <div title={product.productName}>
      {/* Resumen de reviews */}
      <div className="w-100 ph3 ph5-m ph2-xl mw9">
        {/*<span>Opiniones de clientes</span>*/}
        <div className={styles.stars} style={{ color: colorStars }}>
          <span className={'f6'}>{scoreAverage}</span> 
          <Rating
            readonly
            initialRating={scoreAverage}
            {...ratingDynamicProps}
          />
        </div>        
        <span>{productReviews.length} <FormattedMessage id="opiniones"/></span>
      </div>
    </div>
  )
}

RatingSummaryTopContent.getSchema = ({ starsType }) => {

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

export default graphql(getReviewsQuery, {  
    options: (props:any) => {
      return ({ 
        variables: { 
          productId: props["data-producto"],
          approved: true
        }
      })
    }
})(RatingSummaryTopContent)
