
import React, { FunctionComponent, useState} from 'react'
//import { FormattedMessage } from 'react-intl'

import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import adminReviewsQuery from './queries/adminReviews.gql'
import { graphql } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'
const AdminReviews: VtexFunctionComponent = (props: any) => {
  const { colorStars, starsType } = props
  const [filterProductId, setFilterProductId] = useState(props.query.productId ? props.query.productId : '');
  const [filterLocale, setFilterLocale] = useState(props.query.locale ? props.query.locale : '');
  
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

function filtrar(){
  let URLQuery = '';
  
  let productId = (document.getElementById("review_filter_productId") as HTMLInputElement).value;
  if(!isNaN(parseInt(productId))){
    URLQuery = URLQuery + '&productId=' + productId;
  } 

  let locale = (document.getElementById("review_filter_locale") as HTMLInputElement).value;
  if(locale != ''){
    URLQuery = URLQuery + '&locale=' + locale;
  } 
  /*let approved = (document.getElementById("review_filter_approved") as HTMLInputElement).value;
  if(locale != ''){
    query += '&locale=' + locale;
  } */
  
  props.runtime.navigate({
    page: 'admin.app.admin-reviews',
    query: ''+URLQuery+''
  });
  
  /*props.runtime.navigate({
    params: { "term": "search" },
    query: 'map=ft',
    fallbackToWindowLocation: false,
  });*/
}
  return (
    <div className="w-100 ph3 ph5-m ph2-xl mw9 ba">  {/* Resumen de reviews */}
      <table>
        <thead>
          <tr className="filters ma3">
            <th colSpan={7}>
              <span>Product ID: </span><input type="text" id="review_filter_productId" onChange={(e) => {setFilterProductId(e.target.value)}} value={filterProductId}/>
              <span>Approved: </span><input type="checkbox" id="review_filter_approved"/>
              <span>Locale: </span><input type="text" id="review_filter_locale"  onChange={(e) => {setFilterLocale(e.target.value)}} value={filterLocale}/>
              <button onClick={filtrar}>FILTER</button>
            </th>
          </tr>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Score</th>
            <th>Locale</th>
            <th>Comment</th>
            <th>Approved</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {props.data.adminReviews && props.data.adminReviews.map((review:any, indice:any) =>
          <tr key={indice} className="product-reviews-item ba mb2">
            <td className="product-reviews-productId">
              {review.productId}
            </td>
            <td className="product-reviews-name">
              {review.name}
            </td>
            <td className="product-reviews-score">
              <div className={styles.stars} style={{ color: colorStars }}>
                <Rating
                  readonly
                  initialRating={review.score}
                  {...ratingDynamicProps}
                />
              </div>
            </td>
            <td className="product-reviews-locale">
              {review.locale}
            </td>
            <td className="product-reviews-comment">
              {review.comment}
            </td>
            <td className="product-reviews-approved">
              {review.approved ? 'yes' : 'not'}
            </td>
            <td>
              <a className="f6 link dim ph3 pv2 mb2 dib white bg-near-black" href={"admin-reviews/" + review.reviewId}>Editar</a>
            </td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default graphql(adminReviewsQuery, {
    options: (props:any) => {
      return ({ variables: { 
        productId: (props.query && props.query.productId) ? props.query.productId : undefined, 
        from: (props.query && props.query.from) ? props.query.from : 0 , 
        to:  (props.query && props.query.to) ? props.query.to : 10,
        locale: (props.query && props.query.locale) ? props.query.locale : undefined, 
      }})
    }
})(withRuntimeContext(AdminReviews))
