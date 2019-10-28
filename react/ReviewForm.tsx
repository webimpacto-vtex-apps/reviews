import React, { FunctionComponent , useContext , useEffect, useState} from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { ProductContext } from 'vtex.product-context'
import { FormattedMessage } from 'react-intl'
import styles from './styles.css'
import { ReviewInput } from './../node/typings/custom'
import saveReviewQuery from './queries/saveReview.gql'
import {flowRight as compose} from 'lodash';
import GET_PROFILE from './queries/getProfile.gql'
import { graphql } from 'react-apollo'

import Rating from 'react-rating'
 
const ReviewForm: FunctionComponent = (props:any) => {  
  const { product } = useContext(ProductContext)
  const [hiddenReviewForm, setHiddenReviewForm] = useState(false);

  useEffect(() => {
    document.addEventListener('toogleMenu', (/*e*/) => {
        toggleReviewForm()
    });
  })
  
  function toggleReviewForm() {    
    (document.getElementById('form_review_input_score') as HTMLInputElement).value = '';
    setHiddenReviewForm(!hiddenReviewForm);
  }

  function generateReviewName(){
    return (props.profile.profile.firstName == null ? props.profile.profile.email.split("@").shift() : props.profile.profile.fistName.charAt(0) + " " + props.profile.profile.lastName);
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
    
    if(formReviewInputScore != null){      
      let reviewObj:ReviewInput={
        comment: comment,
        approved: false,
        locale: props.runtime.culture.locale,
        name: generateReviewName(),
        productId: product.productId,
        score: formReviewInputScore.value
      }
      let variables = {
        review: reviewObj
      }

      props.saveReview({ variables }).then((/*data:any*/) => {
        toggleReviewForm()
        showFloatingMessage("Review creada");
      });
    }
  }

  return (
    <div>
      {/* Boton nueva review */}
      {props.profile.profile ? 
      <div>
        <div id="testwim" className="f6 link dim ph3 pv2 mb2 dib yellow bg-red" onClick={toggleReviewForm}>
          <FormattedMessage id="dejar-comentario"/>
        </div>
        <div className={hiddenReviewForm ? `${styles['reviewForm-background']}` : `${styles['reviewForm-background']} dn`} onClick={toggleReviewForm}></div>
        <div className={hiddenReviewForm ? `${styles['reviewForm-form-container']}` : `${styles['reviewForm-form-container']} dn`}>        
          {/* Formulario nueva review */}
          <div id="review-formm" className={`${styles['review-form-container']}`}>
            <div className={"db"}>
              <label htmlFor="review-form-score">Score: </label>
              <input name="review-form-score" type="hidden" id="form_review_input_score" />
              <Rating
              onClick={(rate:any) => (document.getElementById('form_review_input_score') as HTMLInputElement).value = rate || ''}
              />
            </div>
            <div className={"db"}>
              <label htmlFor="review-form-comment">Comment: </label>
              <input name="review-form-comment" type="text" id="form_review_input_comment" />
            </div>
            <div id="testwim" className="f6 link dim ph3 pv2 mb2 dib yellow bg-red db" onClick={saveReview}>
              <FormattedMessage id="Button-addReview" />
            </div>
          </div>
        </div>
      </div> 
      : 
      <div><a href="/login">Debe iniciar sesion para poder comentar</a></div>
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
)(withRuntimeContext(ReviewForm))
