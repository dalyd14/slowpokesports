import React, { useState } from 'react'
import $ from 'jquery'

import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import DoneIcon from '@material-ui/icons/Done';
import SaveIcon from '@material-ui/icons/Save';

import EditAntennaRow from './EditAntennaRow'

const EditReaderRow = ({ reader }) => {
    const [readerExpanded, setReaderExpanded] = useState($(`button[data-target='#subzoneExpand_${reader.sys_id}']`).attr('aria-expanded') === 'true')
    const handleToggle = () => {
        const expanded = $(`button[data-target='#subzoneExpand_${reader.sys_id}']`).attr('aria-expanded') === 'true'
        setReaderExpanded(!expanded)
    }

    const [defaultValues, setDefaultValues] = useState({
        display_name: reader.display_name,
        location_description: reader.location_description
    })
    const [newValues, setNewValues] = useState()
    const [showSave, setShowSave] = useState(false)

    const handleChange = (event) => {
        const fieldName = $(event.target).data('field')
        const fieldValue = $(event.target).val()

        if (fieldValue !== defaultValues[fieldName]) {
            setShowSave(true)
            setNewValues({...newValues, [fieldName]: fieldValue})
        } else {
            setShowSave(false)
        }
    }

    const handleSave = async () => {
        if (!showSave) {
            console.log('no need to save')
            return
        }

        try {
            await fetch(`/api/reader/${reader._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newValues)
            })

            setDefaultValues({ ...defaultValues, ...newValues })
            setShowSave(false)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
        <div id={"reader-" + reader.sys_id} className="row no-gutters reader-row">
            <div className="col-1 border-left border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <button onClick={handleToggle} type="button" className="btn btn-link nounderline text-dark d-flex justify-content-center align-items-center w-100" data-toggle="collapse" data-target={"#subzoneExpand_" + reader.sys_id} aria-expanded="false" aria-controls="subzoneExpand">
                    {
                        readerExpanded ?
                        <UnfoldLessIcon data-toggle="collapse" data-target={"#subzoneExpand_" + reader.sys_id} /> :
                        <UnfoldMoreIcon data-toggle="collapse" data-target={"#subzoneExpand_" + reader.sys_id} />
                    }
                </button>
            </div>
            <div className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{reader.sys_id}</p>
            </div>
            <div className="col-3 border-right border-bottom border-info d-flex align-items-center px-1">
                <input onChange={handleChange} type="text" data-field="display_name" className="form-control no-border" defaultValue={reader.display_name} />
            </div>
            <div className="col-3 border-right border-bottom border-info d-flex align-items-center px-1">
                <input onChange={handleChange} type="text" data-field="location_description" className="form-control no-border" defaultValue={reader.location_description} />
            </div>
            <div className="col-2 border-right border-bottom border-info d-flex align-items-center px-1">
                <input onChange={handleChange} type="text" data-field="ip_address" className="form-control no-border" defaultValue={reader.ip_address} />
            </div>
            <div className="col-1 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <button onClick={handleSave} type="button" className="btn btn-link nounderline text-dark d-flex justify-content-center align-items-center w-100">
                    {
                        showSave ?
                        <SaveIcon /> :
                        <DoneIcon />
                    }
                </button>
            </div>
        </div>
        <div className="collapse" id={"subzoneExpand_" + reader.sys_id}>
            {
                reader.antennas.map(antenna => (
                    <EditAntennaRow antenna={antenna} key={antenna.sys_id} />
                ))
            }
        </div>
        </>
    )
}

export default EditReaderRow