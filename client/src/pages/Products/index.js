import React, { useEffect, useState } from 'react'
import Filters from '../../components/Filters'
import ProductRow from '../../components/ProductRow'

import Auth from '../../utils/auth'

const Products = ({query}) => {
    const [products, setProducts] = useState()

    useEffect(() => {
        const token = Auth.getToken()

        const fetchProducts = async token => {
            let tags = await fetch('/api/tag/byFilters', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            })

            tags = await tags.json()

            setProducts(tags)
        }

        fetchProducts(token)
    }, [])

    if(!products) {
        return <h2>Loading......</h2>
    }

    return (
        <>
        <Filters query={query} />
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
                    products.map(product => (
                        <ProductRow product={product} key={product.sys_id} />
                    ))
                }       
            </section>
        </div>
        </>
    )
}

export default Products