import React, { FunctionComponent, useState , useContext , useEffect} from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import ReviewForm from './ReviewForm'
import getReviewsQuery from './queries/getReviews.gql'
//import {flowRight as compose} from 'lodash';
import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import { graphql } from 'react-apollo'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'
const RatingSummaryList: VtexFunctionComponent = (props: any) => {
  const { product } = useContext(ProductContext)
  const {data: {productReviews}} = props
  if (!product || !productReviews) {
    return null
  }  
  const [scoreAverage,setScoreAverage] = useState();
  const [resumenReviews,setResumenReviews] = useState();
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
    setScoreAverage( Math.round( (totalScore/cont) * 10) / 10 );
  }
  
  function generateReviewsSummary(){
    let resumen: {[index: string]:any} = {
      1:0,
      2:0,
      3:0,
      4:0,
      5:0
    };
    let cont = productReviews.length;
  
    productReviews.map(function(review:any){
      resumen[review['score']] = 1 + resumen[review['score']] ;
    })

    Object.keys(resumen).map(function(key) {
      resumen[key] = ((resumen[key]*100)/cont);
    });
    
    let HTML_RatingSummary:any = [];
    Object.keys(resumen).map(function(key) {
      HTML_RatingSummary.push(
        <div key={key}>
          <Rating readonly initialRating={key as unknown as number} {...ratingDynamicProps} />
          <div className={styles.reviewProgressBarContainer}>
            <div className={styles.reviewProgressBar} style={{width:resumen[key]+'%'}}></div>
          </div>
        </div>
      );
    });

    setResumenReviews(HTML_RatingSummary);
  }  
 
  useEffect(() => {
    calculateAverageScore();
    generateReviewsSummary();
  },[]);

  if(productReviews.length>0){
    return (
      <div className={`w-100 w-50-ns w-30-l pa4 mw9 ba b--gray ${styles.ratingSummaryContainer}`}>  {/* Resumen de reviews */}
        <strong><FormattedMessage id="Opiniones de los clientes"/></strong>
      
        <div className={styles.stars} style={{ color: colorStars }}>
          <span>{scoreAverage}</span> 
          <Rating
            readonly
            initialRating={scoreAverage}
            {...ratingDynamicProps}
          />
          <br/>
          <span>{productReviews.length} <FormattedMessage id="opiniones"/></span>
        </div>
        
        <hr/>
        {resumenReviews}
        <hr/>
        {/* Formulario nueva review */}      
        <ReviewForm/>
      </div>
    )
  }else{
    return (
      <div className={ `w-100 w-50-ns w-30-l pa4 mw9 ba b--gray ${styles.ratingSummaryContainer}`}>
        <strong><FormattedMessage id="Opiniones de los clientes"/></strong>
      
        <div><FormattedMessage id="Todavía no hay opiniones"/></div>
        <hr/> 
        <ReviewForm/>
      </div>
    )
  }
}

RatingSummaryList.getSchema = ({ starsType }) => {

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
 })(withRuntimeContext(RatingSummaryList))
