import React from 'react'
import { Link } from 'react-router-dom';

import './antenna-row.css'

import { useDispatch } from 'react-redux'
import { updateAll } from '../../../utils/filterSlice'

const AntennaRow = ({ reader, antenna }) => {

    const dispatch = useDispatch()

    const isReaderIndet = () => {
        return reader.antennas.length !== 1
    }

    const handleAntennaRowNav = (antennaSel, status) => {

        const isDet = isReaderIndet()

        dispatch(updateAll({
            readers: {
                sel: !isDet ? [antenna.reader] : [],
                ind: isDet ? [antenna.reader] : []
            },
            antennas: antennaSel,
            status
        }))
    }

    return (
        <div id={"antenna-" + antenna.sys_id} className="row no-gutters antenna-row bg-light">
            <div className="col-1 border-left border-right border-bottom border-info"></div>
            <div className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center"></div>
            <div onClick={() => handleAntennaRowNav([antenna._id], ['PRES', 'MISS'])} className="col-4 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <Link to={{pathname: '/products'}} className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <p className="m-0">{antenna.display_name}</p>
                </Link>
            </div>
            <div onClick={() => handleAntennaRowNav([antenna._id], ['PRES'])} className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <Link to={{pathname: '/products'}} className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <span className="badge subzoneBadge badge-pill badge-success text-dark">{antenna.tagCountPres}</span>
                </Link>
            </div>
            <div onClick={() => handleAntennaRowNav([antenna._id], ['MISS'])} className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <Link to={{pathname: '/products'}} className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <span className="badge subzoneBadge badge-pill badge-warning">{antenna.tagCountMiss}</span>
                </Link>
            </div>
        </div>
    )
}

export default AntennaRow