import React, { FunctionComponent, useState} from 'react'
import { FormattedMessage, injectIntl  } from 'react-intl'
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
    return (<div><FormattedMessage id="CARGANDO"/></div>);
  }

  const { colorStars, starsType } = props
  const [reviewApproved, setReviewApproved] = useState(review.approved);
  const handleApprovedClick = () => {
    setReviewApproved(!reviewApproved);
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
        approved: !reviewApproved,
        id: props.data.adminReview.id
      };
      let variables = {
        review: reviewObj
      }
      props.saveReview( {variables} ).then(() => {
        showFloatingMessage(props.intl.formatMessage({id: "Review actualizada"}))
      });    
  }

  function showFloatingMessage(msg:String){
    let body = document.querySelector("body") as HTMLBodyElement;
    let msg_modal = '<div id="msg_modal" style="padding: .75rem 1.25rem; border-radius: .25rem; color: #155724; background-color: #d4edda; border: 2px solid rgb(195, 230, 203); z-index: 999; position: fixed; bottom: -300px; right: 20px; opacity: 0; width: 350px; transition: all 2s ease-in-out;">' + msg + '</div>'
    body.insertAdjacentHTML('beforeend' , msg_modal);
    
    setTimeout(function(){
      (document.getElementById("msg_modal") as HTMLDivElement).style.bottom = "20px";
      (document.getElementById("msg_modal") as HTMLDivElement).style.opacity ="1";
      setTimeout(function(){
        (document.getElementById("msg_modal") as HTMLDivElement).style.opacity ="0";
        (document.getElementById("msg_modal") as HTMLDivElement).style.bottom ="-300px";
        setTimeout(function(){
          (document.getElementById("msg_modal") as HTMLDivElement).remove()
        },2500)
      }, 5000)
    }, 50)
  }

  return (
    <div className={"pa3 pa5-m pa2-xl"}>
      <a href={"../admin-reviews"} className={"f6 link dim ph3 pv2 mb2 dib"}><FormattedMessage id="Volver"/></a>
      <div className="w-100 pa3 pa5-m pa2-xl mw9 ba">
        <div className={"db"}>
          <span><FormattedMessage id="Id"/>: </span><span>{review.reviewId}</span>
        </div>
        <div className={"db"}>
          <span><FormattedMessage id="Nombre"/>: </span><span>{review.name}</span>
        </div>
        <div className={"db"}>
          <span><FormattedMessage id="Score"/>: </span> 
          <div className={styles.stars} style={{ color: colorStars }}>
            <Rating
              readonly
              initialRating={review.score}
              {...ratingDynamicProps}
            />
          </div>
        </div>
        <div className={"db"}>
          <span><FormattedMessage id="Locale"/>: </span><span>{review.locale}</span>
        </div>
        <div className={"db"}>
          <span className={"v-top"}><FormattedMessage id="Comment"/>: </span><textarea rows={6} style={{width: "400px"}} readOnly={true}>{review.comment}</textarea>
        </div>
        <div className={"db"}>
          <span><FormattedMessage id="Approved"/>: </span><input type="checkbox" checked={reviewApproved} onChange={handleApprovedClick}/>
        </div>
        {/*<div className={"db"}>
          <a className="f6 link dim ph3 pv2 mb2 dib white bg-near-black" href={""}><FormattedMessage id="Guardar"/></a>
        </div>*/}
      </div>
    </div>
  )
}

export default compose(
  graphql(adminReviewQuery, {
    options: (props:any) => {
      return ({ variables: { 
        reviewId: props.params.reviewId
      }})
    }
  }),
  graphql(saveReview, {name: 'saveReview'})
)(injectIntl(AdminReview))