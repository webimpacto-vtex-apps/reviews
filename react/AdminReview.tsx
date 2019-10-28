
import React, { FunctionComponent, useState} from 'react'
//import { FormattedMessage } from 'react-intl'
import adminReviewQuery from './queries/adminReview.gql'
import saveReview from './queries/saveReview.gql'
import { graphql } from 'react-apollo'
import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import {flowRight as compose} from 'lodash';
import { ReviewInput } from '../node/typings/custom'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'
const AdminReview: VtexFunctionComponent = (props: any) => {
  const review = props.data.adminReview;
  if(!review){
    return (<div>CARGANDO</div>);
  }

  const { colorStars, starsType } = props
  const [reviewApproved, setReviewApproved] = useState(review.approved);
  const handleApprovedClick = () => {
    setReviewApproved(!reviewApproved)
    updateApproved();
  }
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

  function updateApproved(){
      let reviewObj:ReviewInput={
        reviewId: props.params.reviewId,
        approved: reviewApproved
      };    
      console.log(reviewObj);
      let variables = {
        review: reviewObj
      }
      props.saveReview( {variables} ).then((data:any) => {
        console.log("DATA")
        console.log(data)
      });    
  }

  return (
    <div className="w-100 ph3 ph5-m ph2-xl mw9 ba">
      <div className={"db"}>
        <span>Id: </span><span>{review.reviewId}</span>
      </div>
      <div className={"db"}>
        <span>Nombre: </span><span>{review.name}</span>
      </div>
      <div className={"db"}>
        <span>Score: </span> 
        <div className={styles.stars} style={{ color: colorStars }}>
          <Rating
            readonly
            initialRating={review.score}
            {...ratingDynamicProps}
          />
        </div>
      </div>
      <div className={"db"}>
        <span>Locale</span><span>{review.locale}</span>
      </div>
      <div className={"db"}>
        <span>Comment</span><textarea readOnly={true}>{review.comment}</textarea>
      </div>
      <div className={"db"}>
        <span>Approved</span><input type="checkbox" checked={reviewApproved} onChange={handleApprovedClick}/>
      </div>
      <div className={"db"}>
        <a className="f6 link dim ph3 pv2 mb2 dib white bg-near-black" href={""}>Guardar</a>
      </div>
    </div>
  )
}
/*
export default graphql(adminReviewQuery, {
    options: (props:any) => {
      return ({ variables: { 
        reviewId: props.params.reviewId
      }})
    }
})(AdminReview)
*/
export default compose(
  graphql(adminReviewQuery, {
    options: (props:any) => {
      return ({ variables: { 
        reviewId: props.params.reviewId
      }})
    }
  }),
  
  graphql(saveReview, {name: 'saveReview'})/*,
  graphql(saveReview, {
    options: (props:any) => {
      return ({
        variables: {
          id: props.params.reviewId
        }
      })
    }
  })*/
)(AdminReview)