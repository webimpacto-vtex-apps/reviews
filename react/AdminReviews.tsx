
import React, { FunctionComponent, useState} from 'react'
import { FormattedMessage } from 'react-intl'
import Rating, { RatingComponentProps } from 'react-rating'
import fontAwesome from 'font-awesome/css/font-awesome.min.css'
import styles from './styles.css'
import adminReviewsQuery from './queries/adminReviews.gql'
import { graphql } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Table } from 'vtex.styleguide'
import { Checkbox } from 'vtex.styleguide'
import { Input } from 'vtex.styleguide'
import { FilterBar } from 'vtex.styleguide'

//const Checkbox = require('../Checkbox').default
interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

//import emptyStarDefault from './img/star-empty.png'
//import emptyFullDefault from './img/star-yellow.png'
const AdminReviews: VtexFunctionComponent = (props: any) => {
  const { /*colorStars,*/ starsType } = props
  const [filterProductId, setFilterProductId] = useState(props.query.productId ? props.query.productId : '');
  //const [filterLocale, setFilterLocale] = useState(props.query.locale ? props.query.locale : '');
  const [filterApproved, setFilterApproved] = useState(props.query.approved ? props.query.approved : '');
  const [filterNotApproved, setFilterNotApproved] = useState(props.query.notapproved ? props.query.notapproved : '');
  
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
  const [statements,setStatements] = useState([]);
  
  // La primera carga de la app a veces fallaba. Con esto se soluciona:
  if(props.data.adminReviews && itemsLength==999999999999) {
    setItemsLength(props.data.adminReviews.length);
    setSlicedData(props.data.adminReviews.slice(0, tableLength));
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

  function SimpleInputObject( {value, onChange}:any) {
    return (
      <Input value={value || ''} onChange={(e:any) => onChange(e.target.value)} />
    )
  }
  /*function simpleInputVerbsAndLabel() {
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
  }*/


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
  function filtrar(statements_: any){
    let URLQuery = '';
    
    if(statements_){
      setStatements(statements_);
    }
    
    statements_.map((el:any)=>{
      switch(el.subject) { 
        case "product": {
          setFilterProductId((el.object) ? el.object : filterProductId);
          let productId = el.object;
          if(!isNaN(parseInt(productId))){
            URLQuery = URLQuery + '&productId=' + productId;
          } 
          break;  
        } 
        case "approved": {
          setFilterNotApproved((el.object["not approved"]) ? el.object["not approved"] : filterNotApproved);
          setFilterApproved((el.object["approved"]) ? el.object["approved"] : filterApproved);
          let filterApprovedAux = el.object["approved"];
          let filterNotApprovedAux = el.object["not approved"];
          if(!filterApprovedAux || !filterNotApprovedAux){
            if(filterApprovedAux){
              URLQuery = URLQuery + '&approved=true';
            }
            if(filterNotApprovedAux){
              URLQuery = URLQuery + '&notapproved=true';
            }
          }
          break; 
        } 
        default: {
          break; 
        } 
     }
    });

    /*let locale = (document.getElementById("review_filter_locale") as HTMLInputElement).value;
    if(locale != ''){
      URLQuery = URLQuery + '&locale=' + locale;
    }*/

    props.runtime.navigate({
      query: ''+URLQuery+'',
      page: 'admin.app.admin-reviews',
    });
   
    setTimeout(() => {
      location.reload();
    }, 100);
  }

  function ApprovedSelectorObject({ value, error, onChange }:any) {
    const initialValue = {
      "approved": true,
      "not approved": true,
      ...(value || {}),
    }
    const toggleValueByKey = (key:any) => {
      const newValues = {
        ...(value || initialValue),
        [key]: value ? !value[key] : false,
      }
      return newValues
    }
    return (
      <div>
        {Object.keys(initialValue).map((opt, index) => {
          return (
            <div className="mb3" key={`class-statment-object-${opt}-${index}`}>
              <Checkbox
                checked={value ? value[opt] : initialValue[opt]}
                id={`class-${opt}`}
                label={opt}
                name="class-checkbox-group"
                onChange={() => {
                  const newValue = toggleValueByKey(`${opt}`)
                  onChange(newValue)
                }}
                value={opt}
              />
            </div>
          )
        })}
      </div>
    )
    console.log(error);
  }
  
  return (
    <div className="w-100 ph3 ph5-m ph2-xl mw9 mt4">  {/* Resumen de reviews */}
      <div className={"f6 w-100 mw8 center"}>
        <FilterBar
          alwaysVisibleFilters={['product', 'approved']}
          statements={statements}
          onChangeStatements={(statements_:any) => filtrar(statements_)}
          clearAllFiltersButtonLabel="Clear Filters"
          options={{
            product: {
              label: 'Product',
              renderFilterLabel: (st:any) => {
                if (!st || !st.object) {
                  // you should treat empty object cases only for alwaysVisibleFilters
                  return 'Any'
                }
                return `${
                  st.verb === '='
                    ? 'is'
                    : st.verb === '!='
                    ? 'is not'
                    : 'contains '
                } ${st.object}`
              },
              verbs: [
                /*{
                  label: 'contains',
                  value: 'contains',
                  object: (props:any) => <SimpleInputObject {...props} />,
                },*/
                {
                  label: 'is',
                  value: '=',
                  object: (props:any) => <SimpleInputObject {...props} />,
                }/*,
                {
                  label: 'is not',
                  value: '!=',
                  object: (props:any) => <SimpleInputObject {...props} />,
                },*/
              ],
            },
            approved: {
              label: 'Approved',
              renderFilterLabel: (st:any) => {
                if (!st || !st.object) {
                  // you should treat empty object cases only for alwaysVisibleFilters
                  return 'All'
                }
                
                //const keys = st.object ? Object.keys(st.object) : {}
                //return 'All'// Esta linea hay que borrarla
                
                const isAllTrue = st.object["approved"] && st.object["not approved"]
                const isAllFalse = !st.object["approved"] && !st.object["not approved"]
               
                //const trueKeys = keys.each(key => st.object[key])
                const trueKeys = [];
                if(st.object["approved"]){
                  trueKeys.push("approved");
                }
                if(st.object["not approved"]){
                  trueKeys.push("not approved");
                }
                
                
                let trueKeysLabel = '';

                trueKeys.forEach((key:any, index:any) => {
                  trueKeysLabel += `${key}${
                    index === trueKeys.length - 1 ? '' : ', '
                  }`
                })
                return `${
                  isAllTrue ? 'All' : isAllFalse ? 'None' : `${trueKeysLabel}`
                }`
              },
              verbs: [
                {
                  label: 'includes',
                  value: 'includes',
                  object: (props:any) => <ApprovedSelectorObject {...props} />,
                },
              ],
            }
          }}
        />

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
        />
      </div>
    </div>
  )
}

//export default graphql(adminReviewsQuery)(withRuntimeContext(AdminReviews))


export default graphql(adminReviewsQuery, {
  options: (props:any) => {
    console.log("LOAD")
    console.log(props)
    return ({ variables: { 
      productId: (props.query && props.query.productId) ? props.query.productId : undefined, 
      //from: (props.query && props.query.from) ? props.query.from : 0 , 
      //to:  (props.query && props.query.to) ? props.query.to : 99,
      //locale: (props.query && props.query.locale) ? props.query.locale : '', 
      approved: (props.query && props.query.approved) ? props.query.approved : '', 
      notapproved: (props.query && props.query.notapproved) ? props.query.notapproved : '', 
    }})
  }
})(withRuntimeContext(AdminReviews))