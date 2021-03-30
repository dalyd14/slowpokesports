import React from 'react'
import moment from 'moment'

const ProductRow = ({product}) => {
    const convertEpoch = epoch => {
        let m = moment(epoch * 1000);
        return m.format("M/D/YYYY h:mm a")
    }

    const returnBadgeClass = status => {
        let badgeClass
        if (status === 'PRES') {
            badgeClass = 'badge-success text-dark'
        } else {
            badgeClass = 'badge-warning'
        }
        return badgeClass
    }

    return (
        <div className="row no-gutters">
            <div data-sort={product.sys_id} data-column="tag_id" className="col-3 border-left border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <a className="m-0 text-body" href="/company/{{../company.sys_id}}/product/{{sys_id}}">{product.sys_id}</a>
            </div>
            <div data-sort={product.tagname} data-column="tag_name" className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{product.tagname}</p>
            </div>
            <div data-sort={product.reader.display_name} data-column="zone" className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{product.reader.display_name}</p>
            </div>
            <div data-sort={product.antenna.display_name} data-column="subzone" className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{product.antenna.display_name}</p>
            </div>
            <div data-sort={product.status} data-column="status" className="col-1 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <span className={"badge zoneBadge badge-pill " + returnBadgeClass(product.status)}>{product.status}</span>
            </div>
            <div data-sort={product.seen_unix} data-column="seen" className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{convertEpoch(product.seen_unix)}</p>
            </div>
        </div>        
    )

}

export default ProductRow