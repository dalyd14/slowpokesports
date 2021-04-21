import React, { useEffect, useState } from 'react'
import Filters from '../../components/Filters'
import ProductRow from '../../components/ProductRow'

import Auth from '../../utils/auth'

import { useSelector } from 'react-redux'
import { selectFilters } from '../../utils/filterSlice'

// query object format
// query = {
//   reader: [] <--- array of all readers in which all antennas are selected
//   antenna: [] <--- array of all antennas that isn't covered by checked reader
//   status: <--- either 'null', 'PRES', 'MISS'   
// }

const Products = () => {
    const [products, setProducts] = useState()
    const [refetch, setRefetch] = useState(false)
    const [sort, setSort] = useState({ column: '', sortDir: 0 })
    const [searchString, setSearchString] = useState({ string: '', searchColumn: 'default' })

    const filters = useSelector(selectFilters)

    useEffect(() => {
        const token = Auth.getToken()

        const fetchProducts = async token => {
            let tags = await fetch('/api/tag/byFilters', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            })
            tags = await tags.json()
            setProducts(tags)
        }
        fetchProducts(token)
    }, [refetch])

    if(!products) {
        return <h2>Loading......</h2>
    }

    if (sort.column && sort.sortDir) {
        if (sort.column === 'reader' || sort.column === 'antenna') {
            products.sort((a, b) => {
                if (a[sort.column].display_name < b[sort.column].display_name) {
                    return sort.sortDir
                } else if (a[sort.column].display_name > b[sort.column].display_name) {
                    return sort.sortDir*(-1)
                } else {
                    return 0
                }
            })            
        } else {
            products.sort((a, b) => {
                if (a[sort.column] < b[sort.column]) {
                    return sort.sortDir
                } else if (a[sort.column] > b[sort.column]) {
                    return sort.sortDir*(-1)
                } else {
                    return 0
                }
            })            
        }

    }

    const handleSort = (colName) => {
        if (colName !== sort.column) {
            setSort({
                column: colName, 
                sortDir: -1
            })
        } else {
            setSort({
                column: colName, 
                sortDir: sort.sortDir*(-1)
            })
        }
    }

    const isTagGood = (tagData) => {
        const isFilters = doesPassFilters(tagData)
        if (!isFilters) {
            return false
        }

        const isSearch = doesPassSearch(tagData)
        if (!isSearch) {
            return false
        }

        return true
    }

    const doesPassFilters = (tagData) => {
        if (!filters) {
            return true
        }

        if (filters.readers.sel.length) {
            if (filters.readers.sel.includes(tagData.reader._id) && filters.status.includes(tagData.status)) {
                return true
            }
        }
        if (filters.antennas.includes(tagData.antenna._id) && filters.status.includes(tagData.status)) {
            return true
        }

        return false
    }

    const doesPassSearch = (tagData) => {

        const regexString = generateRegex(searchString.string)
        switch (searchString.searchColumn) {
            case 'default':
                return true
            case 'reader':
            case 'antenna':
                return compareValues(
                    tagData[searchString.searchColumn].display_name,
                    regexString
                )
            default:
                return compareValues(
                    tagData[searchString.searchColumn],
                    regexString
                )
        }
    }

    const compareValues = (tagValue, regexComp) => {
        return tagValue.toString().toLowerCase().match(regexComp)
    }

    const generateRegex = (searchString) => {
        let regexString = searchString.toLowerCase().replaceAll('*', '([ \\w-]*)')
        regexString = '^' + regexString + '$'
        return new RegExp(regexString)
    }

    return (
        <>
        <Filters setRefetch={setRefetch} refetch={refetch} setSearchString={setSearchString} searchString={searchString} />
        <div className="container my-4">
            <div className="row no-gutters header-row bg-secondary text-light cursor-pointer">
                <div id='tag_id' onClick={() => handleSort('sys_id')} className="header-col col-3 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Tag ID</h4>
                </div>
                <div id='tag_name' onClick={() => handleSort('tagname')} className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Tag Name</h4>
                </div>
                <div id='zone' onClick={() => handleSort('reader')} className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Zone</h4>
                </div>
                <div id='subzone' onClick={() => handleSort('antenna')} className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Subzone</h4>
                </div>
                <div id='status' onClick={() => handleSort('status')} className="header-col col-1 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Status</h4>
                </div>
                <div id='seen' onClick={() => handleSort('seen_unix')} className="header-col col-2 border-left border-right border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Seen</h4>
                </div>
            </div>
            <section id="product-rows">
                {
                    products.map(product => isTagGood(product) && <ProductRow product={product} key={product.sys_id} />)
                }       
            </section>
        </div>
        </>
    )
}

export default Products