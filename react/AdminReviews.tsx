
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

interface VtexFunctionComponent extends FunctionComponent {
  getSchema?(props: any): {}
}

const AdminReviews: VtexFunctionComponent = (props: any) => {
  const { starsType } = props
  const [filterStatements, setFilterStatements] = useState(props.query.filterStatements ? props.query.filterStatements : []);
  const [tableLength] = useState(10);
  const [currentPage,setCurrentPage] = useState(1);
  const [sampleData, setSampleData] = useState(props.data.adminReviews);
  const [slicedData,setSlicedData] = useState(props.data.adminReviews ? props.data.adminReviews.slice(0, tableLength): []);
  const [currentItemFrom,setCurrentItemFrom] = useState(1);
  const [currentItemTo,setCurrentItemTo] = useState(tableLength);
  const [itemsLength, setItemsLength] = useState(props.data.adminReviews?props.data.adminReviews.length:999999999999);
  const [emptyStateLabel] = useState('Nothing to show.');

if(props.data.adminReviews && itemsLength==999999999999) {
  setItemsLength(props.data.adminReviews.length);
  setSlicedData(props.data.adminReviews.slice(0, tableLength));
  setSampleData(props.data.adminReviews);
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

  function simpleInputObject({ value, onChange }:any) {
    return (
      <Input value={value || ''} onChange={(e:any) => onChange(e.target.value)} />
    )
  }

  function simpleInputVerbsAndLabel() {
    return {
      renderFilterLabel: (st:any) => {
        if (!st || !st.object) {
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
      ],
    }
  }

  function approvedSelectorObject({ value, onChange }:any) {
    const initialValue = {
      approved: true,
      notapproved: true,
      ...(value || {}),
    }
    const toggleValueByKey = (key:any) => {
      const newValue = {
        ...(value || initialValue),
        [key]: value ? !value[key] : false,
      }
      return newValue
    }
    return (
      <div>
        {Object.keys(initialValue).map((opt, index) => {
          return (
            <div className="mb3" key={`class-statment-object-${opt}-${index}`}>
              <Checkbox
                checked={value ? value[opt] : initialValue[opt]}
                label={opt}
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
            </div>
          )
        })}
      </div>
    )
  }

  function handleFiltersChange(statements = []) {
    let newData = Object.values(sampleData);
    statements.forEach((st:any) => {
      if (!st || !st.object) return 
      const { subject, verb, object } = st
      switch (subject) {        
        case 'approved':
          if (!object) return
          newData = newData.filter(function(item:any){
            if(object["approved"] && item.approved){
              return item;
            }
            if(object["notapproved"] && !item.approved){
              return item;
            }
          })
          break
        case 'productId':
        case 'locale':
          newData = newData.filter(function(item:any){ 
            return item[subject] == object;
          })
          break
        case 'number':
          if (verb === '=') {
            newData = newData.filter((item:any) => item.number === parseInt(object))
          } else if (verb === 'between') {
            newData = newData.filter(
              (item:any) =>
                item.number >= parseInt(object.first) &&
                item.number <= parseInt(object.last)
            )
          }
          break
      }
    })
    const newDataLength = newData.length
    const newSlicedData = newData.slice(0, tableLength)
    setFilterStatements(statements);
    setSlicedData(newSlicedData)
    setItemsLength(newDataLength)
    setCurrentItemTo(tableLength > newDataLength ? newDataLength : tableLength)
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
            alwaysVisibleFilters: ['approved', 'productId', 'locale'],
            statements: filterStatements,
            onChangeStatements: handleFiltersChange,
            clearAllFiltersButtonLabel: 'Clear Filters',
            collapseLeft: true,
            options: {
              approved: {
                label: 'Approved',
                renderFilterLabel: (st:any) => {
                  if (!st || !st.object) {
                    // you should treat empty object cases only for alwaysVisibleFilters
                    return 'All'
                  }
                  const keys:any = st.object ? Object.keys(st.object) : {}
                  const isAllTrue = st.object["approved"] && st.object["not approved"]
                  const isAllFalse = !st.object["approved"] && !st.object["not approved"]
                  const trueKeys = keys.filter((key:any) => st.object[key])
                  let trueKeysLabel = ''
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
                    object: approvedSelectorObject,
                  },
                ],
              },
              productId: {
                label: 'Product Id',
                ...simpleInputVerbsAndLabel(),
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