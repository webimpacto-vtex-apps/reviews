import React, { FunctionComponent, useContext , useState} from 'react'
import { FormattedMessage } from 'react-intl'
import { ProductContext } from 'vtex.product-context'


//import { Query } from "react-apollo";
//import { useQuery } from '@apollo/react-hooks';
//import { productReviews } from '../node/resolvers/productReviews';
import getReviewsQuery from './queries/getReviews.gql'

//import { graphql } from 'react-apollo';

import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import { graphql } from 'react-apollo'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'

const RatingSummary: VtexFunctionComponent = (props: any) => {
  console.log(getReviewsQuery)
  const { product } = useContext(ProductContext)
  if (!product) {
    return null
  }
  const [scoreAverage] = useState();
  const [reviews] = useState([]);
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
/*
  const GET_REVIEWS = gql`
  {
    productReviews(productId: 1){
      approved
      comment
      locale
      name
      productId
      score
    }
  }
`;
*/

/*
  function getReviews(){
    return []
    /*
    //const { loading, error, data } = useQuery(GET_REVIEWS);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    console.log("la data es esta!")
    console.log(data)
    return data;
    
  }
  function calculateAverageScore(){
    let cont = 1// reviews.length;
    let totalScore = 0
    console.log("typeof reviews: "+typeof reviews)
    reviews.map(function(review){
      totalScore+= review['score'];
    })
    setScoreAverage(totalScore/cont);
    console.log("La puntuacion media es: " + (totalScore/cont));
  }
  */
 /*
  useEffect(() => {
    // Actualiza el título del documento usando la API del navegador
    console.log("Obtener reviews y puntuacion media del producto.");
    let _reviews = getReviews();
    setReviews(_reviews);

    calculateAverageScore()
  });
  */

  return (
    <div title={product.productName}>
      <div className={styles.stars} style={{ color: colorStars }}>
        <Rating
          readonly
          initialRating={scoreAverage}
          {...ratingDynamicProps}
        />
      </div>
      {reviews}
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

export default graphql(getReviewsQuery)(RatingSummary)
