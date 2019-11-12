import React, { FunctionComponent , useContext , useEffect, useState} from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'
import { FormattedMessage, injectIntl  } from 'react-intl'
import {flowRight as compose} from 'lodash';
import { graphql } from 'react-apollo'
import { ReviewInput } from './../node/typings/custom'
import saveReviewQuery from './queries/saveReview.gql'
import GET_PROFILE from './queries/getProfile.gql'
import Rating, { RatingComponentProps } from 'react-rating'
import styles from './styles.css'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
 
const ReviewForm: FunctionComponent = (props:any) => {  
  const { product } = useContext(ProductContext)
  const [hiddenReviewForm, setHiddenReviewForm] = useState(false);
  const [formErrorMessage, setformErrorMessage] = useState("");
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
  
  useEffect(() => {
    document.addEventListener('toogleMenu', (/*e*/) => {
        toggleReviewForm()
    });
  })
  
  function toggleReviewForm() {    
    (document.getElementById('form_review_input_score') as HTMLInputElement).value = '';
    (document.getElementById('form_review_input_comment') as HTMLInputElement).value = '';
    setHiddenReviewForm(!hiddenReviewForm);
    setformErrorMessage('');
  }

  function generateReviewName(){
    return (props.profile.profile.firstName == null ? props.profile.profile.email.split("@").shift() : props.profile.profile.firstName.charAt(0) + " " + props.profile.profile.lastName);
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


  function saveReview(){
    const formReviewInputScore = document.getElementById('form_review_input_score') as HTMLInputElement; // Refs cannot be used on functional components.
    const formReviewInputComment = document.getElementById('form_review_input_comment') as HTMLInputElement; // Refs cannot be used on functional components.

    let comment = '';
    if(formReviewInputComment != null){
      comment = formReviewInputComment.value;
    }
    
    if(formReviewInputScore != null && formReviewInputScore.value != ''){
      let reviewObj:ReviewInput={
        comment: comment,
        approved: false,
        locale: props.runtime.culture.language,
        name: generateReviewName(),
        productId: product.productId,
        score: formReviewInputScore.value
      }
      let variables = {
        review: reviewObj
      }

      props.saveReview({ variables }).then((/*data:any*/) => {
        toggleReviewForm()
        showFloatingMessage(props.intl.formatMessage({id: "Review creada"}));
      });
    }else{
      setformErrorMessage(props.intl.formatMessage({id: "DebeIndicarPuntuacion"}))
    }
  }

  return (
    <div>
      {/* Boton nueva review */}
      {props.profile.profile ? 
      <div className={'tc'}>
        <div className="f6 link dim ba ph3 pv2 mb2 dib near-black pointer w-100" onClick={toggleReviewForm}>
          <FormattedMessage id="dejar-comentario"/>
        </div>
        <div className={hiddenReviewForm ? `${styles['reviewForm-background']}` : `${styles['reviewForm-background']} dn`} onClick={toggleReviewForm}></div>
        <div className={hiddenReviewForm ? `${styles['reviewForm-form-container']}` : `${styles['reviewForm-form-container']} dn`}>        
          {/* Formulario nueva review */}
          <div id="review-formm" className={`tl ${styles['review-form-container']}`}>
            <span className={'f4'}><FormattedMessage id="Add-review-title"/></span>
            <hr/>
            <div className={"db tl"}>
              <label htmlFor="review-form-score" className={'b f6'}><FormattedMessage id="Score"/>: </label>
              <input name="review-form-score" type="hidden" id="form_review_input_score" />
              <div className={styles.stars} style={{ color: colorStars }}>
                <Rating
                  onClick={(rate:any) => (document.getElementById('form_review_input_score') as HTMLInputElement).value = rate || ''}
                  {...ratingDynamicProps}
                />
              </div>       
              
            </div>
            <div className={"db tl"}>
              <label htmlFor="review-form-comment" className={'b f6'}><FormattedMessage id="Comment"/>: </label>
              <textarea name="review-form-comment" id={"form_review_input_comment"} rows={4} className={'w-100'} ></textarea>
            </div>
            <span className={styles.formErrorMessage}>{formErrorMessage}</span>
            <div className="f6 link dim ba ph3 pv2 mb2 dib near-black pointer" onClick={saveReview}>
              <FormattedMessage id="Button-addReview" />
            </div>
          </div>
        </div>
      </div> 
      : 
      <div><a href="/login"><FormattedMessage id="Debe iniciar sesion para poder comentar"/></a></div>
      }      
    </div>
  )
}
const options = {
  name: 'profile',
  options: () => ({ ssr: false }),
}

export default compose(
  graphql(GET_PROFILE, options),
  graphql(saveReviewQuery, {name: 'saveReview'}),
)(withRuntimeContext(injectIntl(ReviewForm)))
