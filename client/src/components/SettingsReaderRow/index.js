import React, { useState } from 'react'
import $ from 'jquery'

import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

import './reader-row.css'
import SettingsAntennaRow from './SettingsAntennaRow'


const SettingsReaderRow = ({ reader, setCurrentItem }) => {

    const [readerExpanded, setReaderExpanded] = useState($(`button[data-target='#subzoneExpand_${reader.sys_id}']`).attr('aria-expanded') === 'true')

    const handleToggle = () => {
        const expanded = $(`button[data-target='#subzoneExpand_${reader.sys_id}']`).attr('aria-expanded') === 'true'
        setReaderExpanded(!expanded)
    }

    const handleReaderSelect = (_id) => {
        setCurrentItem({
            type: 'readers',
            _id,
            showModal: true
        })
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
            <div onClick={() => {handleReaderSelect(reader._id)}} className="col-4 border-right border-bottom border-info d-flex justify-content-center align-items-center cursor-pointer">
                <p className="m-0">{reader.display_name}</p>
            </div>
            <div onClick={() => {handleReaderSelect(reader._id)}} data-filter="reader-all" className="col-4 border-right border-bottom border-info d-flex justify-content-center align-items-center cursor-pointer"></div>
            <div onClick={() => {handleReaderSelect(reader._id)}} className="col-3 border-right border-bottom border-info d-flex justify-content-center align-items-center cursor-pointer">
                <p className="m-0">{reader.sys_id}</p>
            </div>
        </div>
        <div className="collapse" id={"subzoneExpand_" + reader.sys_id} >
            {
                reader.antennas.map(antenna => <SettingsAntennaRow key={antenna.sys_id} antenna={antenna} setCurrentItem={setCurrentItem} />)
            }
        </div>
        </>
    )
}

export default SettingsReaderRow