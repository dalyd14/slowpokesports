import React from 'react'

import './antenna-row.css'

const AntennaRow = ({ antenna, setFilters }) => {

    const handleProductNav = (reader=[], ants=[], status='') => {
        const query = {
            reader: [], //<--- array of all readers in which all antennas are selected
            antenna: [], //<--- array of all antennas that isn't covered by checked reader
            status: '' //<--- either 'null', 'PRES', 'MISS'      
        }

        query.reader = reader;
        query.antenna = ants
        query.status = status

        setFilters(query)
    }

    return (
        <div id={"antenna-" + antenna.sys_id} className="row no-gutters antenna-row bg-light">
            <div className="col-1 border-left border-right border-bottom border-info"></div>
            <div className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center"></div>
            <div onClick={() => handleProductNav(undefined, antenna._id, '')} data-filter="antenna-all" className="col-4 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{antenna.display_name}</p>
            </div>
            <div onClick={() => handleProductNav(undefined, antenna._id, 'PRES')} data-filter="antenna-PRES" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <span className="badge subzoneBadge badge-pill badge-success text-dark">{antenna.tagCountPres}</span>
            </div>
            <div onClick={() => handleProductNav(undefined, antenna._id, 'MISS')} data-filter="antenna-MISS" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <span className="badge subzoneBadge badge-pill badge-warning">{antenna.tagCountMiss}</span>
            </div>
        </div>
    )
}

export default AntennaRow