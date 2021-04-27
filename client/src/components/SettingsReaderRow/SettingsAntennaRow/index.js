import React from 'react'

import './antenna-row.css'

const AntennaRow = ({ antenna, setCurrentItem }) => {

    const handleAntennaSelect = (_id) => {
        setCurrentItem({
            type: 'antennas',
            _id,
            showModal: true
        })
    }

    return (
        <div onClick={() => {handleAntennaSelect(antenna._id)}} id={"antenna-" + antenna.sys_id} className="row no-gutters antenna-row bg-light cursor-pointer">
            <div className="col-1 border-left border-right border-bottom border-info"></div>
            <div className="col-4 border-right border-bottom border-info d-flex justify-content-center align-items-center"></div>
            <div className="col-4 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{antenna.display_name}</p>
            </div>
            <div className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{antenna.sys_id}</p>
            </div>
        </div>
    )
}

export default AntennaRow