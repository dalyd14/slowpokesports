import React from 'react'

import './antenna-row.css'

const AntennaRow = ({ antenna }) => {
    return (
        <div id={"antenna-" + antenna.sys_id} className="row no-gutters antenna-row bg-light">
            <div className="col-1 border-left border-right border-bottom border-info"></div>
            <div className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center"></div>
            <div data-filter="antenna-all" className="col-4 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{antenna.display_name}</p>
            </div>
            <div data-filter="antenna-PRES" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <span className="badge subzoneBadge badge-pill badge-success text-dark">{antenna.tagCountPres}</span>
            </div>
            <div data-filter="antenna-MISS" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <span className="badge subzoneBadge badge-pill badge-warning">{antenna.tagCountMiss}</span>
            </div>
        </div>
    )
}

export default AntennaRow