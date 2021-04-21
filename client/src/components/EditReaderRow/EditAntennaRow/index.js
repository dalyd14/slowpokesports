import React, { useState } from 'react'
import $ from 'jquery'

import DoneIcon from '@material-ui/icons/Done';
import SaveIcon from '@material-ui/icons/Save';

const EditAntennaRow = ({ antenna }) => {

    const [defaultValues, setDefaultValues] = useState({
        display_name: antenna.display_name,
        location_description: antenna.location_description
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
            await fetch(`/api/antenna/${antenna.sys_id}`, {
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
        <div id={"antenna-" + antenna.sys_id} className="row no-gutters antenna-row bg-light">
            <div className="col-1 border-left border-right border-bottom border-info"></div>
            <div className="col-2 border-right border-bottom border-info d-flex justify-content-center align-items-center">
                <p className="m-0">{antenna.sys_id}</p>
            </div>
            <div className="col-3 border-right border-bottom border-info d-flex align-items-center px-1">
                <input onChange={handleChange} type="text" data-field="display_name" className="form-control no-border" defaultValue={antenna.display_name} />
            </div>
            <div className="col-3 border-right border-bottom border-info d-flex align-items-center px-1">
                <input onChange={handleChange} type="text" data-field="location_description" className="form-control no-border" defaultValue={antenna.location_description} />
            </div>
            <div className="col-2 border-right border-bottom border-info"></div>
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
    )
}

export default EditAntennaRow