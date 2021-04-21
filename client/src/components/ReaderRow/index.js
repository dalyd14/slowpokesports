import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import $ from 'jquery'

import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

import './reader-row.css'
import AntennaRow from './AntennaRow'

import { useDispatch } from 'react-redux'
import { updateAll } from '../../utils/filterSlice'


const ReaderRow = ({ reader }) => {

    const [readerExpanded, setReaderExpanded] = useState($(`button[data-target='#subzoneExpand_${reader.sys_id}']`).attr('aria-expanded') === 'true')

    const handleToggle = () => {
        const expanded = $(`button[data-target='#subzoneExpand_${reader.sys_id}']`).attr('aria-expanded') === 'true'
        setReaderExpanded(!expanded)
    }

    const dispatch = useDispatch()

    const handleReaderRowNav = (readerSel, status) => {
        dispatch(updateAll({
            readers: {
                sel: readerSel,
                ind: []
            },
            antennas: reader.antennas.map(ant => ant._id),
            status
        }))
    }

    return (
        <>
        <div id={'reader-' + reader.sys_id} className="row no-gutters reader-row">
            <div className="col-1 border-left border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <button onClick={handleToggle} type="button" className="btn btn-link nounderline text-dark d-flex justify-content-center align-items-center w-100" data-toggle="collapse" data-target={"#subzoneExpand_" + reader.sys_id} aria-expanded="false" aria-controls="subzoneExpand">
                    {
                        readerExpanded ?
                        <UnfoldLessIcon data-toggle="collapse" data-target={"#subzoneExpand_" + reader.sys_id} /> :
                        <UnfoldMoreIcon data-toggle="collapse" data-target={"#subzoneExpand_" + reader.sys_id} />
                    }
                </button>
            </div>
            <div className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{reader.display_name}</p>
            </div>
            <div onClick={() => handleReaderRowNav([reader._id], ['PRES', 'MISS'])} data-filter="reader-all" className="col-4 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <Link to={{pathname: '/products'}} className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <p className="m-0">All Subzones</p>
                </Link>
            </div>
            <div onClick={() => handleReaderRowNav([reader._id], ['PRES'])} data-filter="reader-PRES" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <Link to={{pathname: '/products'}} className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <span className="badge zoneBadge badge-pill badge-success text-dark">{reader.tagCountPres}</span>
                </Link>
            </div>
            <div onClick={() => handleReaderRowNav([reader._id], ['MISS'])} data-filter="reader-MISS" className="col-2 cursor-pointer border-right border-bottom border-info d-flex justify-content-center align-items-center px-1">
                <Link to={{pathname: '/products'}} className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <span className="badge zoneBadge badge-pill badge-warning">{reader.tagCountMiss}</span>
                </Link>
            </div>
        </div>
        <div className="collapse" id={"subzoneExpand_" + reader.sys_id} >
            {
                reader.antennas.map(antenna => <AntennaRow key={antenna.sys_id} reader={reader} antenna={antenna} />)
            }
        </div>
        </>
    )
}

export default ReaderRow