import React, { useEffect, useState } from 'react'
import Filters from '../../components/Filters'
import ProductRow from '../../components/ProductRow'

import Auth from '../../utils/auth'

// query object format
// query = {
//   reader: [] <--- array of all readers in which all antennas are selected
//   antenna: [] <--- array of all antennas that isn't covered by checked reader
//   status: <--- either 'null', 'PRES', 'MISS'   
// }

const Products = ({ query, all }) => {
    const [products, setProducts] = useState()
    const [filters, setFilters] = useState(query)
    const [refetch, setRefetch] = useState(false)

    useEffect(() => {
        const token = Auth.getToken()

        const fetchProducts = async token => {
            let tags = await fetch('/api/tag/byFilters', {
                method: 'POST',
                body: JSON.stringify(filters), 
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

    const isTagGood = (tagData) => {
        if (!filters) {
            return true
        }

        let status = filters.status ? [filters.status] : ['PRES', 'MISS']

        if (filters.reader.length) {
            if (filters.reader.includes(tagData.reader._id) && status.includes(tagData.status)) {
                return true
            }
        }
        if (filters.antenna.includes(tagData.antenna._id) && status.includes(tagData.status)) {
            return true
        }
        return false
    }

    return (
        <>
        <Filters filters={filters} setFilters={setFilters} all={all} setRefetch={setRefetch} refetch={refetch} />
        <div className="container my-4">
            <div className="row no-gutters header-row bg-secondary text-light cursor-pointer">
                <div id='tag_id' data-sorted="" className="header-col col-3 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Tag ID</h4>
                </div>
                <div id='tag_name' data-sorted="" className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Tag Name</h4>
                </div>
                <div id='zone' data-sorted="" className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Zone</h4>
                </div>
                <div id='subzone' data-sorted="" className="header-col col-2 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Subzone</h4>
                </div>
                <div id='status' data-sorted="" className="header-col col-1 border-left border-top border-bottom border-info d-flex align-items-center">
                    <span className="material-icons sort-arrow disable-user-select d-none">keyboard_arrow_up</span>
                    <h4 className="m-0 mx-auto disable-user-select">Status</h4>
                </div>
                <div id='seen' data-sorted="" className="header-col col-2 border-left border-right border-top border-bottom border-info d-flex align-items-center">
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