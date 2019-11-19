
import React, { FunctionComponent, useState} from 'react'
import { FormattedMessage } from 'react-intl'
import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import adminReviewsQuery from './queries/adminReviews.gql'
import { graphql } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Table } from 'vtex.styleguide'

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'
const AdminReviews: VtexFunctionComponent = (props: any) => {
  const { colorStars, starsType } = props
  const [filterProductId, setFilterProductId] = useState(props.query.productId ? props.query.productId : '');
  const [filterLocale, setFilterLocale] = useState(props.query.locale ? props.query.locale : '');
  const [filterApproved, setFilterApproved] = useState(props.query.approved ? props.query.approved : '');
  const [filterNotApproved, setFilterNotApproved] = useState(props.query.notapproved ? props.query.notapproved : '');
  
  const [tableLength,setTableLength] = useState(10);
  const [currentPage,setCurrentPage] = useState(1);
  const [slicedData,setSlicedData] = useState(props.data.adminReviews ? props.data.adminReviews.slice(0, tableLength): []);
  const [currentItemFrom,setCurrentItemFrom] = useState(1);
  const [currentItemTo,setCurrentItemTo] = useState(tableLength);
  const [itemsLength, setItemsLength] = useState(props.data.adminReviews?props.data.adminReviews.length:999);
  const [emptyStateLabel] = useState('Nothing to show.');
  const [filterStatements,setFilterStatements] = useState([]);

  //const Checkbox = require('../Checkbox').default
  function approvedSelectorObject( value:any, onChange:any ) {
    const initialValue = {
      approved: true,
      notapproved: true,
    }
    const toggleValueByKey = (key: any) => {
      const newValue = {
        ...(value || initialValue),
        [key]: value ? !value[key] : false,
      }
      return newValue
    }
    return (
      <div>
        {Object.keys(initialValue).map((opt, index) => {
          console.log("value")
          console.log(value)
          return (
            <div className="mb3" key={`class-statment-object-${opt}-${index}`}>
              <input type="checkbox"
                //checked={value ? value[opt] : false}
                //label={opt}
                checked={value ? value[opt] : value[opt]}
                name="default-checkbox-group"
                onChange={() => {
                  const newValue = toggleValueByKey(`${opt}`)
                  const newValueKeys = Object.keys(newValue)
                  const isEmptyFilter = !newValueKeys.some(
                    key => !newValue[key]
                  )
                  onChange(isEmptyFilter ? null : newValue)
                }}
                value={opt}
              />
              <label>{opt}</label>
            </div>
          )
        })}
      </div>
    )
  }

  function handleNextClick() {
    const newPage = currentPage + 1
    const itemFrom = currentItemTo + 1
    const itemTo = tableLength * newPage
    const data = props.data.adminReviews.slice(itemFrom - 1, itemTo)
    goToPage(newPage, itemFrom, itemTo, data)
  }

  function handlePrevClick() {
    if (currentPage === 0) return
    const newPage = currentPage - 1
    const itemFrom = currentItemFrom - tableLength
    const itemTo = currentItemFrom - 1
    const data = props.data.adminReviews.slice(itemFrom - 1, itemTo)
    goToPage(newPage, itemFrom, itemTo, data)
  }
  function goToPage(currentPage:any, currentItemFrom:any, currentItemTo:any, slicedData:any) {
    setCurrentPage(currentPage);
    setCurrentItemFrom(currentItemFrom);
    setCurrentItemTo(currentItemTo);
    setSlicedData(slicedData);
  }

  function  handleRowsChange(e:any, value:any) {
    console.log(e);
    console.log(value)
    setTableLength(parseInt(value));
    setCurrentItemTo(parseInt(value));
    /*this.setState(
      {
        tableLength: parseInt(value),
        currentItemTo: parseInt(value),
      },
      () => {
        // this callback garantees new sliced items respect filters and tableLength
        const { filterStatements } = this.state
        this.handleFiltersChange(filterStatements)
      }
    )*/
  }

  function handleFiltersChange(statements = []) {
    // here you should receive filter values, so you can fire mutations ou fetch filtered data from APIs
    // For the sake of example I'll filter the data manually since there is no API
    
    let newData = props.data.adminReviews.slice()
    statements.forEach(st => {
      if (!st) return
      const { subject, verb, object } = st
      console.log(verb)
      switch (subject) {
        case 'approved':
          if (!object) return
          /*const approvedMap = {
            'true': 'true',
            'false': 'false',
          }*/
          console.log("OBJECT")
          console.log(object)
          console.log(subject)
          newData = newData.filter(
            function(item:any){
              return item.approved == true
            }
            //item => object[approvedMap[item.approved]]
            )
          break
        case 'name':
        case 'email':
          /*if (verb === 'contains') {
            newData = newData.filter(item => item[subject].includes(object))
          } else if (verb === '=') {
            newData = newData.filter(item => item[subject] === object)
          } else if (verb === '!=') {
            newData = newData.filter(item => item[subject] !== object)
          }*/
          break
      }
    })
    const newDataLength = newData.length
    const newSlicedData = newData.slice(0, tableLength)
    setFilterStatements(statements)
    setSlicedData(newSlicedData)
    setItemsLength(newDataLength)
    setCurrentItemTo(tableLength > newDataLength ? newDataLength : tableLength)
  }

  const defaultSchema = {
    properties: {
      productId: {
        title: 'Producto',
        width: 80,
        //sortable: true
      },
      name: {
        title: 'Nombre',
        width: 150,
        //sortable: true
      },
      score: {
        title: 'Puntuacion',
        width: 90,
        //sortable: true,
        cellRenderer: (cellData:any) => {
          return (
            <Rating
              readonly
              initialRating={cellData.cellData}
              {...ratingDynamicProps}
            />
          )
        },
      },
      locale: {
        title: 'Idioma',
        width: 60,
        //sortable: true
      },
      comment: {
        title: 'Comentario',
        minWidth: 300,
      },
      approved: {
        title: 'Aprobado',
        width: 80,
        // sortable: true
        cellRenderer: (cellData:any) => {
          return (
            //<a className="f6 link dim ph3 pv2 mb2 dib white bg-near-black" href={"admin-reviews/" + cellData.rowData.reviewId + '?id=' + cellData.rowData.id}><FormattedMessage id="Editar"/></a>
            <input type="checkbox" checked={cellData.rowData.approved} disabled/>
          )
        },
      },
      actions: {
        title: 'Acciones',
        width: 100,
        cellRenderer: (cellData:any) => {
          return (
            <a className="f6 link dim ph3 pv2 mb2 dib white bg-near-black" href={"admin-reviews/" + cellData.rowData.reviewId + '?id=' + cellData.rowData.id}><FormattedMessage id="Editar"/></a>
          )
        },
      },
    },
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
    
    let approved = document.getElementById("review_filter_approved") as HTMLInputElement;  
    let notapproved = document.getElementById("review_filter_notapproved") as HTMLInputElement;
    if(!approved.checked || !notapproved.checked){
      if(approved.checked){
        URLQuery = URLQuery + '&approved=true';
      }    
      if(notapproved.checked){
        URLQuery = URLQuery + '&notapproved=true';
      }
    }

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
    <div className="w-100 ph3 ph5-m ph2-xl mw9 mt4">  {/* Resumen de reviews */}
      <div className={"f6 w-100 mw8 center"}>
        <Table
          fullWidth
          schema={defaultSchema}
          items={slicedData}
          emptyStateLabel={emptyStateLabel}
          density="high"
          pagination={{
            onNextClick: handleNextClick,
            onPrevClick: handlePrevClick,
            currentItemFrom: currentItemFrom,
            currentItemTo: currentItemTo,
            onRowsChange: handleRowsChange,
            textShowRows: 'Show rows',
            textOf: 'of',
            totalItems: itemsLength,
            //rowsOptions: [5, 10, 15, 25],
          }}
          filters={{
            alwaysVisibleFilters: ['approved', 'locale'],
            statements: filterStatements,
            onChangeStatements: handleFiltersChange,
            clearAllFiltersButtonLabel: 'Clear Filters',
            collapseLeft: true,
            options: {
              approved: {
                label: 'Aprobado',
                renderFilterLabel: (st:any) => {
                  if (!st || !st.object) {
                    // you should treat empty object cases only for alwaysVisibleFilters
                    return 'All'
                  }
                  const keys = st.object ? Object.keys(st.object) : {}
                  console.log(keys);
                  /*const isAllTrue = !keys.some((key: React.ReactText) => !st.object[key])
                  const isAllFalse = !keys.some(key => st.object[key])
                  const trueKeys = keys.filter(key => st.object[key])
                  let trueKeysLabel = ''
                  trueKeys.forEach((key:any, index:any) => {
                    trueKeysLabel += `${key}${
                      index === trueKeys.length - 1 ? '' : ', '
                    }`
                  })
                  return `${
                    isAllTrue ? 'All' : isAllFalse ? 'None' : `${trueKeysLabel}`
                  }`*/
                  return 'All' 
                },
                verbs: [
                  {
                    label: 'includes',
                    value: 'includes',
                    object: approvedSelectorObject,
                  },
                ],
              },
              /*locale: {
                label: 'Locale',
                ...this.simpleInputVerbsAndLabel(),
              },*/
            },
          }}
        />
      </div>
      <table cellPadding="3" cellSpacing="0" className={"f6 w-100 mw8 center"}>
        <thead>
          <tr className="filters ma3">
            <th colSpan={7}>
              <div className={"w-25 dib"}><span><FormattedMessage id="Product ID"/>: </span><input type="text" id="review_filter_productId" className={"w-30"} onChange={(e) => {setFilterProductId(e.target.value)}} value={filterProductId}/></div>
              <div className={"w-20 dib"}><span><FormattedMessage id="Approved"/>: </span><input type="checkbox" id="review_filter_approved" onChange={(e) => {setFilterApproved(e.target.checked)}} checked={filterApproved as boolean}/></div>
              <div className={"w-20 dib"}><span><FormattedMessage id="NotApproved"/>: </span><input type="checkbox" id="review_filter_notapproved" onChange={(e) => {setFilterNotApproved(e.target.checked)}} checked={filterNotApproved as boolean}/></div>
              <div className={"w-25 dib"}><span><FormattedMessage id="Locale"/>: </span><input type="text" id="review_filter_locale" className={"w-30"} onChange={(e) => {setFilterLocale(e.target.value)}} value={filterLocale}/></div>
              <button className={"w-10 dib"} onClick={filtrar}><FormattedMessage id="FILTER"/></button>
            </th>
          </tr>
          <tr>
            <th className={"fw6 bb b--black-20 tl pb3 pr3 bg-white tl"}><FormattedMessage id="Product"/></th>
            <th className={"fw6 bb b--black-20 tl pb3 pr3 bg-white tl"} style={{width: "130px"}}><FormattedMessage id="Nombre"/></th>
            <th className={"fw6 bb b--black-20 tl pb3 pr3 bg-white tc"} style={{width: "100px"}}><FormattedMessage id="Score"/></th>
            <th className={"fw6 bb b--black-20 tl pb3 pr3 bg-white tl"}><FormattedMessage id="Locale"/></th>
            <th className={"fw6 bb b--black-20 tl pb3 pr3 bg-white tl"}><FormattedMessage id="Comment"/></th>
            <th className={"fw6 bb b--black-20 tl pb3 pr3 bg-white tc"}><FormattedMessage id="Approved"/></th>
            <th className={"fw6 bb b--black-20 tl pb3 pr3 bg-white tc"}></th>
          </tr> 
        </thead>
        <tbody>
        {props.data.adminReviews && props.data.adminReviews.map((review:any, indice:any) =>
          <tr key={indice} className="product-reviews-item ba mb2">
            <td className="pv3 pr3 bb b--black-20 product-reviews-productId">
              {review.productId}
            </td>
            <td className="pv3 pr3 bb b--black-20 product-reviews-name">
              {review.name}
            </td>
            <td className="pv3 pr3 bb b--black-20 product-reviews-score">
              <div className={styles.stars} style={{ color: colorStars }}>
                <Rating
                  readonly
                  initialRating={review.score}
                  {...ratingDynamicProps}
                />
              </div>
            </td>
            <td className="pv3 pr3 bb b--black-20 product-reviews-locale">
              {review.locale}
            </td>
            <td className="pv3 pr3 bb b--black-20 product-reviews-comment">
              {review.comment}
            </td>
            <td className="pv3 pr3 bb b--black-20 product-reviews-approved tc">
              {review.approved ? 'yes' : 'not'}
            </td>
            <td className="pv3 pr3 bb b--black-20">
              <a className="f6 link dim ph3 pv2 mb2 dib white bg-near-black" href={"admin-reviews/" + review.reviewId + '?id=' + review.id}><FormattedMessage id="Editar"/></a>
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
        to:  (props.query && props.query.to) ? props.query.to : 99,
        locale: (props.query && props.query.locale) ? props.query.locale : '', 
        approved: (props.query && props.query.approved) ? props.query.approved : '', 
        notapproved: (props.query && props.query.notapproved) ? props.query.notapproved : '', 
      }})
    }
})(withRuntimeContext(AdminReviews))
