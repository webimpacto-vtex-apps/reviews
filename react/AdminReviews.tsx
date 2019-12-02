
import React, { FunctionComponent, useState} from 'react'
import { FormattedMessage } from 'react-intl'
import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import adminReviewsQuery from './queries/adminReviews.gql'
import { graphql } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Table } from 'vtex.styleguide'

//const Checkbox = require('../Checkbox').default
interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'
const AdminReviews: VtexFunctionComponent = (props: any) => {
  const { /*colorStars,*/ starsType } = props
  //const [filterProductId, setFilterProductId] = useState(props.query.productId ? props.query.productId : '');
  //const [filterLocale, setFilterLocale] = useState(props.query.locale ? props.query.locale : '');
  //const [filterApproved, setFilterApproved] = useState(props.query.approved ? props.query.approved : '');
  //const [filterNotApproved, setFilterNotApproved] = useState(props.query.notapproved ? props.query.notapproved : '');
  
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

  const defaultSchema = {
    properties: {
      productId: {
        title: 'Producto',
        width: 80,
      },
      name: {
        title: 'Nombre',
        width: 150,
      },
      score: {
        title: 'Puntuacion',
        width: 90,
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
      },
      comment: {
        title: 'Comentario',
        minWidth: 300,
      },
      approved: {
        title: 'Aprobado',
        width: 80,
        cellRenderer: (cellData:any) => {
          return (
            <input type="checkbox" checked={cellData.rowData.approved} disabled/>
          )
        },
      },
      actions: {
        title: 'Acciones',
        width: 100,
        cellRenderer: (cellData:any) => {
          return (
            <a className="f6 link dim ph3 pv2 mb2 dib white bg-near-black" href={"admin-reviews/" + cellData.rowData.reviewId + '?id=' + cellData.rowData.id}>
              <FormattedMessage id="Editar"/>
            </a>
          )
        },
      },
    },
  }

  const [tableLength] = useState(10);
  const [currentPage,setCurrentPage] = useState(1);
  const [slicedData,setSlicedData] = useState(props.data.adminReviews ? props.data.adminReviews.slice(0, tableLength): []);
  const [currentItemFrom,setCurrentItemFrom] = useState(1);
  const [currentItemTo,setCurrentItemTo] = useState(tableLength);
  const [itemsLength, setItemsLength] = useState(props.data.adminReviews?props.data.adminReviews.length:999999999999);
  const [emptyStateLabel] = useState('Nothing to show.');
  const [filterStatements,setFilterStatements] = useState([]);
  
  // La primera carga de la app a veces fallaba. Con esto se soluciona:
  if(props.data.adminReviews && itemsLength==999999999999) {
    setItemsLength(props.data.adminReviews.length);
    setSlicedData(props.data.adminReviews.slice(0, tableLength));
  }

  function approvedSelectorObject( value:any/*, onChange:any */) {
    const initialValue = {
      approved: true,
      notapproved: true,
    }
    const toggleValueByKey = (key: any) => {
      const newValue = {
        ...(value || initialValue),
        [key]: value ? !value[key] : false,
      }
      console.log("newValue",newValue);
      console.log("key",key);
      console.log("value",value);
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
                  /*const newValue = */toggleValueByKey(`${opt}`)
                  //const newValueKeys = Object.keys(newValue)
                  /*const isEmptyFilter = !newValueKeys.some(
                    key => !newValue[key]
                  )*/
                  //onChange(isEmptyFilter ? null : newValue)
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

  function handleFiltersChange(statements = []) {
    // here you should receive filter values, so you can fire mutations ou fetch filtered data from APIs
    // For the sake of example I'll filter the data manually since there is no API
    console.log("handleFiltersChange")
    let newData = props.data.adminReviews.slice()
    statements.forEach(st => {
      if (!st) return
      const { subject, verb, object } = st
      console.log("VERB: ",verb)
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
  function simpleInputObject( value:any, onChange:any) {
    return (
      <input value={value || ''} onChange={e => onChange(e.target.value)} />
    )
  }
  function simpleInputVerbsAndLabel() {
    return {
      renderFilterLabel: (st:any) => {
        if (!st || !st.object) {
          console.log("Devuelvo 'Any'");
          // you should treat empty object cases only for alwaysVisibleFilters
          return 'Any'
        }
        return `${
          st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'
        } ${st.object}`
      },
      verbs: [
        {
          label: 'is',
          value: '=',
          object: simpleInputObject,
        },
        {
          label: 'is not',
          value: '!=',
          object: simpleInputObject,
        },
        {
          label: 'contains',
          value: 'contains',
          object: simpleInputObject,
        },
      ],
    }
  }


  /*function filtrar(){
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
  }*/

  return (
    <div className="w-100 ph3 ph5-m ph2-xl mw9 mt4">  {/* Resumen de reviews */}
      <div className={"f6 w-100 mw8 center"}>
        <Table
          fullWidth
          schema={defaultSchema}
          items={slicedData}
          emptyStateLabel={emptyStateLabel}
          density="medium"
          pagination={{
            onNextClick: handleNextClick,
            onPrevClick: handlePrevClick,
            currentItemFrom: currentItemFrom,
            currentItemTo: currentItemTo,
            //onRowsChange: handleRowsChange,
            textShowRows: 'Show rows',
            textOf: 'of',
            totalItems: itemsLength,
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
                    console.log(st);
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
              locale: {
                label: 'Locale',
                ...simpleInputVerbsAndLabel(),
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default graphql(adminReviewsQuery)(withRuntimeContext(AdminReviews))
